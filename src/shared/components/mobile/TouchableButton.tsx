import React, { useState } from 'react';

interface TouchableButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'default' | 'large';
  className?: string;
  disabled?: boolean;
}

export const TouchableButton: React.FC<TouchableButtonProps> = ({
  children,
  onPress,
  variant = 'primary',
  size = 'default',
  className = "",
  disabled = false
}) => {
  const [isPressed, setIsPressed] = useState(false);
  
  const baseClasses = "min-h-[44px] flex items-center justify-center rounded-xl font-medium transition-all duration-200";
  
  const variants = {
    primary: "bg-green-600 text-white shadow-lg hover:bg-green-700 disabled:bg-gray-300",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:bg-gray-50",
    danger: "bg-red-600 text-white shadow-lg hover:bg-red-700 disabled:bg-gray-300"
  };
  
  const sizes = {
    small: "px-4 py-2 text-sm",
    default: "px-6 py-3",
    large: "px-8 py-4 text-lg"
  };
  
  return (
    <button
      className={`
        ${baseClasses} ${variants[variant]} ${sizes[size]} ${className}
        ${isPressed ? 'scale-95' : 'scale-100'}
      `}
      onClick={onPress}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      disabled={disabled}
    >
      {children}
    </button>
  );
};