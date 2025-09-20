import type { Handler } from '@netlify/functions'

// Enhanced local fallback with mental health responses
function localRespond(userText: string): string {
  console.log('🔄 Using local fallback for:', userText);
  const t = userText.toLowerCase();
  
  if (/suicid|self\s*harm|kill\s*myself|end\s*my\s*life/.test(t)) {
    return "I'm really sorry you're feeling this way. You deserve support right now. Please contact your local emergency number immediately or reach out to a crisis hotline. You're not alone, and help is available. 🆘";
  }
  if (/(anx|worry|panic|nervous|scared)/.test(t)) {
    return "For anxiety: Try the 4-7-8 breathing technique - breathe in for 4, hold for 7, out for 8. Also try the 5-4-3-2-1 grounding: name 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste. 🧘‍♀️";
  }
  if (/(sleep|insomnia|tired|exhausted)/.test(t)) {
    return "For better sleep: Keep consistent bedtime, avoid screens 1 hour before bed, try progressive muscle relaxation, and ensure your room is cool and dark. Consider a brief journal to clear your mind. 😴";
  }
  if (/(sad|low|depress|empty|hopeless)/.test(t)) {
    return "When feeling low: Try one small valued action (5-10 min), get some sunlight or bright light, reach out to a friend, practice self-compassion. Remember: feelings are temporary, you matter. 💙";
  }
  if (/(stress|burnout|overwhelm|pressure)/.test(t)) {
    return "For stress: Break tasks into smaller pieces, use the Pomodoro technique (25 min work, 5 min break), prioritize your top 3 tasks, and don't forget to take care of your basic needs. 🌟";
  }
  if (/(exam|study|academic|school|college)/.test(t)) {
    return "For academic stress: Create a study schedule, take regular breaks, practice active recall, get enough sleep, and remember that your worth isn't determined by grades. You're doing your best. 📚";
  }
  
  return "Thank you for sharing. Try taking 3 deep breaths right now. Remember, seeking help is a sign of strength. Consider talking to a counselor if these feelings persist. You deserve support. 💚";
}

const handler: Handler = async (event, context) => {
  console.log('🚀 AI Function called:', event.httpMethod, event.path);
  
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Test endpoint
  if (event.httpMethod === 'GET') {
    console.log('✅ GET request - test endpoint');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: 'AI Function working!',
        timestamp: new Date().toISOString(),
        groqApiKeyExists: !!process.env.GROQ_API_KEY,
        environment: process.env.NODE_ENV || 'production'
      })
    };
  }

  // AI Chat endpoint
  if (event.httpMethod === 'POST') {
    console.log('🤖 AI Chat endpoint called');
    
    try {
      const body = event.body ? JSON.parse(event.body) : {};
      const { messages } = body;
      
      if (!messages || !Array.isArray(messages)) {
        console.log('❌ Invalid messages format');
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid messages format' })
        };
      }
      
      const userMessage = messages[messages.length - 1]?.text || '';
      console.log('👤 User message:', userMessage.substring(0, 50));
      
      // Check for GROQ API key
      if (!process.env.GROQ_API_KEY) {
        console.log('❌ No GROQ_API_KEY - using enhanced fallback');
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ text: localRespond(userMessage) })
        };
      }
      
      console.log('📤 Calling Groq AI API...');
      
      // Call Groq API with timeout protection
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
                content: 'You are a compassionate mental health support assistant for students. Provide empathetic, supportive responses under 100 words. Be warm, understanding, and offer practical coping strategies. Encourage professional help when appropriate.'
              },
              { role: 'user', content: userMessage }
            ],
            max_tokens: 150,
            temperature: 0.7,
            top_p: 0.9
          })
        }),
        // 8 second timeout (before Netlify's 10s limit)
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Groq API timeout')), 8000)
        )
      ]);
      
      console.log('📥 Groq response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        const aiResponse = data.choices?.[0]?.message?.content?.trim() || '';
        
        if (aiResponse && aiResponse.length > 10) {
          console.log('✅ Groq AI success:', aiResponse.substring(0, 40));
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ text: aiResponse })
          };
        }
      } else {
        console.log('❌ Groq API error:', response.status);
      }
      
      console.log('🔄 Groq failed, using enhanced fallback');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ text: localRespond(userMessage) })
      };
      
    } catch (error: any) {
      console.error('❌ Function error:', error.name, error.message);
      
      // Always return helpful response
      const fallbackText = localRespond(event.body ? JSON.parse(event.body).messages?.[0]?.text || 'Hello' : 'Hello');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ text: fallbackText })
      };
    }
  }

  return {
    statusCode: 404,
    headers,
    body: JSON.stringify({ error: 'Not found' })
  };
};

export { handler };
