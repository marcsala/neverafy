import React from 'react';

interface AppFooterProps {
  userStats: {
    co2Saved: number;
    totalSaved: number;
    level: number;
    ocrUsed: number;
    recipesGenerated: number;
  };
}

const AppFooter: React.FC<AppFooterProps> = ({ userStats }) => {
  return (
    <div className="text-center mt-8 text-gray-500">
      <p className="mb-2">Neverafy v1.0 | Nunca más desperdicies 🇪🇸</p>
      <div className="flex justify-center gap-4 text-sm flex-wrap">
        <span>🌍 {userStats.co2Saved.toFixed(1)}kg CO2 ahorrado</span>
        <span>💰 {userStats.totalSaved.toFixed(1)}€ ahorrado</span>
        <span>⭐ Nivel {userStats.level}</span>
        <span>📸 {userStats.ocrUsed} análisis OCR</span>
        <span>🍳 {userStats.recipesGenerated} recetas IA</span>
      </div>
      <div className="mt-3 text-xs text-gray-400">
        <p>Desarrollado con ❤️ en España | Powered by Claude AI</p>
      </div>
    </div>
  );
};

export default AppFooter;