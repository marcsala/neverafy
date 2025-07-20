import React from 'react';
import { Crown, Sparkles, TrendingUp, BarChart3 } from 'lucide-react';

interface PremiumUpgradeProps {
  onUpgrade: () => void;
}

const PremiumUpgrade: React.FC<PremiumUpgradeProps> = ({ onUpgrade }) => {
  const premiumFeatures = [
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: 'Análisis Avanzados',
      description: 'Patrones de consumo detallados'
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: 'Comparativas Mensuales',
      description: 'Evolución de tu eficiencia'
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: 'Reportes Detallados',
      description: 'Insights personalizados'
    }
  ];

  return (
    <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <Crown className="w-6 h-6 text-purple-600" />
        <h3 className="text-lg font-bold text-gray-800">Analytics Premium</h3>
      </div>
      
      <p className="text-gray-700 mb-4">
        Desbloquea análisis avanzados y obtén insights detallados sobre tus hábitos de consumo.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        {premiumFeatures.map((feature, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="text-purple-600">{feature.icon}</div>
            <div>
              <div className="font-medium text-gray-800">{feature.title}</div>
              <div className="text-gray-600 text-xs">{feature.description}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          <span className="line-through">€4.99/mes</span>
          <span className="ml-2 font-bold text-green-600">€2.49/mes</span>
          <div className="text-xs text-orange-600">50% OFF - Oferta limitada</div>
        </div>
        <button
          onClick={onUpgrade}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
        >
          <Crown className="w-4 h-4" />
          Actualizar a Premium
        </button>
      </div>
    </div>
  );
};

export default PremiumUpgrade;