import React from 'react';
import { TouchableCard } from './TouchableCard';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  notifications?: number;
}

interface BottomNavItem {
  id: string;
  label: string;
  icon: string;
  badge?: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  notifications = 0
}) => {
  const navItems: BottomNavItem[] = [
    { id: 'dashboard', label: 'Nevera', icon: '🥬', badge: notifications },
    { id: 'camera', label: 'Cámara', icon: '📸' },
    { id: 'recipes', label: 'Recetas', icon: '🍳' },
    { id: 'profile', label: 'Perfil', icon: '👤' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
      <div className="flex h-20 pb-4">
        {navItems.map((item) => (
          <TouchableCard
            key={item.id}
            className={`
              flex-1 flex flex-col items-center justify-center min-h-[56px] relative
              ${activeTab === item.id ? 'bg-green-50' : ''}
            `}
            onPress={() => onTabChange(item.id)}
          >
            <span className="text-xl mb-1">{item.icon}</span>
            <span className={`
              text-xs font-medium
              ${activeTab === item.id ? 'text-green-600' : 'text-gray-600'}
            `}>
              {item.label}
            </span>
            {item.badge && item.badge > 0 && (
              <div className="absolute top-2 right-4 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {item.badge > 9 ? '9+' : item.badge}
              </div>
            )}
          </TouchableCard>
        ))}
      </div>
    </nav>
  );
};