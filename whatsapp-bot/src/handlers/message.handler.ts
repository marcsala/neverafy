// src/handlers/message.handler.ts - VERSIÓN CON LÍMITES (continuación)
      message += `${usageStats.daily.used}/${usageStats.daily.limit} (${dailyPercent}%)\n`;
      message += `${usageStats.daily.remaining} restantes\n\n`;
      
      message += `📦 **Productos semanales:**\n`;
      message += `${usageStats.weekly.used}/${usageStats.weekly.limit} (${weeklyPercent}%)\n`;
      message += `${usageStats.weekly.remaining} restantes\n\n`;
      
      message += `🤖 **IA mensual:**\n`;
      message += `${usageStats.monthly.used}/${usageStats.monthly.limit} (${monthlyPercent}%)\n`;
      message += `${usageStats.monthly.remaining} restantes\n\n`;

      if (dailyPercent > 80 || weeklyPercent > 80 || monthlyPercent > 80) {
        message += `⚠️ Te estás acercando a los límites.\n`;
        message += `⭐ Con Premium: *todo ilimitado*\n`;
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
      
      let message = `📦 *Tu nevera (${products.length} productos)*\n\n`;
      
      // Productos urgentes primero
      const urgent = sortedProducts.filter(p => p.daysLeft <= 2);
      const soon = sortedProducts.filter(p => p.daysLeft > 2 && p.daysLeft <= 7);
      const fresh = sortedProducts.filter(p => p.daysLeft > 7);

      if (urgent.length > 0) {
        message += `🚨 *URGENTE (${urgent.length}):*\n`;
        urgent.slice(0, 5).forEach(p => {
          message += `• ${p.name} - ${p.daysLeft === 0 ? 'HOY' : p.daysLeft + 'd'} (${p.price?.toFixed(2) || '0.00'}€)\n`;
        });
        if (urgent.length > 5) {
          message += `... y ${urgent.length - 5} más urgentes\n`;
        }
        message += '\n';
      }

      if (soon.length > 0) {
        message += `⚠️ *PRÓXIMOS (${soon.length}):*\n`;
        soon.slice(0, 3).forEach(p => {
          message += `• ${p.name} - ${p.daysLeft}d (${p.price?.toFixed(2) || '0.00'}€)\n`;
        });
        if (soon.length > 3) {
          message += `... y ${soon.length - 3} más\n`;
        }
        message += '\n';
      }

      if (fresh.length > 0) {
        message += `✅ *FRESCOS (${fresh.length}):*\n`;
        fresh.slice(0, 2).forEach(p => {
          message += `• ${p.name} - ${p.daysLeft}d\n`;
        });
        if (fresh.length > 2) {
          message += `... y ${fresh.length - 2} más frescos\n`;
        }
      }

      const totalValue = products.reduce((sum, p) => sum + (p.price || 0), 0);
      message += `\n💰 Valor total: *${totalValue.toFixed(2)}€*`;

      if (urgent.length > 0) {
        message += `\n\n💡 ¿Quieres una receta para aprovechar los urgentes?`;
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
).join('\n') || 'Ninguno'}

¡Tienes todo bajo control! 👍`
        );
        return;
      }

      const totalUrgentValue = urgent.reduce((sum, p) => sum + (p.price || 0), 0);
      
      let message = `🚨 *PRODUCTOS URGENTES (${urgent.length})*\n\n`;
      
      urgent.forEach(p => {
        const daysText = p.daysLeft === 0 ? '¡HOY!' : p.daysLeft === 1 ? 'MAÑANA' : `${p.daysLeft} días`;
        message += `• *${p.name}* - Caduca ${daysText}\n`;
        message += `  💰 ${p.price?.toFixed(2) || '0.00'}€ • 📊 ${p.category}\n\n`;
      });

      message += `💸 *Valor en riesgo: ${totalUrgentValue.toFixed(2)}€*\n\n`;
      
      message += `💡 *Sugerencias:*\n`;
      message += `• Cocina algo con estos ingredientes\n`;
      message += `• Congélalos si es posible\n`;
      message += `• Compártelos con amigos/familia\n\n`;
      
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
${products.slice(0, 5).map(p => `• ${p.name}`).join('\n')}
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

        let message = `🤔 Encontré varios productos con "${productName}":\n\n`;
        matches.forEach((p, i) => {
          message += `${i + 1}. *${p.name}* - ${p.daysLeft}d (${p.price?.toFixed(2) || '0.00'}€)\n`;
        });
        message += `\nResponde con el número del producto a eliminar:`;

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

      let message = `📊 *Tus estadísticas*\n\n`;
      message += `📦 Productos totales: *${products.length}*\n`;
      message += `💰 Valor total: *${totalValue.toFixed(2)}€*\n`;
      message += `🚨 Urgentes: *${urgent.length}*\n`;
      message += `📅 Promedio días restantes: *${avgDaysLeft.toFixed(1)}*\n`;
      message += `🏆 Categoría principal: *${topCategory?.[0] || 'N/A'}* (${topCategory?.[1] || 0})\n\n`;

      if (subscription.isActive && subscription.tier === 'premium') {
        // Estadísticas premium adicionales
        const weeklyTrend = await this.productsService.getWeeklyTrend(user.user_id);
        const wasteEstimate = await this.productsService.getWasteEstimate(user.user_id);
        
        message += `📈 *Analytics Premium:*\n`;
        message += `📊 Tendencia semanal: ${weeklyTrend > 0 ? '+' : ''}${weeklyTrend} productos\n`;
        message += `🗑️ Desperdicio estimado: ${wasteEstimate.toFixed(2)}€/mes\n`;
        message += `💡 Ahorro potencial: ${(wasteEstimate * 0.7).toFixed(2)}€/mes\n`;
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

    let message = `🤖 *Ayuda - Neverafy Bot*\n\n`;
    
    message += `📝 *Comandos principales:*\n`;
    message += `• "Tengo [producto]" - Añadir producto\n`;
    message += `• "Lista" o "Qué tengo" - Ver productos\n`;
    message += `• "Urgente" - Productos a punto de caducar\n`;
    message += `• "Receta" - Sugerencia de cocina\n`;
    message += `• "Stats" - Estadísticas\n`;
    message += `• "Premium" - Info suscripción\n`;
    message += `• "Uso" - Ver límites actuales\n\n`;
    
    message += `💡 *Ejemplos de uso:*\n`;
    message += `• "Compré leche que caduca el viernes"\n`;
    message += `• "Tengo pollo, arroz y verduras"\n`;
    message += `• "Receta con mis productos urgentes"\n`;
    message += `• "Eliminar yogur natural"\n\n`;

    if (isPremium) {
      message += `⭐ *Funciones Premium activas:*\n`;
      message += `• ✅ Todo ilimitado\n`;
      message += `• 🤖 IA avanzada\n`;
      message += `• 📊 Analytics detallados\n`;
      message += `• 👨‍🍳 Recetas completas\n\n`;
      message += `Válido hasta: ${subscription.expiresAt?.toLocaleDateString('es-ES')}`;
    } else {
      const usageStats = await this.limitsService.getUsageStats(user.user_id);
      if (usageStats) {
        message += `📊 *Límites actuales (Plan Gratuito):*\n`;
        message += `• Mensajes: ${usageStats.daily.remaining}/día restantes\n`;
        message += `• Productos: ${usageStats.weekly.remaining}/semana restantes\n`;
        message += `• IA: ${usageStats.monthly.remaining}/mes restantes\n\n`;
      }
      message += `⭐ *Upgrade a Premium* para todo ilimitado`;
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
}
