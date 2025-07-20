import React from 'react';
import { Star, Flame, DollarSign, Crown } from 'lucide-react';

interface StatsBarProps {
  userStats: {
    points: number;
    streak: number;
    totalSaved: number;
  };
  isPremium: boolean;
}

const StatsBar: React.FC<StatsBarProps> = ({ userStats, isPremium }) => {
  return (
    <div className="mt-4 flex justify-center items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
        <Star className="w-5 h-5 text-yellow-500" />
        <span className="font-bold">{userStats.points} puntos</span>
      </div>
      <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
        <Flame className="w-5 h-5 text-orange-500" />
        <span className="font-bold">{userStats.streak} días</span>
      </div>
      <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
        <DollarSign className="w-5 h-5 text-green-500" />
        <span className="font-bold">{userStats.totalSaved.toFixed(1)}€</span>
      </div>
      {isPremium && (
        <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full shadow-md">
          <Crown className="w-5 h-5" />
          <span className="font-bold">Premium</span>
        </div>
      )}
    </div>
  );
};

export default StatsBar;