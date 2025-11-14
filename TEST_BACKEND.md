# Backend Test

Open your browser console and run this:

```javascript
// Test 1: Check if backend is alive
fetch('https://ai-teaching-assistant-backend-5u22.onrender.com/api/health')
  .then(r => r.json())
  .then(d => console.log('Health check:', d))
  .catch(e => console.error('Health check failed:', e));

// Test 2: Try forgot password
fetch('https://ai-teaching-assistant-backend-5u22.onrender.com/api/auth/forgot-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@example.com' })
})
  .then(r => r.json())
  .then(d => console.log('Forgot password response:', d))
  .catch(e => console.error('Forgot password failed:', e));
```

## What to check on Render:

1. Go to your backend service on Render
2. Click "Logs" tab
3. Look for errors when you try the forgot password
4. Check if MongoDB is connected (should see "✅ Connected to MongoDB Atlas")

## Common Issues:

1. **MongoDB not connected** - Check MONGODB_URI in environment variables
2. **Email service failing** - This is OK, it should still return the reset code in development
3. **PasswordReset model error** - Model might not be imported correctly

## Quick Fix:

The backend might be sleeping (free tier). Try accessing the health endpoint first:
https://ai-teaching-assistant-backend-5u22.onrender.com/api/health

Wait 30 seconds for it to wake up, then try forgot password again.
