# AI Note Generation Feature

## Overview
The AI Virtual Teaching Assistant now includes automatic note generation from meeting transcripts using AI technology.

## Features

### 1. **Automatic Note Generation**
- Click the "🤖 AI Notes" button on any meeting card
- AI processes the meeting content and generates structured notes
- Notes include:
  - **Summary**: Concise overview of the meeting
  - **Key Points**: Main concepts and topics covered
  - **Action Items**: Homework, assignments, and next steps

### 2. **Smart Note Parsing**
- Extracts important information automatically
- Organizes content in student-friendly format
- Identifies action items and homework

### 3. **Note Viewer**
- Beautiful modal interface to view notes
- Color-coded sections for easy reading
- Download option for offline access

## How to Use

### Generate Notes:
1. Go to **Meetings** page
2. Find the meeting you want notes for
3. Click **"🤖 AI Notes"** button
4. Wait for AI processing (takes a few seconds)
5. Notes will be automatically saved

### View Notes:
1. Go to **Notes** page
2. Click on any note card
3. View detailed notes in the modal
4. Download as PDF if needed

## AI Integration

### Current Setup:
- Uses **OpenAI GPT-3.5-turbo** for note generation
- Falls back to basic text processing if API key not configured
- Processes transcripts intelligently to extract key information

### To Enable Full AI Features:
1. Get an OpenAI API key from: https://platform.openai.com/api-keys
2. Add to `backend/.env`:
   ```
   OPENAI_API_KEY=your_actual_api_key_here
   ```
3. Restart the backend server

### Without API Key:
- System uses intelligent text processing
- Extracts sentences and identifies action items
- Still provides useful structured notes

## API Endpoints

### Generate Notes:
```
POST /api/notes/generate
Body: { meetingId, transcript }
```

### Generate Sample Notes (for testing):
```
POST /api/notes/generate-sample
Body: { meetingId }
```

### Get All Notes:
```
GET /api/notes
```

### Get Notes for Specific Meeting:
```
GET /api/notes/meeting/:meetingId
```

## Technical Details

### AI Processing:
- Model: GPT-3.5-turbo (or GPT-4 if configured)
- Temperature: 0.7 (balanced creativity)
- Max tokens: 1000
- Structured prompt for educational content

### Fallback Processing:
- Sentence extraction
- Action word detection (should, must, need to, etc.)
- Automatic summarization
- Key point identification

## Future Enhancements

- [ ] Real-time transcription during meetings
- [ ] Multiple language support
- [ ] Custom note templates
- [ ] Integration with Google Meet for automatic recording
- [ ] Voice-to-text transcription
- [ ] PDF export with formatting
- [ ] Email delivery of notes
- [ ] Collaborative note editing

## Tips for Best Results

1. **Better Transcripts = Better Notes**
   - Clear audio quality
   - Structured meeting format
   - Distinct speakers

2. **Meeting Titles Matter**
   - Use descriptive titles
   - Include subject/topic
   - Helps AI understand context

3. **Review AI Notes**
   - Always review generated content
   - AI is helpful but not perfect
   - Add your own annotations

## Troubleshooting

### Notes Not Generating?
- Check backend server is running
- Verify MongoDB connection
- Check browser console for errors

### Poor Quality Notes?
- Ensure transcript is clear
- Try with longer, more detailed content
- Consider adding OpenAI API key for better results

### API Errors?
- Check OpenAI API key is valid
- Verify API quota/credits
- System will fallback to basic processing

## Support

For issues or questions:
1. Check backend logs: `backend/` terminal
2. Check browser console: F12 → Console
3. Verify API connectivity: http://localhost:3000/api/health
