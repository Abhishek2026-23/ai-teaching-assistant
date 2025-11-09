# 🎓 AI Virtual Teaching Assistant

An intelligent web application that automatically attends online meetings, records sessions, transcribes audio, and generates comprehensive AI-powered notes.

## ✨ Features

### 🤖 Core Functionality
- **Automatic Meeting Attendance** - Bot joins scheduled meetings automatically
- **Audio Recording** - High-quality recording of meeting sessions
- **Multilingual Transcription** - Supports Hindi and English using OpenAI Whisper
- **AI-Powered Notes** - Generates structured notes with summaries and key points
- **Smart Scheduling** - Automated meeting management with cron jobs
- **Email Notifications** - Reminders and alerts for meetings and notes

### 👤 User Features
- **Secure Authentication** - JWT-based login and signup
- **Password Recovery** - Email-based password reset
- **Meeting Management** - Create, view, and manage meetings
- **Notes Dashboard** - Search and organize generated notes
- **Analytics** - View meeting statistics and insights
- **Responsive UI** - Beautiful interface with Tailwind CSS

### 🔒 Security & Privacy
- Encrypted password storage with bcrypt
- JWT token authentication
- Secure API endpoints
- Environment-based configuration
- GDPR-ready data handling

## 🛠️ Technology Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Puppeteer for browser automation
- OpenAI Whisper for transcription
- OpenAI GPT for note generation

### Infrastructure
- MongoDB Atlas for database
- RESTful API architecture
- Cron jobs for scheduling
- Email service integration

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account
- OpenAI API key
- Gmail account with App Password

## 🚀 Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/ai-teaching-assistant.git
cd ai-teaching-assistant
```

### 2. Install dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
npm install
```

### 3. Configure environment variables

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000/api
```

**Backend (backend/.env):**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=http://localhost:5173
```

### 4. Run the application

**Backend (Terminal 1):**
```bash
cd backend
npm start
```

**Frontend (Terminal 2):**
```bash
npm run dev
```

Visit `http://localhost:5173` to use the application.

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with code

### Meetings
- `GET /api/meetings` - Get all meetings
- `POST /api/meetings` - Create new meeting
- `GET /api/meetings/:id` - Get meeting details
- `PUT /api/meetings/:id` - Update meeting
- `DELETE /api/meetings/:id` - Delete meeting

### Notes
- `GET /api/notes` - Get all notes
- `GET /api/notes/:id` - Get note details
- `POST /api/notes` - Create note
- `DELETE /api/notes/:id` - Delete note

### Transcription
- `POST /api/transcription/upload` - Upload audio for transcription
- `GET /api/transcription/:id` - Get transcription status

### Schedule
- `GET /api/schedule` - Get meeting schedule
- `POST /api/schedule/check` - Check upcoming meetings

## 🎯 Usage

1. **Sign Up** - Create an account with email and password
2. **Schedule Meeting** - Add meeting details (title, link, date, time)
3. **Automatic Attendance** - Bot joins meeting at scheduled time
4. **Recording** - Audio is recorded throughout the meeting
5. **Transcription** - Audio is transcribed after meeting ends
6. **AI Notes** - Structured notes are generated automatically
7. **Review** - Access notes from the dashboard anytime

## 🔧 Configuration

### MongoDB Setup
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create database user
4. Whitelist IP addresses
5. Get connection string

### OpenAI Setup
1. Create account at [OpenAI](https://platform.openai.com)
2. Generate API key
3. Add to environment variables

### Gmail Setup
1. Enable 2-Factor Authentication
2. Generate App Password at [Google Account](https://myaccount.google.com/apppasswords)
3. Use App Password in environment variables

## 📊 Project Structure

```
ai-teaching-assistant/
├── backend/
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── middleware/      # Auth middleware
│   └── server.js        # Entry point
├── src/
│   ├── pages/           # React pages
│   ├── services/        # API services
│   └── main.tsx         # React entry
├── public/              # Static files
└── package.json
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Your Name - [Abhishek2026-23](https://github.com/Abhishek2026-23)

## 🙏 Acknowledgments

- OpenAI for Whisper and GPT APIs
- MongoDB for database services
- Puppeteer team for browser automation
- React and Node.js communities

## 📧 Contact

For questions or support, please contact: your.email@example.com

## 🔗 Links

- [Live Demo](https://your-app-url.com) (Coming soon)
- [Documentation](https://github.com/yourusername/ai-teaching-assistant/wiki)
- [Report Bug](https://github.com/yourusername/ai-teaching-assistant/issues)
- [Request Feature](https://github.com/yourusername/ai-teaching-assistant/issues)

---

**Made with ❤️ for educators and students**
