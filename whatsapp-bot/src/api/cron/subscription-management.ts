// src/api/cron/subscription-management.ts (continuación)
        await whatsappService.sendMessage(
          message.whatsapp_users.phone_number,
          messageText
        );

        // Marcar como enviado
        await supabase
          .from('scheduled_messages')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString()
          })
          .eq('id', message.id);
      }

      await sleep(1000);
      
    } catch (error) {
      console.error(`Failed to send scheduled message ${message.id}:`, error);
      
      // Marcar como fallido
      await supabase
        .from('scheduled_messages')
        .update({
          status: 'failed',
          error_message: error.message
        })
        .eq('id', message.id);
    }
  }

  console.log(`Processed ${scheduledMessages.length} scheduled messages`);
}

function generateUpsellFollowup(contextData: any): string {
  const attempts = contextData.attempts || 1;
  
  if (attempts === 1) {
    return `🤔 *¿Sigues interesado en Premium?*

Hace 24h alcanzaste tus límites gratuitos.

⭐ *Con Premium obtienes:*
• 🚀 Todo ilimitado
• 🤖 IA más avanzada
• 📊 Analytics detallados

💳 Solo €4.99/mes
¿Te ayudamos a activarlo?`;
  } else if (attempts === 2) {
    return `💭 *Última oportunidad Premium*

Has usado varios límites gratuitos esta semana.

🎯 *Usuarios Premium ahorran más:*
• Mejor gestión de productos
• Menos desperdicio alimentario
• Recetas más eficientes

¿Probamos Premium 1 mes?`;
  }
  
  return ''; // No más follow-ups después del segundo intento
}

function generateEngagementMessage(contextData: any): string {
  return `👋 ¡Hola! ¿Cómo va tu nevera hoy?

💡 *Recordatorio:*
• Revisa productos próximos a caducar
• Añade las compras de hoy
• Pide recetas personalizadas

¿En qué te ayudo? 🤖`;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
