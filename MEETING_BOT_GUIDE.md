# Meeting Bot - Complete Guide

## 🤖 What It Does

The bot **automatically**:
1. ✅ Joins Google Meet at scheduled time
2. ✅ Records audio from the meeting
3. ✅ Transcribes audio (Hindi + English → English)
4. ✅ Generates structured notes with AI
5. ✅ Saves everything to database
6. ✅ Leaves meeting when done

**You don't need to do anything!** Just schedule the meeting and the bot handles everything.

## 🚀 How It Works

### Automatic Flow:
```
1. User schedules meeting in app
   ↓
2. Scheduler checks every 5 minutes
   ↓
3. 5 minutes before meeting:
   - Bot launches Chrome browser
   - Joins Google Meet
   - Turns off camera/mic
   - Starts recording audio
   ↓
4. During meeting:
   - Bot records everything
   - Saves audio file
   ↓
5. After meeting ends:
   - Bot stops recording
   - Converts audio to MP3
   - Sends to OpenAI Whisper (transcription)
   - Sends transcript to AI (note generation)
   - Saves notes to database
   - Leaves meeting
   ↓
6. User sees notes in app!
```

## 📋 Requirements

### Software:
- ✅ Node.js (already installed)
- ✅ Chrome/Chromium (Puppeteer installs it)
- ✅ FFmpeg (for audio conversion)

### API Keys:
- OpenAI API key (for transcription + notes)
- Or use without key (mock transcription)

### Permissions:
- Google Meet link must allow bot to join
- No host approval required (or bot waits)

## 🛠️ Installation

### 1. Install Dependencies:
```bash
cd backend
npm install puppeteer puppeteer-stream @ffmpeg-installer/ffmpeg fluent-ffmpeg
```

### 2. Configure (Optional):
In `backend/.env`:
```
OPENAI_API_KEY=sk-proj-your-key-here
```

### 3. Restart Backend:
```bash
npm run dev
```

You'll see:
```
✅ Meeting scheduler started (runs every 5 minutes)
```

## 🎯 Usage

### Method 1: Automatic (Recommended)
1. Schedule meeting in app with future date/time
2. Add Google Meet URL
3. Wait for scheduled time
4. Bot automatically joins and records
5. Check Notes page after meeting

### Method 2: Manual Trigger
```bash
POST http://localhost:3000/api/transcription/auto-attend/MEETING_ID
```

### Method 3: Test Bot
```bash
POST http://localhost:3000/api/transcription/test-bot
Body: { "meetingUrl": "https://meet.google.com/xxx-xxxx-xxx" }
```

## 🧪 Testing

### Quick Test:
1. Create a test Google Meet
2. Schedule it for 5 minutes from now
3. Watch backend logs
4. Bot will join automatically!

### Test Command:
```javascript
// In your app or Postman
POST http://localhost:3000/api/transcription/test-bot
{
  "meetingUrl": "https://meet.google.com/your-test-meeting"
}
```

Bot will:
- Join meeting
- Stay for 10 seconds
- Leave automatically

## ⚙️ Configuration

### Bot Settings (in meetingBotService.js):

```javascript
// Headless mode (no visible browser)
headless: true  // Set to false to see browser

// Recording duration
duration: 60  // minutes

// Audio quality
mimeType: 'audio/webm'  // or 'audio/mp3'
```

### Meeting Settings:
- Default duration: 60 minutes
- Auto-leave after duration
- Camera/mic: OFF by default
- Audio only recording

## 📊 What Gets Recorded

### Audio Only:
- ✅ All speech in meeting
- ✅ Hindi + English supported
- ✅ Multiple speakers
- ❌ No video (saves bandwidth)
- ❌ No screen sharing

### File Storage:
- Temporary: `uploads/recordings/`
- Deleted after processing
- Only transcript saved permanently

## 🔒 Privacy & Security

### Important:
1. **Consent Required** - Inform participants bot is recording
2. **Audio Only** - No video or screen capture
3. **Auto-Delete** - Audio files deleted after transcription
4. **Secure Storage** - Only text transcript saved
5. **No Permanent Recording** - Audio not stored long-term

### Bot Behavior:
- Joins with camera OFF
- Joins with microphone OFF
- Silent participant
- Leaves automatically
- No interaction with meeting

## 💰 Cost

### Per Meeting (1 hour):
- Whisper transcription: $0.36
- GPT note generation: $0.02
- **Total: ~$0.38 per meeting**

