import { claude } from '../config/claude';
import { Product, UserStats, WhatsAppUser } from '../types/shared.types';
import { ConversationMessage } from './conversation.service';
import { logger } from '../utils/logger';

export interface AIContext {
  user: WhatsAppUser;
  products: Product[];
  userStats: UserStats;
  conversationHistory: ConversationMessage[];
  currentContext?: any;
}

export interface AIResponse {
  message: string;
  intent: string;
  confidence: number;
  suggestedActions?: string[];
  needsFollowUp?: boolean;
}

export class AIService {
  async generateContextualResponse(
    userMessage: string,
    context: AIContext
  ): Promise<AIResponse> {
    try {
      const prompt = this.buildAdvancedPrompt(userMessage, context);
      
      const response = await claude.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 800,
        messages: [{ role: 'user', content: prompt }]
      });
      
      const responseText = response.content[0]?.text || '';
      
      // Extraer respuesta estructurada
      const aiResponse = this.parseAIResponse(responseText, userMessage);
      
      logger.info('AI response generated:', {
        intent: aiResponse.intent,
        confidence: aiResponse.confidence,
        messageLength: aiResponse.message.length
      });
      
      return aiResponse;
    } catch (error) {
      logger.error('Error generating AI response:', error);
      return this.getFallbackResponse(userMessage);
    }
  }
  
  async generateRecipeSuggestion(
    ingredients: Product[],
    dietaryPreferences?: string[],
    mealType?: string
  ): Promise<string> {
    try {
      const urgentIngredients = ingredients.filter(p => p.daysLeft <= 2);
      const allIngredients = ingredients.map(p => `${p.name} (${p.daysLeft} días)`).join(', ');
      
      const prompt = `
Eres un chef experto en cocina española. Sugiere una receta usando estos ingredientes:

INGREDIENTES DISPONIBLES:
${allIngredients}

INGREDIENTES URGENTES (usar prioritariamente):
${urgentIngredients.map(p => `${p.name} (caduca en ${p.daysLeft} días)`).join(', ') || 'Ninguno'}

PREFERENCIAS:
- Tipo de comida: ${mealType || 'cualquiera'}
- Restricciones: ${dietaryPreferences?.join(', ') || 'ninguna'}

Genera una receta que:
1. Use prioritariamente los ingredientes urgentes
2. Sea práctica y rápida (máximo 30 min)
3. Incluya ingredientes, pasos e tips
4. Sea apropiada para la cultura española

Formato de respuesta:
🍽️ **NOMBRE DE LA RECETA**
⏱️ Tiempo: X minutos | 👥 Porciones: X

📋 **Ingredientes:**
• Ingrediente 1
• Ingrediente 2

📝 **Preparación:**
1. Paso 1
2. Paso 2

💡 **Tips del chef:**
Consejo útil

Responde SOLO la receta formateada, sin texto adicional.
`;
      
      const response = await claude.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 700,
        messages: [{ role: 'user', content: prompt }]
      });
      
      return response.content[0]?.text || 'No pude generar una receta con esos ingredientes.';
    } catch (error) {
      logger.error('Error generating recipe:', error);
      return 'Lo siento, no pude generar una receta en este momento. ¿Puedes intentarlo más tarde?';
    }
  }
  
  async analyzeUserIntent(message: string, context: AIContext): Promise<string> {
    try {
      const prompt = `
Analiza la intención del usuario en este mensaje, considerando el contexto:

MENSAJE: "${message}"
PRODUCTOS ACTUALES: ${context.products.length} (${context.products.filter(p => p.daysLeft <= 2).length} urgentes)
HISTORIAL RECIENTE: ${context.conversationHistory.slice(-3).map(h => `${h.role}: ${h.content}`).join(' | ')}

Clasifica la intención en UNA de estas categorías:
- add_product: Quiere añadir un producto
- list_products: Quiere ver su inventario
- recipe_request: Pide sugerencias de recetas
- urgent_check: Pregunta por productos urgentes
- stats_request: Quiere ver estadísticas
- general_question: Pregunta general sobre alimentación/cocina
- greeting: Saludo o conversación casual
- help_request: Necesita ayuda con el bot

Responde SOLO la categoría, sin explicaciones.
`;
      
      const response = await claude.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 50,
        messages: [{ role: 'user', content: prompt }]
      });
      
      return response.content[0]?.text?.trim() || 'general_question';
    } catch (error) {
      logger.error('Error analyzing intent:', error);
      return 'general_question';
    }
  }
  
  private buildAdvancedPrompt(message: string, context: AIContext): string {
    const urgentProducts = context.products.filter(p => p.daysLeft <= 2);
    const recentHistory = context.conversationHistory.slice(-5);
    
    return `
Eres el asistente de nevera inteligente de Neverafy. Responde de forma natural, útil y personalizada.

INFORMACIÓN DEL USUARIO:
- Teléfono: ${context.user.phone_number}
- Suscripción: ${context.user.subscription_tier}
- Miembro desde: ${new Date(context.user.created_at).toLocaleDateString('es-ES')}

ESTADO ACTUAL DE LA NEVERA:
- Total productos: ${context.products.length}
- Productos urgentes: ${urgentProducts.length}
- Valor total: ${context.userStats.totalValue.toFixed(2)}€
- Categoría principal: ${context.userStats.topCategory}

PRODUCTOS URGENTES (caducan ≤2 días):
${urgentProducts.map(p => `• ${p.name} - ${p.daysLeft} días (${p.price?.toFixed(2) || '0.00'}€)`).join('\n') || 'Ninguno'}

PRODUCTOS DISPONIBLES:
${context.products.slice(0, 10).map(p => `• ${p.name} - ${p.daysLeft} días`).join('\n')}

HISTORIAL CONVERSACIÓN:
${recentHistory.map(h => `${h.role}: ${h.content}`).join('\n')}

MENSAJE ACTUAL DEL USUARIO: "${message}"

INSTRUCCIONES:
- Responde en español de forma natural y conversacional
- Si preguntas por recetas, usa SUS productos disponibles
- Si hay productos urgentes, menciónalos proactivamente
- Personaliza según su suscripción (free vs premium)
- Mantén coherencia con el historial de conversación
- Incluye 1-2 emojis relevantes, no más
- Máximo 400 caracteres para WhatsApp
- Si no tienes información suficiente, pregunta específicamente

EJEMPLOS DE RESPUESTAS BUENAS:
- "Veo que tienes leche y huevos que caducan pronto. ¿Te sugiero una tortilla francesa? 🍳"
- "Tu nevera está bien organizada con ${context.products.length} productos valorados en ${context.userStats.totalValue.toFixed(2)}€ 📊"
- "Como tienes ${urgentProducts.length} productos urgentes, es buen momento para cocinar algo rico 👨‍🍳"

Responde SOLO el mensaje para el usuario, sin formato JSON ni explicaciones adicionales.
    `;
  }
  
  private parseAIResponse(responseText: string, originalMessage: string): AIResponse {
    // Intentar detectar la intención basada en la respuesta
    let intent = 'general';
    let confidence = 0.8;
    
    const lowerResponse = responseText.toLowerCase();
    const lowerMessage = originalMessage.toLowerCase();
    
    if (lowerResponse.includes('receta') || lowerResponse.includes('cocinar')) {
      intent = 'recipe_suggestion';
      confidence = 0.9;
    } else if (lowerResponse.includes('producto') && lowerMessage.includes('añadir')) {
      intent = 'add_product';
      confidence = 0.9;
    } else if (lowerResponse.includes('urgente') || lowerResponse.includes('caduca')) {
      intent = 'urgent_check';
      confidence = 0.85;
    } else if (lowerResponse.includes('estadística') || lowerResponse.includes('valor')) {
      intent = 'stats_display';
      confidence = 0.85;
    }
    
    return {
      message: this.formatResponse(responseText),
      intent,
      confidence,
      needsFollowUp: lowerResponse.includes('?'),
      suggestedActions: this.extractSuggestedActions(responseText)
    };
  }
  
  private formatResponse(response: string): string {
    return response
      .replace(/\*\*(.*?)\*\*/g, '*$1*') // Bold de markdown a WhatsApp
      .replace(/#{1,6}\s/g, '') // Quitar headers
      .replace(/```[\s\S]*?```/g, '') // Quitar code blocks
      .trim();
  }
  
  private extractSuggestedActions(response: string): string[] {
    // Extraer posibles acciones sugeridas de la respuesta
    const actions: string[] = [];
    
    if (response.includes('receta')) actions.push('recipe_request');
    if (response.includes('producto')) actions.push('add_product');
    if (response.includes('estadística')) actions.push('stats_request');
    
    return actions;
  }
  
  private getFallbackResponse(userMessage: string): AIResponse {
    const fallbacks = [
      "Disculpa, tuve un problema procesando tu mensaje. ¿Puedes repetirlo? 🤖",
      "Lo siento, no pude entender bien. ¿Podrías ser más específico? 😊", 
      "Tengo dificultades técnicas ahora. ¿Intentamos de nuevo en un momento? ⚙️"
    ];
    
    const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    
    return {
      message: randomFallback,
      intent: 'error',
      confidence: 0.1,
      needsFollowUp: true
    };
  }
}
