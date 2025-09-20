import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Local fallback responses function
function localRespond(userText) {
  const t = userText.toLowerCase();
  if (/suicid|self\s*harm|kill\s*myself|end\s*my\s*life/.test(t)) {
    return "I'm really sorry you're feeling this way. Please contact your local emergency number immediately. You're not alone. 🆘";
  }
  if (/(anx|worry|panic)/.test(t)) {
    return "For anxiety: Try the 4-7-8 breathing technique. Practice 5-4-3-2-1 grounding. 🧘‍♀️";
  }
  if (/(stress|burnout|overwhelm)/.test(t)) {
    return "For stress: Break tasks into smaller pieces, use Pomodoro technique, prioritize your top 3 tasks. 🌟";
  }
  return "Thank you for sharing. Try taking 3 deep breaths right now. You deserve support. 💚";
}

// AI Chat endpoint
app.post('/ai-chat', async (req, res) => {
  console.log('🚀 Netlify Function: AI Chat called');
  
  try {
    const { messages } = req.body;
    const userMessage = messages[messages.length - 1]?.text || '';
    
    console.log('👤 User message:', userMessage.substring(0, 50));
    
    // Check for API key
    if (!process.env.GROQ_API_KEY) {
      console.log('❌ No GROQ_API_KEY');
      return res.json({ text: localRespond(userMessage) });
    }
    
    console.log('📤 Calling Groq API...');
    
    // Call Groq with timeout protection
    const response = await Promise.race([
      fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'You are a compassionate mental health assistant. Provide supportive responses under 80 words.'
            },
            { role: 'user', content: userMessage }
          ],
          max_tokens: 100,
          temperature: 0.7
        })
      }),
      // 8 second timeout (before Netlify's 10s limit)
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Groq API timeout')), 8000)
      )
    ]);
    
    console.log('📥 Groq response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content?.trim() || '';
      
      if (aiResponse) {
        console.log('✅ Groq success');
        return res.json({ text: aiResponse });
      }
    }
    
    console.log('❌ Groq failed, using fallback');
    
  } catch (error) {
    console.error('❌ Function error:', error.message);
  }
  
  // Always return something (prevents empty response 502)
  return res.json({ text: localRespond(req.body?.messages?.[0]?.text || 'Hello') });
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Netlify Functions working!', 
    timestamp: new Date().toISOString(),
    groqKeyExists: !!process.env.GROQ_API_KEY
  });
});

// ✅ CORRECT export format for Netlify
export const handler = serverless(app);
