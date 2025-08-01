// features/recipes/components/RecipeGenerator.tsx

import React, { useState } from 'react';
import { Sparkles, Loader2, ChefHat, Crown, AlertTriangle, Zap } from 'lucide-react';
import { Button } from '../../../shared/components/ui';
import { getDaysToExpiry } from '../../../shared/utils/dateUtils';
import { FREEMIUM_LIMITS } from '../../../shared/utils/constants';

interface Product {
  id: string;
  name: string;
  category: string;
  expiryDate: string;
  quantity: number;
}

interface RecipeGeneratorProps {
  products: Product[];
  isPremium: boolean;
  userStats: {
    recipesGenerated: number;
  };
  onGenerateRecipes: (products: Product[]) => Promise<any[]>;
  onUpgradeToPremium?: () => void;
  isGenerating: boolean;
}

const RecipeGenerator: React.FC<RecipeGeneratorProps> = ({
  products,
  isPremium,
  userStats,
  onGenerateRecipes,
  onUpgradeToPremium,
  isGenerating
}) => {
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [cuisineType, setCuisineType] = useState('any');
  const [mealType, setMealType] = useState('any');

  const urgentProducts = products.filter(p => getDaysToExpiry(p.expiryDate) <= 3);
  const limitReached = !isPremium && userStats.recipesGenerated >= FREEMIUM_LIMITS.RECIPES_MONTHLY;
  const usagePercentage = isPremium ? 0 : (userStats.recipesGenerated / FREEMIUM_LIMITS.RECIPES_MONTHLY) * 100;

  const toggleProductSelection = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const selectAllUrgent = () => {
    const urgentIds = urgentProducts.map(p => p.id);
    setSelectedProducts(new Set(urgentIds));
  };

  const clearSelection = () => {
    setSelectedProducts(new Set());
  };

  const handleGenerate = async () => {
    if (selectedProducts.size === 0) {
      alert('Selecciona al menos un producto para generar recetas.');
      return;
    }

    const productsToUse = products.filter(p => selectedProducts.has(p.id));
    await onGenerateRecipes(productsToUse);
  };

  const dietaryOptions = [
    { value: 'vegetarian', label: 'Vegetariano' },
    { value: 'vegan', label: 'Vegano' },
    { value: 'gluten-free', label: 'Sin gluten' },
    { value: 'dairy-free', label: 'Sin lácteos' },
    { value: 'low-carb', label: 'Bajo en carbohidratos' },
    { value: 'keto', label: 'Keto' }
  ];

  const cuisineOptions = [
    { value: 'any', label: 'Cualquier cocina' },
    { value: 'mediterranean', label: 'Mediterránea' },
    { value: 'asian', label: 'Asiática' },
    { value: 'mexican', label: 'Mexicana' },
    { value: 'italian', label: 'Italiana' },
    { value: 'spanish', label: 'Española' },
    { value: 'indian', label: 'India' }
  ];

  const mealOptions = [
    { value: 'any', label: 'Cualquier comida' },
    { value: 'breakfast', label: 'Desayuno' },
    { value: 'lunch', label: 'Almuerzo' },
    { value: 'dinner', label: 'Cena' },
    { value: 'snack', label: 'Merienda' },
    { value: 'dessert', label: 'Postre' }
  ];

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          No hay productos para generar recetas
        </h3>
        <p className="text-gray-500">
          Agrega algunos productos a tu nevera para ver sugerencias de recetas personalizadas.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-purple-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Generador de Recetas IA</h2>
            <p className="text-gray-600">Recetas personalizadas con Claude AI</p>
          </div>
        </div>
        
        <div className="text-right">
          {isPremium ? (
            <div className="flex items-center gap-2 text-purple-600">
              <Crown className="w-5 h-5" />
              <span className="font-medium">Recetas ilimitadas</span>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-600">
                {userStats.recipesGenerated}/{FREEMIUM_LIMITS.RECIPES_MONTHLY} recetas usadas este mes
              </p>
              <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    usagePercentage >= 100 ? 'bg-red-500' : 
                    usagePercentage >= 80 ? 'bg-orange-500' : 'bg-purple-500'
                  }`}
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Banner de límite */}
      {limitReached && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
            <div className="flex-1">
              <h4 className="font-medium text-orange-800">
                Límite mensual alcanzado
              </h4>
              <p className="text-sm text-orange-700">
                Has usado todas tus generaciones de recetas gratuitas este mes.
                {onUpgradeToPremium && ' Actualiza a Premium para recetas ilimitadas.'}
              </p>
            </div>
            {/* 🍋 BOTÓN DIRECTO LEMONSQUEEZY */}
            <a 
              href="https://neverafy.lemonsqueezy.com/buy/0d8fe582-01f6-4766-9075-44bbf46780e4"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium px-3 py-2 rounded-lg transition-all duration-200 text-sm"
            >
              Ver Premium
            </a>
          </div>
        </div>
      )}

      {/* Productos urgentes destacados */}
      {urgentProducts.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-orange-800 flex items-center gap-2">
              🚨 Productos que vencen pronto ({urgentProducts.length})
            </h4>
            <Button
              onClick={selectAllUrgent}
              variant="secondary"
              size="sm"
            >
              Seleccionar todos
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {urgentProducts.map(product => {
              const daysLeft = getDaysToExpiry(product.expiryDate);
              return (
                <button
                  key={product.id}
                  onClick={() => toggleProductSelection(product.id)}
                  className={`p-3 rounded-lg text-left transition-all ${
                    selectedProducts.has(product.id)
                      ? 'bg-orange-200 border-2 border-orange-400'
                      : 'bg-orange-100 border border-orange-200 hover:bg-orange-150'
                  }`}
                >
                  <div className="font-medium text-orange-800 text-sm">
                    {product.name}
                  </div>
                  <div className="text-xs text-orange-600">
                    {daysLeft === 0 ? 'Vence hoy' : 
                     daysLeft === 1 ? 'Vence mañana' : 
                     `${daysLeft} días`}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selección de productos */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">
            Selecciona productos para tu receta ({selectedProducts.size} seleccionados)
          </h3>
          <Button
            onClick={clearSelection}
            variant="secondary"
            size="sm"
            disabled={selectedProducts.size === 0}
          >
            Limpiar selección
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-64 overflow-y-auto">
          {products.map(product => {
            const daysLeft = getDaysToExpiry(product.expiryDate);
            const isUrgent = daysLeft <= 3;
            
            return (
              <button
                key={product.id}
                onClick={() => toggleProductSelection(product.id)}
                className={`p-3 rounded-lg text-left transition-all ${
                  selectedProducts.has(product.id)
                    ? 'bg-green-100 border-2 border-green-400'
                    : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="font-medium text-gray-800 text-sm truncate">
                    {product.name}
                  </div>
                  {isUrgent && <span className="text-orange-500 text-xs">⚠️</span>}
                </div>
                <div className="text-xs text-gray-600 capitalize">
                  {product.category}
                </div>
                <div className={`text-xs ${
                  daysLeft <= 1 ? 'text-red-600' :
                  daysLeft <= 3 ? 'text-orange-600' : 'text-green-600'
                }`}>
                  {daysLeft <= 0 ? 'Vencido' :
                   daysLeft === 1 ? 'Vence mañana' :
                   `${daysLeft} días`}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Preferencias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de cocina
          </label>
          <select
            value={cuisineType}
            onChange={(e) => setCuisineType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {cuisineOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de comida
          </label>
          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {mealOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Restricciones dietéticas
          </label>
          <div className="space-y-1 max-h-20 overflow-y-auto">
            {dietaryOptions.map(option => (
              <label key={option.value} className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={dietaryRestrictions.includes(option.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setDietaryRestrictions([...dietaryRestrictions, option.value]);
                    } else {
                      setDietaryRestrictions(dietaryRestrictions.filter(r => r !== option.value));
                    }
                  }}
                  className="mr-2 rounded"
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Botón generar */}
      <div className="text-center">
        <Button
          onClick={handleGenerate}
          disabled={limitReached || selectedProducts.size === 0 || isGenerating}
          loading={isGenerating}
          variant="primary"
          size="lg"
          className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generando recetas mágicas...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Generar Recetas con IA
            </>
          )}
        </Button>
        
        {!limitReached && selectedProducts.size > 0 && (
          <p className="text-sm text-gray-500 mt-2">
            Se generarán 2-3 recetas personalizadas con tus productos seleccionados
          </p>
        )}
      </div>

      {/* Información para usuarios gratuitos */}
      {!isPremium && (
        <div className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-start gap-3">
            <Crown className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h4 className="font-semibold text-purple-800 mb-2">
                ¿Quieres más recetas personalizadas?
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-purple-700 mb-4">
                <div className="flex items-center gap-2">
                  <span>✅</span>
                  <span>Recetas ilimitadas</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🎯</span>
                  <span>Más personalizadas</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🍳</span>
                  <span>Recetas exclusivas</span>
                </div>
              </div>
              {/* 🍋 BOTÓN DIRECTO LEMONSQUEEZY */}
              <a 
                href="https://neverafy.lemonsqueezy.com/buy/0d8fe582-01f6-4766-9075-44bbf46780e4"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                <Crown className="w-4 h-4" />
                Actualizar a Premium
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeGenerator;
