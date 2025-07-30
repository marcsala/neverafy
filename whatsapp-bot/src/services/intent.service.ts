import { AIService } from './ai.service';
import { ConversationService } from './conversation.service';
import { ProductsService } from './products.service';
import { UsersService } from './users.service';
import { AIContext } from './ai.service';
import { logger } from '../utils/logger';

export interface IntentMatch {
  intent: string;
  confidence: number;
  entities: any;
  originalText: string;
  contextualInfo?: any;
}

export class IntentService {
  constructor(
    private aiService: AIService,
    private conversationService: ConversationService,
    private productsService: ProductsService,
    private usersService: UsersService
  ) {}

  async detectAdvancedIntent(message: string, userId: string): Promise<IntentMatch> {
    try {
      // Obtener contexto completo del usuario
      const context = await this.buildUserContext(userId);
      
      // Usar IA para detectar intención contextual
      const aiIntent = await this.aiService.analyzeUserIntent(message, context);
      
      // Combinar con detección basada en reglas para mayor precisión
      const rulesIntent = this.detectBasicIntent(message);
      
      // Determinar intención final
      const finalIntent = this.resolveIntentConflict(aiIntent, rulesIntent.intent, message);
      
      return {
        intent: finalIntent,
        confidence: this.calculateConfidence(aiIntent, rulesIntent.intent, message),
        entities: await this.extractEntities(message, finalIntent),
        originalText: message,
        contextualInfo: {
          hasProducts: context.products.length > 0,
          hasUrgentProducts: context.products.filter(p => p.daysLeft <= 2).length > 0,
          conversationLength: context.conversationHistory.length,
          lastIntent: context.conversationHistory[context.conversationHistory.length - 1]?.intent
        }
      };
    } catch (error) {
      logger.error('Error in advanced intent detection:', error);
      return this.getFallbackIntent(message);
    }
  }
  
  private async buildUserContext(userId: string): Promise<AIContext> {
    const [user, products, conversationHistory] = await Promise.all([
      this.usersService.getUserByPhone(userId),
      this.productsService.getUserProducts(userId),
      this.conversationService.getRecentHistory(userId, 10)
    ]);
    
    const userStats = await this.productsService.getUserStats(userId);
    
    return {
      user: user!,
      products,
      userStats,
      conversationHistory,
      currentContext: await this.conversationService.getContext(userId)
    };
  }
  
  private detectBasicIntent(message: string): { intent: string; confidence: number } {
    const lowerMessage = message.toLowerCase();
    
    // Patrones específicos con alta confianza
    const patterns = {
      // Añadir productos - patrones más específicos
      add_product: {
        patterns: [
          /(?:tengo|compré|añadir|agregar|meter|nuevo)\s+(.+?)(?:\s+(?:que|hasta)\s+(?:caduca|vence))/i,
          /(?:caduca|vence|expira)\s+(?:el|en|mañana|hoy)/i,
          /(?:compr[éeé]|tengo)\s+[a-záéíóúü]+(?:\s+[a-záéíóúü]+)*(?:\s*,\s*\d+[.,]\d+\s*€?)?/i
        ],
        confidence: 0.9
      },
      
      // Petición de recetas - más específico
      recipe_request: {
        patterns: [
          /(?:receta|cocinar|preparar|hacer|cenar|comer|almorzar)\s*(?:con|de|para)?/i,
          /(?:qué|que)\s+(?:puedo|podría)\s+(?:cocinar|hacer|preparar)/i,
          /(?:ideas?|sugerencias?)\s+(?:de|para)\s+(?:cocina|cocinar|recetas?)/i,
          /(?:cómo|como)\s+(?:cocino|preparo|hago)/i
        ],
        confidence: 0.85
      },
      
      // Listar productos
      list_products: {
        patterns: [
          /(?:qué|que)\s+tengo\s+(?:en\s+(?:la\s+)?nevera|disponible)/i,
          /(?:mi|mis)\s+productos?/i,
          /(?:inventario|lista)\s+(?:de\s+)?(?:productos?|nevera)/i,
          /(?:mostrar|ver)\s+(?:mi\s+)?(?:nevera|productos?)/i
        ],
        confidence: 0.9
      },
      
      // Productos urgentes
      urgent_check: {
        patterns: [
          /productos?\s+urgentes?/i,
          /(?:qué|que)\s+caduca\s+(?:pronto|hoy|mañana)/i,
          /(?:algo|productos?)\s+(?:en\s+)?riesgo/i,
          /(?:revisar|check)\s+caducidad/i
        ],
        confidence: 0.9
      },
      
      // Estadísticas
      stats_request: {
        patterns: [
          /(?:estadísticas?|stats?|métricas?)/i,
          /(?:cuánto|cuanto)\s+(?:he\s+)?ahorrado/i,
          /(?:valor|precio)\s+(?:total|de\s+(?:mi\s+)?nevera)/i,
          /(?:resumen|balance)\s+(?:de\s+)?(?:mi\s+)?nevera/i
        ],
        confidence: 0.85
      }
    };
    
    for (const [intent, config] of Object.entries(patterns)) {
      for (const pattern of config.patterns) {
        if (pattern.test(lowerMessage)) {
          return { intent, confidence: config.confidence };
        }
      }
    }
    
    return { intent: 'general', confidence: 0.3 };
  }
  
