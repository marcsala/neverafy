import React from 'react';
import { TrendingUp, Clock, Target } from 'lucide-react';

const AnalyticsView = ({ stats, userStats, isPremium, setIsPremium }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">📊 Resumen Mensual</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Productos consumidos:</span>
              <span className="font-bold text-green-600">{stats.totalConsumed}</span>
            </div>
            <div className="flex justify-between">
              <span>Productos desperdiciados:</span>
              <span className="font-bold text-red-600">{stats.totalWasted}</span>
            </div>
            <div className="flex justify-between">
              <span>Eficiencia:</span>
              <span className="font-bold text-blue-600">
                {stats.totalConsumed + stats.totalWasted > 0
                  ? `${Math.round((stats.totalConsumed / (stats.totalConsumed + stats.totalWasted)) * 100)}%`
                  : '0%'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Análisis OCR realizados:</span>
              <span className="font-bold text-purple-600">{userStats.ocrUsed}</span>
            </div>
            <div className="flex justify-between">
              <span>Recetas generadas:</span>
              <span className="font-bold text-orange-600">{userStats.recipesGenerated}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">🌱 Impacto Ambiental</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>CO2 ahorrado:</span>
              <span className="font-bold text-green-600">{userStats.co2Saved.toFixed(1)} kg</span>
            </div>
            <div className="flex justify-between">
              <span>Agua ahorrada:</span>
              <span className="font-bold text-blue-600">{(userStats.co2Saved * 1.5).toFixed(0)} litros</span>
            </div>
            <div className="flex justify-between">
              <span>Equivale a:</span>
              <span className="font-bold text-purple-600">{Math.round(userStats.co2Saved / 2.3)} km en coche</span>
            </div>
            <div className="flex justify-between">
              <span>Dinero ahorrado:</span>
              <span className="font-bold text-green-600">{userStats.totalSaved.toFixed(2)}€</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📈 Tendencias</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-bold text-blue-800">Mejor Categoría</h4>
            <p className="text-sm text-blue-600">Frutas (85% consumidas)</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <h4 className="font-bold text-orange-800">Promedio Consumo</h4>
            <p className="text-sm text-orange-600">2.3 días antes vencimiento</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-bold text-green-800">Meta Mensual</h4>
            <p className="text-sm text-green-600">80% eficiencia (78% actual)</p>
          </div>
        </div>
      </div>

      {isPremium ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">📊 Analytics Premium</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3">Uso de Funciones IA</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>OCR este mes:</span>
                  <span className="font-medium">{userStats.ocrUsed} análisis</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Recetas generadas:</span>
                  <span className="font-medium">{userStats.recipesGenerated} recetas</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Precisión promedio:</span>
                  <span className="font-medium">94%</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-green-50 to-yellow-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3">Patrones de Consumo</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Día más activo:</span>
                  <span className="font-medium">Domingo</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Categoría favorita:</span>
                  <span className="font-medium">Frutas</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Mejor racha:</span>
                  <span className="font-medium">{userStats.streak} días</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">🔒 Analytics Premium</h3>
          <p className="text-gray-700 mb-4">
            Desbloquea análisis avanzados, patrones de consumo, comparativas mensuales y reportes detallados.
          </p>
          <button
            onClick={() => setIsPremium(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Actualizar a Premium
          </button>
        </div>
      )}
    </div>
  );
};

export default AnalyticsView;
