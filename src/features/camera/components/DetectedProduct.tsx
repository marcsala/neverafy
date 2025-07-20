// features/camera/components/DetectedProduct.tsx

import React, { useState } from 'react';
import { Plus, Package, Calendar, DollarSign, Eye, Edit3, Check, X } from 'lucide-react';
import { getDaysToExpiry, getAlertColor, getExpiryStatusText, formatExpiryDate } from '../../../shared/utils/dateUtils';
import { formatPrice, formatConfidence, formatCategory } from '../../../shared/utils/formatters';
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

interface DetectedProductProps {
  product: DetectedProductData;
  onAdd: (product: DetectedProductData) => void;
  onEdit?: (product: DetectedProductData) => void;
  isAdding?: boolean;
  showConfidence?: boolean;
  compact?: boolean;
}

const DetectedProduct: React.FC<DetectedProductProps> = ({
  product,
  onAdd,
  onEdit,
  isAdding = false,
  showConfidence = true,
  compact = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(product);
  const [isAdded, setIsAdded] = useState(false);

  const daysToExpiry = getDaysToExpiry(product.expiryDate);
  const alertColor = getAlertColor(daysToExpiry);
  const expiryStatus = getExpiryStatusText(daysToExpiry);

  const getUrgencyIcon = () => {
    if (daysToExpiry < 0) return '🚨';
    if (daysToExpiry === 0) return '⚡';
    if (daysToExpiry <= 1) return '⏰';
    if (daysToExpiry <= 3) return '📅';
    return '✅';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const handleAdd = async () => {
    setIsAdded(true);
    await onAdd(isEditing ? editedProduct : product);
  };

  const handleEdit = () => {
    if (isEditing) {
      // Guardar cambios
      setIsEditing(false);
      if (onEdit) {
        onEdit(editedProduct);
      }
    } else {
      // Activar modo edición
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedProduct(product);
  };

  const productToDisplay = isEditing ? editedProduct : product;

  if (compact) {
    return (
      <div className={`${alertColor} border rounded-lg p-3 ${isAdded ? 'opacity-60' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-lg">{getUrgencyIcon()}</span>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-800 truncate">{productToDisplay.name}</h4>
              <p className="text-sm text-gray-600">{expiryStatus}</p>
            </div>
          </div>
          
          <div className="flex gap-1 ml-2">
            {showConfidence && (
              <span className={`text-xs px-2 py-1 rounded-full ${getConfidenceColor(product.confidence)}`}>
                {formatConfidence(product.confidence)}
              </span>
            )}
            
            <Button
              onClick={handleAdd}
              disabled={isAdding || isAdded}
              size="sm"
              variant={isAdded ? "success" : "primary"}
            >
              {isAdded ? <Check size={14} /> : <Plus size={14} />}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${alertColor} border rounded-lg p-6 shadow-sm hover:shadow-md transition-all ${
      isAdded ? 'opacity-75 bg-green-50' : ''
    }`}>
      <div className="space-y-4">
        {/* Header con nombre y confianza */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <span className="text-2xl">{getUrgencyIcon()}</span>
            
            {isEditing ? (
              <input
                type="text"
                value={editedProduct.name}
                onChange={(e) => setEditedProduct(prev => ({ ...prev, name: e.target.value }))}
                className="flex-1 text-lg font-bold text-gray-800 border-b border-gray-300 focus:border-green-500 outline-none bg-transparent"
              />
            ) : (
              <h4 className="text-lg font-bold text-gray-800">{productToDisplay.name}</h4>
            )}
          </div>

          <div className="flex items-center gap-2">
            {showConfidence && (
              <span className={`text-xs px-2 py-1 rounded-full ${getConfidenceColor(product.confidence)}`}>
                <Eye size={12} className="inline mr-1" />
                {formatConfidence(product.confidence)}
              </span>
            )}
            
            {isAdded && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                ✅ Añadido
              </span>
            )}
          </div>
        </div>

        {/* Información del producto */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Package className="w-4 h-4" />
            {isEditing ? (
              <select
                value={editedProduct.category}
                onChange={(e) => setEditedProduct(prev => ({ ...prev, category: e.target.value }))}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="frutas">Frutas</option>
                <option value="verduras">Verduras</option>
                <option value="lácteos">Lácteos</option>
                <option value="carne">Carne</option>
                <option value="pescado">Pescado</option>
                <option value="pan">Pan</option>
                <option value="conservas">Conservas</option>
                <option value="otros">Otros</option>
              </select>
            ) : (
              <span>{formatCategory(productToDisplay.category)}</span>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            {isEditing ? (
              <input
                type="date"
                value={editedProduct.expiryDate}
                onChange={(e) => setEditedProduct(prev => ({ ...prev, expiryDate: e.target.value }))}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              />
            ) : (
              <span>Vence: {formatExpiryDate(productToDisplay.expiryDate)}</span>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <DollarSign className="w-4 h-4" />
            {isEditing ? (
              <input
                type="number"
                step="0.01"
                value={editedProduct.estimatedPrice}
                onChange={(e) => setEditedProduct(prev => ({ ...prev, estimatedPrice: parseFloat(e.target.value) || 0 }))}
                className="border border-gray-300 rounded px-2 py-1 text-sm w-20"
              />
            ) : (
              <span>~{formatPrice(productToDisplay.estimatedPrice)}</span>
            )}
          </div>
        </div>

        {/* Estado de vencimiento */}
        <div className={`text-sm font-medium ${
          daysToExpiry < 0 ? 'text-red-600' :
          daysToExpiry <= 1 ? 'text-orange-600' :
          daysToExpiry <= 3 ? 'text-yellow-600' : 'text-green-600'
        }`}>
          {expiryStatus}
        </div>

        {/* Texto detectado */}
        {product.detectedText && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <h5 className="text-xs font-medium text-gray-700 mb-1">Texto detectado:</h5>
            <p className="text-xs text-gray-600 italic">"{product.detectedText}"</p>
          </div>
        )}

        {/* Acciones */}
        <div className="flex gap-2 justify-end">
          {isEditing ? (
            <>
              <Button
                onClick={handleCancelEdit}
                variant="secondary"
                size="sm"
              >
                <X size={16} />
                Cancelar
              </Button>
              <Button
                onClick={handleEdit}
                variant="primary"
                size="sm"
              >
                <Check size={16} />
                Guardar
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleEdit}
                variant="secondary"
                size="sm"
                disabled={isAdded}
              >
                <Edit3 size={16} />
                Editar
              </Button>
              <Button
                onClick={handleAdd}
                disabled={isAdding || isAdded}
                variant={isAdded ? "success" : "primary"}
                loading={isAdding}
              >
                {isAdded ? (
                  <>
                    <Check size={16} />
                    Añadido
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    Añadir a Nevera
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetectedProduct;
