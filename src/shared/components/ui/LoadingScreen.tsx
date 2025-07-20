import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🥬</div>
        <div className="text-xl font-bold text-gray-800">Cargando Neverafy...</div>
      </div>
    </div>
  );
};

export default LoadingScreen;