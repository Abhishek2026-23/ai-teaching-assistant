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
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://ai-virtual-student.vercel.app',
  'https://ai-virtual-student-blond.vercel.app',
  'https://ai-teaching-assistant-blond.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set in environment variables');
  process.exit(1);
}

console.log('Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

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
