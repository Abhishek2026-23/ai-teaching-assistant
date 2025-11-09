# 🚀 DEPLOY NOW - Step by Step

## ✅ Pre-Deployment Checklist

- [x] Code errors fixed (standalone.html)
- [x] .gitignore created
- [x] render.yaml created
- [x] Environment variable examples created
- [ ] Git installed on your system
- [ ] GitHub account ready
- [ ] MongoDB Atlas account ready
- [ ] OpenAI API key ready
- [ ] Gmail app password ready

---

## 🎯 DEPLOYMENT STEPS

### Step 1: Install Git (if not installed)

Download and install Git from: https://git-scm.com/download/win

After installation, restart your terminal.

---

### Step 2: Setup MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a free cluster (M0)
4. Create database user:
   - Click "Database Access"
   - Add new user with username and password
   - **SAVE THESE CREDENTIALS!**
5. Whitelist all IPs:
   - Click "Network Access"
   - Add IP: 0.0.0.0/0 (allow from anywhere)
6. Get connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Replace `<dbname>` with `ai-teaching-assistant`

**Your MongoDB URI should look like:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ai-teaching-assistant?retryWrites=true&w=majority
```

---

### Step 3: Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign up or login
3. Click "Create new secret key"
4. **SAVE THIS KEY!** (starts with `sk-`)

---

### Step 4: Setup Gmail App Password

1. Enable 2-Factor Authentication on your Google account
2. Go to https://myaccount.google.com/apppasswords
3. Select "Mail" and "Other (Custom name)"
4. Name it "AI Teaching Assistant"
5. **SAVE THE 16-CHARACTER PASSWORD!**

---

### Step 5: Generate JWT Secret

Open terminal and run:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**SAVE THIS OUTPUT!**

---

### Step 6: Push to GitHub

```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - AI Teaching Assistant ready for deployment"

# Create a new repository on GitHub (https://github.com/new)
# Name it: ai-teaching-assistant
# Don't initialize with README

# Link your local repo to GitHub (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/ai-teaching-assistant.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

### Step 7: Deploy on Render

1. **Go to https://render.com**
2. **Sign up** (use GitHub to sign up for easier integration)
3. **Click "New +" → "Blueprint"**
4. **Connect your GitHub repository:**
   - Select `ai-teaching-assistant` repository
5. **Render detects `render.yaml` automatically**
6. **Add Environment Variables:**

   Click on **Backend Service** and add:
   ```
   MONGODB_URI = (your MongoDB connection string from Step 2)
   JWT_SECRET = (your JWT secret from Step 5)
   OPENAI_API_KEY = (your OpenAI key from Step 3)
   EMAIL_USER = (your Gmail address)
   EMAIL_PASS = (your Gmail app password from Step 4)
   FRONTEND_URL = (leave empty for now)
   ```

   Click on **Frontend Service** and add:
   ```
   VITE_API_URL = (leave empty for now)
   ```

7. **Click "Apply"** - Render starts deploying!

---

### Step 8: Update URLs (After First Deploy)

**Wait for both services to deploy (5-10 minutes)**

1. **Copy Backend URL:**
   - Go to backend service in Render
   - Copy the URL (e.g., `https://ai-teaching-assistant-backend.onrender.com`)
   - Add `/api` to it

2. **Update Frontend Environment Variable:**
   - Go to frontend service → Environment
   - Set `VITE_API_URL` = `https://ai-teaching-assistant-backend.onrender.com/api`
   - Click "Save Changes"

3. **Copy Frontend URL:**
   - Go to frontend service
   - Copy the URL (e.g., `https://ai-teaching-assistant-frontend.onrender.com`)

4. **Update Backend Environment Variable:**
   - Go to backend service → Environment
   - Set `FRONTEND_URL` = `https://ai-teaching-assistant-frontend.onrender.com`
   - Click "Save Changes"

5. **Both services will auto-redeploy**

---

### Step 9: Update CORS Settings

Update `backend/server.js` line 28:

```javascript
// Replace:
app.use(cors());

// With (use your actual frontend URL):
app.use(cors({
  origin: ['https://your-frontend-url.onrender.com'],
  credentials: true
}));
```

Then push the update:
```bash
git add backend/server.js
git commit -m "Update CORS for production"
git push
```

Render will auto-deploy the update.

---

## ✅ Test Your Deployment

1. **Visit your frontend URL**
2. **Sign up for a new account**
3. **Check your email** for welcome message
4. **Login** with your credentials
5. **Create a test meeting**
6. **Verify it appears** in your dashboard

---

## 🎉 SUCCESS!

Your AI Teaching Assistant is now live and accessible to anyone!

**Share your app URL:**
```
https://your-app-name.onrender.com
```

---

## 📊 Monitor Your App

### Check Backend Health
Visit: `https://your-backend-url.onrender.com/api/health`

Should return:
```json
{
  "status": "ok",
  "message": "AI Teaching Assistant API is running"
}
```

### View Logs
- Go to Render dashboard
- Click on each service
- Click "Logs" tab to see real-time logs

---

## ⚠️ Important Notes

1. **Free Tier Limitations:**
   - Services spin down after 15 minutes of inactivity
   - First request after spin-down takes ~30 seconds to wake up
   - 750 hours/month free (enough for one service 24/7)

2. **Puppeteer on Free Tier:**
   - Works on Render free tier
   - May be slower than local
   - Consider upgrading for production use

3. **OpenAI Costs:**
   - Monitor your usage at https://platform.openai.com/usage
   - Set spending limits to avoid surprises

---

## 🐛 Troubleshooting

### "Application failed to respond"
- Check environment variables are set correctly
- View logs in Render dashboard
- Verify MongoDB connection string

### "CORS error" in browser
- Update CORS settings in `backend/server.js`
- Make sure `FRONTEND_URL` is set correctly
- Redeploy backend after changes

### "Cannot connect to database"
- Verify MongoDB URI is correct
- Check Network Access in MongoDB Atlas (0.0.0.0/0)
- Check Database Access user credentials

### Emails not sending
- Verify Gmail App Password (not regular password)
- Check 2FA is enabled on Google account
- Check `EMAIL_USER` and `EMAIL_PASS` are correct

---

## 🆙 Upgrade Options

If you need better performance:

**Render Starter Plan ($7/month per service):**
- No spin-down
- Better performance
- More resources

**MongoDB Atlas M2 ($9/month):**
- 2GB storage
- Better performance
- Automated backups

---

## 🎓 You're Done!

Your AI Virtual Teaching Assistant is now:
- ✅ Live on the internet
- ✅ Accessible to anyone
- ✅ Fully functional
- ✅ Ready for users

**Congratulations! 🎉**
