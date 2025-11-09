# 🚀 Deployment Guide

This guide will help you deploy the AI Virtual Teaching Assistant to production.

## 📋 Prerequisites

- GitHub account
- MongoDB Atlas account (free tier)
- OpenAI API key
- Gmail with 2FA enabled

## 🌐 Deployment Options

### Option 1: Render (Recommended)

1. Push your code to GitHub
2. Sign up at [render.com](https://render.com)
3. Create new Web Service
4. Connect your GitHub repository
5. Configure environment variables
6. Deploy!

### Option 2: Vercel (Frontend) + Render (Backend)

**Frontend on Vercel:**
1. Push to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add environment variable: `VITE_API_URL`
4. Deploy

**Backend on Render:**
1. Create Web Service on Render
2. Connect repository
3. Add all backend environment variables
4. Deploy

### Option 3: VPS (DigitalOcean, AWS, etc.)

1. Set up Ubuntu server
2. Install Node.js and MongoDB
3. Clone repository
4. Install dependencies
5. Configure environment variables
6. Use PM2 for process management
7. Set up Nginx as reverse proxy
8. Configure SSL with Let's Encrypt

## 🔑 Environment Variables

### Backend
```
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
FRONTEND_URL=your_frontend_url
```

### Frontend
```
VITE_API_URL=your_backend_url/api
```

## 🔧 Post-Deployment

1. Test all features
2. Monitor logs
3. Set up error tracking
4. Configure backups
5. Monitor API usage

## 📊 Monitoring

- Check application logs regularly
- Monitor MongoDB metrics
- Track OpenAI API usage
- Set up uptime monitoring

## 🐛 Troubleshooting

**Backend won't start:**
- Verify all environment variables are set
- Check MongoDB connection string
- Review logs for errors

**CORS errors:**
- Update CORS configuration in `backend/server.js`
- Ensure `FRONTEND_URL` is correct

**Emails not sending:**
- Use Gmail App Password, not regular password
- Verify 2FA is enabled

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**Note:** Keep your environment variables secure and never commit them to version control.
