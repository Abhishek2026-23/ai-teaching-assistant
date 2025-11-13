# THE ACTUAL PROBLEM

## What's Wrong
Your frontend is deployed but it's trying to connect to `http://localhost:3000/api` which doesn't exist in production.

You need to:
1. Deploy the BACKEND first
2. Update frontend to use the backend URL
3. Redeploy frontend

## STEP-BY-STEP FIX

### Step 1: Deploy Backend on Render

1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repo: `Abhishek2028-23/ai-teaching-assistant`
4. Configure:
   - **Name:** `ai-teaching-assistant-backend`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** Free

5. Add Environment Variables:
```
PORT=3000
MONGODB_URI=mongodb+srv://Abhisheksingh:abhimongodb123@cluster0.mvjlzrx.mongodb.net/ai-teaching-assistant?retryWrites=true&w=majority
JWT_SECRET=ai-teaching-assistant-secret-key-2024-change-in-production
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=production
FRONTEND_URL=https://ai-teaching-assistant-frontend.onrender.com
```

6. Click "Create Web Service"
7. **WAIT 5-10 minutes** for it to deploy
8. **COPY THE BACKEND URL** (e.g., `https://ai-teaching-assistant-backend-abc123.onrender.com`)

### Step 2: Update Frontend Files

Replace `http://localhost:3000/api` with your backend URL in these files:

1. `frontend/app.js` - Line 2
2. `login.html` - Around line 120
3. `forgot-password.html` - Around line 120
4. `standalone.html` - Check for API calls

**Example:**
```javascript
// OLD
const API_BASE_URL = 'http://localhost:3000/api';

// NEW (use YOUR actual backend URL)
const API_BASE_URL = 'https://ai-teaching-assistant-backend-abc123.onrender.com/api';
```

### Step 3: Commit and Push

```bash
git add .
git commit -m "Fix: Update API URLs to production backend"
git push origin main
```

Your frontend will auto-redeploy and connect to the backend.

## Quick Test

After both are deployed:

1. Backend health: `https://your-backend-url.onrender.com/api/health`
2. Frontend: `https://ai-teaching-assistant-frontend.onrender.com`
3. Try to login/signup

## Why This Happened

The frontend was deployed as a static site, but it still had localhost URLs hardcoded. Static sites can't use environment variables at runtime, so you need to hardcode the production backend URL.
