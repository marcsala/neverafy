import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Package, Camera, ChefHat, Trophy, TrendingUp, Star } from 'lucide-react';

const NavBar = ({ currentView, setCurrentView, isPremium, userStats }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/' },
    { id: 'products', label: 'Mi Nevera', icon: Package, path: '/products' },
    { id: 'camera', label: 'Smart Camera', icon: Camera, premium: !isPremium && userStats.ocrUsed >= 3, path: '/camera' },
    { id: 'recipes', label: 'Recetas IA', icon: ChefHat, premium: !isPremium && userStats.recipesGenerated >= 5, path: '/recipes' },
    { id: 'achievements', label: 'Logros', icon: Trophy, path: '/achievements' },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, path: '/analytics' }
  ];

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <div className="flex flex-wrap gap-2">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              to={item.path}
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
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default NavBar;
