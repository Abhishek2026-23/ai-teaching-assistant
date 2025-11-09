import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { transcribeMultilingual, processAudioAndGenerateNotes } from '../services/transcriptionService.js';
import { triggerAutoAttendance } from '../services/schedulerService.js';
import Meeting from '../models/Meeting.js';
import Note from '../models/Note.js';

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/audio';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /mp3|wav|m4a|ogg|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed (mp3, wav, m4a, ogg, webm)'));
    }
  }
});

// Upload audio and transcribe
router.post('/upload', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    const { meetingId } = req.body;
    
    if (!meetingId) {
      return res.status(400).json({ error: 'Meeting ID is required' });
    }

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    // Process audio and generate notes
    const result = await processAudioAndGenerateNotes(
      req.file.path,
      meetingId,
      meeting.title
    );

    // Save notes to database
    const note = new Note({
      meetingId,
      ...result.notes
    });
    await note.save();

    // Update meeting
    meeting.status = 'completed';
    meeting.transcript = result.transcription.translatedText;
    await meeting.save();

    // Clean up audio file
    fs.unlinkSync(req.file.path);

    res.json({
      message: 'Audio processed successfully',
      transcription: result.transcription,
      note: note
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Transcribe audio only (no note generation)
router.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    const transcription = await transcribeMultilingual(req.file.path);

    // Clean up audio file
    fs.unlinkSync(req.file.path);

    res.json({
      message: 'Transcription complete',
      transcription
    });
  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Manually trigger auto-attendance for a meeting
router.post('/auto-attend/:meetingId', async (req, res) => {
  try {
    const result = await triggerAutoAttendance(req.params.meetingId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Test bot with a meeting URL
router.post('/test-bot', async (req, res) => {
  try {
    const { meetingUrl } = req.body;
    
    if (!meetingUrl) {
      return res.status(400).json({ error: 'Meeting URL is required' });
    }

    const { testBot } = await import('../services/meetingBotService.js');
    const result = await testBot(meetingUrl);
    
    res.json({
      success: result,
      message: result ? 'Bot test successful' : 'Bot test failed'
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get transcription status
router.get('/status/:meetingId', async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.meetingId);
    
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    const notes = await Note.find({ meetingId: req.params.meetingId });

    res.json({
      meeting: {
        title: meeting.title,
        status: meeting.status,
        hasTranscript: !!meeting.transcript,
        hasNotes: notes.length > 0
      },
      notesCount: notes.length
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
