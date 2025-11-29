# 🚀 AI Virtual Student - Technology Stack

## Project Overview
An intelligent virtual student assistant that automates lecture recording, transcription, note generation, and meeting management using AI - your personal AI study companion.

---

## Frontend Technologies

### Core Framework
- **React 18.2** - Modern UI library for building interactive interfaces
- **TypeScript 5.2** - Type-safe JavaScript for better code quality
- **Vite 5.0** - Lightning-fast build tool and dev server

### UI & Styling
- **Tailwind CSS 3.3** - Utility-first CSS framework for rapid UI development
- **Lucide React** - Beautiful, consistent icon library
- **Custom Gradients** - Purple-to-blue gradient theme for modern aesthetics

### Routing & Navigation
- **React Router DOM 6.20** - Client-side routing for single-page application
- **Protected Routes** - Authentication-based route protection

### State Management
- **React Context API** - Global state management for authentication
- **React Hooks** - useState, useEffect, useContext for component logic

### Authentication
- **Clerk** - Professional authentication service with:
  - Email/password authentication
  - Email verification
  - Password reset
  - User profile management
  - Session handling
  - Social login support (Google, GitHub)

### HTTP Client
- **Axios 1.6** - Promise-based HTTP client for API requests
- **API Service Layer** - Centralized API configuration and error handling

### Date Handling
- **date-fns 2.30** - Modern JavaScript date utility library

---

## Backend Technologies

### Runtime & Framework
- **Node.js** - JavaScript runtime for server-side execution
- **Express.js** - Minimal web framework for building REST APIs
- **ES Modules** - Modern JavaScript module system

### Database
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - ODM (Object Data Modeling) library for MongoDB
  - Schema validation
  - Middleware support
  - Query building

### Authentication & Security
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcryptjs** - Password hashing and encryption
- **CORS** - Cross-Origin Resource Sharing configuration
- **dotenv** - Environment variable management

### AI & Machine Learning

#### Speech-to-Text
- **OpenAI Whisper API** - State-of-the-art speech recognition
  - Supports 99+ languages including Hindi and English
  - Automatic language detection
  - Timestamp generation
  - High accuracy transcription

#### Natural Language Processing
- **Google Gemini AI (gemini-1.5-flash)** - Advanced AI for:
  - Intelligent note generation
  - Content summarization
  - Key points extraction
  - Action items identification
  - Question generation
  - Topic categorization

### File Processing
- **Multer** - Multipart/form-data handling for file uploads
- **FFmpeg** - Audio/video processing and conversion
- **fluent-ffmpeg** - Node.js wrapper for FFmpeg

### Task Scheduling
- **node-cron** - Cron-like job scheduler for:
  - Meeting reminders
  - Automated transcription
  - Scheduled tasks

### Email Services
- **Nodemailer** - Email sending functionality
- **Brevo (Sendinblue) SMTP** - Reliable email delivery service

### API Integration
- **Axios** - HTTP client for external API calls
- **Form-Data** - Multipart form data for file uploads

---

## Development Tools

### Code Quality
- **ESLint** - JavaScript/TypeScript linting
- **TypeScript Compiler** - Type checking and compilation
- **Prettier** (via IDE) - Code formatting

### Build Tools
- **Vite** - Frontend build tool with:
  - Hot Module Replacement (HMR)
  - Optimized production builds
  - Code splitting
  - Tree shaking
  - Terser minification

### Version Control
- **Git** - Source code management
- **GitHub** - Code hosting and collaboration

---

## Deployment & Infrastructure

### Hosting
- **Render** - Cloud platform for:
  - Backend API hosting
  - MongoDB database hosting
  - Automatic deployments from GitHub
  - Environment variable management

### Frontend Deployment Options
- **Render Static Site** - Static file hosting
- **Vercel** (Alternative) - Optimized for React applications

### Environment Management
- **Development** - Local development with hot reload
- **Production** - Optimized builds with minification

---

## Key Features & Technologies

### 1. Audio Transcription
**Technologies:**
- OpenAI Whisper API
- FFmpeg for audio processing
- Multer for file uploads

**Capabilities:**
- Multi-language support (Hindi, English, 99+ languages)
- Automatic language detection
- Timestamp generation
- High accuracy transcription

### 2. AI Note Generation
**Technologies:**
- Google Gemini AI (gemini-1.5-flash)
- Natural Language Processing

**Capabilities:**
- Intelligent summarization
- Key points extraction
- Action items identification
- Question generation
- Topic categorization

### 3. Meeting Management
**Technologies:**
- MongoDB for data storage
- Node-cron for scheduling
- Nodemailer for reminders

**Capabilities:**
- Meeting scheduling
- Automated reminders
- Attendance tracking
- Meeting history

### 4. User Authentication
**Technologies:**
- Clerk authentication service
- JWT tokens
- bcrypt password hashing

