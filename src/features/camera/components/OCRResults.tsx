// features/camera/components/OCRResults.tsx

import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, RefreshCw, Plus, Filter, Grid, List, MoreHorizontal } from 'lucide-react';
import DetectedProduct from './DetectedProduct';
import { Button } from '../../../shared/components/ui';

interface DetectedProductData {
  name: string;
  category: string;
  expiryDate: string;
  estimatedPrice: number;
  confidence: number;
  detectedText?: string;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface OCRResultsData {
  success: boolean;
  message: string;
  products: DetectedProductData[];
  confidence?: number;
  processingTime?: number;
  rawText?: string;
}

interface OCRResultsProps {
  results: OCRResultsData;
  onAddProduct: (product: DetectedProductData) => void;
  onAddAllProducts: () => void;
  onRetryAnalysis: () => void;
  isAddingProduct?: boolean;
  showRawData?: boolean;
}

const OCRResults: React.FC<OCRResultsProps> = ({
  results,
  onAddProduct,
  onAddAllProducts,
  onRetryAnalysis,
  isAddingProduct = false,
  showRawData = false
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact'>('list');
  const [filterBy, setFilterBy] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [addedProducts, setAddedProducts] = useState<Set<string>>(new Set());
  const [showRawText, setShowRawText] = useState(false);

  const handleAddProduct = async (product: DetectedProductData) => {
    const productKey = `${product.name}-${product.expiryDate}`;
    setAddedProducts(prev => new Set([...prev, productKey]));
    await onAddProduct(product);
  };

  const handleAddAllVisible = async () => {
    const visibleProducts = getFilteredProducts();
    for (const product of visibleProducts) {
      const productKey = `${product.name}-${product.expiryDate}`;
      if (!addedProducts.has(productKey)) {
        setAddedProducts(prev => new Set([...prev, productKey]));
        await onAddProduct(product);
      }
    }
  };

  const getFilteredProducts = () => {
    if (!results.products) return [];
    
    return results.products.filter(product => {
      switch (filterBy) {
        case 'high':
          return product.confidence >= 0.8;
        case 'medium':
          return product.confidence >= 0.6 && product.confidence < 0.8;
        case 'low':
          return product.confidence < 0.6;
        default:
          return true;
      }
    });
  };

  const filteredProducts = getFilteredProducts();
  const confidenceStats = {
    high: results.products?.filter(p => p.confidence >= 0.8).length || 0,
    medium: results.products?.filter(p => p.confidence >= 0.6 && p.confidence < 0.8).length || 0,
    low: results.products?.filter(p => p.confidence < 0.6).length || 0
  };

  const viewModeOptions = [
    { mode: 'list' as const, icon: List, label: 'Lista' },
    { mode: 'grid' as const, icon: Grid, label: 'Grid' },
    { mode: 'compact' as const, icon: MoreHorizontal, label: 'Compacto' }
  ];

  const filterOptions = [
    { value: 'all', label: 'Todos', count: results.products?.length || 0 },
    { value: 'high', label: 'Alta confianza', count: confidenceStats.high },
    { value: 'medium', label: 'Media confianza', count: confidenceStats.medium },
    { value: 'low', label: 'Baja confianza', count: confidenceStats.low }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className={`px-6 py-4 border-b ${
        results.success ? 'bg-green-50' : 'bg-orange-50'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {results.success ? (
              <CheckCircle className="w-8 h-8 text-green-600" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            )}
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {results.success ? 'Productos Detectados' : 'Análisis Incompleto'}
              </h3>
              <p className="text-gray-600">{results.message}</p>
              {results.processingTime && (
                <p className="text-sm text-gray-500">
                  Procesado en {results.processingTime.toFixed(1)}s
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            {showRawData && results.rawText && (
              <Button
                onClick={() => setShowRawText(!showRawText)}
                variant="secondary"
                size="sm"
              >
                {showRawText ? 'Ocultar' : 'Ver'} texto raw
              </Button>
            )}
            
            <Button
              onClick={onRetryAnalysis}
              variant="secondary"
              size="sm"
            >
              <RefreshCw size={16} />
              Reintentar
            </Button>
          </div>
        </div>
      </div>

      {/* Controles */}
      {results.success && results.products && results.products.length > 0 && (
        <div className="px-6 py-4 border-b bg-gray-50">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Filtros */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Filtrar:</span>
              </div>
              
              <div className="flex gap-1">
                {filterOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setFilterBy(option.value as any)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      filterBy === option.value
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {option.label} ({option.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Vista y acciones */}
            <div className="flex items-center gap-4">
              <div className="flex bg-gray-200 rounded-lg p-1">
                {viewModeOptions.map(({ mode, icon: Icon, label }) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm transition-colors ${
                      viewMode === mode
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                    title={label}
                  >
                    <Icon size={16} />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>

              {filteredProducts.length > 1 && (
                <Button
                  onClick={handleAddAllVisible}
                  disabled={isAddingProduct}
                  size="sm"
                >
                  <Plus size={16} />
                  Añadir todos ({filteredProducts.length})
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Texto raw (si está habilitado) */}
      {showRawText && results.rawText && (
        <div className="px-6 py-4 border-b bg-gray-50">
          <h4 className="font-medium text-gray-800 mb-2">Texto extraído:</h4>
          <div className="bg-white border rounded-lg p-3 text-sm text-gray-600 font-mono max-h-32 overflow-y-auto">
            {results.rawText}
          </div>
        </div>
      )}

      {/* Resultados */}
      <div className="p-6">
        {results.success && results.products && results.products.length > 0 ? (
          <>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-8">
                <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">
                  No hay productos que coincidan con el filtro seleccionado.
                </p>
                <Button
                  onClick={() => setFilterBy('all')}
                  variant="secondary"
                  size="sm"
                  className="mt-3"
                >
                  Ver todos los productos
                </Button>
              </div>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 lg:grid-cols-2 gap-4'
                  : 'space-y-4'
              }>
                {filteredProducts.map((product, index) => (
                  <DetectedProduct
                    key={`${product.name}-${index}`}
                    product={product}
                    onAdd={handleAddProduct}
                    isAdding={isAddingProduct}
                    compact={viewMode === 'compact'}
                    showConfidence={true}
                  />
                ))}
              </div>
            )}

            {/* Estadísticas */}
            {results.products.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium text-gray-800 mb-3">Estadísticas del análisis:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-green-600">{confidenceStats.high}</div>
                    <div className="text-sm text-gray-600">Alta confianza</div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-yellow-600">{confidenceStats.medium}</div>
                    <div className="text-sm text-gray-600">Media confianza</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-red-600">{confidenceStats.low}</div>
                    <div className="text-sm text-gray-600">Baja confianza</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-blue-600">{results.products.length}</div>
                    <div className="text-sm text-gray-600">Total detectados</div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <AlertTriangle className="w-16 h-16 text-orange-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-800 mb-2">
              No se detectaron productos
            </h4>
            <p className="text-gray-600 mb-4">
              No se encontraron productos con fechas claras en esta imagen.
            </p>
            <div className="space-y-2 text-sm text-gray-500 mb-6">
              <p>💡 Consejos para mejorar el reconocimiento:</p>
              <ul className="text-left max-w-md mx-auto space-y-1">
                <li>• Asegúrate de que las fechas sean legibles</li>
                <li>• Usa buena iluminación</li>
                <li>• Enfoca bien la imagen</li>
                <li>• Evita sombras y reflejos</li>
              </ul>
            </div>
            <Button onClick={onRetryAnalysis} variant="primary">
              <RefreshCw size={16} />
              Intentar con otra imagen
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OCRResults;
