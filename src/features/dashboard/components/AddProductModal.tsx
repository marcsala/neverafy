// =================================
// Add Product Modal Component
// =================================

import React, { useState } from 'react';
import type { ProductFormData } from '../types';
import { validateProductForm, getTodayDate, estimatePrice } from '../utils';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => void;
  loading?: boolean;
  isMobile?: boolean;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  isMobile = false
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    expiryDate: '',
    quantity: '',
    category: 'general',
    price: undefined // 🆕 Campo precio
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [showPriceEstimate, setShowPriceEstimate] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateProductForm(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setErrors([]);
    onSubmit(formData);
    
    // Limpiar formulario
    setFormData({
      name: '',
      expiryDate: '',
      quantity: '',
      category: 'general',
      price: undefined
    });
    setShowPriceEstimate(false);
  };

  const handleChange = (field: keyof ProductFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 🆕 Auto-estimar precio si el nombre cambia y no hay precio manual
    if (field === 'name' && typeof value === 'string' && value.length > 2) {
      if (!formData.price) {
        const estimated = estimatePrice(value);
        setShowPriceEstimate(true);
        // No auto-asignar, solo mostrar sugerencia
      }
    }
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handlePriceEstimate = () => {
    if (formData.name) {
      const estimated = estimatePrice(formData.name);
      setFormData(prev => ({ ...prev, price: estimated }));
      setShowPriceEstimate(false);
    }
  };

  if (!isOpen) return null;

  const estimatedPrice = formData.name ? estimatePrice(formData.name) : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-end md:items-center justify-center z-50">
      <div className={`bg-white w-full max-w-md max-h-[80vh] overflow-y-auto ${
        isMobile ? 'rounded-t-3xl' : 'rounded-3xl'
      }`}>
        {/* Header */}
        <div className="p-6 text-center relative">
          {isMobile && (
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-5"></div>
          )}
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Añadir producto
          </h3>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
            disabled={loading}
          >
            ×
          </button>
        </div>
        
        {/* Form */}
        <div className="px-6 pb-6">
          {errors.length > 0 && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-red-600 text-sm font-medium mb-1">
                Por favor corrige los siguientes errores:
              </div>
              <ul className="text-red-600 text-sm list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre del producto */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre del producto
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full h-13 border border-gray-300 rounded-xl px-4 text-base bg-white focus:outline-none focus:border-blue-600 transition-colors"
                style={{ height: '52px' }}
                placeholder="Ej: Leche, Tomates, Yogurt..."
                disabled={loading}
                required
              />
            </div>
            
            {/* 🆕 Campo de precio con estimación */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Precio (opcional)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="9999"
                  value={formData.price || ''}
                  onChange={(e) => handleChange('price', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full h-13 border border-gray-300 rounded-xl px-4 pr-12 text-base bg-white focus:outline-none focus:border-blue-600 transition-colors"
                  style={{ height: '52px' }}
                  placeholder="Ej: 2.50"
                  disabled={loading}
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  €
                </span>
              </div>
              
              {/* Sugerencia de precio */}
              {showPriceEstimate && formData.name && !formData.price && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-blue-700">
                      Precio estimado: <span className="font-semibold">{estimatedPrice.toFixed(2)}€</span>
                    </div>
                    <button
                      type="button"
                      onClick={handlePriceEstimate}
                      className="text-xs bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Usar
                    </button>
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    Basado en productos similares
                  </div>
                </div>
              )}
            </div>

            {/* Fecha de caducidad */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Fecha de caducidad
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => handleChange('expiryDate', e.target.value)}
                min={getTodayDate()}
                className="w-full h-13 border border-gray-300 rounded-xl px-4 text-base bg-white focus:outline-none focus:border-blue-600 transition-colors"
                style={{ height: '52px' }}
                disabled={loading}
                required
              />
            </div>
            
            {/* Cantidad */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cantidad
              </label>
              <input
                type="text"
                value={formData.quantity}
                onChange={(e) => handleChange('quantity', e.target.value)}
                className="w-full h-13 border border-gray-300 rounded-xl px-4 text-base bg-white focus:outline-none focus:border-blue-600 transition-colors"
                style={{ height: '52px' }}
                placeholder="Ej: 1 litro, 500g, 6 unidades..."
                disabled={loading}
                required
              />
            </div>
            
            {/* Categoría */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Categoría
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full h-13 border border-gray-300 rounded-xl px-4 text-base bg-white focus:outline-none focus:border-blue-600 transition-colors"
                style={{ height: '52px' }}
                disabled={loading}
              >
                <option value="general">General</option>
                <option value="lacteos">Lácteos</option>
                <option value="carnes">Carnes</option>
                <option value="verduras">Verduras</option>
                <option value="frutas">Frutas</option>
                <option value="conservas">Conservas</option>
                <option value="bebidas">Bebidas</option>
              </select>
            </div>
            
            {/* Botón de envío */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-13 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ height: '52px' }}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Añadiendo...
                </div>
              ) : (
                'Añadir a nevera'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
