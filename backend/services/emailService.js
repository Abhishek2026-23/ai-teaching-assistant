import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Email service for sending password reset codes
 */

// Create transporter
const createTransporter = () => {
  // Support both EMAIL_PASSWORD and EMAIL_PASS
  const emailPassword = process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS;
  
  // Check if email is configured
  if (!process.env.EMAIL_USER || !emailPassword) {
    console.warn('⚠️ Email not configured. Using console logging instead.');
    console.warn('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Not set');
    console.warn('EMAIL_PASSWORD/EMAIL_PASS:', emailPassword ? 'Set' : 'Not set');
    return null;
  }
  
  console.log('📧 Configuring email with:', process.env.EMAIL_USER);
  console.log('📧 Email service:', process.env.EMAIL_SERVICE);
  
  // Gmail configuration
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: emailPassword
      }
    });
  }
  
  // SMTP configuration (Brevo, SendGrid, etc.)
  if (process.env.EMAIL_SERVICE === 'smtp' && process.env.EMAIL_HOST) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: emailPassword
      }
    });
  }
  
  // Default: Use Ethereal (fake SMTP for testing)
  console.warn('⚠️ Using default Ethereal SMTP (for testing only)');
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: emailPassword
    }
  });
};

/**
 * Send password reset code via email
 */
