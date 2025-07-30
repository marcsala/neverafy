import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

export const claude = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// Validar configuración de Claude
export function validateClaudeConfig(): void {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is required');
  }
}

// Test de conexión
export async function testClaudeConnection(): Promise<boolean> {
  try {
    const response = await claude.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 50,
      messages: [{ 
        role: 'user', 
        content: 'Responde solo: "Conexión exitosa"' 
      }]
    });
    
    const responseText = response.content[0]?.text || '';
    if (responseText.includes('exitosa')) {
      console.log('✅ Claude AI connection successful');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Claude connection test error:', error);
    return false;
  }
}