### Monthly (20 meetings):
- **~$7.60/month**

### Without OpenAI:
- FREE (uses mock transcription)
- Still generates notes
- Lower quality

## 🐛 Troubleshooting

### Bot Doesn't Join:
- Check meeting URL is correct
- Verify meeting allows guests
- Check if host approval needed
- Look at backend logs

### No Audio Recorded:
- Check FFmpeg is installed
- Verify audio permissions
- Check disk space
- Look for error logs

### Transcription Fails:
- Verify OpenAI API key
- Check API quota/credits
- Ensure audio file exists
- Check file format

### Notes Not Generated:
- Check transcription completed
- Verify AI service working
- Check database connection
- Look at error logs

## 📝 Backend Logs

### What to Look For:
```
🤖 Launching bot for meeting: Math Class
✅ Browser launched
🔗 Joining meeting: https://meet.google.com/...
✅ Joined meeting successfully
🔇 Camera and mic turned off
🎙️ Starting audio recording...
✅ Recording started
⏰ Recording for 60 minutes...
⏹️ Stopping recording...
✅ Recording stopped
✅ Converted to MP3
👋 Leaving meeting...
✅ Left meeting and closed browser
✅ Notes generated for: Math Class
```

## 🚨 Common Issues

### Issue: "Cannot find module 'puppeteer'"
**Solution:**
```bash
cd backend
npm install puppeteer
```

### Issue: "FFmpeg not found"
**Solution:**
```bash
npm install @ffmpeg-installer/ffmpeg fluent-ffmpeg
```

### Issue: "Bot can't join meeting"
**Solution:**
- Meeting might require host approval
- Check meeting URL is valid
- Ensure meeting hasn't started yet

### Issue: "No audio recorded"
**Solution:**
- Check meeting has audio
- Verify participants are speaking
- Check audio permissions

## 🎓 Best Practices

### For Best Results:
1. **Schedule 10 min early** - Give bot time to join
2. **Use clear meeting URLs** - No shortened links
3. **Test first** - Try with test meeting
4. **Check logs** - Monitor bot activity
5. **Verify notes** - Review generated content

### Meeting Setup:
- Create recurring meetings in advance
- Use consistent meeting URLs
- Set appropriate duration
- Allow guests to join

## 🔄 Workflow Example

### Student Use Case:
```
Monday 9:00 AM - Math Class
1. Student schedules in app (Sunday night)
2. Bot joins Monday 8:55 AM
3. Records entire class (9:00-10:00 AM)
4. Generates notes by 10:05 AM
5. Student reviews notes anytime
```

### Teacher Use Case:
```
Multiple Classes Daily
1. Teacher schedules all classes for week
2. Bot attends each class automatically
3. Generates notes for each session
4. Students access notes after class
5. Teacher reviews for quality
```

## 📈 Scaling

### For Multiple Meetings:
- Bot can handle multiple meetings
- Runs in separate browser instances
- Parallel processing supported
- Queue system for many meetings

### Limitations:
- Max 5 simultaneous meetings (hardware dependent)
- Each meeting needs separate bot instance
- Memory: ~500MB per bot
- CPU: Moderate usage

## 🎯 Next Steps

### Phase 1 (Current):
- ✅ Bot joins meeting
- ✅ Records audio
- ✅ Transcribes
- ✅ Generates notes

### Phase 2 (Future):
- [ ] Video recording
- [ ] Screen capture
- [ ] Live transcription
- [ ] Real-time notes

### Phase 3 (Advanced):
- [ ] Speaker identification
- [ ] Sentiment analysis
- [ ] Q&A extraction
- [ ] Quiz generation

## 📚 API Reference

### Start Bot:
```
POST /api/transcription/auto-attend/:meetingId
Response: { success: true, message: "..." }
```

### Test Bot:
```
POST /api/transcription/test-bot
Body: { meetingUrl: "https://meet.google.com/..." }
Response: { success: true, message: "Bot test successful" }
```

### Check Status:
```
GET /api/transcription/status/:meetingId
Response: {
  meeting: { title, status, hasTranscript, hasNotes },
  notesCount: 1
}
```

## ✅ Status

**FULLY IMPLEMENTED** ✨

The bot is ready to:
- Join Google Meet automatically
- Record audio
- Transcribe (Hindi + English)
- Generate notes
- Save everything

**Just schedule a meeting and let the bot do its job!** 🎓🤖
