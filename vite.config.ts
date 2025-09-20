import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables FIRST
dotenv.config();

// Debug environment loading
console.log('🚀 Server starting...');
console.log('🔧 GROQ_API_KEY exists:', !!process.env.GROQ_API_KEY);
console.log('🔧 VITE_SUPABASE_URL exists:', !!process.env.VITE_SUPABASE_URL);

function createServer() {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(cors());

  // Add request logging
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) {
      console.log(`📡 ${req.method} ${req.path}`);
    }
    next();
  });

  // Local fallback responses function
  function localRespond(userText) {
    const t = userText.toLowerCase();
    if (/suicid|self\s*harm|kill\s*myself|end\s*my\s*life/.test(t)) {
      return "I'm really sorry you're feeling this way. You deserve support right now. Please contact your local emergency number immediately. You're not alone, and help is available. 🆘";
    }
    if (/(anx|worry|panic)/.test(t)) {
      return "For anxiety: Try the 4-7-8 breathing technique - breathe in for 4, hold for 7, out for 8. Also try the 5-4-3-2-1 grounding: name 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste. 🧘‍♀️";
    }
    if (/(sleep|insomnia|tired)/.test(t)) {
      return "For better sleep: Keep consistent bedtime, avoid screens 1 hour before bed, try progressive muscle relaxation, and ensure your room is cool and dark. Consider a brief journal to clear your mind. 😴";
    }
    if (/(sad|low|depress|empty)/.test(t)) {
      return "When feeling low: Try one small valued action (5-10 min), get some sunlight or bright light, reach out to a friend, practice self-compassion. Remember: feelings are temporary, you matter. 💙";
    }
    if (/(stress|burnout|overwhelm)/.test(t)) {
      return "For stress: Break tasks into smaller pieces, use the Pomodoro technique (25 min work, 5 min break), prioritize your top 3 tasks, and don't forget to take care of your basic needs. 🌟";
    }
    return "Thank you for sharing. Try taking 3 deep breaths right now. Remember, seeking help is a sign of strength. Consider talking to a counselor if these feelings persist. You deserve support. 💚";
  }

  // 🤖 GROQ AI CHAT ENDPOINT
  app.post('/api/ai-chat', async (req, res) => {
    console.log('🚀 Groq FREE endpoint called');

    const { messages } = req.body;
    
    // Validate request
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.log('❌ Invalid request format');
      return res.status(400).json({ 
        error: 'Invalid messages format',
        text: localRespond('Hello')
      });
    }

    const userMessage = messages[messages.length - 1]?.text || '';
    console.log('👤 User message:', userMessage.substring(0, 50) + '...');

    // Check for Groq API key
    if (!process.env.GROQ_API_KEY) {
      console.log('❌ No Groq token, using local fallback');
      return res.json({ text: localRespond(userMessage) });
    }

    try {
      console.log('📤 Sending to Groq (100% FREE)...');

      // Build conversation context (last 6 messages)
      const conversationMessages = messages.slice(-6).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      // Add system message
      const systemMessage = {
        role: 'system',
        content: 'You are a compassionate mental health support assistant for students. Provide empathetic, supportive responses under 100 words. Be warm, understanding, and encourage professional help when appropriate. Focus on practical coping strategies.'
      };

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          // ✅ FREE MODELS (choose one):
          model: 'llama-3.3-70b-versatile', // Best quality
          // model: 'llama-3.2-3b-preview', // Faster alternative
          messages: [systemMessage, ...conversationMessages],
          max_tokens: 150,
          temperature: 0.7,
          top_p: 0.9,
          stream: false
        })
      });

      console.log('📥 Groq response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('📝 Groq response received');
        
        const aiResponse = data.choices?.[0]?.message?.content?.trim() || '';

        if (aiResponse && aiResponse.length > 10) {
          console.log('✅ Groq FREE responded - ZERO COST! 🆓');
          console.log('🤖 Response preview:', aiResponse.substring(0, 60) + '...');
          return res.json({ text: aiResponse });
        } else {
          console.log('⚠️ Empty response from Groq, using fallback');
        }
      } else {
        const errorText = await response.text();
        console.log('❌ Groq API error:', response.status, errorText);
        
        // Handle rate limiting
        if (response.status === 429) {
          const rateLimitMessage = localRespond(userMessage) + "\n\n💭 Note: AI is experiencing high demand, using local guidance.";
          return res.json({ text: rateLimitMessage });
        }
      }
    } catch (error) {
      console.error('❌ Groq fetch error:', error.message);
    }

    console.log('🔄 Using local fallback response');
    const fallbackText = localRespond(userMessage);
    res.json({ text: fallbackText });
  });

  // Test endpoint (updated for Groq)
  app.get('/api/test', (req, res) => {
    res.json({
      message: 'API routes working!',
      timestamp: new Date().toISOString(),
      groqKeyExists: !!process.env.GROQ_API_KEY,
      supabaseConfigured: !!process.env.VITE_SUPABASE_URL,
      service: 'MindCare Mental Health Support'
    });
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'OK',
      service: 'MindCare Mental Health Support',
      timestamp: new Date().toISOString(),
      apis: {
        groq: !!process.env.GROQ_API_KEY,
        supabase: !!process.env.VITE_SUPABASE_URL
      }
    });
  });

  // Fixed Express 5 compatible wildcard route
  app.get('/{*catchAll}', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      console.log('❓ Unknown API route:', req.path);
      return res.status(404).json({ error: 'API route not found' });
    }
    next();
  });

  return app;
}

// Vite configuration
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: [
        ".", // Allow project root directory for index.html
        "./client",
        "./shared"
      ],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

// Express plugin for Vite
function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    configureServer(server) {
      const app = createServer();

      // Add Express app as middleware to Vite dev server
      server.middlewares.use(app);
    },
  };
}
