import React from 'react';

type ProgressVariant = 'default' | 'success' | 'warning' | 'danger' | 'premium';
type ProgressSize = 'sm' | 'md' | 'lg';

interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: ProgressVariant;
  size?: ProgressSize;
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  showLabel = false,
  label,
  animated = false,
  className = ''
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  const variantClasses = {
    default: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
    premium: 'bg-gradient-to-r from-purple-500 to-blue-500'
  };

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const backgroundClasses = {
    default: 'bg-blue-100',
    success: 'bg-green-100',
    warning: 'bg-yellow-100',
    danger: 'bg-red-100',
    premium: 'bg-gradient-to-r from-purple-100 to-blue-100'
  };

  return (
    <div className={`w-full ${className}`}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            {label || `Progreso: ${Math.round(percentage)}%`}
          </span>
          {showLabel && (
            <span className="text-sm text-gray-500">
              {value}/{max}
            </span>
          )}
        </div>
      )}
      
      <div className={`
        w-full rounded-full overflow-hidden
        ${sizeClasses[size]}
        ${backgroundClasses[variant]}
      `}>
        <div
          className={`
            h-full rounded-full transition-all duration-500 ease-out
            ${variantClasses[variant]}
            ${animated ? 'animate-pulse' : ''}
          `}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;