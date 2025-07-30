import { UsersService } from '../services/users.service';
import { ProductsService } from '../services/products.service';
import { WhatsAppService } from '../services/whatsapp.service';
import { ConversationService } from '../services/conversation.service';
import { LimitsService } from '../services/limits.service';
import { PaymentsService } from '../services/payments.service';
import { AIService } from '../services/ai.service';
import { MetricsService } from '../services/metrics.service';
import { IntentService } from '../services/intent.service';
import { WhatsAppUser } from '../types/shared.types';
import { logger } from '../utils/logger';

export class MessageHandler {
  private usersService: UsersService;
  private productsService: ProductsService;
  private whatsappService: WhatsAppService;
  private conversationService: ConversationService;
  private limitsService: LimitsService;
  private paymentsService: PaymentsService;
  private aiService: AIService;
  private metricsService: MetricsService;
  private intentService: IntentService;

  constructor(
    usersService: UsersService,
    productsService: ProductsService,
    whatsappService: WhatsAppService,
    conversationService: ConversationService,
    limitsService: LimitsService,
    paymentsService: PaymentsService,
    aiService: AIService,
    metricsService: MetricsService,
    intentService: IntentService
  ) {
    this.usersService = usersService;
    this.productsService = productsService;
    this.whatsappService = whatsappService;
    this.conversationService = conversationService;
    this.limitsService = limitsService;
    this.paymentsService = paymentsService;
    this.aiService = aiService;
    this.metricsService = metricsService;
    this.intentService = intentService;
}


  async handleMessage(phoneNumber: string, message: string): Promise<void> {
    try {
      // Rate limiting check
      if (await this.isRateLimited(phoneNumber)) {
        await this.whatsappService.sendMessage(
          phoneNumber,
          "⏰ Vas muy rápido. Espera un momento antes de enviar otro mensaje."
        );
        return;
      }

      // Get or create user
      const user = await this.usersService.getOrCreateWhatsAppUser(phoneNumber);
      if (!user) {
        await this.whatsappService.sendMessage(
          phoneNumber,
          "❌ Error conectando con tu cuenta. Inténtalo más tarde."
        );
        return;
      }

      // Update user activity
      await this.usersService.updateUserActivity(user.id);

      // Check for pending actions (context-based conversations)
      const context = await this.conversationService.getContext(user.id);
      if (context?.pending_action) {
        await this.handlePendingAction(user, message, context);
        return;
      }

      // Normalize message for intent detection
      const normalizedMessage = message.toLowerCase().trim();

      // Detect intent and handle accordingly
      const intent = await this.intentService.detectIntent(normalizedMessage);

      switch (intent.type) {
        case 'greeting':
          await this.handleGreeting(user);
          break;
        case 'add_product':
          await this.handleAddProduct(user, message);
          break;
        case 'list_products':
          await this.handleListProducts(user);
          break;
        case 'remove_product':
          await this.handleRemoveProduct(user, intent.extracted?.productName || '');
          break;
        case 'urgent_products':
          await this.handleUrgentProducts(user);
          break;
        case 'recipe_request':
          await this.handleRecipeRequest(user, intent.extracted?.ingredients);
          break;
        case 'premium_info':
          await this.handlePremiumInfo(user);
          break;
        case 'usage_stats':
          await this.handleUsageStats(user);
          break;
        case 'stats':
          await this.handleStats(user);
          break;
        case 'help':
          await this.handleHelp(user);
          break;
        default:
          await this.handleUnknown(user, message);
      }

      // Track message for analytics
      await this.metricsService.trackMessage(user.id, intent.type);

    } catch (error) {
      await this.handleError(phoneNumber, error);
    }
  }