export async function sendPasswordResetEmail(email, resetCode, userName) {
  try {
    const transporter = createTransporter();
    
    // If email not configured, just log the code
    if (!transporter) {
      console.log('📧 EMAIL NOT CONFIGURED - Reset code for', email, ':', resetCode);
      return {
        success: true,
        messageId: 'no-email-configured',
        resetCode // Return code for development
      };
    }
    
    const mailOptions = {
      from: `"AI Teaching Assistant" <${process.env.EMAIL_USER || 'noreply@aiteaching.com'}>`,
      to: email,
      subject: 'Password Reset Code - AI Teaching Assistant',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .code-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 10px; }
            .code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; }
            .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 AI Teaching Assistant</h1>
              <p>Password Reset Request</p>
            </div>
            <div class="content">
              <h2>Hello ${userName}!</h2>
              <p>We received a request to reset your password. Use the code below to reset your password:</p>
              
              <div class="code-box">
                <p style="margin: 0; color: #666; font-size: 14px;">Your Reset Code</p>
                <div class="code">${resetCode}</div>
                <p style="margin: 0; color: #666; font-size: 12px;">Valid for 15 minutes</p>
              </div>
              
              <p>Enter this code in the app to reset your password.</p>
              
              <div class="warning">
                <strong>⚠️ Security Notice:</strong>
                <ul style="margin: 10px 0;">
                  <li>This code expires in 15 minutes</li>
                  <li>Don't share this code with anyone</li>
                  <li>If you didn't request this, ignore this email</li>
                </ul>
              </div>
              
              <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
              
              <p>Best regards,<br>AI Teaching Assistant Team</p>
            </div>
            <div class="footer">
              <p>© 2024 AI Teaching Assistant. All rights reserved.</p>
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Hello ${userName}!
        
        We received a request to reset your password.
        
        Your Reset Code: ${resetCode}
        
        This code is valid for 15 minutes.
        
        Enter this code in the app to reset your password.
        
        If you didn't request this, please ignore this email.
        
        Best regards,
        AI Teaching Assistant Team
      `
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Password reset email sent:', info.messageId);
    
    // For testing with Ethereal
    if (process.env.NODE_ENV === 'development') {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    
    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    throw new Error('Failed to send email');
  }
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(email, userName) {
  try {
    const transporter = createTransporter();
    
    // If email not configured, just log
    if (!transporter) {
      console.log('📧 Welcome email would be sent to:', email, '(Email not configured)');
      return {
        success: true,
        messageId: 'no-email-configured'
      };
    }
    
    const mailOptions = {
      from: `"AI Teaching Assistant" <${process.env.EMAIL_USER || 'noreply@aiteaching.com'}>`,
      to: email,
      subject: 'Welcome to AI Teaching Assistant! 🎓',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #667eea; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 Welcome to AI Teaching Assistant!</h1>
            </div>
            <div class="content">
              <h2>Hello ${userName}! 👋</h2>
              <p>Thank you for joining AI Teaching Assistant. We're excited to help you never miss a class!</p>
              
              <h3>What you can do:</h3>
              <div class="feature">
                <strong>🤖 Auto-Attend Classes</strong><br>
                Schedule your meetings and our bot will attend for you
              </div>
              <div class="feature">
                <strong>📝 AI-Generated Notes</strong><br>
                Get comprehensive notes from every class automatically
              </div>
              <div class="feature">
                <strong>🌐 Multilingual Support</strong><br>
                Works with Hindi and English (and 90+ languages)
              </div>
              
              <p>Start by scheduling your first meeting in the app!</p>
              
              <p>Best regards,<br>AI Teaching Assistant Team</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent to:', email);
  } catch (error) {
    console.error('❌ Welcome email failed:', error.message);
    // Don't throw error for welcome email
  }
}

/**
 * Generate random 6-digit code
 */
export function generateResetCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send meeting reminder email
 */
export async function sendMeetingReminder(email, userName, meeting) {
  try {
    const transporter = createTransporter();
    
    const meetingTime = new Date(meeting.scheduledTime);
    const formattedDate = meetingTime.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const formattedTime = meetingTime.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    const mailOptions = {
      from: `"AI Teaching Assistant" <${process.env.EMAIL_USER || 'noreply@aiteaching.com'}>`,
      to: email,
      subject: `🔔 Meeting Reminder: ${meeting.title} in 10 minutes`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .meeting-card { background: white; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 5px; }
            .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .time-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔔 Meeting Reminder</h1>
              <p>Your meeting starts in 10 minutes!</p>
            </div>
            <div class="content">
              <h2>Hello ${userName}! 👋</h2>
              <p>This is a friendly reminder that your meeting is starting soon.</p>
              
              <div class="meeting-card">
                <h3 style="margin: 0 0 15px 0; color: #667eea;">📹 ${meeting.title}</h3>
                <p style="margin: 5px 0;"><strong>📅 Date:</strong> ${formattedDate}</p>
                <p style="margin: 5px 0;"><strong>🕐 Time:</strong> ${formattedTime}</p>
                <p style="margin: 5px 0;"><strong>⏱️ Duration:</strong> ${meeting.duration || 60} minutes</p>
              </div>
              
              <div class="time-box">
                <strong>⏰ Starting in 10 minutes!</strong>
                <p style="margin: 5px 0 0 0;">Get ready to join your meeting.</p>
              </div>
              
              <div style="text-align: center;">
                <a href="${meeting.url}" class="button">
                  🔗 Join Meeting Now
                </a>
              </div>
              
              <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 0;"><strong>🤖 AI Assistant Active</strong></p>
                <p style="margin: 5px 0 0 0; font-size: 14px;">
                  Our AI bot will also join this meeting to record and generate notes for you automatically.
                </p>
              </div>
              
              <p style="color: #666; font-size: 14px;">
                <strong>Note:</strong> If you can't attend, don't worry! Our AI assistant will join the meeting, 
                record it, and generate comprehensive notes for you to review later.
              </p>
              
              <p>Best regards,<br>AI Teaching Assistant Team</p>
            </div>
            <div class="footer">
              <p>© 2024 AI Teaching Assistant. All rights reserved.</p>
              <p>This is an automated reminder. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Hello ${userName}!
        
        🔔 MEETING REMINDER
        
        Your meeting starts in 10 minutes!
        
        Meeting: ${meeting.title}
        Date: ${formattedDate}
        Time: ${formattedTime}
        Duration: ${meeting.duration || 60} minutes
        
        Join URL: ${meeting.url}
        
        Our AI bot will also join to record and generate notes for you.
        
        Best regards,
        AI Teaching Assistant Team
      `
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log(`✅ Meeting reminder sent to ${email}:`, info.messageId);
    
    // For testing with Ethereal
    if (process.env.NODE_ENV === 'development') {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    
    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error('❌ Meeting reminder email failed:', error.message);
    // Don't throw error - reminder is not critical
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Send meeting completion notification with notes
 */
export async function sendNotesReadyEmail(email, userName, meeting, notesUrl) {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"AI Teaching Assistant" <${process.env.EMAIL_USER || 'noreply@aiteaching.com'}>`,
      to: email,
      subject: `📝 Notes Ready: ${meeting.title}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .success-box { background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Notes Ready!</h1>
              <p>Your AI-generated notes are available</p>
            </div>
            <div class="content">
              <h2>Hello ${userName}! 👋</h2>
              <p>Great news! Your meeting notes have been generated and are ready to review.</p>
              
              <div class="success-box">
                <h3 style="margin: 0 0 10px 0; color: #059669;">📝 ${meeting.title}</h3>
                <p style="margin: 5px 0;">Meeting completed and processed successfully!</p>
              </div>
              
              <p><strong>What's included in your notes:</strong></p>
              <ul>
                <li>📋 Summary of the meeting</li>
                <li>🎯 Key points and concepts</li>
                <li>✅ Action items and homework</li>
                <li>📚 Important topics covered</li>
              </ul>
              
              <div style="text-align: center;">
                <a href="${notesUrl || 'http://localhost:5174'}" class="button">
                  📖 View Your Notes
                </a>
              </div>
              
              <p>Your notes are securely stored and available anytime in your dashboard.</p>
              
              <p>Best regards,<br>AI Teaching Assistant Team</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Notes ready email sent to ${email}`);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Notes ready email failed:', error.message);
    return { success: false, error: error.message };
  }
}
