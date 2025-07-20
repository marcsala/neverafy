import React from 'react';
import StatsBar from '../ui/StatsBar';

interface AppHeaderProps {
  userStats: {
    points: number;
    streak: number;
    totalSaved: number;
  };
  isPremium: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({ userStats, isPremium }) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">🥬 Neverafy</h1>
      <p className="text-gray-600">Tu nevera, inteligente</p>
      <div className="mt-2 inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-blue-100 text-gray-700 px-3 py-1 rounded-full text-sm">
        <span className="text-red-600">🇪🇸</span>
        <span className="font-medium">Hecho en España</span>
      </div>
      <StatsBar userStats={userStats} isPremium={isPremium} />
    </div>
  );
};

export default AppHeader;