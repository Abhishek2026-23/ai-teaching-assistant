# 📧 Setup Email Reminders

Your AI Virtual Student app is configured to send email reminders 10 minutes before each scheduled meeting!

## ✅ What's Already Done

- ✅ Email service configured in backend
- ✅ Scheduler running every 5 minutes to check for upcoming meetings
- ✅ Beautiful HTML email templates ready
- ✅ Meeting reminder system implemented

## 🔧 Setup Gmail App Password

To enable email reminders, you need to create a Gmail App Password:

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account: https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Under "How you sign in to Google", enable "2-Step Verification"
4. Follow the prompts to set it up

### Step 2: Create App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" as the app
3. Select "Other (Custom name)" as the device
4. Enter "AI Virtual Student" as the name
5. Click "Generate"
6. Copy the 16-character password (it will look like: `xxxx xxxx xxxx xxxx`)

### Step 3: Update Backend Environment Variables

1. Open `backend/.env` file
2. Update these lines:
   ```
   EMAIL_USER=abhisinghpatel23404@gmail.com
   EMAIL_PASSWORD=your-16-character-app-password-here
   ```
3. Replace `your-16-character-app-password-here` with the password from Step 2
4. Remove any spaces from the password

### Step 4: Deploy to Render

1. Go to your Render dashboard: https://dashboard.render.com/
2. Click on your backend service: `ai-teaching-assistant-backend`
3. Go to "Environment" tab
4. Add/Update these environment variables:
   - `EMAIL_SERVICE` = `gmail`
   - `EMAIL_USER` = `abhisinghpatel23404@gmail.com`
   - `EMAIL_PASSWORD` = `your-16-character-app-password`
   - `NODE_ENV` = `production`
5. Click "Save Changes"
6. Render will automatically redeploy

## 📧 How Email Reminders Work

1. **Scheduler runs every 5 minutes** checking for upcoming meetings
2. **10 minutes before a meeting**, the system sends a reminder email to the user
3. **Email includes:**
   - Meeting title and details
   - Date and time with timezone
   - Direct link to join the meeting
   - Notification that AI bot will also join
4. **Email is marked as sent** so you don't get duplicate reminders

## 🧪 Testing Email Reminders

### Test Locally:
1. Make sure your backend is running: `cd backend && npm start`
2. Schedule a meeting for 12-15 minutes from now
3. Wait for the scheduler to run (every 5 minutes)
4. Check your email inbox for the reminder

### Test on Production:
1. Go to your deployed app: https://ai-virtual-student-blond.vercel.app
2. Schedule a meeting for 12-15 minutes from now
3. Wait for the reminder email
4. Check the Render logs to see the email being sent

## 📝 Email Templates Included

Your app sends these types of emails:

1. **Meeting Reminder** (10 minutes before)
   - Beautiful gradient header
   - Meeting details card
   - Join meeting button
   - AI assistant notification

2. **Welcome Email** (when user signs up)
   - Welcome message
   - Feature highlights
   - Getting started guide

3. **Password Reset** (when user forgets password)
   - 6-digit reset code
   - Security warnings
   - 15-minute expiration

4. **Notes Ready** (after meeting completes)
   - Success notification
   - Link to view notes
   - Summary of what's included

## 🔍 Troubleshooting

### Emails not sending?
1. Check Render logs for email errors
2. Verify Gmail App Password is correct
3. Make sure 2FA is enabled on your Google account
4. Check if EMAIL_SERVICE is set to "gmail"

### Reminders not arriving?
1. Check spam/junk folder
2. Verify meeting is scheduled 10+ minutes in the future
3. Check Render logs to see if scheduler is running
4. Make sure backend is not sleeping (use UptimeRobot)

### Wrong timezone?
- Emails show time in your local timezone automatically
- Backend stores times in UTC
- Frontend converts to local time for display

## 🎉 You're All Set!

Once you add the Gmail App Password to Render, your email reminders will work automatically!

Schedule a test meeting and see the magic happen! ✨
