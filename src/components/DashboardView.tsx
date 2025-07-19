import React from 'react';
import { Package, AlertTriangle, DollarSign, Star, Flame, Leaf, Camera, ChefHat, Bell } from 'lucide-react';

const DashboardView = ({ stats, userStats, notifications, setIsPremium }) => (
  <div className="space-y-6">
    {/* Premium Banner */}
    {!userStats.isPremium && (
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">🚀 Desbloquea el Poder Completo de Neverafy</h3>
            <p className="text-green-100">Escaneado ilimitado, recetas IA avanzadas, analytics premium y mucho más</p>
          </div>
          <button
            onClick={() => setIsPremium(true)}
            className="premium-button"
          >
            Probar Premium
          </button>
        </div>
      </div>
    )}

    {/* Stats principales */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg shadow-md p-6 text-center border-l-4 border-blue-500">
        <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
        <h3 className="text-2xl font-bold text-gray-800">{stats.total}</h3>
        <p className="text-gray-600">Productos activos</p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 text-center border-l-4 border-orange-500">
        <AlertTriangle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
        <h3 className="text-2xl font-bold text-gray-800">{stats.expiringSoon}</h3>
        <p className="text-gray-600">Vencen pronto</p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 text-center border-l-4 border-green-500">
        <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
        <h3 className="text-2xl font-bold text-gray-800">{userStats.totalSaved.toFixed(1)}€</h3>
        <p className="text-gray-600">Ahorrado</p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 text-center border-l-4 border-purple-500">
        <Star className="w-8 h-8 text-purple-600 mx-auto mb-2" />
        <h3 className="text-2xl font-bold text-gray-800">{userStats.points}</h3>
        <p className="text-gray-600">Puntos</p>
      </div>
    </div>

    {/* Progreso y nivel */}
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Tu Progreso 🌟</h3>
      <div className="flex items-center gap-4 mb-4">
        <div className="text-2xl">🏆</div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-bold">Nivel {userStats.level}</span>
            <span className="text-sm text-gray-600">{userStats.points}/1000 puntos</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(userStats.points % 1000) / 10}%` }}
            ></div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <Flame className="w-6 h-6 text-orange-500 mx-auto mb-1" />
          <p className="text-sm text-gray-600">Racha: {userStats.streak} días</p>
        </div>
        <div>
          <Leaf className="w-6 h-6 text-green-500 mx-auto mb-1" />
          <p className="text-sm text-gray-600">CO2: {userStats.co2Saved.toFixed(1)}kg</p>
        </div>
        <div>
          <Camera className="w-6 h-6 text-blue-500 mx-auto mb-1" />
          <p className="text-sm text-gray-600">OCR: {userStats.ocrUsed}/mes</p>
        </div>
        <div>
          <ChefHat className="w-6 h-6 text-purple-500 mx-auto mb-1" />
          <p className="text-sm text-gray-600">Recetas: {userStats.recipesGenerated}/mes</p>
        </div>
      </div>
    </div>

    {/* Notificaciones */}
    {notifications.length > 0 && (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🔔 Alertas Recientes</h3>
        <div className="space-y-2">
          {notifications.slice(0, 3).map(notif => (
            <div key={notif.id} className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
              <Bell className="w-5 h-5 text-orange-600" />
              <span className="text-sm text-gray-800">{notif.message}</span>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default DashboardView;
