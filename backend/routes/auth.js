import express from 'express';
import User from '../models/User.js';
import { generateToken, authenticate } from '../middleware/auth.js';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role: role || 'student'
    });

    await user.save();

    // Send welcome email (don't wait for it)
    const { sendWelcomeEmail } = await import('../services/emailService.js');
    sendWelcomeEmail(user.email, user.name).catch(err => {
      console.error('Failed to send welcome email:', err.message);
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        avatar: req.user.avatar,
        createdAt: req.user.createdAt,
        lastLogin: req.user.lastLogin
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update user profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name, avatar } = req.body;
    
    const user = await User.findById(req.userId);
    
    if (name) user.name = name;
    if (avatar) user.avatar = avatar;
    
    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Change password
router.put('/change-password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.userId);
    
    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Logout (client-side will remove token)
router.post('/logout', authenticate, async (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// Request password reset
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists
      return res.json({ 
        message: 'If that email exists, a reset code has been sent' 
      });
    }
    
    // Generate reset code
    const { generateResetCode, sendPasswordResetEmail } = await import('../services/emailService.js');
    const PasswordReset = (await import('../models/PasswordReset.js')).default;
    
    const resetCode = generateResetCode();
    
    // Save reset code to database
    const passwordReset = new PasswordReset({
      userId: user._id,
      email: user.email,
      resetCode
    });
    await passwordReset.save();
    
    // Try to send email (don't fail if it doesn't work)
    try {
      await sendPasswordResetEmail(user.email, resetCode, user.name);
    } catch (emailError) {
      console.error('Email sending failed:', emailError.message);
      // Continue anyway - code is saved in database
    }
    
    res.json({ 
      message: 'Reset code sent to your email'
      // Code is only sent via email, not in response for security
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process request', details: error.message });
  }
});

// Verify reset code
router.post('/verify-reset-code', async (req, res) => {
  try {
    const { email, code } = req.body;
    
    const PasswordReset = (await import('../models/PasswordReset.js')).default;
    
    // Find valid reset code
    const resetRequest = await PasswordReset.findOne({
      email,
      resetCode: code,
      used: false,
      expiresAt: { $gt: new Date() }
    });
    
    if (!resetRequest) {
      return res.status(400).json({ 
        error: 'Invalid or expired reset code' 
      });
    }
    
    res.json({ 
      message: 'Code verified successfully',
      resetId: resetRequest._id
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Reset password with code
router.post('/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters' 
      });
    }
    
    const PasswordReset = (await import('../models/PasswordReset.js')).default;
    
    // Find and verify reset code
    const resetRequest = await PasswordReset.findOne({
      email,
      resetCode: code,
      used: false,
      expiresAt: { $gt: new Date() }
    });
    
    if (!resetRequest) {
      return res.status(400).json({ 
        error: 'Invalid or expired reset code' 
      });
    }
    
    // Find user and update password
    const user = await User.findById(resetRequest.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    // Mark reset code as used
    resetRequest.used = true;
    await resetRequest.save();
    
    res.json({ 
      message: 'Password reset successfully',
      success: true
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
