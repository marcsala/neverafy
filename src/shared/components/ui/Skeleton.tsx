import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  circle?: boolean;
  lines?: number;
  animated?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width = '100%',
  height = '1rem',
  circle = false,
  lines = 1,
  animated = true
}) => {
  const baseClasses = `bg-gray-200 ${animated ? 'animate-pulse' : ''}`;
  const shapeClasses = circle ? 'rounded-full' : 'rounded';

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height
  };

  if (lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }, (_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${shapeClasses}`}
            style={{
              ...style,
              width: index === lines - 1 ? '75%' : style.width
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${shapeClasses} ${className}`}
      style={style}
    />
  );
};

// Componentes predefinidos comunes
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ 
  lines = 3, 
  className = '' 
}) => (
  <Skeleton lines={lines} height="1rem" className={className} />
);

export const SkeletonButton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <Skeleton width="6rem" height="2.5rem" className={className} />
);

export const SkeletonAvatar: React.FC<{ size?: number; className?: string }> = ({ 
  size = 40, 
  className = '' 
}) => (
  <Skeleton width={size} height={size} circle className={className} />
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`p-4 border border-gray-200 rounded-lg ${className}`}>
    <div className="space-y-3">
      <Skeleton height="1.5rem" width="60%" />
      <SkeletonText lines={2} />
      <div className="flex justify-between items-center">
        <Skeleton width="4rem" height="2rem" />
        <SkeletonButton />
      </div>
    </div>
  </div>
);

export default Skeleton;