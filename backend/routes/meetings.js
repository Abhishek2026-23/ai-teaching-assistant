import express from 'express';
import Meeting from '../models/Meeting.js';
import { optionalAuth, getOrCreateUserFromEmail } from '../middleware/optionalAuth.js';

const router = express.Router();

// Get all meetings (optionally filtered by user)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const query = req.userId ? { userId: req.userId } : {};
    const meetings = await Meeting.find(query).sort({ scheduledTime: -1 });
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single meeting
router.get('/:id', async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }
    res.json(meeting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new meeting
router.post('/', optionalAuth, async (req, res) => {
  try {
    let userId = req.userId;
    
    // If no userId from JWT, try to get/create from Clerk email
    if (!userId && req.body.userEmail) {
      const user = await getOrCreateUserFromEmail(req.body.userEmail);
      userId = user?._id;
    }
    
    const meetingData = {
      ...req.body,
      userId: userId || null
    };
    
    // Remove userEmail from meeting data (it's not in schema)
    delete meetingData.userEmail;
    
    const meeting = new Meeting(meetingData);
    await meeting.save();
    
    console.log(`✅ Meeting created:`, meeting.title, userId ? `for user ${userId}` : '(no user)');
    
    res.status(201).json(meeting);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update meeting
router.put('/:id', optionalAuth, async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }
    
    Object.assign(meeting, req.body);
    await meeting.save();
    
    res.json(meeting);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete meeting
router.delete('/:id', optionalAuth, async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndDelete(req.params.id);
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }
    res.json({ message: 'Meeting deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