**Capabilities:**
- Secure login/signup
- Email verification
- Password reset
- Session management
- Profile management

### 5. Real-time Updates
**Technologies:**
- React state management
- Axios for API calls
- WebSocket-ready architecture

**Capabilities:**
- Live transcription updates
- Real-time note generation
- Instant meeting notifications

---

## Architecture Pattern

### Frontend Architecture
```
src/
├── components/     # Reusable UI components
├── pages/          # Route-based page components
├── contexts/       # React Context providers
├── services/       # API service layer
└── main.tsx        # Application entry point
```

### Backend Architecture
```
backend/
├── models/         # MongoDB schemas
├── routes/         # API endpoints
├── services/       # Business logic
├── middleware/     # Authentication, validation
└── server.js       # Express server setup
```

### Design Pattern
- **MVC (Model-View-Controller)** - Separation of concerns
- **RESTful API** - Standard HTTP methods and endpoints
- **Service Layer** - Business logic abstraction
- **Middleware Pattern** - Request/response processing

---

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset

### Meetings
- `GET /api/meetings` - List all meetings
- `POST /api/meetings` - Create new meeting
- `PUT /api/meetings/:id` - Update meeting
- `DELETE /api/meetings/:id` - Delete meeting

### Notes
- `GET /api/notes` - List all notes
- `GET /api/notes/:id` - Get specific note
- `POST /api/notes/generate` - Generate AI notes
- `DELETE /api/notes/:id` - Delete note

### Transcription
- `POST /api/transcription/upload` - Upload audio for transcription
- `POST /api/transcription/process` - Process and generate notes

---

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=<backend-api-url>
VITE_CLERK_PUBLISHABLE_KEY=<clerk-public-key>
```

### Backend (.env)
```
MONGODB_URI=<mongodb-connection-string>
JWT_SECRET=<jwt-secret-key>
GEMINI_API_KEY=<google-gemini-api-key>
OPENAI_API_KEY=<openai-api-key>
EMAIL_USER=<smtp-email>
EMAIL_PASS=<smtp-password>
FRONTEND_URL=<frontend-url>
PORT=3000
```

---

## Performance Optimizations

### Frontend
- Code splitting with React.lazy()
- Vendor chunk separation
- Terser minification
- Tree shaking
- Asset optimization

### Backend
- MongoDB indexing
- Query optimization
- Caching strategies
- Async/await for non-blocking operations
- Connection pooling

---

## Security Features

### Frontend
- XSS protection via React
- HTTPS enforcement
- Secure token storage
- Input validation

### Backend
- Password hashing with bcrypt
- JWT token authentication
- CORS configuration
- Environment variable protection
- SQL injection prevention (NoSQL)
- Rate limiting ready

---

## Scalability Considerations

### Current Architecture
- Stateless API design
- Horizontal scaling ready
- Database connection pooling
- Async processing for heavy tasks

### Future Enhancements
- Redis caching
- Load balancing
- CDN for static assets
- Microservices architecture
- WebSocket for real-time features

---

## Why These Technologies?

### React + TypeScript
- Type safety reduces bugs
- Large ecosystem and community
- Excellent developer experience
- Industry standard

### Vite
- 10x faster than Webpack
- Instant hot module replacement
- Optimized production builds

### MongoDB
- Flexible schema for evolving features
- Excellent for document-based data
- Easy to scale
- JSON-like documents

### Clerk
- Professional authentication out of the box
- Saves development time
- Built-in security best practices
- Email verification included

### OpenAI Whisper
- Best-in-class speech recognition
- Multi-language support
- High accuracy
- Industry standard

### Google Gemini
- Advanced AI capabilities
- Fast response times
- Cost-effective
- Excellent for text generation

---

## Development Workflow

1. **Local Development**
   ```bash
   # Frontend
   npm run dev
   
   # Backend
   npm start
   ```

2. **Building for Production**
   ```bash
   # Frontend
   npm run build
   
   # Backend
   # No build step needed (Node.js)
   ```

3. **Deployment**
   - Push to GitHub
   - Automatic deployment via Render
   - Environment variables configured in dashboard

---

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## System Requirements

### Development
- Node.js 18+
- npm 9+
- 4GB RAM minimum
- Modern code editor (VS Code recommended)

### Production
- Node.js 18+
- MongoDB 6+
- 512MB RAM minimum (backend)
- CDN for frontend assets

---

## License & Credits

### Open Source Libraries
All technologies used are open source or have free tiers:
- React (MIT License)
- Express (MIT License)
- MongoDB (SSPL)
- Tailwind CSS (MIT License)

### AI Services
- OpenAI Whisper API (Paid)
- Google Gemini AI (Free tier available)
- Clerk (Free tier available)

---

## Contact & Support

**Project Repository:** GitHub
**Documentation:** This file
**Issues:** GitHub Issues

---

**Built with ❤️ using modern web technologies**
