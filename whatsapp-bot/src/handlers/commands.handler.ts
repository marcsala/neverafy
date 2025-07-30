import { UsersService } from '../services/users.service';
import { ProductsService } from '../services/products.service';
import { WhatsAppService } from '../services/whatsapp.service';
import { WhatsAppUser } from '../types/shared.types';
import { logger } from '../utils/logger';

export class CommandsHandler {
  constructor(
    private usersService: UsersService,
    private productsService: ProductsService,
    private whatsappService: WhatsAppService
  ) {}

  async handleCommand(phoneNumber: string, command: string): Promise<void> {
    try {
      const user = await this.usersService.getOrCreateWhatsAppUser(phoneNumber);
      
      // Actualizar actividad del usuario
      await this.usersService.updateUserActivity(user.id);
      
      switch (command.toLowerCase()) {
        case '/productos':
        case '/products':
          await this.handleProductsCommand(user, phoneNumber);
          break;
        case '/stats':
        case '/estadisticas':
          await this.handleStatsCommand(user, phoneNumber);
          break;
        case '/urgente':
        case '/urgent':
          await this.handleUrgentCommand(user, phoneNumber);
          break;
        case '/ayuda':
        case '/help':
          await this.handleHelpCommand(phoneNumber);
          break;
        default:
          await this.handleUnknownCommand(phoneNumber, command);
      }
    } catch (error) {
      logger.error('Error handling command:', error);
      await this.whatsappService.sendMessage(
        phoneNumber,
        "Hubo un error procesando tu comando. ¿Puedes intentarlo de nuevo? 🤖"
      );
    }
  }

  private async handleProductsCommand(user: WhatsAppUser, phoneNumber: string): Promise<void> {
    try {
      const products = await this.productsService.getUserProducts(user.id);
      
      if (products.length === 0) {
        const message = `📦 *No tienes productos registrados*

¡Vamos a empezar! Puedes añadir productos escribiendo algo como:
• "tengo leche que caduca el viernes"
• "compré pan integral, 2.50€"
• "añadir yogures hasta el lunes"

¿Qué tienes en tu nevera? 🏠`;

        await this.whatsappService.sendMessage(phoneNumber, message);
        return;
      }
      
      const urgent = products.filter(p => p.daysLeft <= 2);
      const normal = products.filter(p => p.daysLeft > 2);
      
      let message = `📊 *Tienes ${products.length} productos en tu nevera*\n\n`;
      
      if (urgent.length > 0) {
        message += `🚨 *URGENTES* (caducan pronto):\n`;
        urgent.slice(0, 5).forEach(p => {
          const emoji = p.daysLeft <= 0 ? '🔴' : '🟡';
          const days = p.daysLeft <= 0 ? 'HOY' : `${p.daysLeft} día${p.daysLeft > 1 ? 's' : ''}`;
          message += `${emoji} ${p.name} - ${days}\n`;
        });
        message += '\n';
      }
      
      if (normal.length > 0) {
        message += `✅ *FRESCOS*:\n`;
        normal.slice(0, 5).forEach(p => {
          message += `• ${p.name} - ${p.daysLeft} días\n`;
        });
        if (normal.length > 5) {
          message += `... y ${normal.length - 5} más\n`;
        }
      }
      
      message += `\n💡 Escribe "/stats" para ver estadísticas`;
      
      await this.whatsappService.sendMessage(phoneNumber, message);
    } catch (error) {
      logger.error('Error in handleProductsCommand:', error);
      await this.whatsappService.sendMessage(
        phoneNumber,
        "No pude obtener tus productos. ¿Puedes intentarlo más tarde? 📦"
      );
    }
  }

