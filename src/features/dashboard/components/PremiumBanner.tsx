// features/dashboard/components/PremiumBanner.tsx

import React from 'react';
import { Crown, Zap, Camera, ChefHat, BarChart3 } from 'lucide-react';
import { Button } from '../../../shared/components/ui';

interface PremiumBannerProps {
  isPremium: boolean;
  onUpgradeToPremium: () => void;
  userStats: {
    ocrUsed: number;
    recipesGenerated: number;
  };
}

const PremiumBanner: React.FC<PremiumBannerProps> = ({ 
  isPremium, 
  onUpgradeToPremium,
  userStats 
}) => {
  // No mostrar banner si ya es premium
  if (isPremium) {
    return (
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-6">
        <div className="flex items-center gap-3">
          <Crown className="w-8 h-8 text-yellow-300" />
          <div>
            <h3 className="text-xl font-bold">¡Eres Premium! 👑</h3>
            <p className="text-purple-100">
              Disfruta de todas las funciones avanzadas de Neverafy sin límites
            </p>
          </div>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: Camera,
      title: 'OCR Ilimitado',
      description: 'Escanea todos los productos que quieras'
    },
    {
      icon: ChefHat,
      title: 'Recetas IA Avanzadas',
      description: 'Generación ilimitada con Claude AI'
    },
    {
      icon: BarChart3,
      title: 'Analytics Premium',
      description: 'Estadísticas detalladas y reportes'
    },
    {
      icon: Zap,
      title: 'Funciones Exclusivas',
      description: 'Acceso temprano a nuevas features'
    }
  ];

  return (
    <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg p-6 shadow-lg">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <Crown className="w-8 h-8 text-yellow-300" />
            <h3 className="text-2xl font-bold">🚀 Desbloquea el Poder Completo</h3>
          </div>
          <p className="text-green-100 mb-4">
            Maximiza tu ahorro y reduce el desperdicio con funciones premium
          </p>
          
          {/* Mini features grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className="w-6 h-6 mx-auto mb-1 text-yellow-300" />
                  <p className="text-xs font-medium">{feature.title}</p>
                </div>
              );
            })}
          </div>

          {/* Límites actuales */}
          <div className="flex gap-4 text-sm text-green-100">
            <span>📸 OCR: {userStats.ocrUsed}/1 usado</span>
            <span>🍳 Recetas: {userStats.recipesGenerated}/2 usadas</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={onUpgradeToPremium}
            variant="premium"
            size="lg"
            className="bg-white text-green-600 hover:bg-gray-100 font-bold shadow-lg"
          >
            <Crown className="w-5 h-5" />
            Probar Premium
          </Button>
          <p className="text-xs text-green-100 text-center">
            🎁 Los primeros 100 usuarios: ¡Premium GRATIS de por vida!
          </p>
        </div>
      </div>
    </div>
  );
};

export default PremiumBanner;
