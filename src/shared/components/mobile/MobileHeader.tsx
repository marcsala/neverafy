import React from 'react';
import { Bell } from 'lucide-react';

interface MobileHeaderProps {
  user: {
    name?: string;
    avatar?: string;
    level?: number;
    points?: number;
  };
  urgentCount: number;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  user,
  urgentCount
}) => {
  const NotificationBell = ({ count = 0 }) => (
    <div className="relative">
      <Bell size={20} className="text-gray-600" />
      {count > 0 && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {count > 9 ? '9+' : count}
        </div>
      )}
    </div>
  );

  return (
    <header className="h-15 bg-white px-4 flex items-center justify-between border-b sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🥬</span>
        <div className="text-sm">
          <div className="font-bold">Nivel {user.level || 1}</div>
          <div className="text-green-600">{user.points || 0} pts</div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <NotificationBell count={urgentCount} />
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
          <span className="text-lg">{user.avatar || '👤'}</span>
        </div>
      </div>
    </header>
  );
};