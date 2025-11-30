# 📧 Setup Email Reminders with Brevo (Sendinblue)

Brevo is perfect for production apps - it's more reliable than Gmail and has a generous free tier (300 emails/day)!

## ✅ What's Already Done

- ✅ Email service configured for SMTP
- ✅ Scheduler running every 5 minutes
- ✅ Beautiful HTML email templates
- ✅ Meeting reminder system ready

## 🔧 Setup Brevo SMTP

### Step 1: Get Your Brevo SMTP Credentials

1. **Login to Brevo:**
   - Go to: https://app.brevo.com/
   - Login with your account

2. **Get SMTP Key:**
   - Click on your name (top right) → "SMTP & API"
   - Or go directly to: https://app.brevo.com/settings/keys/smtp
   - Click "Generate a new SMTP key" or copy existing one
   - Give it a name like "AI Virtual Student"
   - Copy the SMTP key (looks like: `xsmtpsib-xxxxx...`)

3. **Note Your Login Email:**
   - Your Brevo login email (the one you use to login to Brevo)
   - This is your `EMAIL_USER`

### Step 2: Update Local Environment

Open `backend/.env` and update:

```env
EMAIL_SERVICE=smtp
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_USER=your-brevo-login-email@gmail.com
EMAIL_PASSWORD=xsmtpsib-your-smtp-key-here
NODE_ENV=production
```

Replace:
- `your-brevo-login-email@gmail.com` with your Brevo account email
- `xsmtpsib-your-smtp-key-here` with your SMTP key from Step 1

### Step 3: Deploy to Render

1. Go to Render dashboard: https://dashboard.render.com/
2. Click on `ai-teaching-assistant-backend`
3. Go to "Environment" tab
4. Add/Update these variables:
   - `EMAIL_SERVICE` = `smtp`
   - `EMAIL_HOST` = `smtp-relay.brevo.com`
   - `EMAIL_PORT` = `587`
   - `EMAIL_USER` = `your-brevo-login-email@gmail.com`
   - `EMAIL_PASSWORD` = `xsmtpsib-your-smtp-key`
   - `NODE_ENV` = `production`
5. Click "Save Changes"
6. Render will automatically redeploy

## 📧 How It Works

**Scheduler checks every 5 minutes:**
- Finds meetings starting in 10-15 minutes
- Sends beautiful reminder email via Brevo
- Marks reminder as sent (no duplicates)

**Email includes:**
- 🎯 Meeting title and details
- 📅 Date and time with timezone
- 🔗 Direct join link
- 🤖 AI bot notification

## 🧪 Test Your Setup

### Test Locally:
```bash
cd backend
npm start
```

Then schedule a meeting for 12-15 minutes from now and wait for the email!

### Test on Production:
1. Go to: https://ai-virtual-student-blond.vercel.app
2. Schedule a meeting for 12-15 minutes from now
3. Check your email inbox
4. Check Render logs to see: "✅ Meeting reminder sent"

## 📊 Brevo Free Tier Limits

- ✅ **300 emails per day** (plenty for reminders!)
- ✅ **Unlimited contacts**
- ✅ **Professional SMTP**
- ✅ **Email tracking**
- ✅ **No credit card required**

## 🔍 Troubleshooting

### Emails not sending?

**Check Brevo Dashboard:**
1. Go to: https://app.brevo.com/statistics/email
2. Check if emails are being sent
3. Look for any errors or bounces

**Check Render Logs:**
1. Look for: "✅ Meeting reminder sent"
2. Or errors like: "❌ Meeting reminder email failed"

**Common Issues:**
- ❌ Wrong SMTP key → Get new one from Brevo
- ❌ Wrong login email → Use your Brevo account email
- ❌ Port blocked → Make sure PORT is 587
- ❌ Backend sleeping → Use UptimeRobot to keep it awake

### Emails going to spam?

**Verify Your Domain (Optional):**
1. Go to Brevo → Settings → Senders & IP
2. Add and verify your domain
3. This improves deliverability

**For now:**
- Check spam/junk folder
- Mark as "Not Spam"
- Add sender to contacts

### Wrong timezone in emails?

- Emails automatically show time in recipient's timezone
- Backend stores in UTC
- Frontend displays in local time

## 🎯 What's Next?

Once you add your Brevo credentials to Render:

1. ✅ Email reminders will work automatically
2. ✅ Users get notified 10 minutes before meetings
3. ✅ Beautiful professional emails
4. ✅ Reliable delivery via Brevo

## 📝 Email Types Sent

Your app sends 4 types of emails:

1. **Meeting Reminder** (10 min before)
2. **Welcome Email** (on signup)
3. **Password Reset** (forgot password)
4. **Notes Ready** (after meeting)

All use the same Brevo SMTP configuration!

## 🚀 Quick Start Checklist

- [ ] Login to Brevo
- [ ] Get SMTP key from Settings → SMTP & API
- [ ] Update Render environment variables
- [ ] Wait for Render to redeploy
- [ ] Schedule a test meeting
- [ ] Check email inbox
- [ ] Celebrate! 🎉

---

**Need help?** Check Brevo docs: https://developers.brevo.com/docs/send-emails-with-smtp
