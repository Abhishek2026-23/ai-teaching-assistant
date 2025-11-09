# Password Reset Feature - Complete Guide

## ✅ Feature Implemented

Users can now reset their password if they forget it using a secure email verification code system.

## 🔐 How It Works

### User Flow:
```
1. User clicks "Forgot Password" on login page
   ↓
2. Enters registered email address
   ↓
3. System generates 6-digit code
   ↓
4. Code sent to user's email
   ↓
5. User enters code in app
   ↓
6. System verifies code
   ↓
7. User sets new password
   ↓
8. Password updated successfully
   ↓
9. User can login with new password
```

## 📧 Email System

### What Gets Sent:
- **Subject**: "Password Reset Code - AI Teaching Assistant"
- **Content**: 
  - Personalized greeting
  - 6-digit reset code
  - Expiration time (15 minutes)
  - Security warnings
  - Professional HTML design

### Email Example:
```
Hello John!

We received a request to reset your password.

Your Reset Code: 123456

This code is valid for 15 minutes.

⚠️ Security Notice:
• Don't share this code with anyone
• If you didn't request this, ignore this email
```

## 🛠️ Setup Instructions

### 1. Install Dependencies:
```bash
cd backend
npm install nodemailer
```

### 2. Configure Email (Choose One):

#### Option A: Gmail (Recommended for Testing)
1. Go to Google Account settings
2. Enable 2-Factor Authentication
3. Generate App Password:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other"
   - Copy the 16-character password

4. Update `backend/.env`:
```
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
NODE_ENV=development
```

#### Option B: Other SMTP Service
```
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.example.com
SMTP_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-password
```

#### Option C: Testing (No Real Emails)
Leave email settings empty - system will use Ethereal (fake SMTP)
- Emails won't actually send
- Code shown in console for testing

### 3. Restart Backend:
```bash
npm run dev
```

## 🎯 API Endpoints

### 1. Request Password Reset:
```
POST /api/auth/forgot-password
Body: { "email": "user@example.com" }

Response: {
  "message": "Reset code sent to your email",
  "resetCode": "123456" // Only in development mode
}
```

### 2. Verify Reset Code:
```
POST /api/auth/verify-reset-code
Body: { 
  "email": "user@example.com",
  "code": "123456"
}

Response: {
  "message": "Code verified successfully",
  "resetId": "..."
}
```

### 3. Reset Password:
```
POST /api/auth/reset-password
Body: { 
  "email": "user@example.com",
  "code": "123456",
  "newPassword": "newpass123"
}

Response: {
  "message": "Password reset successfully",
  "success": true
}
```

## 🔒 Security Features

### Code Generation:
- Random 6-digit number
- Cryptographically secure
- Unique for each request

### Expiration:
- Valid for 15 minutes only
- Auto-deleted after expiration
- Can't be reused

### Protection:
- One-time use codes
- Email verification required
- Rate limiting (future)
- Secure password hashing

### Database:
- Codes stored in separate collection
- Linked to user ID
- Marked as "used" after reset
- Auto-cleanup of expired codes

## 📱 User Interface

### Pages:
1. **login.html** - Has "Forgot Password" link
2. **forgot-password.html** - 3-step reset process

### Steps:
1. **Enter Email** - User provides registered email
2. **Enter Code** - User enters 6-digit code from email
3. **New Password** - User sets new password

### Features:
- Beautiful gradient design
- Step-by-step wizard
- Real-time validation
- Toast notifications
- Resend code option
- Back to login link

## 🧪 Testing

### Test Flow:

#### 1. Without Email Setup (Console Mode):
```
1. Go to forgot-password.html
2. Enter any registered email
3. Check backend console for code
4. Enter code in app
5. Set new password
6. Login with new password
```

#### 2. With Gmail Setup:
```
1. Configure Gmail in .env
2. Go to forgot-password.html
3. Enter your email
4. Check your Gmail inbox
5. Enter code from email
6. Set new password
7. Login successfully
```

