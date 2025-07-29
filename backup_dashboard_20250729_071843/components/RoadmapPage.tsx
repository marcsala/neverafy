import React from 'react';

const RoadmapPage: React.FC = () => {
  const roadmapSections = [
    {
      category: "📊 Estadísticas y Analytics",
      priority: "Alta",
      items: [
        "Ahorro total desde registro",
        "CO2 evitado con impacto ambiental",
        "Productos gestionados histórico",
        "Tiempo usando la app y días activos",
        "Ranking y sistema de logros (gamificación)",
        "Gráficos de tendencias de consumo",
        "Comparativas con otros usuarios"
      ]
    },
    {
      category: "🎯 Objetivos y Metas",
      priority: "Alta",
      items: [
        "Meta de ahorro mensual",
        "Meta de sostenibilidad",
        "Desafíos semanales/mensuales",
        "Progreso con gráficos de cumplimiento",
        "Recompensas por objetivos cumplidos"
      ]
    },
    {
      category: "🏠 Configuración del Hogar",
      priority: "Media",
      items: [
        "Miembros de la familia",
        "Múltiples neveras (casa, oficina, garaje)",
        "Roles (admin, usuario, solo lectura)",
        "Sincronización entre dispositivos",
        "Gestión de permisos familiares"
      ]
    },
    {
      category: "🥶 Preferencias de Nevera",
      priority: "Media",
      items: [
        "Tipos de productos favoritos",
        "Restricciones alimentarias (vegano, sin gluten, etc.)",
        "Tiempo de conservación personalizado por tipo",
        "Ubicaciones de nevera múltiples",
        "Categorización automática de productos"
      ]
    },
    {
      category: "📱 Preferencias de App",
      priority: "Media",
      items: [
        "Tema claro/oscuro/automático",
        "Idiomas múltiples (español, inglés, etc.)",
        "Unidades métricas/imperiales",
        "Formato de fecha personalizable",
        "Widgets del dashboard personalizables"
      ]
    },
    {
      category: "🎨 Personalización",
      priority: "Baja",
      items: [
        "Colores de categorías personalizados",
        "Vista preferida (lista vs tarjetas)",
        "Ordenación default configurable",
        "Fondos de pantalla temáticos",
        "Iconos personalizados por categoría"
      ]
    },
    {
      category: "🔗 Integraciones",
      priority: "Alta",
      items: [
        "Supermercados (Mercadona, Carrefour, etc.)",
        "Calendarios (Google, Outlook)",
        "Asistentes de voz (Alexa, Google)",
        "Apps de recetas populares",
        "APIs de productos y códigos de barras"
      ]
    },
    {
      category: "📞 Soporte y Ayuda",
      priority: "Media",
      items: [
        "Centro de ayuda con FAQs",
        "Chat de soporte en vivo",
        "Sistema de tickets",
        "Reportar problemas y bugs",
        "Sugerir nuevas funciones",
        "Tutoriales interactivos"
      ]
    },
    {
      category: "🔒 Datos y Privacidad",
      priority: "Alta",
      items: [
        "Descarga de datos (GDPR)",
        "Control granular de privacidad",
        "Gestión de cookies avanzada",
        "Backup y restore de datos",
        "Cifrado end-to-end"
      ]
    },
    {
      category: "🤖 Inteligencia Artificial",
      priority: "Alta",
      items: [
        "Reconocimiento de productos por foto",
        "Sugerencias inteligentes de recetas",
        "Predicción de fechas de caducidad",
        "Optimización automática de compras",
        "Análisis de patrones de consumo",
        "Recomendaciones personalizadas"
      ]
    },
    {
      category: "📊 Funciones Premium+",
      priority: "Baja",
      items: [
        "Análisis nutricional avanzado",
        "Planificación de menús con IA",
        "Integración con wearables",
        "Reportes ejecutivos detallados",
        "API para desarrolladores",
        "Modo familia empresarial"
      ]
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta': return 'bg-red-100 text-red-800';
      case 'Media': return 'bg-yellow-100 text-yellow-800';
      case 'Baja': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">🚀 Roadmap de Neverafy</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descubre las próximas funcionalidades que estamos desarrollando para hacer de Neverafy 
              la mejor app de gestión de nevera inteligente.
            </p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3">Leyenda de Prioridades</h3>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center">
              <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 mr-2">
                Alta
              </span>
              <span className="text-sm text-gray-600">En desarrollo activo</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 mr-2">
                Media
              </span>
              <span className="text-sm text-gray-600">Próximos 6 meses</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 mr-2">
                Baja
              </span>
              <span className="text-sm text-gray-600">Futuro (6+ meses)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Roadmap Sections */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <div className="space-y-6">
          {roadmapSections.map((section, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">{section.category}</h2>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(section.priority)}`}>
                    {section.priority}
                  </span>
                </div>
                
                <div className="grid gap-3">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">¿Tienes una idea?</h3>
          <p className="text-gray-600 mb-6">
            Nos encanta escuchar a nuestra comunidad. Si tienes alguna sugerencia o funcionalidad 
            que te gustaría ver en Neverafy, ¡háznoslo saber!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:feedback@neverafy.com" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Enviar Sugerencia
            </a>
            <a 
              href="/" 
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Volver al Inicio
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;