  private async handleStatsCommand(user: WhatsAppUser, phoneNumber: string): Promise<void> {
    try {
      const stats = await this.productsService.getUserStats(user.id);
      const userInfo = await this.usersService.getUserStats(user.id);
      
      let message = `📈 *Estadísticas de tu nevera*\n\n`;
      message += `📦 *Productos totales:* ${stats.totalProducts}\n`;
      message += `⚠️ *Productos urgentes:* ${stats.urgentProducts}\n`;
      message += `💰 *Valor total:* ${stats.totalValue.toFixed(2)}€\n`;
      message += `📊 *Categoría principal:* ${stats.topCategory}\n`;
      message += `⏱️ *Días promedio restantes:* ${stats.averageDaysLeft}\n\n`;
      
      message += `👤 *Tu cuenta:*\n`;
      message += `📱 Suscripción: ${userInfo?.subscription_tier || 'free'}\n`;
      message += `📅 Miembro desde: ${this.formatDate(userInfo?.created_at)}\n\n`;
      
      if (stats.urgentProducts > 0) {
        message += `🎯 *Recomendación:* ¡Tienes ${stats.urgentProducts} productos urgentes! Consúmelos pronto para evitar desperdicios.`;
      } else if (stats.totalProducts === 0) {
        message += `🎯 *Recomendación:* Empieza añadiendo productos a tu nevera para obtener estadísticas útiles.`;
      } else {
        message += `🎯 *Recomendación:* ¡Tu nevera está bien organizada! Sigue así.`;
      }
      
      await this.whatsappService.sendMessage(phoneNumber, message);
    } catch (error) {
      logger.error('Error in handleStatsCommand:', error);
      await this.whatsappService.sendMessage(
        phoneNumber,
        "No pude obtener tus estadísticas. ¿Puedes intentarlo más tarde? 📈"
      );
    }
  }

  private async handleUrgentCommand(user: WhatsAppUser, phoneNumber: string): Promise<void> {
    try {
      const urgent = await this.productsService.getUrgentProducts(user.id);
      
      if (urgent.length === 0) {
        const message = `✅ *¡Excelente!*

No tienes productos urgentes. Todo está bajo control en tu nevera 🎉

Escribe "/productos" para ver todo tu inventario.`;

        await this.whatsappService.sendMessage(phoneNumber, message);
        return;
      }
      
      const totalValue = urgent.reduce((sum, p) => sum + (p.price || 0), 0);
      
      let message = `🚨 *PRODUCTOS URGENTES*\n\n`;
      message += `${urgent.length} productos caducan pronto:\n\n`;
      
      urgent.forEach(p => {
        const emoji = p.daysLeft <= 0 ? '🔴' : '🟡';
        const days = p.daysLeft <= 0 ? 'CADUCA HOY' : `${p.daysLeft} día${p.daysLeft > 1 ? 's' : ''}`;
        const price = p.price ? ` (${p.price.toFixed(2)}€)` : '';
        message += `${emoji} *${p.name}* - ${days}${price}\n`;
      });
      
      message += `\n💰 *Valor en riesgo:* ${totalValue.toFixed(2)}€\n\n`;
      message += `💡 *Sugerencias:*\n`;
      message += `• Cocina algo con estos ingredientes\n`;
      message += `• Congela lo que puedas\n`;
      message += `• Comparte con familiares/amigos\n\n`;
      message += `¿Necesitas ideas de recetas? ¡Pregúntame!`;
      
      await this.whatsappService.sendMessage(phoneNumber, message);
    } catch (error) {
      logger.error('Error in handleUrgentCommand:', error);
      await this.whatsappService.sendMessage(
        phoneNumber,
        "No pude revisar tus productos urgentes. ¿Puedes intentarlo más tarde? 🚨"
      );
    }
  }

  private async handleHelpCommand(phoneNumber: string): Promise<void> {
    const message = `🤖 *Comandos disponibles*

📦 *GESTIÓN DE PRODUCTOS:*
• "/productos" - Ver tu inventario
• "/urgente" - Productos que caducan pronto
• "/stats" - Estadísticas de tu nevera

💬 *AÑADIR PRODUCTOS (lenguaje natural):*
• "tengo leche que caduca el viernes"
• "compré pan, 2.50€"
• "añadir yogures hasta el lunes"

❓ *AYUDA:*
• "/ayuda" - Ver este menú
• "info" - Información sobre Neverafy

🎯 *EJEMPLOS DE USO:*
• "¿qué tengo en la nevera?"
• "receta con tomates"
• "cuánto he ahorrado"

¡Solo escribe de forma natural y te entenderé! 🚀`;

    await this.whatsappService.sendMessage(phoneNumber, message);
  }

  private async handleUnknownCommand(phoneNumber: string, command: string): Promise<void> {
    const message = `❓ No reconozco el comando "${command}"

Comandos disponibles:
• /productos - Ver inventario
• /stats - Estadísticas
• /urgente - Productos urgentes
• /ayuda - Ayuda completa

¿O prefieres escribir de forma natural? ¡También te entiendo! 😊`;

    await this.whatsappService.sendMessage(phoneNumber, message);
  }

  private formatDate(dateString?: string): string {
    if (!dateString) return 'Desconocido';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
}
