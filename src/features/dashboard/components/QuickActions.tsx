// features/dashboard/components/QuickActions.tsx

import React from 'react';
import { Plus, Camera, ChefHat, BarChart3, Trophy, Package } from 'lucide-react';
import { Button } from '../../../shared/components/ui';

interface QuickActionsProps {
  onNavigate: (view: string) => void;
  stats: {
    total: number;
    expiringSoon: number;
  };
  userStats: {
    ocrUsed: number;
    recipesGenerated: number;
  };
  isPremium: boolean;
}

const QuickActions: React.FC<QuickActionsProps> = ({ 
  onNavigate, 
  stats, 
  userStats,
  isPremium 
}) => {
  const quickActions = [
    {
      id: 'add-product',
      title: 'Añadir Producto',
      description: 'Agregar manualmente un nuevo producto',
      icon: Plus,
      color: 'bg-green-500 hover:bg-green-600',
      action: () => onNavigate('products'),
      priority: 'high'
    },
    {
      id: 'scan-product',
      title: 'Escanear Productos',
      description: 'Usar OCR inteligente para detectar productos',
      icon: Camera,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => onNavigate('camera'),
      disabled: !isPremium && userStats.ocrUsed >= 1,
      priority: 'high'
    },
    {
      id: 'generate-recipes',
      title: 'Generar Recetas',
      description: 'Crear recetas IA con productos próximos a vencer',
      icon: ChefHat,
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => onNavigate('recipes'),
      disabled: !isPremium && userStats.recipesGenerated >= 2,
      priority: stats.expiringSoon > 0 ? 'high' : 'medium'
    },
    {
      id: 'view-analytics',
      title: 'Ver Analytics',
      description: 'Revisar estadísticas de ahorro y desperdicio',
      icon: BarChart3,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      action: () => onNavigate('analytics'),
      priority: 'medium'
    },
    {
      id: 'check-achievements',
      title: 'Ver Logros',
      description: 'Revisar tus achievements desbloqueados',
      icon: Trophy,
      color: 'bg-yellow-500 hover:bg-yellow-600',
      action: () => onNavigate('achievements'),
      priority: 'low'
    },
    {
      id: 'manage-products',
      title: 'Gestionar Nevera',
      description: `Administrar tus ${stats.total} productos`,
      icon: Package,
      color: 'bg-gray-500 hover:bg-gray-600',
      action: () => onNavigate('products'),
      priority: stats.total > 0 ? 'medium' : 'low'
    }
  ];

  // Ordenar por prioridad y filtrar algunas acciones según contexto
  const sortedActions = quickActions
    .filter(action => {
      // Mostrar solo 4-6 acciones más relevantes
      if (action.priority === 'low' && quickActions.filter(a => a.priority === 'high').length >= 3) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    })
    .slice(0, 6);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">🚀 Acciones Rápidas</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedActions.map(action => {
          const Icon = action.icon;
          
          return (
            <button
              key={action.id}
              onClick={action.action}
              disabled={action.disabled}
              className={`
                p-4 rounded-lg text-left transition-all duration-200 
                ${action.disabled 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : `${action.color} text-white hover:shadow-lg transform hover:-translate-y-1`
                }
              `}
            >
              <div className="flex items-start gap-3">
                <Icon className="w-6 h-6 flex-shrink-0 mt-1" />
                <div className="min-w-0">
                  <h4 className="font-semibold mb-1">{action.title}</h4>
                  <p className="text-sm opacity-90 leading-tight">
                    {action.description}
                  </p>
                  {action.disabled && (
                    <p className="text-xs mt-1 opacity-75">
                      Límite alcanzado - Actualiza a Premium
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Sugerencias contextual */}
      {stats.expiringSoon > 0 && (
        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-sm text-orange-800">
            💡 <strong>Sugerencia:</strong> Tienes {stats.expiringSoon} productos que vencen pronto. 
            ¡Genera recetas para aprovecharlos!
          </p>
        </div>
      )}
      
      {stats.total === 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            🎯 <strong>Empieza:</strong> Añade tus primeros productos para comenzar a ahorrar 
            y reducir el desperdicio alimentario.
          </p>
        </div>
      )}
    </div>
  );
};

export default QuickActions;