  private resolveIntentConflict(aiIntent: string, rulesIntent: string, message: string): string {
    // Si coinciden, usar esa intención
    if (aiIntent === rulesIntent) {
      return aiIntent;
    }
    
    // Si las reglas tienen alta confianza en patrones específicos, priorizarlas
    const rulesResult = this.detectBasicIntent(message);
    if (rulesResult.confidence >= 0.85) {
      return rulesIntent;
    }
    
    // Si la IA detecta intenciones específicas conocidas, usar IA
    const knownIntents = ['add_product', 'recipe_request', 'list_products', 'urgent_check', 'stats_request'];
    if (knownIntents.includes(aiIntent)) {
      return aiIntent;
    }
    
    // Por defecto, usar reglas
    return rulesIntent;
  }
  
  private calculateConfidence(aiIntent: string, rulesIntent: string, message: string): number {
    const rulesResult = this.detectBasicIntent(message);
    
    if (aiIntent === rulesIntent) {
      return Math.max(0.8, rulesResult.confidence);
    }
    
    if (rulesResult.confidence >= 0.85) {
      return rulesResult.confidence;
    }
    
    return 0.7; // Confianza media cuando hay conflicto
  }
  
  private async extractEntities(message: string, intent: string): Promise<any> {
    const entities: any = {};
    
    switch (intent) {
      case 'add_product':
        entities.productText = this.extractProductText(message);
        entities.priceMatch = this.extractPrice(message);
        entities.dateMatch = this.extractDate(message);
        break;
        
      case 'recipe_request':
        entities.mealType = this.extractMealType(message);
        entities.ingredients = this.extractIngredients(message);
        entities.cookingTime = this.extractCookingTime(message);
        break;
        
      case 'urgent_check':
        entities.timeframe = this.extractTimeframe(message);
        break;
    }
    
    return entities;
  }
  
  private extractProductText(message: string): string | null {
    const patterns = [
      /(?:tengo|compré|añadir|agregar)\s+(.+?)(?:\s+(?:que|hasta|,)|\s*$)/i,
      /(.+?)\s+(?:caduca|vence|expira)/i
    ];
    
    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }
    
    return null;
  }
  
  private extractPrice(message: string): number | null {
    const pricePattern = /(\d+[.,]\d+)\s*€?/;
    const match = message.match(pricePattern);
    
    if (match) {
      return parseFloat(match[1].replace(',', '.'));
    }
    
    return null;
  }
  
  private extractDate(message: string): string | null {
    const datePatterns = [
      /(?:el\s+)?(lunes|martes|miércoles|jueves|viernes|sábado|domingo)/i,
      /(?:el\s+)?(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/,
      /(mañana|hoy|pasado\s+mañana)/i
    ];
    
    for (const pattern of datePatterns) {
      const match = message.match(pattern);
      if (match) {
        return match[1];
      }
    }
    
    return null;
  }
  
  private extractMealType(message: string): string | null {
    const mealPatterns = {
      'desayuno': /desayuno|desayunar/i,
      'almuerzo': /almuerzo|almorzar|comida/i,
      'cena': /cena|cenar/i,
      'merienda': /merienda|merendar/i
    };
    
    for (const [mealType, pattern] of Object.entries(mealPatterns)) {
      if (pattern.test(message)) {
        return mealType;
      }
    }
    
    return null;
  }
  
  private extractIngredients(message: string): string[] {
    const ingredientPattern = /(?:con|usando|de)\s+(.+?)(?:\s+(?:para|y|,)|\s*$)/i;
    const match = message.match(ingredientPattern);
    
    if (match) {
      return match[1].split(/\s*,\s*|\s+y\s+/).map(ing => ing.trim());
    }
    
    return [];
  }
  
  private extractCookingTime(message: string): number | null {
    const timePattern = /(\d+)\s*(?:minutos?|min)/i;
    const match = message.match(timePattern);
    
    if (match) {
      return parseInt(match[1]);
    }
    
    return null;
  }
  
  private extractTimeframe(message: string): string | null {
    if (/hoy|today/i.test(message)) return 'today';
    if (/mañana|tomorrow/i.test(message)) return 'tomorrow';
    if (/esta\s+semana|this\s+week/i.test(message)) return 'week';
    
    return null;
  }
  
  private getFallbackIntent(message: string): IntentMatch {
    return {
      intent: 'general',
      confidence: 0.5,
      entities: {},
      originalText: message,
      contextualInfo: {
        hasProducts: false,
        hasUrgentProducts: false,
        conversationLength: 0
      }
    };
  }
}