  private async handleGreeting(user: any): Promise<void> {
    const subscription = await this.paymentsService.checkSubscriptionStatus(user.user_id);
    const products = await this.productsService.getUserProducts(user.user_id);
    const urgent = products.filter(p => p.daysLeft <= 2);

    let message = `👋 ¡Hola! Soy tu asistente de nevera inteligente.\n\n`;

    if (products.length === 0) {
      message += `🆕 **Para empezar, añade productos:**\n`;
      message += `• "Tengo leche que caduca el viernes"\n`;
      message += `• "Compré pan integral por 2.50€"\n`;
      message += `• "Yogures naturales hasta el lunes"\n\n`;
      message += `¡Así podré ayudarte a reducir el desperdicio! 🌱`;
    } else {
      message += `📦 Tienes **${products.length} productos** en tu nevera.\n`;

      if (urgent.length > 0) {
        message += `🚨 **${urgent.length} urgentes** - caducan pronto\n\n`;
        message += `💡 Escribe "urgente" para verlos\n`;
        message += `👨‍🍳 ¿Quieres una receta para aprovecharlos?`;
      } else {
        message += `✅ Todo está bajo control\n\n`;
        message += `¿En qué te ayudo hoy? 🤖`;
      }
    }

    if (!subscription.isActive) {
      message += `\n\n⭐ **Premium:** Todo ilimitado + IA avanzada`;
    }

    await this.whatsappService.sendMessage(user.phone_number, message);
  }

  private async handlePendingAction(user: any, message: string, context: any): Promise<void> {
    switch (context.pending_action) {
      case 'clarify_product':
        await this.handleProductClarification(user, message, context);
        break;
      case 'confirm_removal':
        await this.handleRemovalConfirmation(user, message, context);
        break;
      case 'recipe_followup':
        await this.handleRecipeFollowup(user, message, context);
        break;
    }

    // Limpiar contexto después de manejar
    await this.conversationService.clearContext(user.id);
  }

  private async handleProductClarification(user: any, message: string, context: any): Promise<void> {
    // Intentar parsear de nuevo con el mensaje clarificado
    try {
      const product = await this.productsService.addProductByText(user.user_id, message);

      if (product) {
        await this.whatsappService.sendMessage(
          user.phone_number,
          `✅ ¡Perfecto! *${product.name}* añadido correctamente.

📅 Caduca: ${this.formatDate(product.expiryDate)}
💰 Precio: ${product.price?.toFixed(2) || '0.00'}€

¡Gracias por la clarificación! 😊`
        );
      } else {
        await this.whatsappService.sendMessage(
          user.phone_number,
          `❓ Aún no pude procesar "${message}".

Prueba con este formato:
"[Producto] que caduca [fecha], [precio]€"

Ejemplo: "Yogur natural que caduca mañana, 1.50€"`
        );
      }
    } catch (error) {
      await this.whatsappService.sendMessage(
        user.phone_number,
        "❌ Error procesando el producto. ¿Puedes intentarlo de nuevo?"
      );
    }
  }

  private async handleRemovalConfirmation(user: any, message: string, context: any): Promise<void> {
    const matches = context.context_data.matches;
    const selection = parseInt(message.trim());

    if (isNaN(selection) || selection < 1 || selection > matches.length) {
      await this.whatsappService.sendMessage(
        user.phone_number,
        `❓ Por favor responde con un número del 1 al ${matches.length}`
      );
      return;
    }

    try {
      const selectedProduct = matches[selection - 1];
      await this.productsService.removeProduct(selectedProduct.id);

      await this.whatsappService.sendMessage(
        user.phone_number,
        `✅ *${selectedProduct.name}* eliminado correctamente.

¡Espero que lo hayas disfrutado! 😊`
      );
    } catch (error) {
      await this.whatsappService.sendMessage(
        user.phone_number,
        "❌ Error eliminando el producto. Inténtalo más tarde."
      );
    }
  }

  private async handleRecipeFollowup(user: any, message: string, context: any): Promise<void> {
    if (message.toLowerCase().includes('sí') || message.toLowerCase().includes('si')) {
      // Usuario quiere la receta, verificar premium
      const subscription = await this.paymentsService.checkSubscriptionStatus(user.user_id);

      if (subscription.isActive) {
        const products = context.context_data.products;
        const fullRecipe = await this.aiService.generateDetailedRecipe(products);

        await this.whatsappService.sendMessage(user.phone_number, fullRecipe);
      } else {
        await this.handlePremiumInfo(user);
      }
    } else {
      await this.whatsappService.sendMessage(
        user.phone_number,
        "👍 Perfecto. Si cambias de opinión o necesitas ayuda, ¡aquí estoy!"
      );
    }
  }

  // Métodos utilitarios

  private async isRateLimited(phoneNumber: string): Promise<boolean> {
    // Rate limiting básico: máximo 5 mensajes por minuto por número
    // En producción usar Redis, por ahora memoria simple
    return false;
  }

