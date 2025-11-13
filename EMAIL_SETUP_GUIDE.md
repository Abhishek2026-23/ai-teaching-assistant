# 📧 Email Setup Guide for AI Teaching Assistant

## Current Status
- ✅ Welcome email on signup (implemented)
- ✅ OTP email for password reset (implemented)
- ⚠️ Email credentials need to be configured on Render

## Quick Setup (5 minutes)

### Step 1: Get Gmail App Password

1. Go to your Google Account: https://myaccount.google.com
2. Click **Security** (left sidebar)
3. Enable **2-Step Verification** (if not already enabled)
4. Go back to Security page
5. Click **App passwords** (under "How you sign in to Google")
6. Select:
   - App: **Mail**
   - Device: **Other (Custom name)**
   - Name it: **AI Teaching Assistant**
7. Click **Generate**
8. **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)

### Step 2: Configure on Render

1. Go to https://dashboard.render.com
2. Click your **backend service** (ai-teaching-assistant-backend)
3. Click **Environment** tab (left sidebar)
4. Update these variables:

```
EMAIL_SERVICE = gmail
EMAIL_USER = your-actual-email@gmail.com
EMAIL_PASSWORD = abcdefghijklmnop (paste the 16-char password, no spaces)
```

5. Click **Save Changes**
6. Wait 2-3 minutes for auto-redeploy

### Step 3: Test

1. Go to your app
2. **Signup** with a new account → Check email for welcome message
3. **Forgot Password** → Check email for 6-digit OTP code
4. Both emails should arrive within 1 minute

## Email Templates

### Welcome Email
- Sent when: User signs up
- Contains: Welcome message, feature overview
- Subject: "Welcome to AI Teaching Assistant! 🎓"

### OTP Email
- Sent when: User requests password reset
- Contains: 6-digit code (valid 15 minutes)
- Subject: "Password Reset Code - AI Teaching Assistant"

## Troubleshooting

### Email Not Arriving?

1. **Check Spam/Junk folder**
2. **Check Promotions tab** (Gmail)
3. **Verify credentials on Render**:
   - EMAIL_USER should be full email address
   - EMAIL_PASSWORD should be 16-char app password (no spaces)
   - EMAIL_SERVICE should be "gmail"

### Still Not Working?

Check backend logs on Render:
1. Go to backend service
2. Click **Logs** tab
3. Look for email sending messages
4. If you see errors, check credentials

### Development Mode

If email is not configured, the system will:
- Log OTP codes to console
- Return OTP in API response (visible in browser console)
- Still allow testing without email

## Alternative: SendGrid (Production Recommended)

For production, consider SendGrid (100 free emails/day):

1. Sign up: https://sendgrid.com
2. Get API key from Settings → API Keys
3. Update Render environment:

```
EMAIL_SERVICE = sendgrid
SENDGRID_API_KEY = your-sendgrid-api-key
EMAIL_USER = noreply@yourdomain.com
```

## Security Notes

✅ App passwords are safer than regular passwords
✅ Can be revoked anytime from Google Account
✅ Only works for the specific app
✅ Doesn't give access to your Google Account

---

**Need Help?** Check the logs on Render or test in development mode first!
