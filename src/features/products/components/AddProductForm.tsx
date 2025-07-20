// features/products/components/AddProductForm.tsx

import React, { useState, useEffect } from 'react';
import { X, Plus, Package, Calendar, Euro, Hash } from 'lucide-react';
import { PRODUCT_CATEGORIES as CATEGORIES } from '@shared/utils/constants';
import { formatCategory, capitalize } from '@shared/utils/formatters';
import { getCurrentDate } from '@shared/utils/dateUtils';
import { Button } from '@shared/components/ui';

interface NewProduct {
  name: string;
  category: string;
  expiryDate: string;
  quantity: number;
  price: string;
}

interface AddProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: NewProduct) => void;
  initialProduct?: Partial<NewProduct>;
  isLoading?: boolean;
}

const AddProductForm: React.FC<AddProductFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialProduct,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<NewProduct>({
    name: '',
    category: CATEGORIES[0],
    expiryDate: '',
    quantity: 1,
    price: ''
  });

  const [errors, setErrors] = useState<Partial<NewProduct>>({});

  // Inicializar formulario con datos existentes (para edición)
  useEffect(() => {
    if (initialProduct) {
      setFormData({
        name: initialProduct.name || '',
        category: initialProduct.category || CATEGORIES[0],
        expiryDate: initialProduct.expiryDate || '',
        quantity: initialProduct.quantity || 1,
        price: initialProduct.price || ''
      });
    }
  }, [initialProduct]);

  // Resetear formulario cuando se abre
  useEffect(() => {
    if (isOpen && !initialProduct) {
      setFormData({
        name: '',
        category: CATEGORIES[0],
        expiryDate: '',
        quantity: 1,
        price: ''
      });
      setErrors({});
    }
  }, [isOpen, initialProduct]);

  const validateForm = (): boolean => {
    const newErrors: Partial<NewProduct> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = 'La fecha de vencimiento es requerida';
    } else {
      const selectedDate = new Date(formData.expiryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        // Permitir fechas pasadas pero mostrar advertencia
        console.warn('Fecha de vencimiento en el pasado');
      }
    }

    if (formData.quantity < 1) {
      newErrors.quantity = 'La cantidad debe ser mayor a 0';
    }

    const priceNum = parseFloat(formData.price);
    if (formData.price && (isNaN(priceNum) || priceNum < 0)) {
      newErrors.price = 'El precio debe ser un número válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof NewProduct, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // Sugerir fecha de vencimiento basada en categoría
  const getSuggestedExpiryDate = (category: string): string => {
    const today = new Date();
    let daysToAdd = 7; // Default: 1 semana

    const categoryDays: { [key: string]: number } = {
      'frutas': 5,
      'verduras': 7,
      'lácteos': 7,
      'carne': 3,
      'pescado': 2,
      'pan': 3,
      'conservas': 365,
      'congelados': 90,
      'huevos': 21,
      'otros': 14
    };

    daysToAdd = categoryDays[category] || 7;
    
    const suggestedDate = new Date(today);
    suggestedDate.setDate(today.getDate() + daysToAdd);
    
    return suggestedDate.toISOString().split('T')[0];
  };

  const handleCategoryChange = (category: string) => {
    handleInputChange('category', category);
    
    // Auto-sugerir fecha si no hay una seleccionada
    if (!formData.expiryDate) {
      const suggestedDate = getSuggestedExpiryDate(category);
      handleInputChange('expiryDate', suggestedDate);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="w-6 h-6 text-green-600" />
            {initialProduct ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nombre del producto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Package className="w-4 h-4 inline mr-1" />
              Nombre del producto *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej: Tomates cherry, Leche entera, Pan de molde..."
              autoFocus
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Categoría y Cantidad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>
                    {formatCategory(cat)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Hash className="w-4 h-4 inline mr-1" />
                Cantidad *
              </label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.quantity ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.quantity && (
                <p className="text-red-600 text-sm mt-1">{errors.quantity}</p>
              )}
            </div>
          </div>

          {/* Fecha de vencimiento y Precio */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Fecha de vencimiento *
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                min={getCurrentDate()}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.expiryDate && (
                <p className="text-red-600 text-sm mt-1">{errors.expiryDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Euro className="w-4 h-4 inline mr-1" />
                Precio aprox. (€)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Opcional"
              />
              {errors.price && (
                <p className="text-red-600 text-sm mt-1">{errors.price}</p>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              loading={isLoading}
              className="flex-1"
              variant="primary"
            >
              <Plus className="w-4 h-4" />
              {initialProduct ? 'Actualizar' : 'Agregar'} Producto
            </Button>
            
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </div>
        </form>

        {/* Tips */}
        <div className="bg-green-50 border-t p-4">
          <h4 className="font-medium text-green-800 mb-2">💡 Consejos:</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Añade el precio para calcular tus ahorros</li>
            <li>• La fecha sugerida se basa en la categoría seleccionada</li>
            <li>• Puedes agregar productos ya vencidos para hacer seguimiento</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddProductForm;
