import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Optional authentication middleware
 * Attaches user info if token is present, but doesn't block request if not
 */
export const optionalAuth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      try {
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Find user
        const user = await User.findById(decoded.userId);
        
        if (user) {
          // Attach user to request
          req.user = user;
          req.userId = user._id;
        }
      } catch (error) {
        // Token invalid, but continue anyway
        console.log('Invalid token, continuing without auth');
      }
    }
    
    next();
  } catch (error) {
    next();
  }
};

/**
 * Get or create user from Clerk email
 * Temporary solution until Clerk integration is complete
 */
export const getOrCreateUserFromEmail = async (email) => {
  if (!email) return null;
  
  let user = await User.findOne({ email });
  
  if (!user) {
    // Create user from Clerk data
    user = new User({
      email,
      name: email.split('@')[0], // Use email prefix as name
      password: 'clerk-auth-' + Math.random().toString(36) // Random password (not used)
    });
    await user.save();
    console.log(`✅ Created user from Clerk: ${email}`);
  }
  
  return user;
};
