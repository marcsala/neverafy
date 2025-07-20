// features/recipes/components/RecipeModal.tsx

import React, { useState } from 'react';
import { X, Timer, Award, Clock, Users, Share2, Bookmark, CheckCircle, Printer } from 'lucide-react';
import { Button, Modal } from '../../../shared/components/ui';
import { formatDuration } from '../../../shared/utils/formatters';

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
  usedProducts?: string[];
}

interface RecipeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
  onSave?: (recipe: Recipe) => void;
  onCook?: (recipe: Recipe) => void;
  onShare?: (recipe: Recipe) => void;
  isSaved?: boolean;
}

const RecipeModal: React.FC<RecipeModalProps> = ({
  recipe,
  onClose,
  onSave,
  onCook,
  onShare,
  isSaved = false
}) => {
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());
  const [servings, setServings] = useState(recipe?.servings || 4);

  if (!recipe) return null;

  const toggleStep = (stepIndex: number) => {
    const newChecked = new Set(checkedSteps);
    if (newChecked.has(stepIndex)) {
      newChecked.delete(stepIndex);
    } else {
      newChecked.add(stepIndex);
    }
    setCheckedSteps(newChecked);
  };

  const adjustIngredients = (ingredient: string) => {
    if (!recipe.servings || recipe.servings === servings) return ingredient;
    
    const ratio = servings / recipe.servings;
    
    // Intentar detectar y ajustar cantidades numéricas
    return ingredient.replace(/(\d+(?:\.\d+)?)\s*([a-zA-Z]+)?/g, (match, number, unit) => {
      const adjustedAmount = (parseFloat(number) * ratio).toFixed(1);
      return `${adjustedAmount}${unit ? ` ${unit}` : ''}`;
    });
  };

  const handlePrint = () => {
    const printContent = `
      <h1>${recipe.name}</h1>
      <p>${recipe.description}</p>
      <h2>Ingredientes (${servings} porciones):</h2>
      <ul>${recipe.ingredients.map(ing => `<li>${adjustIngredients(ing)}</li>`).join('')}</ul>
      <h2>Preparación:</h2>
      <ol>${recipe.steps.map(step => `<li>${step}</li>`).join('')}</ol>
      ${recipe.tips ? `<h2>Consejos:</h2><p>${recipe.tips}</p>` : ''}
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>${recipe.name} - Neverafy</title></head>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            ${printContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Medio':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Difícil':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <Modal
      isOpen={!!recipe}
      onClose={onClose}
      maxWidth="xl"
      showCloseButton={false}
    >
      <div className="max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 z-10">
          <div className="flex justify-between items-start">
            <div className="flex-1 pr-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{recipe.name}</h2>
              <p className="text-gray-600">{recipe.description}</p>
              
              {recipe.isAI && (
                <div className="mt-2">
                  <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
                    ✨ Generado por IA con tus productos
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              {onShare && (
                <Button onClick={() => onShare(recipe)} variant="secondary" size="sm">
                  <Share2 size={16} />
                </Button>
              )}
              
              <Button onClick={handlePrint} variant="secondary" size="sm">
                <Printer size={16} />
              </Button>
              
              {onSave && (
                <Button 
                  onClick={() => onSave(recipe)} 
                  variant={isSaved ? "success" : "secondary"} 
                  size="sm"
                >
                  <Bookmark size={16} />
                </Button>
              )}
              
              <Button onClick={onClose} variant="secondary" size="sm">
                <X size={20} />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Info básica */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <Timer className="w-5 h-5 text-gray-600" />
              <div>
                <div className="text-sm text-gray-600">Preparación</div>
                <div className="font-medium">{recipe.prepTime}</div>
              </div>
            </div>
            
            {recipe.cookTime && (
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="text-sm text-gray-600">Cocción</div>
                  <div className="font-medium">{recipe.cookTime}</div>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <Users className="w-5 h-5 text-gray-600" />
              <div>
                <div className="text-sm text-gray-600">Porciones</div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setServings(Math.max(1, servings - 1))}
                    className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-sm"
                  >
                    -
                  </button>
                  <span className="font-medium w-8 text-center">{servings}</span>
                  <button 
                    onClick={() => setServings(servings + 1)}
                    className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            
            <div className={`flex items-center gap-2 p-3 rounded-lg border ${getDifficultyColor(recipe.difficulty)}`}>
              <Award className="w-5 h-5" />
              <div>
                <div className="text-sm">Dificultad</div>
                <div className="font-medium">{recipe.difficulty}</div>
              </div>
            </div>
          </div>

          {/* Productos usados */}
          {recipe.usedProducts && recipe.usedProducts.length > 0 && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 className="font-medium text-orange-800 mb-2">
                🥗 Esta receta aprovecha tus productos que vencen pronto:
              </h4>
              <div className="flex flex-wrap gap-2">
                {recipe.usedProducts.map((product, i) => (
                  <span key={i} className="bg-orange-100 text-orange-700 text-sm px-3 py-1 rounded-full">
                    {product}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Ingredientes */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4 text-lg">
              Ingredientes {servings !== recipe.servings && `(ajustado para ${servings} porciones)`}:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {recipe.ingredients.map((ingredient, i) => (
                <div key={i} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700">{adjustIngredients(ingredient)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pasos */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4 text-lg">Preparación:</h3>
            <div className="space-y-4">
              {recipe.steps.map((step, i) => (
                <div 
                  key={i} 
                  className={`flex gap-4 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    checkedSteps.has(i) 
                      ? 'bg-green-50 border-green-200 opacity-75' 
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => toggleStep(i)}
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 ${
                    checkedSteps.has(i) 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {checkedSteps.has(i) ? (
                      <CheckCircle size={16} />
                    ) : (
                      <span className="font-medium text-sm">{i + 1}</span>
                    )}
                  </div>
                  <p className={`text-gray-700 ${checkedSteps.has(i) ? 'line-through' : ''}`}>
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          {recipe.tips && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
                💡 Consejo del Chef:
              </h4>
              <p className="text-yellow-700">{recipe.tips}</p>
            </div>
          )}

          {/* Información nutricional */}
          {recipe.nutrition && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                🥗 Información Nutricional:
              </h4>
              <p className="text-green-700">{recipe.nutrition}</p>
            </div>
          )}

          {/* Acciones finales */}
          <div className="flex gap-3 pt-4 border-t">
            {onCook && (
              <Button
                onClick={() => onCook(recipe)}
                variant="success"
                className="flex-1"
              >
                👨‍🍳 ¡Ya cociné esta receta!
              </Button>
            )}
            
            <Button
              onClick={onClose}
              variant="secondary"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RecipeModal;
