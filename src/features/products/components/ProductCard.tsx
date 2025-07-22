// features/products/components/ProductCard.tsx

import React from 'react';
import { CheckCircle, Trash2, Clock, Package2, Euro } from 'lucide-react';
import { getDaysToExpiry, getAlertColor, getExpiryStatusText, formatExpiryDate } from '@/shared/utils/dateUtils';
import { formatPrice, formatCategory } from '@/shared/utils/formatters';

interface Product {
  id: string;
  name: string;
  category: string;
  expiryDate: string;
  quantity: number;
  price?: number;
  source?: string;
  confidence?: number;
  addedDate?: string;
}

interface ProductCardProps {
  product: Product;
  onMarkAsConsumed: (product: Product, wasConsumed: boolean) => void;
  onRemove: (id: string) => void;
  onEdit?: (product: Product) => void;
  compact?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onMarkAsConsumed,
  onRemove,
  onEdit,
  compact = false
}) => {
  const daysToExpiry = getDaysToExpiry(product.expiryDate);
  const alertColor = getAlertColor(daysToExpiry);
  const expiryStatus = getExpiryStatusText(product.expiryDate);

  const handleMarkAsConsumed = () => {
    onMarkAsConsumed(product, true);
  };

  const handleMarkAsWasted = () => {
    onMarkAsConsumed(product, false);
  };

  const getUrgencyIcon = () => {
    if (daysToExpiry < 0) return '🚨';
    if (daysToExpiry === 0) return '⚡';
    if (daysToExpiry <= 1) return '⏰';
    if (daysToExpiry <= 3) return '📅';
    return '✅';
  };

  const getPriorityClass = () => {
    if (daysToExpiry < 0) return 'ring-2 ring-red-500';
    if (daysToExpiry <= 1) return 'ring-2 ring-orange-500';
    return '';
  };

  if (compact) {
    return (
      <div className={`${alertColor} border rounded-lg p-3 ${getPriorityClass()}`}>
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-lg">{getUrgencyIcon()}</span>
              <h4 className="font-medium text-gray-800 truncate">{product.name}</h4>
              {product.source === 'ocr' && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  📸
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">{expiryStatus}</p>
          </div>
          <div className="flex gap-1 ml-2">
            <button
              onClick={handleMarkAsConsumed}
              className="text-green-600 hover:text-green-800 transition-colors p-1"
              title="Marcar como consumido"
            >
              <CheckCircle size={16} />
            </button>
            <button
              onClick={() => onRemove(product.id)}
              className="text-red-600 hover:text-red-800 transition-colors p-1"
              title="Eliminar"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${alertColor} border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow ${getPriorityClass()}`}>
      <div className="flex justify-between items-start gap-4">
        {/* Información principal */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{getUrgencyIcon()}</span>
            <h4 className="font-semibold text-gray-800 text-lg">{product.name}</h4>
            {product.source === 'ocr' && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                📸 OCR
                {product.confidence && (
                  <span className="text-blue-600">
                    {Math.round(product.confidence * 100)}%
                  </span>
                )}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mb-3">
            <div className="flex items-center gap-2 text-gray-600">
              <Package2 className="w-4 h-4" />
              <span>{formatCategory(product.category)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Cantidad: {product.quantity}</span>
            </div>
            
            {product.price !== undefined && product.price > 0 && (
              <div className="flex items-center gap-2 text-gray-600">
                <Euro className="w-4 h-4" />
                <span>Valor: {formatPrice(product.price)}</span>
              </div>
            )}
          </div>

          {product.addedDate && (
            <div className="text-xs text-gray-500 mb-2">
              Añadido: {formatExpiryDate(product.addedDate)}
            </div>
          )}
        </div>

        {/* Información de vencimiento */}
        <div className="text-right flex-shrink-0">
          <p className="text-sm text-gray-600 mb-1">
            Vence: {formatExpiryDate(product.expiryDate)}
          </p>
          <p className={`text-sm font-bold mb-3 ${
            daysToExpiry < 0 ? 'text-red-600' : 
            daysToExpiry <= 1 ? 'text-orange-600' : 
            daysToExpiry <= 3 ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {expiryStatus}
          </p>

          {/* Acciones */}
          <div className="flex flex-col gap-2">
            <button
              onClick={handleMarkAsConsumed}
              className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded-lg transition-colors flex items-center gap-1 justify-center"
              title="Marcar como consumido"
            >
              <CheckCircle size={14} />
              Consumido
            </button>
            
            <div className="flex gap-1">
              <button
                onClick={handleMarkAsWasted}
                className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-2 py-1 rounded transition-colors flex items-center gap-1"
                title="Marcar como desperdiciado"
              >
                🗑️
              </button>
              
              {onEdit && (
                <button
                  onClick={() => onEdit(product)}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded transition-colors"
                  title="Editar producto"
                >
                  ✏️
                </button>
              )}
              
              <button
                onClick={() => onRemove(product.id)}
                className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded transition-colors"
                title="Eliminar producto"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
