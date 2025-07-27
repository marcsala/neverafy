import React, { useState } from 'react';

interface TouchableCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
  disabled?: boolean;
}

export const TouchableCard: React.FC<TouchableCardProps> = ({
  children,
  onPress,
  className = "",
  disabled = false
}) => {
  const [isPressed, setIsPressed] = useState(false);
  
  return (
    <div
      className={`
        min-h-[44px] transition-all duration-200 cursor-pointer
        ${onPress ? 'hover:shadow-md' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${isPressed ? 'scale-95' : 'scale-100'}
        ${className}
      `}
      onClick={disabled ? undefined : onPress}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      role="button"
      tabIndex={disabled ? -1 : 0}
    >
      {children}
    </div>
  );
};