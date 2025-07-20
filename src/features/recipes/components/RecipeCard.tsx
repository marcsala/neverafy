// features/recipes/components/RecipeCard.tsx

import React from 'react';
import { BookOpen, Timer, Award, Clock, Users, Sparkles, ChefHat } from 'lucide-react';
import { Button } from '../../../shared/components/ui';

interface Recipe {
  id?: string;
  name: string;
  description: string;
  difficulty: 'Fácil' | 'Medio' | 'Difícil';
  prepTime: string;
  cookTime?: string;
  servings?: number;
  ingredients: string[];
  steps: string[];
  tips?: string;
  nutrition?: string;
  category?: string;
  isAI?: boolean;
  urgency?: number;
  usedProducts?: string[];
}

interface RecipeCardProps {
  recipe: Recipe;
  onView: (recipe: Recipe) => void;
  onSave?: (recipe: Recipe) => void;
  onCook?: (recipe: Recipe) => void;
  compact?: boolean;
  showIngredients?: boolean;
  isSaved?: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onView,
  onSave,
  onCook,
  compact = false,
  showIngredients = true,
  isSaved = false
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil':
        return 'bg-green-100 text-green-800';
      case 'Medio':
        return 'bg-yellow-100 text-yellow-800';
      case 'Difícil':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyBadge = () => {
    if (!recipe.urgency) return null;
    
    if (recipe.urgency <= 1) {
      return (
        <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full flex items-center gap-1">
          🚨 Urgente
        </span>
      );
    }
    
    if (recipe.urgency <= 3) {
      return (
        <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full flex items-center gap-1">
          ⏰ Pronto
        </span>
      );
    }
    
    return null;
  };

  if (compact) {
    return (
      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all bg-white">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {recipe.isAI ? (
                <Sparkles className="w-4 h-4 text-purple-600" />
              ) : (
                <ChefHat className="w-4 h-4 text-green-600" />
              )}
              <h4 className="font-semibold text-gray-800 truncate">{recipe.name}</h4>
            </div>
            
            <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
              <div className="flex items-center gap-1">
                <Timer className="w-3 h-3" />
                <span>{recipe.prepTime}</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(recipe.difficulty)}`}>
                {recipe.difficulty}
              </span>
            </div>
            
            {recipe.usedProducts && recipe.usedProducts.length > 0 && (
              <p className="text-xs text-gray-500 truncate">
                Usa: {recipe.usedProducts.join(', ')}
              </p>
            )}
          </div>
          
          <div className="flex flex-col gap-1">
            {getUrgencyBadge()}
            <Button
              onClick={() => onView(recipe)}
              size="sm"
              variant="primary"
            >
              Ver
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all bg-white">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2 flex-1">
          {recipe.isAI ? (
            <Sparkles className="w-6 h-6 text-purple-600" />
          ) : (
            <ChefHat className="w-6 h-6 text-green-600" />
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-gray-800 text-lg mb-1">{recipe.name}</h4>
            {recipe.isAI && (
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                ✨ Generado por IA
              </span>
            )}
          </div>
        </div>
        
        <div className="flex flex-col gap-1 items-end">
          {getUrgencyBadge()}
          <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(recipe.difficulty)}`}>
            {recipe.difficulty}
          </span>
        </div>
      </div>

      {/* Descripción */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{recipe.description}</p>

      {/* Información básica */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <Timer className="w-4 h-4" />
          <span>Prep: {recipe.prepTime}</span>
        </div>
        
        {recipe.cookTime && (
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Cocción: {recipe.cookTime}</span>
          </div>
        )}
        
        {recipe.servings && (
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-4 h-4" />
            <span>{recipe.servings} porciones</span>
          </div>
        )}
      </div>

      {/* Ingredientes principales */}
      {showIngredients && recipe.ingredients && (
        <div className="mb-4">
          <h5 className="font-medium text-gray-800 mb-2">Ingredientes principales:</h5>
          <div className="flex flex-wrap gap-1">
            {recipe.ingredients.slice(0, 4).map((ingredient, i) => (
              <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                {ingredient.length > 20 ? ingredient.substring(0, 20) + '...' : ingredient}
              </span>
            ))}
            {recipe.ingredients.length > 4 && (
              <span className="text-gray-500 text-xs self-center">
                +{recipe.ingredients.length - 4} más
              </span>
            )}
          </div>
        </div>
      )}

      {/* Productos usados (para recetas IA) */}
      {recipe.usedProducts && recipe.usedProducts.length > 0 && (
        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <h5 className="font-medium text-orange-800 mb-1 text-sm">
            🥗 Aprovecha estos productos:
          </h5>
          <div className="flex flex-wrap gap-1">
            {recipe.usedProducts.map((product, i) => (
              <span key={i} className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded">
                {product}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Acciones */}
      <div className="flex gap-2 pt-2">
        <Button
          onClick={() => onView(recipe)}
          variant="primary"
          className="flex-1"
        >
          <BookOpen size={16} />
          Ver Receta Completa
        </Button>
        
        {onSave && (
          <Button
            onClick={() => onSave(recipe)}
            variant={isSaved ? "success" : "secondary"}
            size="sm"
          >
            {isSaved ? '❤️' : '🤍'}
          </Button>
        )}
        
        {onCook && (
          <Button
            onClick={() => onCook(recipe)}
            variant="success"
            size="sm"
          >
            👨‍🍳
          </Button>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;
