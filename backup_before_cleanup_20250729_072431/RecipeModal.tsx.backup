import React from 'react';
import { X, Timer, Award } from 'lucide-react';

const RecipeModal = ({ recipe, onClose }) => {
    if (!recipe) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-90vh overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{recipe.name}</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <p className="text-gray-600">{recipe.description}</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-gray-500" />
                  <span>{recipe.prepTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-gray-500" />
                  <span>{recipe.difficulty}</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Ingredientes:</h3>
                <ul className="space-y-1">
                  {recipe.ingredients.map((ingredient, i) => (
                    <li key={i} className="text-gray-600">• {ingredient}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Preparación:</h3>
                <ol className="space-y-2">
                  {recipe.steps.map((step, i) => (
                    <li key={i} className="text-gray-600">
                      <span className="font-medium text-green-600">{i + 1}.</span> {step}
                    </li>
                  ))}
                </ol>
              </div>

              {recipe.tips && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-2">💡 Consejo del Chef:</h4>
                  <p className="text-yellow-700 text-sm">{recipe.tips}</p>
                </div>
              )}

              {recipe.nutrition && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">🥗 Info Nutricional:</h4>
                  <p className="text-green-700 text-sm">{recipe.nutrition}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default RecipeModal;
