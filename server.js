import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Obtener el directorio actual en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno desde .env
dotenv.config({ path: path.join(__dirname, '.env') });

// Debug: mostrar qué archivos .env se intentan cargar
console.log('🔍 Loading environment from:', path.join(__dirname, '.env'));
console.log('🔍 CLAUDE_API_KEY found:', !!process.env.CLAUDE_API_KEY);

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/claude', async (req, res) => {
  try {
    const { model, max_tokens, messages } = req.body;

    console.log('🚀 Receiving Claude API request...');
    console.log('Model:', model);
    console.log('Max tokens:', max_tokens);
    console.log('Messages count:', messages?.length);
    console.log('First message preview:', JSON.stringify(messages?.[0], null, 2).substring(0, 200) + '...');

    if (!process.env.CLAUDE_API_KEY) {
      console.error('❌ CLAUDE_API_KEY not found in environment');
      return res.status(500).json({ error: 'Claude API key not configured' });
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.error('❌ Invalid messages array');
      return res.status(400).json({ error: 'Valid messages array is required' });
    }

    const requestBody = {
      model,
      max_tokens,
      messages
    };

    console.log('📤 Sending request to Claude API...');
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify(requestBody)
    });

    console.log('📥 Claude API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Claude API error: ${response.status}`);
      console.error('Error details:', errorText);
      return res.status(response.status).json({ 
        error: 'Claude API error',
        details: errorText,
        status: response.status
      });
    }

    const data = await response.json();
    console.log('✅ Claude API response received successfully');
    console.log('Response preview:', JSON.stringify(data).substring(0, 100) + '...');
    res.json(data);
  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({ 
      error: 'Server error while processing request',
      message: error.message 
    });
  }
});

// Ruta de prueba mejorada
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Claude API server is running',
    hasApiKey: !!process.env.CLAUDE_API_KEY,
    apiKeyPreview: process.env.CLAUDE_API_KEY ? process.env.CLAUDE_API_KEY.substring(0, 20) + '...' : 'Not found',
    envVars: Object.keys(process.env).filter(key => key.includes('CLAUDE'))
  });
});

app.listen(port, () => {
  console.log(`🚀 Claude API server running on port ${port}`);
  console.log(`📋 Health check: http://localhost:${port}/api/health`);
  console.log(`🔑 API Key configured: ${process.env.CLAUDE_API_KEY ? 'Yes' : 'No'}`);
  
  // Debug: mostrar información detallada
  if (process.env.CLAUDE_API_KEY) {
    console.log(`🔍 API Key preview: ${process.env.CLAUDE_API_KEY.substring(0, 20)}...`);
  } else {
    console.log('⚠️ No CLAUDE_API_KEY found in environment variables');
    console.log('📋 All CLAUDE env vars:', Object.keys(process.env).filter(key => key.includes('CLAUDE')));
    console.log('📋 Working directory:', process.cwd());
    console.log('📋 Env file path:', path.join(__dirname, '.env'));
  }
});
