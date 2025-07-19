// api/claude.js - Vercel Serverless Function

export default async function handler(req, res) {
  // Solo permitir POST y OPTIONS
  if (req.method === 'OPTIONS') {
    // Handle CORS preflight
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const { messages, max_tokens = 1500, model = "claude-sonnet-4-20250514" } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Verificar que tenemos la API key
    if (!process.env.CLAUDE_API_KEY) {
      console.error('CLAUDE_API_KEY not found');
      return res.status(500).json({ error: 'Claude API key not configured' });
    }

    console.log('Making request to Claude API...');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        max_tokens,
        messages
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Claude API error: ${response.status} - ${errorText}`);
      return res.status(response.status).json({ 
        error: 'Claude API error',
        details: errorText
      });
    }

    const data = await response.json();
    console.log('Claude API response received successfully');
    
    return res.status(200).json(data);

  } catch (error) {
    console.error('Internal server error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
