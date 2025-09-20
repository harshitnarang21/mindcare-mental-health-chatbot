import type { Handler } from '@netlify/functions'

const handler: Handler = async (event, context) => {
  console.log('🚀 Function called:', event.httpMethod, event.path);
  
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

  // Simple test - always works
  if (event.httpMethod === 'GET') {
    console.log('✅ GET request - returning test response');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: 'Function works!',
        timestamp: new Date().toISOString(),
        method: event.httpMethod,
        path: event.path
      })
    };
  }

  // Handle POST to ai-chat
  if (event.httpMethod === 'POST') {
    console.log('📨 POST request received');
    
    try {
      // Simple fallback response (no external API calls)
      const body = event.body ? JSON.parse(event.body) : {};
      const messages = body.messages || [];
      const lastMessage = messages[messages.length - 1]?.text || 'hello';
      
      console.log('💬 User message:', lastMessage);
      
      // Simple response without external APIs
      const response = "I'm here to support you. Take a deep breath. You're doing great by reaching out. 💚";
      
      console.log('✅ Sending simple response');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ text: response })
      };
      
    } catch (error: any) {
      console.error('❌ Error:', error.message);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ text: 'I understand you need support. Take 3 deep breaths. 💙' })
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
