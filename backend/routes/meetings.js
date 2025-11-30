import express from 'express';
import Meeting from '../models/Meeting.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all meetings for authenticated user
router.get('/', authenticate, async (req, res) => {
  try {
    const meetings = await Meeting.find({ userId: req.userId }).sort({ scheduledTime: -1 });
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
router.post('/', authenticate, async (req, res) => {
  try {
    const meetingData = {
      ...req.body,
      userId: req.userId // Automatically attach authenticated user's ID
    };
    
    const meeting = new Meeting(meetingData);
    await meeting.save();
    
    console.log(`✅ Meeting created for user ${req.user.email}:`, meeting.title);
    
    res.status(201).json(meeting);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update meeting
router.put('/:id', authenticate, async (req, res) => {
  try {
    // Only allow users to update their own meetings
    const meeting = await Meeting.findOne({ _id: req.params.id, userId: req.userId });
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
router.delete('/:id', authenticate, async (req, res) => {
  try {
    // Only allow users to delete their own meetings
    const meeting = await Meeting.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }
    res.json({ message: 'Meeting deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
