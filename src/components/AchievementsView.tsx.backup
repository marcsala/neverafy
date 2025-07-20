import React from 'react';
import { Trophy, CheckCircle, Clock } from 'lucide-react';

const AchievementsView = ({ achievements, products, userStats }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🏆 Logros y Desafíos</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map(achievement => {
            // Lógica para desbloquear logros
            let unlocked = false;
            switch(achievement.id) {
              case 1: unlocked = products.length > 0; break;
              case 2: unlocked = userStats.totalSaved >= 10; break;
              case 3: unlocked = userStats.recipesGenerated >= 5; break;
              case 4: unlocked = userStats.streak >= 7; break;
              case 5: unlocked = userStats.co2Saved >= 50; break;
              case 6: unlocked = userStats.ocrUsed >= 10; break;
              case 7: unlocked = userStats.recipesGenerated >= 20; break;
            }

            return (
              <div key={achievement.id} className={`border rounded-lg p-4 transition-all ${
                unlocked ? 'border-green-200 bg-green-50 shadow-md' : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{achievement.name}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    <p className="text-xs text-purple-600 font-medium">+{achievement.points} puntos</p>
                  </div>
                  {unlocked ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <span className="text-sm font-medium text-green-600">¡Desbloqueado!</span>
                    </div>
                  ) : (
                    <div className="text-gray-400">
                      <Clock className="w-6 h-6" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-6">
          <h4 className="font-semibold text-gray-800 mb-3">🎯 Próximos Desafíos</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl mb-2">📸</div>
              <p className="font-medium">Usa OCR 5 veces más</p>
              <p className="text-gray-600">Progreso: {userStats.ocrUsed}/10</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🍳</div>
              <p className="font-medium">Genera 15 recetas más</p>
              <p className="text-gray-600">Progreso: {userStats.recipesGenerated}/20</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">💰</div>
              <p className="font-medium">Ahorra 40€ más</p>
              <p className="text-gray-600">Progreso: {userStats.totalSaved.toFixed(1)}/50€</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementsView;
