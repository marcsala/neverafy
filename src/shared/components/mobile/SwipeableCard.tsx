import React, { useState, useRef, useEffect } from 'react';

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeComplete: () => void;
  swipeThreshold?: number;
}

export const SwipeableCard: React.FC<SwipeableCardProps> = ({
  children,
  onSwipeComplete,
  swipeThreshold = 100
}) => {
  const [swipeX, setSwipeX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleStart = (clientX: number) => {
    setIsDragging(true);
    startX.current = clientX;
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    const diff = clientX - startX.current;
    setSwipeX(Math.max(0, diff)); // Solo permitir swipe hacia la derecha
  };

  const handleEnd = () => {
    if (swipeX > swipeThreshold) {
      onSwipeComplete();
    }
    setSwipeX(0);
    setIsDragging(false);
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, swipeX]);

  return (
    <div className="relative overflow-hidden">
      {swipeX > 50 && (
        <div className="absolute inset-y-0 left-0 bg-green-500 flex items-center justify-center text-white px-4 z-10 transition-all duration-200">
          <span className="text-sm font-medium">✅ Consumido</span>
        </div>
      )}
      <div
        ref={cardRef}
        className="transition-transform duration-200"
        style={{ transform: `translateX(${swipeX}px)` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {children}
      </div>
    </div>
  );
};