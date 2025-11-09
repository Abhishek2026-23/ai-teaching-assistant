import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { getStream } from 'puppeteer-stream';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';

ffmpeg.setFfmpegPath(ffmpegPath.path);

/**
 * Bot that joins Google Meet, records audio, and saves it
 */
export class MeetingBot {
  constructor(meetingUrl, meetingId, duration = 60) {
    this.meetingUrl = meetingUrl;
    this.meetingId = meetingId;
    this.duration = duration; // in minutes
    this.browser = null;
    this.page = null;
    this.audioPath = null;
    this.isRecording = false;
  }

  /**
   * Initialize and launch the bot
   */
  async launch() {
    try {
      console.log(`🤖 Launching bot for meeting: ${this.meetingId}`);
      
      // Launch browser with audio capture enabled
      this.browser = await puppeteer.launch({
        headless: false, // Set to true in production
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--use-fake-ui-for-media-stream', // Auto-allow mic/camera
          '--use-fake-device-for-media-stream',
          '--disable-web-security',
          '--disable-features=IsolateOrigins,site-per-process',
          '--autoplay-policy=no-user-gesture-required'
        ]
      });

      this.page = await this.browser.newPage();
      
      // Set viewport
      await this.page.setViewport({ width: 1280, height: 720 });
      
      console.log('✅ Browser launched');
      return true;
    } catch (error) {
      console.error('❌ Failed to launch browser:', error.message);
      throw error;
    }
  }

  /**
   * Join Google Meet
   */
  async joinMeeting() {
    try {
      console.log(`🔗 Joining meeting: ${this.meetingUrl}`);
      
      // Navigate to meeting
      await this.page.goto(this.meetingUrl, { 
        waitUntil: 'networkidle2',
        timeout: 60000 
      });

      // Wait for page to load
      await this.page.waitForTimeout(3000);

      // Turn off camera and microphone before joining
      await this.turnOffCameraAndMic();

      // Click "Join now" or "Ask to join" button
      await this.clickJoinButton();

      console.log('✅ Joined meeting successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to join meeting:', error.message);
      throw error;
    }
  }

  /**
   * Turn off camera and microphone
   */
  async turnOffCameraAndMic() {
    try {
      // Wait for controls to appear
      await this.page.waitForTimeout(2000);

      // Try to find and click camera/mic buttons
      const selectors = [
        'div[aria-label*="camera"]',
        'div[aria-label*="microphone"]',
        'button[aria-label*="camera"]',
        'button[aria-label*="microphone"]'
      ];

      for (const selector of selectors) {
        try {
          const elements = await this.page.$$(selector);
          for (const element of elements) {
            await element.click();
            await this.page.waitForTimeout(500);
          }
        } catch (e) {
          // Continue if element not found
        }
      }

      console.log('🔇 Camera and mic turned off');
    } catch (error) {
      console.log('⚠️ Could not turn off camera/mic:', error.message);
    }
  }

  /**
   * Click join button
   */
  async clickJoinButton() {
    try {
      // Common selectors for join button
      const joinSelectors = [
        'button[jsname="Qx7uuf"]', // Google Meet join button
        'span:contains("Join now")',
        'span:contains("Ask to join")',
        'button:contains("Join")',
        'div[role="button"]:contains("Join")'
      ];

      for (const selector of joinSelectors) {
        try {
          await this.page.waitForSelector(selector, { timeout: 5000 });
          await this.page.click(selector);
          await this.page.waitForTimeout(3000);
          console.log('✅ Clicked join button');
          return;
        } catch (e) {
          continue;
        }
      }

      // If no button found, try alternative method
      await this.page.keyboard.press('Enter');
      console.log('✅ Pressed Enter to join');
    } catch (error) {
      console.log('⚠️ Could not click join button:', error.message);
    }
  }

  /**
   * Start recording audio
   */
  async startRecording() {
    try {
      console.log('🎙️ Starting audio recording...');
      
      this.isRecording = true;
      
      // Create uploads directory
      const uploadDir = 'uploads/recordings';
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Set audio file path
      this.audioPath = path.join(uploadDir, `${this.meetingId}-${Date.now()}.webm`);
      
      // Get audio stream from page
      const stream = await getStream(this.page, { 
        audio: true, 
        video: false,
        mimeType: 'audio/webm'
      });

      // Save stream to file
      const writeStream = fs.createWriteStream(this.audioPath);
      stream.pipe(writeStream);

      console.log(`✅ Recording started: ${this.audioPath}`);
      
      // Auto-stop after duration
      setTimeout(() => {
        this.stopRecording();
      }, this.duration * 60 * 1000);

      return this.audioPath;
    } catch (error) {
      console.error('❌ Failed to start recording:', error.message);
      throw error;
    }
  }

  /**
   * Stop recording
   */
  async stopRecording() {
    try {
      if (!this.isRecording) return;

      console.log('⏹️ Stopping recording...');
      this.isRecording = false;

      // Wait a bit for stream to finish
      await this.page.waitForTimeout(2000);

      console.log('✅ Recording stopped');
      return this.audioPath;
    } catch (error) {
      console.error('❌ Failed to stop recording:', error.message);
    }
  }

  /**
   * Leave meeting and close browser
   */
  async leaveMeeting() {
    try {
      console.log('👋 Leaving meeting...');

      if (this.isRecording) {
        await this.stopRecording();
      }

      // Try to click leave button
      try {
        const leaveButton = await this.page.$('button[aria-label*="Leave"]');
        if (leaveButton) {
          await leaveButton.click();
        }
      } catch (e) {
        // Continue even if button not found
      }

      await this.page.waitForTimeout(1000);

      if (this.browser) {
        await this.browser.close();
      }

      console.log('✅ Left meeting and closed browser');
    } catch (error) {
      console.error('❌ Error leaving meeting:', error.message);
    }
  }

  /**
   * Convert WebM to MP3 for better compatibility
   */
  async convertToMP3() {
    return new Promise((resolve, reject) => {
      if (!this.audioPath || !fs.existsSync(this.audioPath)) {
        reject(new Error('Audio file not found'));
        return;
      }

      const mp3Path = this.audioPath.replace('.webm', '.mp3');

      ffmpeg(this.audioPath)
        .toFormat('mp3')
        .on('end', () => {
          console.log('✅ Converted to MP3');
          // Delete original WebM file
          fs.unlinkSync(this.audioPath);
          this.audioPath = mp3Path;
          resolve(mp3Path);
        })
        .on('error', (err) => {
          console.error('❌ Conversion error:', err.message);
          reject(err);
        })
        .save(mp3Path);
    });
  }

  /**
   * Get recorded audio path
   */
  getAudioPath() {
    return this.audioPath;
  }
}

