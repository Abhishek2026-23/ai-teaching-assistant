import express from 'express';
import Note from '../models/Note.js';
import Meeting from '../models/Meeting.js';
import { generateNotes, generateNotesEnhanced } from '../services/aiService.js';

const router = express.Router();

// Get all notes
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find().populate('meetingId').sort({ generatedAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get notes for specific meeting
router.get('/meeting/:meetingId', async (req, res) => {
  try {
    const notes = await Note.find({ meetingId: req.params.meetingId });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate notes from transcript
router.post('/generate', async (req, res) => {
  try {
    const { meetingId, transcript } = req.body;
    
    // Get meeting details for better context
    const meeting = await Meeting.findById(meetingId);
    const meetingTitle = meeting ? meeting.title : 'Meeting';
    
    const generatedContent = await generateNotesEnhanced(transcript, meetingTitle);
    
    const note = new Note({
      meetingId,
      ...generatedContent
    });
    
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Test endpoint to generate sample notes
router.post('/generate-sample', async (req, res) => {
  try {
    const { meetingId } = req.body;
    
    // Sample transcript for testing
    const sampleTranscript = `
    Welcome everyone to today's lecture on Advanced Calculus. 
    Today we'll be covering derivatives and their applications in real-world scenarios.
    
    First, let's review the fundamental theorem of calculus. The derivative represents the rate of change of a function.
    For example, if we have f(x) = x squared, the derivative f'(x) = 2x.
    
    Key concepts to remember:
    - The power rule: d/dx(x^n) = nx^(n-1)
    - The chain rule for composite functions
    - Applications in physics for velocity and acceleration
    
    For homework, you need to complete problems 1 through 10 in chapter 5.
    Also, prepare for the quiz next week on integration techniques.
    
    Remember to review your notes and practice the examples we covered today.
    Office hours are available on Wednesdays from 2-4 PM if you need help.
    `;
    
    const meeting = await Meeting.findById(meetingId);
    const meetingTitle = meeting ? meeting.title : 'Sample Meeting';
    
    const generatedContent = await generateNotesEnhanced(sampleTranscript, meetingTitle);
    
    const note = new Note({
      meetingId,
      ...generatedContent
    });
    
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete note
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
