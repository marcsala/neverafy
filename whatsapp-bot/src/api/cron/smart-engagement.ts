// src/api/cron/smart-engagement.ts
import { WhatsAppService } from '../../services/whatsapp.service';
import { supabase } from '../../config/supabase';

export default async function handler(req: Request) {
  try {
    console.log('Running smart engagement cron...');
    
    const whatsappService = new WhatsAppService();
    
    // 1. Usuarios que añadieron productos ayer pero no hoy
    await engageUsersWithStaleProducts(whatsappService);
    
    // 2. Usuarios con productos urgentes sin recetas solicitadas
    await remindUrgentProducts(whatsappService);
    
    // 3. Usuarios premium inactivos
    await engagePremiumUsers(whatsappService);
    
    // 4. Nuevos usuarios sin productos después de 24h
    await engageNewUsers(whatsappService);

    console.log('Smart engagement cron completed successfully');
    return new Response('OK', { status: 200 });

  } catch (error) {
    console.error('Smart engagement cron error:', error);
    return new Response('Error', { status: 500 });
  }
}

async function engageUsersWithStaleProducts(whatsappService: WhatsAppService) {
  // Usuarios que tienen productos pero no han interactuado en 24h
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  const { data: staleUsers } = await supabase
    .from('whatsapp_users')
    .select(`
      *,
      products (id, name, expiry_date)
    `)
    .lt('updated_at', yesterday.toISOString())
    .eq('is_active', true);

  if (!staleUsers) return;

  for (const user of staleUsers) {
    if (!user.products || user.products.length === 0) continue;

    const urgentProducts = user.products.filter(p => {
      const daysLeft = Math.ceil((new Date(p.expiry_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return daysLeft <= 2;
    });

    if (urgentProducts.length > 0) {
      await supabase
        .from('scheduled_messages')
        .insert({
          user_id: user.id,
          message_type: 'urgent_reminder',
          scheduled_for: new Date(Date.now() + Math.random() * 2 * 60 * 60 * 1000).toISOString(),
          context_data: {
            urgent_products: urgentProducts.length,
            product_names: urgentProducts.map(p => p.name)
          }
        });
    }
  }

  console.log(`Scheduled engagement for ${staleUsers.length} users with stale products`);
}

async function remindUrgentProducts(whatsappService: WhatsAppService) {
  // Buscar usuarios con productos que caducan hoy/mañana
  const twoDaysFromNow = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
  
  const { data: urgentProductUsers } = await supabase
    .from('products')
    .select(`
      user_id,
      name,
      expiry_date,
      whatsapp_users (phone_number, subscription_tier)
    `)
    .lte('expiry_date', twoDaysFromNow.toISOString())
    .eq('whatsapp_users.is_active', true);

  if (!urgentProductUsers) return;

  // Agrupar por usuario
  const userGroups = urgentProductUsers.reduce((acc: any, product) => {
    const userId = product.user_id;
    if (!acc[userId]) {
      acc[userId] = {
        user: product.whatsapp_users,
        products: []
      };
    }
    acc[userId].products.push(product);
    return acc;
  }, {});

  for (const [userId, data] of Object.entries<any>(userGroups)) {
    const message = generateUrgentProductMessage(data.products, data.user.subscription_tier);
    
    await supabase
      .from('scheduled_messages')
      .insert({
        user_id: userId,
        message_type: 'urgent_products',
        scheduled_for: new Date(Date.now() + Math.random() * 60 * 60 * 1000).toISOString(),
        context_data: {
          products: data.products.map((p: any) => ({ name: p.name, expiry_date: p.expiry_date }))
        }
      });
  }

  console.log(`Scheduled urgent product reminders for ${Object.keys(userGroups).length} users`);
}

async function engagePremiumUsers(whatsappService: WhatsAppService) {
  // Usuarios premium que no han usado funciones premium en 3 días
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  
  const { data: inactivePremium } = await supabase
    .from('whatsapp_users')
    .select('*')
    .eq('subscription_tier', 'premium')
    .lt('updated_at', threeDaysAgo.toISOString())
    .eq('is_active', true);

  if (!inactivePremium) return;

  for (const user of inactivePremium) {
    await supabase
      .from('scheduled_messages')
      .insert({
        user_id: user.id,
        message_type: 'premium_engagement',
        scheduled_for: new Date(Date.now() + Math.random() * 3 * 60 * 60 * 1000).toISOString(),
        context_data: {
          premium_inactive_days: 3
        }
      });
  }

  console.log(`Scheduled premium engagement for ${inactivePremium.length} users`);
}

async function engageNewUsers(whatsappService: WhatsAppService) {
  // Usuarios creados en las últimas 24-48h sin productos
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
  
  const { data: newUsers } = await supabase
    .from('whatsapp_users')
    .select(`
      *,
      products (id)
    `)
    .gte('created_at', twoDaysAgo.toISOString())
    .lte('created_at', dayAgo.toISOString())
    .eq('is_active', true);

  if (!newUsers) return;

  const usersWithoutProducts = newUsers.filter(u => !u.products || u.products.length === 0);

  for (const user of usersWithoutProducts) {
    await supabase
      .from('scheduled_messages')
      .insert({
        user_id: user.id,
        message_type: 'onboarding_help',
        scheduled_for: new Date(Date.now() + Math.random() * 4 * 60 * 60 * 1000).toISOString(),
        context_data: {
          new_user: true,
          hours_since_signup: 24
        }
      });
  }

  console.log(`Scheduled onboarding help for ${usersWithoutProducts.length} new users`);
}

function generateUrgentProductMessage(products: any[], subscriptionTier: string): string {
  const productList = products.slice(0, 3).map(p => p.name).join(', ');
  const totalValue = products.reduce((sum, p) => sum + (p.price || 0), 0);
  
  let message = `🚨 *¡Productos urgentes!*\n\n`;
  message += `Tienes ${products.length} productos que caducan pronto:\n`;
  message += `• ${productList}${products.length > 3 ? '...' : ''}\n\n`;
  message += `💰 Valor: ${totalValue.toFixed(2)}€\n\n`;
  
  if (subscriptionTier === 'premium') {
    message += `👨‍🍳 ¿Quieres una receta personalizada para aprovecharlos?`;
  } else {
    message += `💡 Tips: cocínalos hoy, congélalos o compártelos.\n`;
    message += `⭐ Con Premium: recetas personalizadas automáticas`;
  }
  
  return message;
}
