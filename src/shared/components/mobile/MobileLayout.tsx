import React from 'react';
import { MobileHeader } from './MobileHeader';
import { BottomNavigation } from './BottomNavigation';

interface MobileLayoutProps {
  children: React.ReactNode;
  user: any;
  urgentCount: number;
  currentView: string;
  onViewChange: (view: string) => void;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  user,
  urgentCount,
  currentView,
  onViewChange
}) => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20 max-w-md mx-auto relative">
      <MobileHeader user={user} urgentCount={urgentCount} />
      
      <main className="relative">
        {children}
      </main>
      
      <BottomNavigation 
        activeTab={currentView}
        onTabChange={onViewChange}
        notifications={urgentCount}
      />
    </div>
  );
};