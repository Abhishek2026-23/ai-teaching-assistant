import express from 'express';
import Meeting from '../models/Meeting.js';

const router = express.Router();

// Get upcoming meetings
router.get('/upcoming', async (req, res) => {
  try {
    const now = new Date();
    const meetings = await Meeting.find({
      scheduledTime: { $gte: now },
      status: 'scheduled'
    }).sort({ scheduledTime: 1 });
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get meetings for specific date range
router.get('/range', async (req, res) => {
  try {
    const { start, end } = req.query;
    const meetings = await Meeting.find({
      scheduledTime: {
        $gte: new Date(start),
        $lte: new Date(end)
      }
    }).sort({ scheduledTime: 1 });
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
