// =================================
// Main Action Buttons Component
// =================================

import React from 'react';

interface MainActionButtonsProps {
  onAddProduct: () => void;
  onGenerateRecipes: () => void;
  onScanProduct?: () => void;
  isMobile?: boolean;
  showRecipesCount?: number;
}

const MainActionButtons: React.FC<MainActionButtonsProps> = ({
  onAddProduct,
  onGenerateRecipes,
  onScanProduct,
  isMobile = false,
  showRecipesCount = 0
}) => {
  return (
    <div className={`space-y-4 ${isMobile ? 'px-4' : ''}`}>
      {/* Botón principal: Añadir producto */}
      <button
        onClick={onAddProduct}
        className={`w-full bg-blue-600 text-white rounded-xl font-medium flex items-center justify-center gap-3 hover:bg-blue-700 transition-colors ${
          isMobile ? 'h-12' : 'h-14'
        }`}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Añadir producto
      </button>

      {/* Botón de Recetas IA */}
      <button
        onClick={onGenerateRecipes}
        className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium flex items-center justify-center gap-3 hover:from-purple-700 hover:to-pink-700 transition-colors ${
          isMobile ? 'h-12' : 'h-14'
        }`}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        <span>
          Generar Recetas IA ✨
          {showRecipesCount > 0 && (
            <span className="ml-1 text-xs opacity-90">
              ({showRecipesCount} ingredientes)
            </span>
          )}
        </span>
      </button>

      {/* Botón de escanear (opcional) */}
      {onScanProduct && (
        <button
          onClick={onScanProduct}
          className={`w-full bg-gray-100 text-gray-700 rounded-xl font-medium flex items-center justify-center gap-3 hover:bg-gray-200 transition-colors ${
            isMobile ? 'h-12' : 'h-14'
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
          Escanear con cámara
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
            Próximamente
          </span>
        </button>
      )}
    </div>
  );
};

export default MainActionButtons;
