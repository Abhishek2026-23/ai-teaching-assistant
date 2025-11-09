import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import meetingRoutes from './routes/meetings.js';
import notesRoutes from './routes/notes.js';
import scheduleRoutes from './routes/schedule.js';
import authRoutes from './routes/auth.js';
import transcriptionRoutes from './routes/transcription.js';
import { startMeetingScheduler, checkMissedMeetings } from './services/schedulerService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

console.log('Environment check:');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://Abhisheksingh:abhimongodb123@cluster0.mvjlzrx.mongodb.net/ai-teaching-assistant?retryWrites=true&w=majority';
console.log('Connecting to MongoDB...');
mongoose.connect(mongoUri)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/transcription', transcriptionRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Teaching Assistant API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  
  // Start meeting scheduler
  startMeetingScheduler();
  
  // Check for missed meetings on startup
  checkMissedMeetings();
});
