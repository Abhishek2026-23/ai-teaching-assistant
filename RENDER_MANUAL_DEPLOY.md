# 🚀 Manual Render Deployment Guide

## Step 1: Deploy Backend (10 minutes)

### 1.1 Create Web Service
1. Go to https://dashboard.render.com
2. Click **"New +"** button (top right)
3. Select **"Web Service"**

### 1.2 Connect Repository
1. Click **"Build and deploy from a Git repository"**
2. Click **"Connect account"** if not connected
3. Find and select: **Abhishek2026-23/ai-teaching-assistant**
4. Click **"Connect"**

### 1.3 Configure Backend Service
Fill in these settings:

**Basic Settings:**
- **Name**: `ai-teaching-assistant-backend`
- **Region**: Choose closest to you (e.g., Oregon)
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`

**Build & Deploy:**
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Instance Type:**
- Select **"Free"** plan

### 1.4 Add Environment Variables
Click **"Advanced"** → **"Add Environment Variable"**

Add these one by one:

```
NODE_ENV = production
PORT = 5000
MONGODB_URI = your_mongodb_connection_string
JWT_SECRET = your_jwt_secret_key
OPENAI_API_KEY = your_openai_api_key
EMAIL_USER = your_gmail_address
EMAIL_PASS = your_gmail_app_password
FRONTEND_URL = https://your-frontend-url.onrender.com
```

**Note:** You'll update `FRONTEND_URL` after deploying the frontend in Step 2.

### 1.5 Deploy
1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. **Copy your backend URL** (e.g., `https://ai-teaching-assistant-backend.onrender.com`)

---

## Step 2: Deploy Frontend (10 minutes)

### 2.1 Create Static Site
1. Go back to Render Dashboard
2. Click **"New +"** button
3. Select **"Static Site"**

### 2.2 Connect Repository
1. Select the same repository: **Abhishek2026-23/ai-teaching-assistant**
2. Click **"Connect"**

### 2.3 Configure Frontend Service
Fill in these settings:

**Basic Settings:**
- **Name**: `ai-teaching-assistant-frontend`
- **Branch**: `main`
- **Root Directory**: Leave empty (root of repo)

**Build Settings:**
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

### 2.4 Add Environment Variable
Click **"Advanced"** → **"Add Environment Variable"**

```
VITE_API_URL = https://ai-teaching-assistant-backend.onrender.com
```

**Important:** Use the backend URL you copied in Step 1.5!

### 2.5 Deploy
1. Click **"Create Static Site"**
2. Wait 5-10 minutes for deployment
3. **Copy your frontend URL** (e.g., `https://ai-teaching-assistant-frontend.onrender.com`)

---

## Step 3: Update Backend Environment (5 minutes)

### 3.1 Update FRONTEND_URL
1. Go to your **backend service** on Render
2. Click **"Environment"** in left sidebar
3. Find **FRONTEND_URL** variable
4. Update it with your frontend URL from Step 2.5
5. Click **"Save Changes"**
6. Service will automatically redeploy

---

## Step 4: Test Your Deployment (5 minutes)

### 4.1 Visit Your App
1. Open your frontend URL in browser
2. You should see the login page

### 4.2 Test Sign Up
1. Click **"Sign Up"**
2. Create a new account
3. Check your email for welcome message

### 4.3 Test Login
1. Log in with your credentials
2. You should see the dashboard

### 4.4 Test Features
- ✅ Create a meeting
- ✅ View dashboard
- ✅ Check if data persists

---

## 🎉 Success Checklist

- [ ] Backend deployed and running
- [ ] Frontend deployed and accessible
- [ ] Can sign up new account
- [ ] Welcome email received
- [ ] Can log in
- [ ] Dashboard loads correctly
- [ ] Can create meetings

---

## 🐛 Troubleshooting

### Backend won't start
- Check logs in Render dashboard
- Verify all environment variables are set
- Make sure MongoDB URI is correct

### Frontend shows errors
- Check if VITE_API_URL is correct
- Open browser console (F12) for errors
- Verify backend is running

### Can't sign up
- Check backend logs
- Verify EMAIL_USER and EMAIL_PASS are correct
- Make sure MongoDB is connected

### CORS errors
- Verify FRONTEND_URL in backend matches your actual frontend URL
- Check backend logs for CORS messages

---

## 📝 Your Deployment URLs

**Backend:** `https://ai-teaching-assistant-backend.onrender.com`
**Frontend:** `https://ai-teaching-assistant-frontend.onrender.com`

(Update these with your actual URLs!)

---

## 💡 Important Notes

1. **Free tier sleeps after 15 minutes** - First request may be slow
2. **Keep your API keys secret** - Never share them
3. **Monitor OpenAI usage** - Set spending limits
4. **Check logs regularly** - Catch issues early

---

## 🚀 Next Steps

After successful deployment:
1. Share your frontend URL with others
2. Test all features thoroughly
3. Monitor logs for any errors
4. Consider upgrading if you need 24/7 uptime

---

**Good luck with your deployment! 🎓✨**
