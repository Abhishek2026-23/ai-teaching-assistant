# User Authentication System

## ✅ Completed Features

### Backend Authentication:
1. ✅ User model with bcrypt password hashing
2. ✅ JWT token-based authentication
3. ✅ Register/Login/Logout endpoints
4. ✅ Protected routes with middleware
5. ✅ Profile management
6. ✅ Password change functionality

### Frontend Authentication:
1. ✅ Beautiful login/signup page
2. ✅ Token storage in localStorage
3. ✅ User info display in header
4. ✅ Logout functionality
5. ✅ User menu dropdown
6. ✅ Auto-redirect to login if not authenticated

## API Endpoints

### Authentication:
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update profile (protected)
- `PUT /api/auth/change-password` - Change password (protected)
- `POST /api/auth/logout` - Logout (protected)

## How to Use

### 1. Register New User:
```bash
POST http://localhost:3000/api/auth/register
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

### 2. Login:
```bash
POST http://localhost:3000/api/auth/login
Body: {
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

### 3. Access Protected Routes:
```bash
GET http://localhost:3000/api/auth/me
Headers: {
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

## Frontend Usage

### Login Page:
- Open: `login.html`
- Enter credentials
- Automatically redirects to `standalone.html` on success
- Token saved in localStorage

### Main App:
- Checks for token on load
- Displays user info in header
- User menu with logout option
- Auto-redirect to login if no token

### Demo Account:
- Email: demo@student.com
- Password: demo123

## Security Features

1. **Password Hashing**: bcrypt with salt rounds
2. **JWT Tokens**: 7-day expiration
3. **Protected Routes**: Middleware authentication
4. **Token Validation**: Automatic verification
5. **Secure Storage**: localStorage (client-side)

## User Roles

- **Student**: Default role, access to all features
- **Teacher**: Can create and manage classes
- **Admin**: Full system access

## Testing

### Create Test User:
1. Open `login.html`
2. Click "Sign Up" tab
3. Fill in details:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
   - Role: Student
4. Click "Create Account"
5. Automatically logged in and redirected

### Test Login:
1. Open `login.html`
2. Enter credentials
3. Click "Login"
4. Redirected to main app

### Test Logout:
1. In main app, click user avatar
2. Click "Logout"
3. Redirected to login page

## Configuration

### JWT Secret:
Located in `backend/.env`:
```
JWT_SECRET=ai-teaching-assistant-secret-key-2024-change-in-production
```

**Important**: Change this in production!

### Token Expiration:
Default: 7 days
Change in `backend/middleware/auth.js`:
```javascript
jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
```

## Database Schema

### User Model:
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (student/teacher/admin),
  avatar: String,
  createdAt: Date,
  lastLogin: Date
}
```

## Next Steps (Optional)

- [ ] Email verification
- [ ] Password reset via email
- [ ] Social login (Google, Facebook)
- [ ] Two-factor authentication
- [ ] Session management
- [ ] Remember me functionality
- [ ] Account deletion
- [ ] Profile picture upload

## Troubleshooting

### "Token is not valid" error:
- Token expired (7 days)
- JWT_SECRET changed
- Solution: Logout and login again

### Can't login:
- Check backend is running
- Verify MongoDB connection
- Check browser console for errors

### User not found:
- Register new account first
- Check email spelling
- Verify database connection

## Files Created

### Backend:
- `backend/models/User.js` - User schema
- `backend/middleware/auth.js` - JWT middleware
- `backend/routes/auth.js` - Auth endpoints

### Frontend:
- `login.html` - Login/Signup page

### Modified:
- `backend/server.js` - Added auth routes
- `backend/.env` - Added JWT_SECRET
- `standalone.html` - Added auth check & user info

## Status

✅ **FULLY FUNCTIONAL**

The authentication system is complete and ready to use. Users can register, login, and access protected features.