  private formatDate(date: string | Date): string {
    const d = new Date(date);
    const now = new Date();
    const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Mañana';
    if (diffDays === -1) return 'Ayer';
    if (diffDays > 0 && diffDays <= 7) return `En ${diffDays} días`;
    if (diffDays < 0 && diffDays >= -7) return `Hace ${Math.abs(diffDays)} días`;

    return d.toLocaleDateString('es-ES', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  }

  private generateUserCode(userId: string): string {
    return Buffer.from(userId.slice(-8), 'hex').toString('base64').slice(0, 6).toUpperCase();
  }

  private async handleError(phoneNumber: string, error: any): Promise<void> {
    logger.error('Message handler error:', error);

    await this.whatsappService.sendMessage(
      phoneNumber,
      "❌ Ups, algo salió mal. Por favor inténtalo de nuevo en unos momentos."
    );

    // Log error para debugging
    await this.metricsService.trackError(phoneNumber, error.message || 'Unknown error');
  }

  private async handleAddProduct(user: any, message: string): Promise<void> {
    try {
      // Check daily limit for adding products
      const productLimit = await this.limitsService.checkAndEnforceLimit(user.user_id, 'add_product');
      if (!productLimit.allowed) {
        return; // Limit service already sent the message
      }

      const product = await this.productsService.addProductByText(user.user_id, message);

      if (product) {
        await this.whatsappService.sendMessage(
          user.phone_number,
          `✅ **${product.name}** añadido correctamente!

📅 Caduca: ${this.formatDate(product.expiryDate)}
💰 Precio: ${product.price?.toFixed(2) || '0.00'}€
📊 Categoría: ${product.category}

¡Perfecto! Tu nevera está actualizada 🎉`
        );

        // Track successful product addition
        await this.metricsService.trackEvent(user.user_id, 'product_added', {
          product_name: product.name,
          category: product.category,
          days_until_expiry: product.daysLeft
        });

      } else {
        // Product couldn't be parsed, ask for clarification
        await this.conversationService.setContext(user.id, {
          pending_action: 'clarify_product',
          context_data: { original_message: message },
          expires_at: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
        });

        await this.whatsappService.sendMessage(
          user.phone_number,
          `❓ No pude procesar "${message}" correctamente.

**Formato recomendado:**
"[Producto] que caduca [fecha], [precio]€"

**Ejemplos:**
• "Leche entera que caduca el viernes, 1.20€"
• "Pan integral hasta mañana"
• "Yogures naturales por 2.50€"

¿Puedes intentarlo de nuevo? 🤖`
        );
      }
    } catch (error) {
      await this.whatsappService.sendMessage(
        user.phone_number,
        "❌ Error añadiendo el producto. ¿Puedes intentarlo de nuevo?"
      );
    }
  }

  private async handleRecipeRequest(user: any, ingredients?: string[]): Promise<void> {
    try {
      // Check AI usage limit
      const aiLimit = await this.limitsService.checkAndEnforceLimit(user.user_id, 'ai_request');
      if (!aiLimit.allowed) {
        return; // Limit service already sent the message
      }

      const subscription = await this.paymentsService.checkSubscriptionStatus(user.user_id);

      if (ingredients && ingredients.length > 0) {
        // User specified ingredients
        const recipe = await this.aiService.generateQuickRecipe(ingredients);
        await this.whatsappService.sendMessage(user.phone_number, recipe);
      } else {
        // Use user's products
        const products = await this.productsService.getUserProducts(user.user_id);

        if (products.length === 0) {
          await this.whatsappService.sendMessage(
            user.phone_number,
            `📦 Tu nevera está vacía. Añade algunos productos primero:

• "Tengo pollo, arroz y verduras"
• "Compré tomates y pasta"

¡Luego te daré recetas increíbles! 👨‍🍳`
          );
          return;
        }

        const urgent = products.filter(p => p.daysLeft <= 3);
        const recipeProducts = urgent.length >= 2 ? urgent : products.slice(0, 5);

        if (subscription.isActive && subscription.tier === 'premium') {
          // Premium: receta completa y detallada
          const fullRecipe = await this.aiService.generateDetailedRecipe(recipeProducts);
          await this.whatsappService.sendMessage(user.phone_number, fullRecipe);
        } else {
          // Free: receta básica + oferta premium
          const basicRecipe = await this.aiService.generateQuickRecipe(
            recipeProducts.map(p => p.name)
          );

          await this.whatsappService.sendMessage(user.phone_number, basicRecipe);

          // Set context for potential upsell
          await this.conversationService.setContext(user.id, {
            pending_action: 'recipe_followup',
            context_data: { products: recipeProducts },
            expires_at: new Date(Date.now() + 5 * 60 * 1000)
          });

          await this.whatsappService.sendMessage(
            user.phone_number,
            `💡 ¿Quieres la versión completa con pasos detallados, tiempos y tips profesionales?`
          );
        }
      }
    } catch (error) {
      await this.whatsappService.sendMessage(
        user.phone_number,
        "❌ Error generando receta. Inténtalo más tarde."
      );
    }
  }

  private async handlePremiumInfo(user: any): Promise<void> {
    const subscription = await this.paymentsService.checkSubscriptionStatus(user.user_id);

    if (subscription.isActive) {
      let message = `⭐ **¡Eres Premium!** ✨

`;
      message += `🚀 **Funciones activas:**
`;
      message += `• ✅ Todo ilimitado
`;
      message += `• 🤖 IA avanzada y recetas completas
`;
      message += `• 📊 Analytics detallados
`;
      message += `• 🎯 Sugerencias personalizadas
`;
      message += `• 💡 Tips de ahorro avanzados

`;
      message += `📅 **Válido hasta:** ${subscription.expiresAt?.toLocaleDateString('es-ES')}

`;
      message += `¡Disfruta de todas las funciones! 🎉`;

      await this.whatsappService.sendMessage(user.phone_number, message);
    } else {
      const usageStats = await this.limitsService.getUsageStats(user.user_id);
      const userCode = this.generateUserCode(user.user_id);

      let message = `⭐ **Upgrade a Premium** 🚀

`;
      message += `🎯 **Con Premium obtienes:**
`;
      message += `• 🚀 **Todo ilimitado** - sin límites
`;
      message += `• 🤖 **IA avanzada** - recetas completas
`;
      message += `• 📊 **Analytics Pro** - tendencias y insights
`;
      message += `• 💡 **Sugerencias personalizadas**
`;
      message += `• 🎨 **Funciones exclusivas**

`;

      if (usageStats) {
        const dailyPercent = Math.round((usageStats.daily.used / usageStats.daily.limit) * 100);
        const weeklyPercent = Math.round((usageStats.weekly.used / usageStats.weekly.limit) * 100);

        message += `📈 **Tu uso actual:**
`;
        message += `• Diario: ${usageStats.daily.used}/${usageStats.daily.limit} (${dailyPercent}%)
`;
        message += `• Semanal: ${usageStats.weekly.used}/${usageStats.weekly.limit} (${weeklyPercent}%)

`;
      }

      message += `💳 **Solo €4.99/mes**
`;
      message += `🔒 **Código:** ${userCode}

`;
      message += `💬 **Activar:** Envía "PREMIUM ${userCode}" por Bizum al 123456789`;

      await this.whatsappService.sendMessage(user.phone_number, message);

      // Schedule follow-up upsell if they're near limits
      await this.paymentsService.scheduleUpsellFollowup(user.user_id);
    }
  }

  private async handleUnknown(user: any, message: string): Promise<void> {
    // Try to parse as a product add attempt
    if (await this.intentService.couldBeProduct(message)) {
      await this.handleAddProduct(user, message);
      return;
    }

    // Check if they might be looking for a recipe
    if (await this.intentService.couldBeRecipe(message)) {
      await this.handleRecipeRequest(user);
      return;
    }

    // Generic help response
    await this.whatsappService.sendMessage(
      user.phone_number,
      `❓ No entendí "${message}".

**Puedes probar:**
• "Lista" - Ver productos
• "Urgente" - Productos próximos a caducar
• "Receta" - Sugerencia de cocina
• "Tengo [producto]" - Añadir producto
• "Ayuda" - Ver comandos

¿En qué te ayudo? 🤖`
    );
  }

  private async handleUsageStats(user: any): Promise<void> {
    const usageStats = await this.limitsService.getUsageStats(user.user_id);

    if (usageStats) {
      const dailyPercent = Math.round((usageStats.daily.used / usageStats.daily.limit) * 100);
      const weeklyPercent = Math.round((usageStats.weekly.used / usageStats.weekly.limit) * 100);
      const monthlyPercent = Math.round((usageStats.monthly.used / usageStats.monthly.limit) * 100);

      let message = `📊 **Tu uso actual**

`;
      message += `📱 **Mensajes diarios:**
`;
      message += `${usageStats.daily.used}/${usageStats.daily.limit} (${dailyPercent}%)
`;
      message += `${usageStats.daily.remaining} restantes

`;

      message += `📦 **Productos semanales:**
`;
      message += `${usageStats.weekly.used}/${usageStats.weekly.limit} (${weeklyPercent}%)
`;
      message += `${usageStats.weekly.remaining} restantes

`;

      message += `🤖 **IA mensual:**
`;
      message += `${usageStats.monthly.used}/${usageStats.monthly.limit} (${monthlyPercent}%)
`;
      message += `${usageStats.monthly.remaining} restantes

`;

      if (dailyPercent > 80 || weeklyPercent > 80 || monthlyPercent > 80) {
        message += `⚠️ Te estás acercando a los límites.
`;
        message += `⭐ Con Premium: *todo ilimitado*
`;
        message += `Envía "premium" para más info`;
      } else {
        message += `✅ ¡Vas por buen camino!`;
      }

      await this.whatsappService.sendMessage(user.phone_number, message);
    } else {
      await this.whatsappService.sendMessage(
        user.phone_number,
        "❌ No pude cargar tus estadísticas. Inténtalo más tarde."
      );
    }
  }

  private async handleListProducts(user: any): Promise<void> {
    try {
      const products = await this.productsService.getUserProducts(user.user_id);

      if (products.length === 0) {
        await this.whatsappService.sendMessage(
          user.phone_number,
          `📦 Tu nevera está vacía.

Para empezar, añade productos:
• "Tengo leche que caduca el viernes"
• "Compré pan de molde por 2€"
• "Yogures naturales para mañana"

¡Así podré ayudarte mejor! 🤖`
        );
        return;
      }

      // Ordenar por fecha de caducidad
      const sortedProducts = products.sort((a, b) => a.daysLeft - b.daysLeft);

      let message = `📦 *Tu nevera (${products.length} productos)*

`;

      // Productos urgentes primero
      const urgent = sortedProducts.filter(p => p.daysLeft <= 2);
      const soon = sortedProducts.filter(p => p.daysLeft > 2 && p.daysLeft <= 7);
      const fresh = sortedProducts.filter(p => p.daysLeft > 7);

      if (urgent.length > 0) {
        message += `🚨 *URGENTE (${urgent.length}):*
`;
        urgent.slice(0, 5).forEach(p => {
          message += `• ${p.name} - ${p.daysLeft === 0 ? 'HOY' : p.daysLeft + 'd'} (${p.price?.toFixed(2) || '0.00'}€)
`;
        });
        if (urgent.length > 5) {
          message += `... y ${urgent.length - 5} más urgentes
`;
        }
        message += '
';
      }

      if (soon.length > 0) {
        message += `⚠️ *PRÓXIMOS (${soon.length}):*
`;
        soon.slice(0, 3).forEach(p => {
          message += `• ${p.name} - ${p.daysLeft}d (${p.price?.toFixed(2) || '0.00'}€)
`;
        });
        if (soon.length > 3) {
          message += `... y ${soon.length - 3} más
`;
        }
        message += '
';
      }

      if (fresh.length > 0) {
        message += `✅ *FRESCOS (${fresh.length}):*
`;
        fresh.slice(0, 2).forEach(p => {
          message += `• ${p.name} - ${p.daysLeft}d
`;
        });
        if (fresh.length > 2) {
          message += `... y ${fresh.length - 2} más frescos
`;
        }
      }

      const totalValue = products.reduce((sum, p) => sum + (p.price || 0), 0);
      message += `
💰 Valor total: *${totalValue.toFixed(2)}€*`;

      if (urgent.length > 0) {
        message += `

💡 ¿Quieres una receta para aprovechar los urgentes?`;
      }

      await this.whatsappService.sendMessage(user.phone_number, message);

    } catch (error) {
      await this.whatsappService.sendMessage(
        user.phone_number,
        "❌ Error cargando tus productos. Inténtalo de nuevo."
      );
    }
  }

  private async handleUrgentProducts(user: any): Promise<void> {
    try {
      const products = await this.productsService.getUserProducts(user.user_id);
      const urgent = products.filter(p => p.daysLeft <= 2);

      if (urgent.length === 0) {
        await this.whatsappService.sendMessage(
          user.phone_number,
          `✅ *¡Perfecto!* No tienes productos urgentes.

🎯 Productos que caducan pronto:
${products.filter(p => p.daysLeft <= 7).map(p =>
  `• ${p.name} - ${p.daysLeft} días`
).join('
') || 'Ninguno'}

¡Tienes todo bajo control! 👍`
        );
        return;
      }

      const totalUrgentValue = urgent.reduce((sum, p) => sum + (p.price || 0), 0);

      let message = `🚨 *PRODUCTOS URGENTES (${urgent.length})*

`;

      urgent.forEach(p => {
        const daysText = p.daysLeft === 0 ? '¡HOY!' : p.daysLeft === 1 ? 'MAÑANA' : `${p.daysLeft} días`;
        message += `• *${p.name}* - Caduca ${daysText}
`;
        message += `  💰 ${p.price?.toFixed(2) || '0.00'}€ • 📊 ${p.category}

`;
      });

      message += `💸 *Valor en riesgo: ${totalUrgentValue.toFixed(2)}€*

`;

      message += `💡 *Sugerencias:*
`;
      message += `• Cocina algo con estos ingredientes
`;
      message += `• Congélalos si es posible
`;
      message += `• Compártelos con amigos/familia

`;

      message += `👨‍🍳 ¿Quieres una receta personalizada?`;

      await this.whatsappService.sendMessage(user.phone_number, message);

    } catch (error) {
      await this.whatsappService.sendMessage(
        user.phone_number,
        "❌ Error verificando productos urgentes."
      );
    }
  }

  private async handleRemoveProduct(user: any, productName: string): Promise<void> {
    // Check límite (mismo que add_product)
    const productLimit = await this.limitsService.checkAndEnforceLimit(user.user_id, 'remove_product');
    if (!productLimit.allowed) return;

    try {
      const products = await this.productsService.getUserProducts(user.user_id);
      const matches = await this.productsService.findProductMatches(user.user_id, productName);

      if (matches.length === 0) {
        await this.whatsappService.sendMessage(
          user.phone_number,
          `❓ No encontré "${productName}" en tu nevera.

📦 *Productos disponibles:*
${products.slice(0, 5).map(p => `• ${p.name}`).join('
')}
${products.length > 5 ? `... y ${products.length - 5} más` : ''}

¿Puedes ser más específico?`
        );
        return;
      }

      if (matches.length === 1) {
        // Un solo resultado, eliminar directamente
        await this.productsService.removeProduct(matches[0].id);

        await this.whatsappService.sendMessage(
          user.phone_number,
          `✅ *${matches[0].name}* eliminado de tu nevera.

💰 Precio: ${matches[0].price?.toFixed(2) || '0.00'}€
📊 Categoría: ${matches[0].category}

¡Espero que lo hayas aprovechado! 😊`
        );
      } else {
        // Múltiples resultados, pedir confirmación
        await this.conversationService.setContext(user.id, {
          pending_action: 'confirm_removal',
          context_data: { matches: matches.map(m => ({ id: m.id, name: m.name })) }
        });

        let message = `🤔 Encontré varios productos con "${productName}":

`;
        matches.forEach((p, i) => {
          message += `${i + 1}. *${p.name}* - ${p.daysLeft}d (${p.price?.toFixed(2) || '0.00'}€)
`;
        });
        message += `
Responde con el número del producto a eliminar:`;

        await this.whatsappService.sendMessage(user.phone_number, message);
      }

    } catch (error) {
      await this.whatsappService.sendMessage(
        user.phone_number,
        "❌ Error eliminando el producto. Inténtalo de nuevo."
      );
    }
  }

  private async handleStats(user: any): Promise<void> {
    try {
      const products = await this.productsService.getUserProducts(user.user_id);
      const subscription = await this.paymentsService.checkSubscriptionStatus(user.user_id);

      if (products.length === 0) {
        await this.whatsappService.sendMessage(
          user.phone_number,
          `📊 *Estadísticas*

📦 Productos: 0
💰 Valor total: 0.00€

¡Añade productos para ver estadísticas interesantes! 📈`
        );
        return;
      }

      const totalValue = products.reduce((sum, p) => sum + (p.price || 0), 0);
      const urgent = products.filter(p => p.daysLeft <= 2);
      const avgDaysLeft = products.reduce((sum, p) => sum + p.daysLeft, 0) / products.length;

      // Estadísticas por categoría
      const categories = products.reduce((acc: any, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
      }, {});

      const topCategory = Object.entries<number>(categories)
        .sort(([,a], [,b]) => b - a)[0];

      let message = `📊 *Tus estadísticas*

`;
      message += `📦 Productos totales: *${products.length}*
`;
      message += `💰 Valor total: *${totalValue.toFixed(2)}€*
`;
      message += `🚨 Urgentes: *${urgent.length}*
`;
      message += `📅 Promedio días restantes: *${avgDaysLeft.toFixed(1)}*
`;
      message += `🏆 Categoría principal: *${topCategory?.[0] || 'N/A'}* (${topCategory?.[1] || 0})

`;

      if (subscription.isActive && subscription.tier === 'premium') {
        // Estadísticas premium adicionales
        const weeklyTrend = await this.productsService.getWeeklyTrend(user.user_id);
        const wasteEstimate = await this.productsService.getWasteEstimate(user.user_id);

        message += `📈 *Analytics Premium:*
`;
        message += `📊 Tendencia semanal: ${weeklyTrend > 0 ? '+' : ''}${weeklyTrend} productos
`;
        message += `🗑️ Desperdicio estimado: ${wasteEstimate.toFixed(2)}€/mes
`;
        message += `💡 Ahorro potencial: ${(wasteEstimate * 0.7).toFixed(2)}€/mes
`;
      } else {
        message += `⭐ *Con Premium:* Analytics avanzados, tendencias y más estadísticas`;
      }

      await this.whatsappService.sendMessage(user.phone_number, message);

    } catch (error) {
      await this.whatsappService.sendMessage(
        user.phone_number,
        "❌ Error cargando estadísticas. Inténtalo más tarde."
      );
    }
  }

  private async handleHelp(user: any): Promise<void> {
    const subscription = await this.paymentsService.checkSubscriptionStatus(user.user_id);
    const isPremium = subscription.isActive;

    let message = `🤖 *Ayuda - Neverafy Bot*

`;

    message += `📝 *Comandos principales:*
`;
    message += `• "Tengo [producto]" - Añadir producto
`;
    message += `• "Lista" o "Qué tengo" - Ver productos
`;
    message += `• "Urgente" - Productos a punto de caducar
`;
    message += `• "Receta" - Sugerencia de cocina
`;
    message += `• "Stats" - Estadísticas
`;
    message += `• "Premium" - Info suscripción
`;
    message += `• "Uso" - Ver límites actuales

`;

    message += `💡 *Ejemplos de uso:*
`;
    message += `• "Compré leche que caduca el viernes"
`;
    message += `• "Tengo pollo, arroz y verduras"
`;
    message += `• "Receta con mis productos urgentes"
`;
    message += `• "Eliminar yogur natural"

`;

    if (isPremium) {
      message += `⭐ *Funciones Premium activas:*
`;
      message += `• ✅ Todo ilimitado
`;
      message += `• 🤖 IA avanzada
`;
      message += `• 📊 Analytics detallados
`;
      message += `• 👨‍🍳 Recetas completas

`;
      message += `Válido hasta: ${subscription.expiresAt?.toLocaleDateString('es-ES')}`;
    } else {
      const usageStats = await this.limitsService.getUsageStats(user.user_id);
      if (usageStats) {
        message += `📊 *Límites actuales (Plan Gratuito):*
`;
        message += `• Mensajes: ${usageStats.daily.remaining}/día restantes
`;
        message += `• Productos: ${usageStats.weekly.remaining}/semana restantes
`;
        message += `• IA: ${usageStats.monthly.remaining}/mes restantes

`;
      }
      message += `⭐ *Upgrade a Premium* para todo ilimitado`;
    }

    await this.whatsappService.sendMessage(user.phone_number, message);
  }
}
