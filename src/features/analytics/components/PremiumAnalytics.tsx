import React from 'react';

interface UserStats {
  ocrUsed: number;
  recipesGenerated: number;
  streak: number;
}

interface PremiumAnalyticsProps {
  userStats: UserStats;
}

const PremiumAnalytics: React.FC<PremiumAnalyticsProps> = ({ userStats }) => {
  const aiUsageStats = [
    { label: 'OCR este mes', value: `${userStats.ocrUsed} análisis` },
    { label: 'Recetas generadas', value: `${userStats.recipesGenerated} recetas` },
    { label: 'Precisión promedio', value: '94%' }
  ];

  const consumptionPatterns = [
    { label: 'Día más activo', value: 'Domingo' },
    { label: 'Categoría favorita', value: 'Frutas' },
    { label: 'Mejor racha', value: `${userStats.streak} días` }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        📊 Analytics Premium
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-3">Uso de Funciones IA</h4>
          <div className="space-y-2">
            {aiUsageStats.map((stat, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-700">{stat.label}:</span>
                <span className="font-medium text-gray-800">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-green-50 to-yellow-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-3">Patrones de Consumo</h4>
          <div className="space-y-2">
            {consumptionPatterns.map((pattern, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-700">{pattern.label}:</span>
                <span className="font-medium text-gray-800">{pattern.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumAnalytics;