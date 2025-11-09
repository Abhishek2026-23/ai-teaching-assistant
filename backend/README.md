# AI Teaching Assistant - Backend

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your credentials:
   - MongoDB URI
   - OpenAI API key (optional, will use fallback if not provided)

4. Start MongoDB (if running locally):
```bash
mongod
```

5. Run the server:
```bash
npm run dev
```

## API Endpoints

### Meetings
- `GET /api/meetings` - Get all meetings
- `GET /api/meetings/:id` - Get single meeting
- `POST /api/meetings` - Create new meeting
- `PUT /api/meetings/:id` - Update meeting
- `DELETE /api/meetings/:id` - Delete meeting

### Notes
- `GET /api/notes` - Get all notes
- `GET /api/notes/meeting/:meetingId` - Get notes for specific meeting
- `POST /api/notes/generate` - Generate notes from transcript
- `DELETE /api/notes/:id` - Delete note

### Schedule
- `GET /api/schedule/upcoming` - Get upcoming meetings
- `GET /api/schedule/range?start=DATE&end=DATE` - Get meetings in date range

## Tech Stack
- Node.js + Express
- MongoDB + Mongoose
- OpenAI API (for AI note generation)
