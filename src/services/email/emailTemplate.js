// ===============================================
// EMAIL SERVICE - NEVERAFY
// Sistema completo de notificaciones por email
// ===============================================

// Helper functions
const getDaysToExpiry = (expiryDate) => {
  const today = new Date();
  const expiry = new Date(expiryDate + 'T00:00:00');
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const getMonthName = (monthIndex) => {
  const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 
                  'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
  return months[monthIndex];
};

const getCategoryEmoji = (category) => {
  const emojis = {
    'frutas': '🍌',
    'verduras': '🥬',
    'lácteos': '🥛',
    'carne': '🥩',
    'pescado': '🐟',
    'pan': '🍞',
    'conservas': '🥫',
    'congelados': '🧊',
    'huevos': '🥚',
    'otros': '📦'
  };
  return emojis[category.toLowerCase()] || '📦';
};

// Plantilla de email profesional con diseño responsive
export const createEmailTemplate = (data) => {
  const { userName, products, userStats, appUrl, unsubscribeUrl } = data;
  
  // Generar HTML de productos dinámicamente
  const productsHtml = products.map(product => {
    const daysToExpiry = getDaysToExpiry(product.expiry_date);
    let expiryText, expiryClass;
    
    if (daysToExpiry <= 0) {
      expiryText = '¡HOY! 🚨';
      expiryClass = 'expiry-today';
    } else if (daysToExpiry === 1) {
      expiryText = 'MAÑANA ⚠️';
      expiryClass = '';
    } else {
      const date = new Date(product.expiry_date);
      expiryText = `${date.getDate()} ${getMonthName(date.getMonth())} ⏰`;
      expiryClass = '';
    }
    
    const categoryEmoji = getCategoryEmoji(product.category);
    
    return `
      <div class="product-item">
        <div class="product-info">
          <div class="product-name">${categoryEmoji} ${product.name}</div>
          <div class="product-category">${product.category} • Cantidad: ${product.quantity || 1}</div>
        </div>
        <div class="expiry-badge ${expiryClass}">${expiryText}</div>
      </div>
    `;
  }).join('');

  const productCount = products.length;
  const pluralText = productCount > 1 ? 's' : '';
  const verbText = productCount > 1 ? 'vencen' : 'vence';

  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Neverafy - Productos por vencer</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6; 
            color: #333;
            background-color: #f8fafc;
        }
        
        .email-container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
        }
        
        .logo { 
            font-size: 2.5rem; 
            margin-bottom: 8px;
        }
        
        .header h1 { 
            font-size: 1.8rem; 
            font-weight: 700; 
            margin-bottom: 8px;
        }
        
        .header p { 
            font-size: 1.1rem; 
            opacity: 0.9;
        }
        
        .content { 
            padding: 40px 30px; 
            background: #ffffff;
        }
        
        .greeting { 
            font-size: 1.3rem; 
            font-weight: 600; 
            color: #1a202c;
            margin-bottom: 24px;
        }
        
        .intro-text { 
            font-size: 1.1rem; 
            color: #4a5568; 
            margin-bottom: 32px;
            line-height: 1.7;
        }
        
        .products-section { 
            background: linear-gradient(135deg, #fef5e7 0%, #fff2d5 100%);
            border: 2px solid #fed7aa;
            border-radius: 12px; 
            padding: 24px; 
            margin: 32px 0;
            position: relative;
        }
        
        .products-title { 
            font-size: 1.25rem; 
            font-weight: 700; 
            color: #c05621;
            margin-bottom: 16px;
        }
        
        .product-item { 
            background: white;
            padding: 16px;
            margin: 12px 0;
            border-radius: 8px;
            border-left: 4px solid #f56565;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .product-info { flex: 1; }
        
        .product-name { 
            font-weight: 600; 
            color: #2d3748;
            font-size: 1.1rem;
        }
        
        .product-category { 
            color: #718096; 
            font-size: 0.9rem;
            margin-top: 4px;
        }
        
        .expiry-badge { 
            background: #fed7d7;
            color: #c53030;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
            white-space: nowrap;
        }
        
        .expiry-today { 
            background: #fbb6ce;
            color: #b83280;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        
        .suggestions { 
            background: #f0fff4;
            border: 2px solid #9ae6b4;
            border-radius: 12px; 
            padding: 24px; 
            margin: 32px 0;
        }
        
        .suggestions h3 { 
            color: #22543d; 
            font-size: 1.2rem; 
            font-weight: 700;
            margin-bottom: 16px;
        }
        
        .suggestions ul { 
            list-style: none; 
            padding: 0;
        }
        
        .suggestions li { 
            padding: 8px 0; 
            color: #2f855a;
            position: relative;
            padding-left: 24px;
        }
        
        .suggestions li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #38a169;
            font-weight: bold;
        }
        
        .cta-section { 
            text-align: center; 
            margin: 40px 0;
        }
        
        .cta-button { 
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; 
            padding: 16px 32px; 
            text-decoration: none; 
            border-radius: 50px; 
            font-weight: 700;
            font-size: 1.1rem;
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }
        
        .stats { 
            background: linear-gradient(135deg, #e6fffa 0%, #b2f5ea 100%);
            border-radius: 12px; 
            padding: 24px; 
            margin: 32px 0;
            text-align: center;
        }
        
        .stats h3 { 
            color: #234e52; 
            margin-bottom: 16px;
            font-size: 1.2rem;
        }
        
        .stats-grid { 
            display: flex; 
            justify-content: space-around; 
            flex-wrap: wrap;
            gap: 16px;
        }
        
        .stat-item { 
            text-align: center;
            min-width: 120px;
        }
        
        .stat-number { 
            font-size: 2rem; 
            font-weight: 700; 
            color: #2c7a7b;
            display: block;
        }
        
        .stat-label { 
            color: #4a5568; 
            font-size: 0.9rem;
            margin-top: 4px;
        }
        
        .footer { 
            background: #f8fafc;
            padding: 32px 30px; 
            text-align: center; 
            border-top: 1px solid #e2e8f0;
        }
        
        .footer-logo { 
            font-size: 1.5rem; 
            margin-bottom: 12px;
            color: #4a5568;
        }
        
        .footer p { 
            color: #718096; 
            font-size: 0.9rem;
            margin: 8px 0;
        }
        
        .footer-links { 
            margin: 16px 0;
        }
        
        .footer-links a { 
            color: #667eea; 
            text-decoration: none; 
            margin: 0 12px;
            font-size: 0.9rem;
        }
        
        @media (max-width: 600px) {
            .email-container { 
                margin: 10px; 
                border-radius: 12px;
            }
            
            .header, .content, .footer { 
                padding-left: 20px; 
                padding-right: 20px;
            }
            
            .product-item { 
                flex-direction: column; 
                align-items: flex-start; 
                gap: 12px;
            }
            
            .expiry-badge { 
                align-self: flex-end;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">🥬</div>
            <h1>¡Alerta Neverafy!</h1>
            <p>Algunos productos necesitan tu atención</p>
        </div>
        
        <div class="content">
            <div class="greeting">¡Hola ${userName}! 👋</div>
            
            <div class="intro-text">
                Te escribimos para recordarte que tienes <strong>${productCount} producto${pluralText}</strong> que ${verbText} pronto. ¡Vamos a evitar que se desperdicien!
            </div>
            
            <div class="products-section">
                <div class="products-title">⏰ Productos que requieren atención:</div>
                ${productsHtml}
            </div>
            
            <div class="suggestions">
                <h3>💡 ¿Qué puedes hacer?</h3>
                <ul>
                    <li><strong>Úsalos hoy:</strong> Prepara una receta con estos ingredientes</li>
                    <li><strong>Compártelos:</strong> Ofrécelos a vecinos, familia o amigos</li>
                    <li><strong>Congélalos:</strong> Si es posible, guárdalos en el congelador</li>
                    <li><strong>Cocina por lotes:</strong> Prepara varias raciones y congela</li>
                </ul>
            </div>
            
            <div class="cta-section">
                <a href="${appUrl}/dashboard" class="cta-button">
                    🥬 Ver Mi Nevera
                </a>
            </div>
            
            ${userStats ? `
            <div class="stats">
                <h3>🌍 Tu impacto hasta ahora:</h3>
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-number">€${userStats.total_saved || 0}</span>
                        <div class="stat-label">Ahorrados</div>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${userStats.co2_saved || 0}kg</span>
                        <div class="stat-label">CO₂ evitado</div>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${userStats.points || 0}</span>
                        <div class="stat-label">Puntos</div>
                    </div>
                </div>
            </div>
            ` : ''}
            
            <div style="text-align: center; color: #4a5568; font-style: italic; margin-top: 32px;">
                "Cada producto que salvas marca la diferencia. ¡Sigue así!" 🌱
            </div>
        </div>
        
        <div class="footer">
            <div class="footer-logo">🥬 Neverafy</div>
            <p>Tu nevera inteligente que cuida el planeta</p>
            <p style="font-size: 0.8rem; color: #a0aec0; margin-top: 16px;">
                Recibes este email porque tienes notificaciones activadas en Neverafy
            </p>
            
            <div class="footer-links">
                <a href="${appUrl}/dashboard">Mi Dashboard</a>
                <a href="${appUrl}/settings">Configuración</a>
                <a href="${unsubscribeUrl}">Cancelar alertas</a>
            </div>
            
            <p style="font-size: 0.8rem; color: #a0aec0; margin-top: 16px;">
                © 2025 Neverafy - Hecho con ❤️ para reducir el desperdicio alimentario
            </p>
        </div>
    </div>
</body>
</html>
  `;
};

export default createEmailTemplate;
