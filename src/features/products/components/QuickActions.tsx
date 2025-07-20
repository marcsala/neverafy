// features/products/components/QuickActions.tsx

import React from 'react';
import { Plus, Camera, Grid, List, MoreHorizontal, Download, Upload } from 'lucide-react';
import { Button } from '../../../shared/components/ui';

interface QuickActionsProps {
  onAddProduct: () => void;
  onUseCamera: () => void;
  onViewModeChange: (mode: 'grid' | 'list' | 'compact') => void;
  viewMode: 'grid' | 'list' | 'compact';
  onExport?: () => void;
  onImport?: () => void;
  isPremium: boolean;
  userStats: {
    ocrUsed: number;
  };
  productCount: number;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onAddProduct,
  onUseCamera,
  onViewModeChange,
  viewMode,
  onExport,
  onImport,
  isPremium,
  userStats,
  productCount
}) => {
  const viewModeButtons = [
    { mode: 'list' as const, icon: List, label: 'Lista', description: 'Vista detallada' },
    { mode: 'grid' as const, icon: Grid, label: 'Grid', description: 'Vista en cuadrícula' },
    { mode: 'compact' as const, icon: MoreHorizontal, label: 'Compacta', description: 'Vista compacta' }
  ];

  const cameraDisabled = !isPremium && userStats.ocrUsed >= 1;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Acciones principales */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={onAddProduct}
            variant="primary"
            className="flex items-center gap-2"
          >
            <Plus size={18} />
            Agregar Manual
          </Button>

          <Button
            onClick={onUseCamera}
            variant={cameraDisabled ? "secondary" : "primary"}
            disabled={cameraDisabled}
            className="flex items-center gap-2"
          >
            <Camera size={18} />
            Usar Cámara
            {cameraDisabled && (
              <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full ml-1">
                Límite
              </span>
            )}
          </Button>

          {/* Acciones adicionales */}
          {productCount > 0 && (
            <div className="flex gap-2">
              {onExport && (
                <Button
                  onClick={onExport}
                  variant="secondary"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Download size={16} />
                  Exportar
                </Button>
              )}

              {onImport && (
                <Button
                  onClick={onImport}
                  variant="secondary"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Upload size={16} />
                  Importar
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Selector de vista */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 hidden sm:inline">Vista:</span>
          <div className="flex bg-gray-100 rounded-lg p-1">
            {viewModeButtons.map(({ mode, icon: Icon, label, description }) => (
              <button
                key={mode}
                onClick={() => onViewModeChange(mode)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === mode
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
                title={description}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-4 flex flex-wrap items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-4">
          <span>📦 {productCount} productos total</span>
          {!isPremium && (
            <span className="text-blue-600">
              📸 OCR: {userStats.ocrUsed}/1 usado este mes
            </span>
          )}
        </div>

        {cameraDisabled && (
          <div className="text-orange-600 text-xs">
            💡 Actualiza a Premium para OCR ilimitado
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickActions;
