// ===============================================
// EMAIL TEMPLATE - ESTILO LANDING NEVERAFY
// Plantilla que coincide con el diseño de la landing page
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

// Plantilla de email con estilo de la landing
export const createEmailTemplate = (data) => {
  const { userName, products, userStats, appUrl, unsubscribeUrl } = data;
  
  // Generar HTML de productos dinámicamente
  const productsHtml = products.map(product => {
    const daysToExpiry = getDaysToExpiry(product.expiry_date);
    let expiryText, expiryClass, productClass;
    
    if (daysToExpiry <= 0) {
      expiryText = 'VENCE HOY';
      expiryClass = 'expiry-today';
      productClass = 'urgent';
    } else if (daysToExpiry === 1) {
      expiryText = 'VENCE MAÑANA';
      expiryClass = 'expiry-tomorrow';
      productClass = 'warning';
    } else {
      const date = new Date(product.expiry_date);
      expiryText = `${date.getDate()} ${getMonthName(date.getMonth())}`;
      expiryClass = 'expiry-soon';
      productClass = '';
    }
    
    return `
      <div class="product-item ${productClass}">
        <div class="product-info">
          <div class="product-name">${product.name}</div>
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
            color: #374151;
            background-color: #f9fafb;
        }
        
        .email-container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .header { 
            background: linear-gradient(135deg, #2563eb 0%, #9333ea 100%);
            color: white; 
            padding: 40px 32px; 
            text-align: center; 
        }
        
        .header-logo { 
            display: inline-flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
        }
        
        .logo-icon {
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            font-weight: 700;
        }
        
        .logo-text {
            font-size: 24px;
            font-weight: 700;
        }
        
        .header h1 { 
            font-size: 24px; 
            font-weight: 700; 
            margin-bottom: 8px;
        }
        
        .header p { 
            font-size: 16px; 
            opacity: 0.9;
            font-weight: 400;
        }
        
        .content { 
            padding: 40px 32px; 
            background: #ffffff;
        }
        
        .greeting { 
            font-size: 24px; 
            font-weight: 700; 
            color: #111827;
            margin-bottom: 20px;
        }
        
        .intro-text { 
            font-size: 18px; 
            color: #4b5563; 
            margin-bottom: 32px;
            line-height: 1.7;
        }
        
        .products-section { 
            margin: 32px 0;
        }
        
        .products-title { 
            font-size: 20px; 
            font-weight: 700; 
            color: #111827;
            margin-bottom: 20px;
        }
        
        .product-item { 
            background: #ffffff;
            padding: 20px;
            margin: 12px 0;
            border-radius: 16px;
            border: 1px solid #e5e7eb;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .product-item.urgent {
            background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
            border-color: #fca5a5;
        }
        
        .product-item.warning {
            background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
            border-color: #fbbf24;
        }
        
        .product-info { flex: 1; }
        
        .product-name { 
            font-weight: 700; 
            color: #111827;
            font-size: 16px;
            margin-bottom: 4px;
        }
        
        .product-category { 
            color: #6b7280; 
            font-size: 14px;
        }
        
        .expiry-badge { 
            padding: 8px 16px;
            border-radius: 50px;
            font-size: 14px;
            font-weight: 600;
            white-space: nowrap;
        }
        
        .expiry-today { 
            background: #dc2626;
            color: white;
        }
        
        .expiry-tomorrow {
            background: #f59e0b;
            color: white;
        }
        
        .expiry-soon {
            background: #6b7280;
            color: white;
        }
        
        .suggestions { 
            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
            border: 1px solid #bbf7d0;
            border-radius: 16px; 
            padding: 24px; 
            margin: 32px 0;
        }
        
        .suggestions h3 { 
            color: #059669; 
            font-size: 20px; 
            font-weight: 700;
            margin-bottom: 16px;
        }
        
        .suggestions ul { 
            list-style: none; 
            padding: 0;
        }
        
        .suggestions li { 
            padding: 8px 0; 
            color: #047857;
            position: relative;
            padding-left: 24px;
            font-size: 16px;
        }
        
        .suggestions li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #10b981;
            font-weight: bold;
            font-size: 18px;
        }
        
        .cta-section { 
            text-align: center; 
            margin: 40px 0;
        }
        
        .cta-button { 
            display: inline-block;
            background: linear-gradient(135deg, #2563eb 0%, #9333ea 100%);
            color: white; 
            padding: 16px 32px; 
            text-decoration: none; 
            border-radius: 12px; 
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
        }
        
        .stats { 
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 16px; 
            padding: 32px; 
            margin: 32px 0;
            text-align: center;
        }
        
        .stats h3 { 
            color: #111827; 
            margin-bottom: 24px;
            font-size: 20px;
            font-weight: 700;
        }
        
        .stats-grid { 
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
        }
        
        .stat-item { 
            text-align: center;
        }
        
        .stat-number { 
            font-size: 32px; 
            font-weight: 700; 
            color: #2563eb;
            display: block;
            margin-bottom: 8px;
        }
        
        .stat-label { 
            color: #6b7280; 
            font-size: 14px;
            font-weight: 500;
        }
        
        .footer { 
            background: #111827;
            color: #d1d5db;
            padding: 32px; 
            text-align: center; 
        }
        
        .footer-logo { 
            display: inline-flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
        }
        
        .footer-logo-icon {
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, #2563eb 0%, #9333ea 100%);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            font-weight: 700;
            color: white;
        }
        
        .footer-logo-text {
            font-size: 20px;
            font-weight: 700;
            color: white;
        }
        
        .footer p { 
            color: #9ca3af; 
            font-size: 14px;
            margin: 8px 0;
        }
        
        .footer-links { 
            margin: 20px 0;
        }
        
        .footer-links a { 
            color: #d1d5db; 
            text-decoration: none; 
            margin: 0 16px;
            font-size: 14px;
        }
        
        .quote {
            text-align: center;
            color: #6b7280;
            font-style: italic;
            margin-top: 32px;
            font-size: 16px;
            padding: 24px;
            background: #f9fafb;
            border-radius: 12px;
            border-left: 4px solid #2563eb;
        }
        
        @media (max-width: 600px) {
            .email-container { 
                margin: 8px; 
                border-radius: 12px;
            }
            
            .header, .content, .footer { 
                padding-left: 20px; 
                padding-right: 20px;
            }
            
            .content {
                padding: 32px 20px;
            }
            
            .product-item { 
                flex-direction: column; 
                align-items: flex-start; 
                gap: 12px;
                padding: 16px;
            }
            
            .expiry-badge { 
                align-self: flex-end;
            }
            
            .stats-grid { 
                grid-template-columns: 1fr;
                gap: 16px;
            }
            
            .greeting {
                font-size: 20px;
            }
            
            .intro-text {
                font-size: 16px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="header-logo">
                <div class="logo-icon">N</div>
                <div class="logo-text">Neverafy</div>
            </div>
            <h1>Productos que requieren atención</h1>
            <p>Algunos productos de tu nevera vencen pronto</p>
        </div>
        
        <div class="content">
            <div class="greeting">Hola ${userName},</div>
            
            <div class="intro-text">
                Te escribimos para recordarte que tienes <strong>${productCount} producto${pluralText}</strong> que ${verbText} pronto. Te ayudamos a evitar que se desperdicien y ahorres dinero.
            </div>
            
            <div class="products-section">
                <div class="products-title">Productos que vencen pronto:</div>
                ${productsHtml}
            </div>
            
            <div class="suggestions">
                <h3>¿Qué puedes hacer?</h3>
                <ul>
                    <li><strong>Úsalos hoy:</strong> Prepara una receta con estos ingredientes</li>
                    <li><strong>Compártelos:</strong> Ofrécelos a vecinos, familia o amigos</li>
                    <li><strong>Congélalos:</strong> Si es posible, guárdalos en el congelador</li>
                    <li><strong>Cocina por lotes:</strong> Prepara varias raciones y congela</li>
                </ul>
            </div>
            
            <div class="cta-section">
                <a href="${appUrl}/dashboard" class="cta-button">
                    Ver Mi Nevera
                </a>
            </div>
            
            ${userStats ? `
            <div class="stats">
                <h3>Tu impacto hasta ahora:</h3>
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
            
            <div class="quote">
                "Cada producto que salvas marca la diferencia. ¡Sigue así!"
            </div>
        </div>
        
        <div class="footer">
            <div class="footer-logo">
                <div class="footer-logo-icon">N</div>
                <div class="footer-logo-text">Neverafy</div>
            </div>
            <p>Tu nevera inteligente que cuida el planeta</p>
            <p style="font-size: 12px; margin-top: 16px;">
                Recibes este email porque tienes notificaciones activadas en Neverafy
            </p>
            
            <div class="footer-links">
                <a href="${appUrl}/dashboard">Mi Dashboard</a>
                <a href="${appUrl}/settings">Configuración</a>
                <a href="${unsubscribeUrl}">Cancelar alertas</a>
            </div>
            
            <p style="font-size: 11px; color: #6b7280; margin-top: 16px;">
                © 2025 Neverafy - Todos los derechos reservados
            </p>
        </div>
    </div>
</body>
</html>
  `;
};

export default createEmailTemplate;
