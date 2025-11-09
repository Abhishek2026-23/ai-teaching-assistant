# 🚀 Quick Deployment Guide

## 📋 Prerequisites

Before deploying, make sure you have:
- ✅ GitHub account
- ✅ MongoDB Atlas account (free tier)
- ✅ OpenAI API key
- ✅ Email credentials (Gmail with App Password)

---

## 🎯 FASTEST DEPLOYMENT: Render (Free Tier)

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for deployment"

# Create repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/ai-teaching-assistant.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Render

1. **Go to [render.com](https://render.com)** and sign up (free)

2. **Click "New +" → "Blueprint"**

3. **Connect your GitHub repository**
   - Authorize Render to access your GitHub
   - Select your `ai-teaching-assistant` repository

4. **Render will detect `render.yaml` automatically**

5. **Add Environment Variables** (Click on each service):

   **Backend Service Variables:**
   ```
   MONGODB_URI = mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/ai-teaching-assistant
   JWT_SECRET = (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
   OPENAI_API_KEY = sk-your-openai-key
   EMAIL_USER = your-email@gmail.com
   EMAIL_PASS = your-gmail-app-password
   FRONTEND_URL = (will be provided after frontend deploys)
   ```

   **Frontend Service Variables:**
   ```
   VITE_API_URL = (will be provided after backend deploys)
   ```

6. **Click "Apply"** - Render will deploy both services

7. **Update URLs:**
   - After backend deploys, copy its URL (e.g., `https://ai-teaching-assistant-backend.onrender.com`)
   - Add `/api` to it and set as `VITE_API_URL` in frontend
   - After frontend deploys, copy its URL and set as `FRONTEND_URL` in backend
   - Redeploy both services

### Step 3: Update CORS (Important!)

After getting your frontend URL, update `backend/server.js`:

```javascript
// Replace the cors() line with:
app.use(cors({
  origin: ['https://your-frontend-url.onrender.com'],
  credentials: true
}));
```

Commit and push:
```bash
git add backend/server.js
git commit -m "Update CORS for production"
git push
```

Render will auto-deploy the update.

---

## 🌟 ALTERNATIVE: Vercel (Frontend) + Render (Backend)

### Deploy Frontend to Vercel

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy:**
```bash
vercel
```

3. **Add environment variable in Vercel dashboard:**
   - `VITE_API_URL` = Your backend URL + `/api`

### Deploy Backend to Render

Follow the backend steps from Option 1 above.

---

## 🔧 MongoDB Atlas Setup

1. **Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)**

2. **Create free cluster**

3. **Create database user:**
   - Database Access → Add New User
   - Username & Password (save these!)

4. **Whitelist IP:**
   - Network Access → Add IP Address
   - Click "Allow Access from Anywhere" (0.0.0.0/0)

5. **Get connection string:**
   - Clusters → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your password
   - Replace `<dbname>` with `ai-teaching-assistant`

---

## 📧 Gmail App Password Setup

1. **Enable 2-Factor Authentication** on your Google account

2. **Generate App Password:**
   - Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Other (Custom name)"
   - Name it "AI Teaching Assistant"
   - Copy the 16-character password

3. **Use this password** as `EMAIL_PASS` in your environment variables

---

## 🔑 Generate JWT Secret

Run this command to generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and use it as `JWT_SECRET`.

---

## ✅ Post-Deployment Checklist

After deployment, test these features:

1. ✅ Visit your frontend URL
2. ✅ Sign up for a new account
3. ✅ Check email for welcome message
4. ✅ Login with credentials
5. ✅ Create a test meeting
6. ✅ Check if meeting appears in dashboard
7. ✅ Test password reset flow

---

## 🐛 Troubleshooting

### Backend won't start
- Check all environment variables are set
- Check MongoDB connection string is correct
- Check logs in Render dashboard

### Frontend can't connect to backend
- Verify `VITE_API_URL` is correct (should end with `/api`)
- Check CORS settings in `backend/server.js`
- Check backend is running (visit `/api/health`)

### Puppeteer errors
- Render free tier supports Puppeteer
- If issues persist, check Render logs
- May need to upgrade to paid tier for better performance

### Email not sending
- Verify Gmail App Password is correct
- Check 2FA is enabled on Google account
- Check `EMAIL_USER` and `EMAIL_PASS` are set

---

## 📊 Monitor Your Deployment

### Render Dashboard
- View logs: Click on service → Logs tab
- Check metrics: CPU, Memory usage
- View deployments: Deploy tab

### Health Check
Visit: `https://your-backend-url.onrender.com/api/health`

Should return:
```json
{
  "status": "ok",
  "message": "AI Teaching Assistant API is running"
}
```

---

## 🎉 Your App is Live!

Share your app URL with others:
- Frontend: `https://your-app-name.onrender.com`
- Users can sign up and start using it immediately!

---

## 💡 Tips

1. **Free tier limitations:**
   - Render free tier spins down after 15 min of inactivity
   - First request after spin-down takes ~30 seconds
   - Consider upgrading for production use

2. **Cost optimization:**
   - Frontend on Vercel (free, always on)
   - Backend on Render (free, but spins down)
   - MongoDB Atlas (free tier: 512MB)

3. **Monitoring:**
   - Set up uptime monitoring (e.g., UptimeRobot)
   - Monitor API usage on OpenAI dashboard
   - Check MongoDB Atlas metrics

---

## 🆘 Need Help?

If you encounter issues:
1. Check Render logs
2. Verify all environment variables
3. Test API health endpoint
4. Check MongoDB connection
5. Review CORS settings

---

**Congratulations! Your AI Teaching Assistant is now live! 🎓✨**
