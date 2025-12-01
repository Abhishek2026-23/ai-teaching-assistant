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

export default router;
