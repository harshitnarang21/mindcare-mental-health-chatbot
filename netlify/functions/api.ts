// netlify/functions/api.js
import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Your existing localRespond function (copy from vite.config.ts)
function localRespond(userText) {
  const t = userText.toLowerCase();
  if (/suicid|self\s*harm|kill\s*myself|end\s*my\s*life/.test(t)) {
    return "I'm really sorry you're feeling this way. Please contact your local emergency number immediately. You're not alone. 🆘";
  }
  if (/(anx|worry|panic)/.test(t)) {
    return "For anxiety: Try the 4-7-8 breathing technique. Practice 5-4-3-2-1 grounding. 🧘‍♀️";
  }
  if (/(sleep|insomnia|tired)/.test(t)) {
    return "For better sleep: Keep consistent bedtime, avoid screens before bed, try progressive muscle relaxation. 😴";
  }
  if (/(sad|low|depress|empty)/.test(t)) {
    return "When feeling low: Try one small action, get sunlight, reach out to a friend, practice self-compassion. Remember: feelings are temporary. 💙";
  }
  if (/(stress|burnout|overwhelm)/.test(t)) {
    return "For stress: Break tasks into smaller pieces, use Pomodoro technique, prioritize top 3 tasks, take care of basic needs. 🌟";
  }
  return "Thank you for sharing. Try taking 3 deep breaths right now. You deserve support. 💚";
}

// Your AI Chat endpoint
app.post('/ai-chat', async (req, res) => {
  console.log('🚀 Netlify Function: Groq endpoint called');
  
  const { messages } = req.body;
  const userMessage = messages[messages.length - 1]?.text || '';
  
  if (!process.env.GROQ_API_KEY) {
    return res.json({ text: localRespond(userMessage) });
  }
  
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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
            content: 'You are a compassionate mental health support assistant for students. Provide empathetic responses under 100 words.'
          },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 150,
        temperature: 0.7
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content?.trim() || '';
      if (aiResponse) {
        return res.json({ text: aiResponse });
      }
    }
  } catch (error) {
    console.error('Groq error:', error);
  }
  
  res.json({ text: localRespond(userMessage) });
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Netlify Functions working!', timestamp: new Date() });
});

// Export handler for Netlify
export const handler = serverless(app);