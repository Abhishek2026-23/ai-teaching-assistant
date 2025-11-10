import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export async function generateNotes(transcript) {
  // Using Google Gemini API (FREE)
  
  try {
    if (!process.env.GEMINI_API_KEY) {
      // Fallback: basic text processing
      return generateBasicNotes(transcript);
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: `You are an AI assistant that generates structured notes from meeting transcripts. Extract key points, summary, and action items.

Generate structured notes from this transcript:

${transcript}

Format your response as:

SUMMARY:
[2-3 sentence overview]

KEY POINTS:
- [Point 1]
- [Point 2]
- [Point 3]

ACTION ITEMS:
- [Action 1]
- [Action 2]`
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.candidates[0].content.parts[0].text;
    return parseAIResponse(content);
  } catch (error) {
    console.error('AI service error:', error.message);
    return generateBasicNotes(transcript);
  }
}

function generateBasicNotes(transcript) {
  const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Extract potential action items (sentences with "should", "need to", "must", etc.)
  const actionWords = ['should', 'need to', 'must', 'have to', 'will', 'going to', 'homework', 'assignment'];
  const actionItems = sentences.filter(s => 
    actionWords.some(word => s.toLowerCase().includes(word))
  ).slice(0, 5);
  
  return {
    title: 'Meeting Notes',
    content: transcript,
    summary: sentences.slice(0, 3).join('. ') + '.',
    keyPoints: sentences.slice(0, 8).map(s => s.trim()),
    actionItems: actionItems.map(s => s.trim())
  };
}

function parseAIResponse(content) {
  // Try to parse structured response
  const lines = content.split('\n').filter(line => line.trim());
  
  let summary = '';
  let keyPoints = [];
  let actionItems = [];
  
  let currentSection = '';
  
  for (const line of lines) {
    const lower = line.toLowerCase();
    
    if (lower.includes('summary') || lower.includes('overview')) {
      currentSection = 'summary';
      continue;
    } else if (lower.includes('key point') || lower.includes('main point')) {
      currentSection = 'keyPoints';
      continue;
    } else if (lower.includes('action item') || lower.includes('todo') || lower.includes('next step')) {
      currentSection = 'actionItems';
      continue;
    }
    
    const cleanLine = line.replace(/^[-*•]\s*/, '').replace(/^\d+\.\s*/, '').trim();
    
    if (cleanLine) {
      if (currentSection === 'summary') {
        summary += cleanLine + ' ';
      } else if (currentSection === 'keyPoints') {
        keyPoints.push(cleanLine);
      } else if (currentSection === 'actionItems') {
        actionItems.push(cleanLine);
      }
    }
  }
  
  // If parsing failed, use basic extraction
  if (!summary) {
    summary = content.substring(0, 300);
  }
  if (keyPoints.length === 0) {
    keyPoints = content.split('\n').filter(l => l.trim()).slice(0, 5);
  }
  
  return {
    title: 'AI Generated Notes',
    content: content,
    summary: summary.trim() || content.substring(0, 200),
    keyPoints: keyPoints.slice(0, 10),
    actionItems: actionItems.slice(0, 10)
  };
}

// Enhanced note generation with better prompting using Gemini
export async function generateNotesEnhanced(transcript, meetingTitle = 'Meeting') {
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      console.log('Gemini API key not configured, using basic notes generation');
      return generateBasicNotes(transcript);
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: `You are an expert educational assistant that creates comprehensive study notes from lecture transcripts.

Your task is to:
1. Create a clear, concise summary
2. Extract key concepts and main points
3. Identify action items or homework
4. Organize information in a student-friendly format

Meeting Title: ${meetingTitle}

Transcript:
${transcript}

Format your response as:

SUMMARY:
[2-3 sentence overview]

KEY POINTS:
- [Point 1]
- [Point 2]
- [Point 3]

ACTION ITEMS:
- [Action 1]
- [Action 2]`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.candidates[0].content.parts[0].text;
    const parsed = parseAIResponse(content);
    parsed.title = `${meetingTitle} - Notes`;
    
    return parsed;
  } catch (error) {
    console.error('AI service error:', error.response?.data || error.message);
    return generateBasicNotes(transcript);
  }
}
