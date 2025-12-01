# ✅ Action Checklist - Fix Your App Now

**Time Required:** 15-20 minutes
**Difficulty:** Easy (just configuration)

---

## 🎯 Step 1: Get API Credentials (10 min)

### A. Get Brevo SMTP Credentials
1. Go to https://app.brevo.com/
2. Login or create free account
3. Go to **Settings** → **SMTP & API**
4. Copy your **SMTP Server** details:
   - Login: `your-email@gmail.com`
   - SMTP Key: `xkeysib-xxxxx...`

### B. Get Gemini API Key
1. Go to https://makersuite.google.com/app/apikey
2. Login with Google account
3. Click **"Create API Key"**
4. Copy the key: `AIzaSy...`

---

## 🚀 Step 2: Configure Render (5 min)

1. Go to https://dashboard.render.com/
2. Click on **`ai-teaching-assistant-backend`**
3. Go to **"Environment"** tab
4. Add/Update these variables:

```
EMAIL_SERVICE = smtp
EMAIL_HOST = smtp-relay.brevo.com
EMAIL_PORT = 587
EMAIL_USER = [paste your Brevo login email]
EMAIL_PASSWORD = [paste your Brevo SMTP key]
GEMINI_API_KEY = [paste your Gemini API key]
NODE_ENV = production
```

5. Click **"Save Changes"** (triggers auto-deploy)

---

## 🔄 Step 3: Clear Build Cache (2 min)

1. Still on Render dashboard
2. Click **"Manual Deploy"** button (top right)
3. Select **"Clear build cache & deploy"**
4. Click **"Yes, clear build cache"**
5. Wait 5-10 minutes for deployment

---

## ✅ Step 4: Test Everything (3 min)

### Test 1: Health Check
Open in browser:
```
https://ai-teaching-assistant-backend-5u22.onrender.com/api/health
```
Expected: `{"status":"ok","message":"AI Teaching Assistant API is running"}`

### Test 2: Email Test
Run in terminal (replace with your email):
```bash
curl -X POST https://ai-teaching-assistant-backend-5u22.onrender.com/api/test/send-test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@gmail.com","name":"Test User"}'
```
Expected: Email arrives in 1 minute

### Test 3: Schedule Meeting
1. Go to https://ai-virtual-student-blond.vercel.app
2. Login with Clerk
3. Schedule a meeting for 15 minutes from now
4. Wait for email reminder
5. Watch bot join meeting!

---

## 🎉 Success Indicators

You'll know it's working when you see in Render logs:

```
✅ Connected to MongoDB Atlas
✅ Meeting scheduler started
✅ Browser launched
✅ Joined meeting successfully
✅ Reminder sent successfully
✅ Notes generated for meeting
```

---

## 🆘 If Something Goes Wrong

### Email Not Sending?
- Check Brevo dashboard for send logs
- Verify SMTP key is correct (not API key)
- Check Render logs for email errors

### Bot Not Joining?
- Check Render logs for "Browser launched"
- If still "Could not find Chrome", clear cache again
- Verify @sparticuz/chromium is in package.json

### Notes Not Generating?
- Check Gemini API key is valid
- Check Render logs for AI service errors
- Verify meeting completed successfully

---

## 📞 Quick Reference

| Service | URL | Purpose |
|---------|-----|---------|
| Render Dashboard | https://dashboard.render.com/ | Backend deployment |
| Brevo Dashboard | https://app.brevo.com/ | Email service |
| Gemini API | https://makersuite.google.com/app/apikey | AI notes |
| Frontend App | https://ai-virtual-student-blond.vercel.app | Your app |
| Backend API | https://ai-teaching-assistant-backend-5u22.onrender.com | API endpoint |

---

## 🎯 Current Status

- ✅ Code fixed and pushed to GitHub
- ✅ Chromium package installed
- ⏳ Waiting for you to set API credentials
- ⏳ Waiting for Render deployment

**Next:** Complete Steps 1-4 above!

---

**Estimated Total Time:** 20 minutes
**Difficulty:** Easy
**Result:** Fully working AI Virtual Student! 🎓🤖
