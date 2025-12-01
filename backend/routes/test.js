import express from 'express';
import { sendMeetingReminder } from '../services/emailService.js';
import Meeting from '../models/Meeting.js';

const router = express.Router();

/**
 * Test email sending
 */
router.post('/send-test-email', async (req, res) => {
  try {
    const { email, name } = req.body;
    
    // Create a test meeting object
    const testMeeting = {
      title: 'Test Meeting',
      url: 'https://meet.google.com/test-meeting',
      scheduledTime: new Date(Date.now() + 10 * 60000), // 10 minutes from now
      duration: 60
    };
    
    const result = await sendMeetingReminder(email, name || 'Test User', testMeeting);
    
    res.json({
      success: true,
      message: 'Test email sent',
      result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Check meeting details
 */
router.get('/meeting/:id', async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id).populate('userId');
    
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }
    
    res.json({
      meeting: {
        id: meeting._id,
        title: meeting.title,
        scheduledTime: meeting.scheduledTime,
        status: meeting.status,
        reminderSent: meeting.reminderSent,
        userId: meeting.userId,
        hasUser: !!meeting.userId,
        userEmail: meeting.userId?.email || 'No email'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Fix stuck meetings (mark in-progress meetings as completed)
 */
router.post('/fix-stuck-meetings', async (req, res) => {
  try {
    const now = new Date();
    
    // Find meetings stuck in "in-progress" that are more than 2 hours old
    const stuckMeetings = await Meeting.find({
      scheduledTime: { $lt: new Date(now.getTime() - 2 * 60 * 60000) },
      status: 'in-progress'
    });
    
    console.log(`Found ${stuckMeetings.length} stuck meetings`);
    
    const fixed = [];
    for (const meeting of stuckMeetings) {
      meeting.status = 'completed';
      await meeting.save();
      fixed.push({
        id: meeting._id,
        title: meeting.title,
        scheduledTime: meeting.scheduledTime
      });
    }
    
    res.json({
      success: true,
      message: `Fixed ${fixed.length} stuck meetings`,
      meetings: fixed
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Test AI notes generation
 */
router.post('/generate-test-notes', async (req, res) => {
  try {
    const { generateNotesEnhanced } = await import('../services/aiService.js');
    
    // Sample transcript for testing
    const sampleTranscript = `
      Welcome everyone to today's class on Machine Learning Fundamentals.
      Today we'll be covering three main topics: supervised learning, unsupervised learning, and neural networks.
      
      First, let's discuss supervised learning. In supervised learning, we train models using labeled data.
      The model learns from examples where we know the correct answer.
      Common algorithms include linear regression, decision trees, and support vector machines.
      
      Next, unsupervised learning works with unlabeled data. The model finds patterns on its own.
      Clustering and dimensionality reduction are key techniques here.
      K-means clustering is a popular algorithm for grouping similar data points.
      
      Finally, neural networks are inspired by the human brain. They consist of layers of interconnected nodes.
      Deep learning uses multiple hidden layers to learn complex patterns.
      
      For homework, please complete the following:
      1. Read chapter 3 on supervised learning algorithms
      2. Complete the coding assignment on linear regression
      3. Watch the video tutorial on neural network basics
      
      Remember, the midterm exam is next week. Make sure to review all the topics we've covered.
      Office hours are available on Wednesday from 2-4 PM if you need help.
      
      Any questions before we end today's session?
    `;
    
    console.log('🧪 Testing AI notes generation...');
    const notes = await generateNotesEnhanced(sampleTranscript, 'Test Meeting - ML Fundamentals');
    
    res.json({
      success: true,
      message: 'Notes generated successfully',
      notes: {
        title: notes.title,
        summary: notes.summary,
        keyPoints: notes.keyPoints,
        actionItems: notes.actionItems,
        topics: notes.topics,
        definitions: notes.definitions
      }
    });
  } catch (error) {
    console.error('❌ Notes generation test failed:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});

export default router;
