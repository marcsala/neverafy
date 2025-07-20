// shared/components/layout/NavBar.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Package, Camera, ChefHat, Trophy, TrendingUp, Star } from 'lucide-react';
import { FREEMIUM_LIMITS } from '../../utils/constants';

interface NavBarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  isPremium: boolean;
  userStats: {
    ocrUsed: number;
    recipesGenerated: number;
  };
  onLogout?: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ 
  currentView, 
  setCurrentView, 
  isPremium, 
  userStats,
  onLogout 
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/' },
    { id: 'products', label: 'Mi Nevera', icon: Package, path: '/products' },
    { 
      id: 'camera', 
      label: 'Smart Camera', 
      icon: Camera, 
      premium: !isPremium && userStats.ocrUsed >= FREEMIUM_LIMITS.OCR_MONTHLY, 
      path: '/camera' 
    },
    { 
      id: 'recipes', 
      label: 'Recetas IA', 
      icon: ChefHat, 
      premium: !isPremium && userStats.recipesGenerated >= FREEMIUM_LIMITS.RECIPES_MONTHLY, 
      path: '/recipes' 
    },
    { id: 'achievements', label: 'Logros', icon: Trophy, path: '/achievements' },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, path: '/analytics' }
  ];

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <div className="flex flex-wrap gap-2 justify-between items-center">
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
        
        {/* Botón logout opcional */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="text-gray-500 hover:text-red-600 transition-colors text-sm px-3 py-1 rounded-lg hover:bg-red-50"
          >
            Cerrar sesión
          </button>
        )}
      </div>
    </div>
  );
};

export default NavBar;
