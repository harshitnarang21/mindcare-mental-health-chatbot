import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

router.post('/ai-chat', async (req, res) => {
  // TEMPORARY DEBUG - remove after fixing
  console.log('🔑 API Key loaded:', !!process.env.GEMINI_API_KEY);
  console.log('🔑 API Key first 10 chars:', process.env.GEMINI_API_KEY?.substring(0, 10));
  console.log('📝 Request body:', req.body);
  
  // Check if API key exists
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not found in environment variables');
    return res.status(500).json({ 
      error: 'GEMINI_API_KEY not found in environment variables',
      fallback: true
    });
  }

  try {
    // Initialize Gemini with explicit API key check
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        maxOutputTokens: 1024,
      }
    });
    
    const { messages } = req.body;
    
    // Validate request
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid messages format',
        fallback: true 
      });
    }
    
    const userMessage = messages[messages.length - 1]?.text || '';
    console.log('👤 User message:', userMessage);
    
    // Build context for mental health support
    const conversationHistory = messages
      .slice(-4) // Last 4 messages for context
      .map(msg => `${msg.role}: ${msg.text}`)
      .join('\n');
    
    const prompt = `You are a compassionate AI First-Aid assistant specialized in mental health support for students.

Instructions:
- Provide empathetic, supportive responses
- Keep responses under 100 words
- Offer practical coping strategies
- Encourage professional help when appropriate
- Use a warm, caring tone
- For crisis situations, immediately direct to emergency services

Previous conversation:
${conversationHistory}

User's current message: ${userMessage}

Provide a helpful, supportive response:`;

    console.log('🤖 Sending to Gemini...');
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Gemini response:', text.substring(0, 50) + '...');
    
    res.json({ text });
    
  } catch (error) {
    console.error('❌ Gemini API Error:', error);
    console.error('❌ Error details:', {
      message: error.message,
      status: error.status,
      statusText: error.statusText
    });
    
    res.status(500).json({ 
      error: 'Gemini API failed',
      details: error.message,
      status: error.status || 500,
      fallback: true
    });
  }
});

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ 
    message: 'API routes working!',
    timestamp: new Date().toISOString(),
    geminiKeyExists: !!process.env.GEMINI_API_KEY
  });
});

export default router;
