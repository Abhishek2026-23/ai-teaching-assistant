# AI Teaching Assistant - Technology Stack

## Frontend Technologies

### Core Framework
- **React 18** - Modern UI library for building interactive interfaces
- **TypeScript** - Type-safe JavaScript for better code quality
- **Vite** - Fast build tool and development server

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **React Router DOM** - Client-side routing for single-page application

### State Management
- **React Context API** - For authentication state management
- **React Hooks** - useState, useEffect for component logic

### HTTP Client
- **Axios** - Promise-based HTTP client for API calls

## Backend Technologies

### Runtime & Framework
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework for REST API

### Database
- **MongoDB Atlas** - Cloud-hosted NoSQL database
- **Mongoose** - ODM (Object Data Modeling) library for MongoDB

### Authentication & Security
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcryptjs** - Password hashing and encryption
- **CORS** - Cross-Origin Resource Sharing middleware

### Email Service
- **Nodemailer** - Email sending library
- **Gmail SMTP / Brevo** - Email delivery services

### AI Integration
- **Google Gemini API** - AI-powered note generation and summarization
- **Axios** - For API communication with AI services

### Meeting Automation
- **Puppeteer** - Headless browser automation for meeting attendance
- **Puppeteer-stream** - Screen recording and streaming
- **FFmpeg** - Audio/video processing

### Scheduling & Background Jobs
- **node-cron** - Task scheduler for meeting reminders and auto-attendance

### File Handling
- **Multer** - Middleware for handling file uploads
- **Form-data** - For multipart form data

## Deployment & DevOps

### Hosting
- **Render** - Cloud platform for both frontend and backend
  - Frontend: Static site hosting
  - Backend: Web service hosting

### Version Control
- **Git** - Version control system
- **GitHub** - Code repository and CI/CD integration

### Environment Management
- **dotenv** - Environment variable management

## Development Tools

### Build Tools
- **Vite** - Frontend build tool
- **TypeScript Compiler** - Type checking and compilation
- **PostCSS** - CSS processing

### Code Quality
- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting

## Architecture Pattern

### Design Pattern
- **MVC (Model-View-Controller)** - Separation of concerns
- **RESTful API** - Standard API architecture
- **JWT Authentication** - Stateless authentication

### Project Structure
```
Frontend (React + TypeScript)
├── Components (Reusable UI)
├── Pages (Route components)
├── Contexts (State management)
└── Services (API calls)

Backend (Node.js + Express)
├── Models (Database schemas)
├── Routes (API endpoints)
├── Middleware (Auth, validation)
└── Services (Business logic)
```

## Key Features & Technologies Used

### 1. User Authentication
- JWT tokens
- bcrypt password hashing
- Protected routes

### 2. Password Reset
- Email verification
- Time-limited reset codes
- Nodemailer integration

### 3. Meeting Management
- CRUD operations
- MongoDB storage
- Scheduled reminders

### 4. AI Note Generation
- Google Gemini API
- Natural language processing
- Automatic summarization

### 5. Auto-Attendance
- Puppeteer automation
- Browser control
- Meeting bot integration

### 6. Real-time Updates
- RESTful API polling
- State synchronization

## Why These Technologies?

### React + TypeScript
- Type safety reduces bugs
- Component reusability
- Large ecosystem

### Node.js + Express
- JavaScript full-stack
- Fast and scalable
- Rich middleware ecosystem

### MongoDB
- Flexible schema
- Easy to scale
- JSON-like documents

### Render
- Free tier available
- Auto-deployment from Git
- Easy environment management

### Gemini AI
- Advanced language model
- Free tier available
- Good for educational content

## Performance Optimizations

- Code splitting with Vite
- Lazy loading of routes
- Optimized bundle size
- CDN for static assets
- Database indexing

## Security Measures

- Password hashing with bcrypt
- JWT token authentication
- CORS configuration
- Environment variable protection
- Input validation
- SQL injection prevention (NoSQL)
