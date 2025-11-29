# 🔧 RENDER "NOT FOUND" FIX - Step by Step

## The Problem
Render is serving your app as a **Static Site**, but it's not configured to handle React Router's client-side routing.

## THE FIX (Choose One Method)

---

## Method 1: Update Render Service Settings (RECOMMENDED - 2 minutes)

### Step 1: Go to Render Dashboard
https://dashboard.render.com

### Step 2: Find Your Frontend Service
Click on **"ai-teaching-assistant-frontend"** (or whatever you named it)

### Step 3: Check Service Type
Look at the top - does it say **"Static Site"** or **"Web Service"**?

#### If it says "Static Site":
1. Click **"Settings"** (left sidebar)
2. Scroll to **"Publish directory"**
3. Make sure it says: `dist`
4. Scroll to **"Redirects/Rewrites"**
5. Add this rule:
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Action**: `Rewrite`
6. Click **"Save Changes"**
7. Go to **"Manual Deploy"** → **"Deploy latest commit"**

#### If it says "Web Service":
You need to change it to Static Site:
1. Delete the current service
2. Create a new **Static Site**
3. Connect your GitHub repo
4. Set these values:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Add Redirect Rule**: `/*` → `/index.html` (Rewrite)

---

## Method 2: Use Vercel Instead (FASTEST - 5 minutes)

Vercel handles React routing automatically and is faster than Render for static sites.

### Step 1: Go to Vercel
https://vercel.com

### Step 2: Import Project
1. Click **"Add New"** → **"Project"**
2. Import your GitHub repo
3. Vercel auto-detects Vite settings
4. Click **"Deploy"**

### Step 3: Add Environment Variable
1. Go to **"Settings"** → **"Environment Variables"**
2. Add:
   - **Name**: `VITE_CLERK_PUBLISHABLE_KEY`
   - **Value**: `pk_test_dW5jb21tb24tY2F0ZmlzaC0yNy5jbGVyay5hY2NvdW50cy5kZXYk`
3. Click **"Save"**
4. Redeploy

### Step 4: Update Backend CORS
Update your backend's CORS to include the new Vercel URL:
```javascript
origin: ['https://your-app.vercel.app']
```

**Done!** Your app will work at: `https://your-app.vercel.app`

---

## Method 3: Add Server Configuration (If using Web Service)

If your Render service is a "Web Service" (not Static Site), you need a server.

### Create `server.js` in root:
```javascript
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Update `package.json`:
```json
{
  "scripts": {
    "start": "node server.js",
    "build": "tsc && vite build"
  }
}
```

### Update Render Settings:
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

---

## Quick Test After Fix

Visit these URLs (replace with your actual URL):
- ✅ https://your-app.onrender.com/
- ✅ https://your-app.onrender.com/login
- ✅ https://your-app.onrender.com/signup

All should work without "Not Found"!

---

## My Recommendation

**Use Method 1** if you want to stay on Render (free tier)
**Use Method 2** if you want the fastest solution (Vercel is better for React apps)

Both are free and work great!

---

## Need Help?

1. Check Render logs: Dashboard → Your Service → Logs
2. Check browser console: F12 → Console tab
3. Verify `_redirects` file is in `dist` folder after build
