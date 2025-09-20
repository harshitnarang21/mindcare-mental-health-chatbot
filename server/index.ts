import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import aiChatRouter from './routes/ai-chat.js';

// Load environment variables FIRST
dotenv.config();

// Debug environment loading
console.log('🚀 Server starting...');
console.log('🔧 Environment loaded, GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
console.log('🔧 NODE_ENV:', process.env.NODE_ENV || 'development');

export function createServer() {
  const app = express();
  
  // Middleware
  app.use(cors());
  app.use(express.json());
  
  // Add request logging
  app.use((req, res, next) => {
    console.log(`📡 ${req.method} ${req.path}`, req.body ? 'with body' : '');
    next();
  });
  
  // API Routes
  app.use('/api', aiChatRouter);
  
  // Fallback route for debugging
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      console.log('❓ Unknown API route:', req.path);
      return res.status(404).json({ error: 'API route not found' });
    }
    next();
  });
  
  return app;
}
