// ===============================================
// API ENDPOINT - DAILY NOTIFICATIONS
// Vercel Serverless Function para envío diario
// ===============================================

import { supabase } from '../../src/services/supabase.js';
import { createEmailTemplate } from '../../src/services/email/emailTemplate.js';

export default async function handler(req, res) {
  // Solo permitir POST (para cron jobs) y GET (para testing manual)
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    console.log('🔍 Iniciando proceso de notificaciones diarias...');

    // 1. Encontrar productos que vencen en 1-2 días
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    const dayAfterTomorrowStr = dayAfterTomorrow.toISOString().split('T')[0];

    console.log(`📅 Buscando productos que vencen entre ${tomorrowStr} y ${dayAfterTomorrowStr}`);

    // Query a Supabase para productos que vencen pronto
    const { data: expiringProducts, error: productsError } = await supabase
      .from('products')
      .select(`
        *,
        profiles:user_id (email, name)
      `)
      .gte('expiry_date', tomorrowStr)
      .lte('expiry_date', dayAfterTomorrowStr);

    if (productsError) {
      console.error('Error fetching products:', productsError);
      return res.status(500).json({ error: 'Error fetching products' });
    }

    console.log(`📦 Encontrados ${expiringProducts.length} productos que vencen pronto`);

    if (expiringProducts.length === 0) {
      return res.status(200).json({ 
        message: 'No hay productos que vencen pronto',
        emailsSent: 0 
      });
    }

    // 2. Agrupar productos por usuario
    const userGroups = {};
    expiringProducts.forEach(product => {
      const userEmail = product.profiles?.email;
      const userId = product.user_id;
      
      if (!userEmail) {
        console.warn(`⚠️ Producto ${product.id} no tiene email de usuario`);
        return;
      }

      if (!userGroups[userEmail]) {
        userGroups[userEmail] = {
          userId: userId,
          userName: product.profiles.name || 'Usuario',
          products: []
        };
      }
      userGroups[userEmail].products.push(product);
    });

    console.log(`👥 Usuarios a notificar: ${Object.keys(userGroups).length}`);

    // 3. Obtener estadísticas de usuarios
    const userIds = Object.values(userGroups).map(group => group.userId);
    const { data: userStats } = await supabase
      .from('user_stats')
      .select('*')
      .in('user_id', userIds);

    // 4. Enviar emails usando Resend
    let emailsSent = 0;
    const errors = [];

    for (const [email, userData] of Object.entries(userGroups)) {
      try {
        const userStat = userStats?.find(stat => stat.user_id === userData.userId);
        
        // Crear el HTML del email
        const emailHtml = createEmailTemplate({
          userName: userData.userName,
          products: userData.products,
          userStats: userStat,
          appUrl: process.env.VITE_APP_URL || 'https://neverafy.vercel.app',
          unsubscribeUrl: `${process.env.VITE_APP_URL}/unsubscribe?email=${encodeURIComponent(email)}`
        });

        // Enviar email con Resend
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Neverafy <onboarding@resend.dev>',
            to: [email],
            subject: `🚨 ${userData.products.length} producto${userData.products.length > 1 ? 's' : ''} ${userData.products.length > 1 ? 'vencen' : 'vence'} pronto!`,
            html: emailHtml,
          }),
        });

        if (resendResponse.ok) {
          const result = await resendResponse.json();
          console.log(`✅ Email enviado a ${email} (ID: ${result.id})`);
          emailsSent++;
        } else {
          const errorText = await resendResponse.text();
          console.error(`❌ Error enviando email a ${email}:`, errorText);
          errors.push({ email, error: errorText });
        }

      } catch (error) {
        console.error(`❌ Error procesando email para ${email}:`, error);
        errors.push({ email, error: error.message });
      }
    }

    // 5. Respuesta final
    const response = {
      success: true,
      message: `Proceso completado. ${emailsSent} emails enviados.`,
      emailsSent,
      totalUsers: Object.keys(userGroups).length,
      totalProducts: expiringProducts.length,
      errors: errors.length > 0 ? errors : undefined
    };

    console.log('📧 Resumen:', response);

    return res.status(200).json(response);

  } catch (error) {
    console.error('💥 Error general en el proceso:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Error interno del servidor',
      message: error.message 
    });
  }
}
