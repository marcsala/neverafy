import React from 'react';
import { ChefHat, Sparkles, Loader2, BookOpen, Timer, Award } from 'lucide-react';

const RecipesView = ({
  isPremium,
  userStats,
  products,
  getDaysToExpiry,
  generateAIRecipes,
  isGeneratingRecipes,
  generatedRecipes,
  setSelectedRecipe,
  getSuggestedRecipes
}) => {
  const urgentProducts = products.filter(p => getDaysToExpiry(p.expiryDate) <= 3);

  const handleGenerateAIRecipes = async () => {
    if (urgentProducts.length === 0) {
      alert('Necesitas productos que venzan pronto para generar recetas.');
      return;
    }

    const recipes = await generateAIRecipes(urgentProducts);
    setGeneratedRecipes(recipes);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <ChefHat className="w-8 h-8 text-purple-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Recetas con IA</h2>
              <p className="text-gray-600">Recetas personalizadas para tus productos</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">
              {isPremium ? 'Recetas ilimitadas' : `${userStats.recipesGenerated}/5 usadas este mes`}
            </p>
            {!isPremium && (
              <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: `${(userStats.recipesGenerated / 5) * 100}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {urgentProducts.length > 0 ? (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-orange-800 mb-2">
              🚨 Productos que vencen pronto ({urgentProducts.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {urgentProducts.map(product => (
                <span key={product.id} className="bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded-full">
                  {product.name} ({getDaysToExpiry(product.expiryDate)} días)
                </span>
              ))}
            </div>

            <button
              onClick={handleGenerateAIRecipes}
              disabled={isGeneratingRecipes || (!isPremium && userStats.recipesGenerated >= 5)}
              className="mt-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isGeneratingRecipes ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generando recetas...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generar Recetas con IA
                </>
              )}
            </button>

            {!isPremium && userStats.recipesGenerated >= 5 && (
              <p className="text-red-600 text-sm mt-2">
                Límite alcanzado. Actualiza a Premium para recetas ilimitadas.
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No hay productos que venzan pronto</p>
            <p className="text-gray-400 text-sm">Agrega productos para ver sugerencias de recetas</p>
          </div>
        )}
      </div>

      {/* Recetas Generadas por IA */}
      {generatedRecipes.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-green-600" />
            Recetas Generadas por IA ({generatedRecipes.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generatedRecipes.map((recipe, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-bold text-gray-800 text-lg">{recipe.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    recipe.difficulty === 'Fácil' ? 'bg-green-100 text-green-800' :
                    recipe.difficulty === 'Medio' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {recipe.difficulty}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4">{recipe.description}</p>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Timer className="w-4 h-4" />
                    <span>{recipe.prepTime}</span>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">Ingredientes:</h5>
                    <div className="flex flex-wrap gap-1">
                      {recipe.ingredients.slice(0, 3).map((ing, i) => (
                        <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                          {ing}
                        </span>
                      ))}
                      {recipe.ingredients.length > 3 && (
                        <span className="text-gray-500 text-xs">+{recipe.ingredients.length - 3} más</span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedRecipe(recipe)}
                  className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <BookOpen size={16} />
                  Ver Receta Completa
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recetas Básicas Sugeridas */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🍳 Sugerencias Rápidas</h3>
        <p className="text-gray-600 mb-6">Basadas en productos que vencen pronto</p>

        {(() => {
          const suggestions = getSuggestedRecipes();
          return suggestions.length === 0 ? (
            <div className="text-center py-8">
              <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No hay sugerencias disponibles</p>
              <p className="text-gray-400 text-sm">Agrega productos que vencen pronto para ver recetas</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <ChefHat className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold text-gray-800">{suggestion.recipe}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Usar: {suggestion.ingredients.join(', ')}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      suggestion.urgency <= 1 ? 'bg-red-100 text-red-600' :
                      suggestion.urgency <= 3 ? 'bg-orange-100 text-orange-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {suggestion.isUrgent ? 'Urgente' :
                       suggestion.urgency <= 3 ? 'Pronto' : 'Normal'}
                    </span>
                    <span className="text-xs text-gray-500">{suggestion.difficulty}</span>
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default RecipesView;
