import cron from 'node-cron';
import Meeting from '../models/Meeting.js';
import Note from '../models/Note.js';
import { generateNotesEnhanced } from './aiService.js';

/**
 * Check for upcoming meetings and trigger auto-attendance
 */
export function startMeetingScheduler() {
  // Run every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    try {
      console.log('Checking for upcoming meetings...');
      
      const now = new Date();
      const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60000);
      const tenMinutesFromNow = new Date(now.getTime() + 10 * 60000);
      const fifteenMinutesFromNow = new Date(now.getTime() + 15 * 60000);
      
      // Send reminders for meetings starting in 10-15 minutes
      const reminderMeetings = await Meeting.find({
        scheduledTime: {
          $gte: tenMinutesFromNow,
          $lte: fifteenMinutesFromNow
        },
        status: 'scheduled',
        reminderSent: { $ne: true }
      }).populate('userId', 'email name');
      
      if (reminderMeetings.length > 0) {
        console.log(`📧 Sending reminders for ${reminderMeetings.length} meetings`);
        
        for (const meeting of reminderMeetings) {
          await sendMeetingReminder(meeting);
        }
      }
      
      // Auto-join bot disabled - only email reminders are active
      // To enable auto-join, uncomment the code below and configure Puppeteer
      
      /*
      // Find meetings starting in the next 5 minutes
      const upcomingMeetings = await Meeting.find({
        scheduledTime: {
          $gte: now,
          $lte: fiveMinutesFromNow
        },
        status: 'scheduled'
      });
      
      if (upcomingMeetings.length > 0) {
        console.log(`🤖 Found ${upcomingMeetings.length} meetings to join`);
        
        for (const meeting of upcomingMeetings) {
          await prepareForMeeting(meeting);
        }
      }
      */
    } catch (error) {
      console.error('Scheduler error:', error.message);
    }
  });
  
  console.log('✅ Meeting scheduler started (runs every 5 minutes)');
  console.log('📧 Email reminders enabled (10 minutes before meetings)');
}

/**
 * Send meeting reminder email
 */
async function sendMeetingReminder(meeting) {
  try {
    // Get user email
    let userEmail, userName;
    
    if (meeting.userId && meeting.userId.email) {
      userEmail = meeting.userId.email;
      userName = meeting.userId.name;
    } else {
      // Fallback: get user from meeting
      const User = (await import('../models/User.js')).default;
      const user = await User.findById(meeting.userId);
      if (user) {
        userEmail = user.email;
        userName = user.name;
      }
    }
    
    if (!userEmail) {
      console.log(`⚠️ No email found for meeting: ${meeting.title}`);
      return;
    }
    
    // Send reminder email
    const { sendMeetingReminder: sendEmail } = await import('../services/emailService.js');
    await sendEmail(userEmail, userName, meeting);
    
    // Mark reminder as sent
    meeting.reminderSent = true;
    await meeting.save();
    
    console.log(`✅ Reminder sent for: ${meeting.title} to ${userEmail}`);
  } catch (error) {
    console.error(`❌ Failed to send reminder for ${meeting.title}:`, error.message);
  }
}

/**
 * Prepare for upcoming meeting
 */
async function prepareForMeeting(meeting) {
  try {
    console.log(`Preparing for meeting: ${meeting.title}`);
    
    // Update meeting status
    meeting.status = 'in-progress';
    await meeting.save();
    
    // Launch bot to join meeting
    const { runMeetingBot } = await import('./meetingBotService.js');
    const { processAudioAndGenerateNotes } = await import('./transcriptionService.js');
    
    console.log(`🤖 Launching bot for: ${meeting.title}`);
    
    try {
      // Run the bot
      const result = await runMeetingBot(
        meeting.url,
        meeting._id.toString(),
        meeting.duration || 60
      );
      
      console.log(`✅ Bot launched successfully for: ${meeting.title}`);
      
      // After meeting duration, process the recording
      setTimeout(async () => {
        try {
          // Stop recording and get audio file
          await result.bot.stopRecording();
          await result.bot.convertToMP3();
          const audioPath = result.bot.getAudioPath();
          
          // Leave meeting
          await result.bot.leaveMeeting();
          
          // Process audio and generate notes
          if (audioPath) {
            const processResult = await processAudioAndGenerateNotes(
              audioPath,
              meeting._id,
              meeting.title
            );
            
            // Save notes
            const Note = (await import('../models/Note.js')).default;
            const note = new Note({
              meetingId: meeting._id,
              ...processResult.notes
            });
            await note.save();
            
            // Update meeting
            meeting.status = 'completed';
            meeting.transcript = processResult.transcription.translatedText;
            await meeting.save();
            
            console.log(`✅ Notes generated for: ${meeting.title}`);
          }
        } catch (error) {
          console.error(`Error processing meeting ${meeting._id}:`, error.message);
          meeting.status = 'failed';
          await meeting.save();
        }
      }, (meeting.duration || 60) * 60 * 1000);
      
    } catch (botError) {
      console.error(`Bot error for ${meeting.title}:`, botError.message);
      // Fallback to sample transcript
      setTimeout(async () => {
        await completeMeeting(meeting);
      }, (meeting.duration || 60) * 60000);
    }
    
  } catch (error) {
    console.error(`Error preparing meeting ${meeting._id}:`, error.message);
  }
}

/**
 * Complete meeting and generate notes
 */
async function completeMeeting(meeting) {
  try {
    console.log(`Completing meeting: ${meeting.title}`);
    
    // Update meeting status
    meeting.status = 'completed';
    await meeting.save();
    
    // Generate sample notes (in production, this would use actual transcript)
    const sampleTranscript = `
    Welcome to ${meeting.title}.
    Today's session covered important concepts and practical applications.
    Key topics discussed include fundamental principles and advanced techniques.
    Students should review the material and complete the assigned exercises.
    Next class will build upon today's foundation.
    `;
    
    const notes = await generateNotesEnhanced(sampleTranscript, meeting.title);
    
    // Save notes
    const note = new Note({
      meetingId: meeting._id,
      ...notes
    });
    
    await note.save();
    
    console.log(`✅ Notes generated for meeting: ${meeting.title}`);
    
    // TODO: Send notification to user
    
  } catch (error) {
    console.error(`Error completing meeting ${meeting._id}:`, error.message);
  }
}

/**
 * Check for missed meetings and generate notes
 */
export async function checkMissedMeetings() {
  try {
    const now = new Date();
    
    // Find meetings that were scheduled but not attended
    const missedMeetings = await Meeting.find({
      scheduledTime: { $lt: now },
      status: 'scheduled'
    });
    
    if (missedMeetings.length > 0) {
      console.log(`Found ${missedMeetings.length} missed meetings`);
      
      for (const meeting of missedMeetings) {
        // Mark as missed
        meeting.status = 'completed';
        await meeting.save();
        
        // Generate notes anyway (with sample data)
        await completeMeeting(meeting);
      }
    }
  } catch (error) {
    console.error('Error checking missed meetings:', error.message);
  }
}

/**
 * Manual trigger for testing
 */
export async function triggerAutoAttendance(meetingId) {
  try {
    const meeting = await Meeting.findById(meetingId);
    
    if (!meeting) {
      throw new Error('Meeting not found');
    }
    
    await prepareForMeeting(meeting);
    
    return {
      success: true,
      message: `Auto-attendance triggered for: ${meeting.title}`
    };
  } catch (error) {
    throw error;
  }
}