/**
 * Main function to run the bot
 */
export async function runMeetingBot(meetingUrl, meetingId, duration = 60) {
  const bot = new MeetingBot(meetingUrl, meetingId, duration);
  
  try {
    // Launch browser
    await bot.launch();
    
    // Join meeting
    await bot.joinMeeting();
    
    // Start recording
    const audioPath = await bot.startRecording();
    
    // Wait for meeting to end
    console.log(`⏰ Recording for ${duration} minutes...`);
    
    return {
      bot,
      audioPath,
      success: true
    };
  } catch (error) {
    console.error('❌ Bot error:', error.message);
    await bot.leaveMeeting();
    throw error;
  }
}

/**
 * Simplified version for testing
 */
export async function testBot(meetingUrl) {
  console.log('🧪 Testing bot with meeting:', meetingUrl);
  
  const bot = new MeetingBot(meetingUrl, 'test-' + Date.now(), 1);
  
  try {
    await bot.launch();
    await bot.joinMeeting();
    console.log('✅ Bot test successful!');
    
    // Leave after 10 seconds
    setTimeout(async () => {
      await bot.leaveMeeting();
    }, 10000);
    
    return true;
  } catch (error) {
    console.error('❌ Bot test failed:', error.message);
    await bot.leaveMeeting();
    return false;
  }
}
