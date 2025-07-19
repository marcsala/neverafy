import React from 'react';
import { BarChart3, Package, Camera, ChefHat, Trophy, TrendingUp, Star } from 'lucide-react';

const NavBar = ({ currentView, setCurrentView, isPremium, userStats }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'products', label: 'Mi Nevera', icon: Package },
    { id: 'camera', label: 'Smart Camera', icon: Camera, premium: !isPremium && userStats.ocrUsed >= 3 },
    { id: 'recipes', label: 'Recetas IA', icon: ChefHat, premium: !isPremium && userStats.recipesGenerated >= 5 },
    { id: 'achievements', label: 'Logros', icon: Trophy },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ];

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <div className="flex flex-wrap gap-2">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors relative ${
                currentView === item.id
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon size={18} />
              {item.label}
              {item.premium && (
                <Star size={14} className="text-yellow-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default NavBar;