### Test Commands:
```bash
# Test forgot password
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Test verify code
curl -X POST http://localhost:3000/api/auth/verify-reset-code \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","code":"123456"}'

# Test reset password
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","code":"123456","newPassword":"newpass123"}'
```

## 💡 Features

### Current:
- ✅ Email verification
- ✅ 6-digit code
- ✅ 15-minute expiration
- ✅ One-time use
- ✅ Secure password update
- ✅ Beautiful UI
- ✅ Toast notifications
- ✅ Resend code option

### Future Enhancements:
- [ ] Rate limiting (prevent spam)
- [ ] SMS verification option
- [ ] Multiple email templates
- [ ] Password strength meter
- [ ] Account lockout after failed attempts
- [ ] Email verification on signup
- [ ] Two-factor authentication

## 🎨 Email Template

### HTML Email Features:
- Responsive design
- Professional branding
- Clear call-to-action
- Security warnings
- Expiration notice
- Mobile-friendly

### Customization:
Edit `backend/services/emailService.js` to:
- Change email design
- Update branding
- Modify content
- Add more information

## 📊 Database Schema

### PasswordReset Model:
```javascript
{
  userId: ObjectId,        // Reference to User
  email: String,           // User's email
  resetCode: String,       // 6-digit code
  expiresAt: Date,         // Expiration time
  used: Boolean,           // Whether code was used
  createdAt: Date          // When created
}
```

### Auto-Cleanup:
- MongoDB TTL index
- Expires documents automatically
- Keeps database clean

## 🚨 Troubleshooting

### Email Not Sending:
1. Check EMAIL_USER and EMAIL_PASSWORD in .env
2. Verify Gmail App Password (not regular password)
3. Check backend logs for errors
4. Test with Ethereal (fake SMTP)

### Code Not Working:
1. Check if code expired (15 minutes)
2. Verify email matches
3. Ensure code not already used
4. Check for typos in code

### Can't Reset Password:
1. Verify code is correct
2. Check password meets requirements (6+ chars)
3. Ensure passwords match
4. Check backend logs

## 📝 Best Practices

### For Users:
1. Use strong passwords
2. Don't share reset codes
3. Reset immediately if code received unexpectedly
4. Check email spam folder

### For Developers:
1. Use App Passwords for Gmail
2. Enable 2FA on email account
3. Monitor failed attempts
4. Log security events
5. Use HTTPS in production

## 🔐 Production Checklist

Before deploying:
- [ ] Remove resetCode from API response
- [ ] Set NODE_ENV=production
- [ ] Use professional email service (SendGrid, AWS SES)
- [ ] Enable rate limiting
- [ ] Add CAPTCHA on forgot password
- [ ] Monitor for abuse
- [ ] Set up email logging
- [ ] Configure proper SMTP
- [ ] Test email delivery
- [ ] Update email templates with real branding

## 📧 Email Service Options

### For Production:

#### SendGrid (Recommended):
- Free: 100 emails/day
- Paid: $15/month for 40k emails
- Easy setup
- Good deliverability

#### AWS SES:
- $0.10 per 1,000 emails
- Highly scalable
- Requires AWS account

#### Mailgun:
- Free: 5,000 emails/month
- Good for developers

#### Gmail:
- Free but limited
- Good for testing only
- Not recommended for production

## ✅ Status

**FULLY IMPLEMENTED** ✨

Users can now:
- Request password reset
- Receive code via email
- Verify code
- Set new password
- Login with new password

**The feature is ready to use!** 🎉

## 📚 Files Created

### Backend:
- `models/PasswordReset.js` - Reset code schema
- `services/emailService.js` - Email sending service
- Updated `routes/auth.js` - Reset endpoints

### Frontend:
- `forgot-password.html` - Reset UI
- Updated `login.html` - Added forgot password link

### Documentation:
- `PASSWORD_RESET_GUIDE.md` - This file

---

**Your users can now safely reset their passwords!** 🔐✨
