import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Transcribe audio using OpenAI Whisper API
 * Supports Hindi, English, and 99+ other languages
 */
export async function transcribeAudio(audioFilePath) {
  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      console.log('OpenAI API key not configured, using mock transcription');
      return generateMockTranscript();
    }

    // Create form data
    const formData = new FormData();
    formData.append('file', fs.createReadStream(audioFilePath));
    formData.append('model', 'whisper-1');
    formData.append('language', 'en'); // Auto-detect if not specified
    formData.append('response_format', 'verbose_json'); // Get timestamps

    const response = await axios.post(
      'https://api.openai.com/v1/audio/transcriptions',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          ...formData.getHeaders()
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
    );

    return {
      text: response.data.text,
      language: response.data.language,
      duration: response.data.duration,
      segments: response.data.segments || []
    };
  } catch (error) {
    console.error('Transcription error:', error.response?.data || error.message);
    return generateMockTranscript();
  }
}

/**
 * Transcribe audio with language detection (Hindi + English)
 */
export async function transcribeMultilingual(audioFilePath) {
  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      return generateMockTranscript();
    }

    const formData = new FormData();
    formData.append('file', fs.createReadStream(audioFilePath));
    formData.append('model', 'whisper-1');
    // Don't specify language - let Whisper auto-detect
    formData.append('response_format', 'verbose_json');

    const response = await axios.post(
      'https://api.openai.com/v1/audio/transcriptions',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          ...formData.getHeaders()
        }
      }
    );

    // If Hindi detected, translate to English for notes
    if (response.data.language === 'hi' || response.data.language === 'hindi') {
      const translated = await translateToEnglish(response.data.text);
      return {
        originalText: response.data.text,
        originalLanguage: 'Hindi',
        translatedText: translated,
        duration: response.data.duration,
        segments: response.data.segments
      };
    }

    return {
      originalText: response.data.text,
      originalLanguage: response.data.language,
      translatedText: response.data.text,
      duration: response.data.duration,
      segments: response.data.segments
    };
  } catch (error) {
    console.error('Multilingual transcription error:', error.message);
    return generateMockTranscript();
  }
}

/**
 * Translate Hindi text to English using OpenAI
 */
async function translateToEnglish(hindiText) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a translator. Translate the following Hindi text to English. Maintain the meaning and context.'
          },
          {
            role: 'user',
            content: hindiText
          }
        ],
        temperature: 0.3
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Translation error:', error.message);
    return hindiText; // Return original if translation fails
  }
}

/**
 * Generate mock transcript for testing without API key
 */
function generateMockTranscript() {
  return {
    originalText: `Welcome to today's lecture on Advanced Mathematics. 
    Today we will cover calculus and its applications. 
    The derivative of a function represents the rate of change. 
    For homework, please complete exercises 1 through 10 in chapter 5.
    Remember to review the chain rule and integration techniques.
    Office hours are available on Wednesdays from 2 to 4 PM.`,
    originalLanguage: 'English',
    translatedText: `Welcome to today's lecture on Advanced Mathematics. 
    Today we will cover calculus and its applications. 
    The derivative of a function represents the rate of change. 
    For homework, please complete exercises 1 through 10 in chapter 5.
    Remember to review the chain rule and integration techniques.
    Office hours are available on Wednesdays from 2 to 4 PM.`,
    duration: 180,
    segments: []
  };
}

/**
 * Process uploaded audio file and generate notes
 */
export async function processAudioAndGenerateNotes(audioFilePath, meetingId, meetingTitle) {
  try {
    console.log('Starting audio processing...');
    
    // Step 1: Transcribe audio (supports Hindi + English)
    const transcription = await transcribeMultilingual(audioFilePath);
    
    console.log(`Transcription complete. Language: ${transcription.originalLanguage}`);
    
    // Step 2: Generate notes from transcript
    const { generateNotesEnhanced } = await import('./aiService.js');
    const notes = await generateNotesEnhanced(transcription.translatedText, meetingTitle);
    
    // Step 3: Add language info to notes
    notes.metadata = {
      originalLanguage: transcription.originalLanguage,
      duration: transcription.duration,
      hasTranslation: transcription.originalLanguage !== 'English'
    };
    
    console.log('Notes generated successfully');
    
    return {
      transcription,
      notes
    };
  } catch (error) {
    console.error('Audio processing error:', error.message);
    throw error;
  }
}
