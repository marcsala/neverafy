import React from 'react';
import { useRecipeGeneration } from '../features/recipes/hooks/useRecipeGeneration';
import { getDaysToExpiry } from '../shared/utils/dateUtils';

interface RecipesIntegrationProps {
  products: any[];
  userId: string;
}

const RecipesIntegration: React.FC<RecipesIntegrationProps> = ({ products, userId }) => {
  // Mock de datos de usuario premium (puedes conectar con tu sistema real)
  const mockUserStats = { recipesGenerated: 1 };
  const isPremium = false;
  const setUserStats = (updater: any) => {
    // Aquí puedes conectar con tu store real
    console.log('Updating user stats:', updater);
  };

  // Usar el hook de recetas
  const {
    generatedRecipes,
    isGeneratingRecipes,
    selectedRecipe,
    generateAIRecipesHandler,
    generateVariedRecipes,
    getSuggestedRecipes,
    setSelectedRecipe
  } = useRecipeGeneration({
    products,
    isPremium,
    userStats: mockUserStats,
    setUserStats
  });

  // Filtrar productos urgentes
  const urgentProducts = products.filter(p => getDaysToExpiry(p.expiryDate) <= 3);

  const handleGenerateUrgentRecipes = async () => {
    if (urgentProducts.length === 0) {
      alert('Necesitas productos que venzan pronto para generar recetas urgentes.');
      return;
    }

    console.log('🚀 Iniciando generación de recetas urgentes...');
    try {
      await generateAIRecipesHandler(urgentProducts);
      console.log('✅ Recetas urgentes generadas exitosamente');
    } catch (error) {
      console.error('❌ Error generando recetas urgentes:', error);
      alert(error.message || 'Error generando recetas');
    }
  };

  const handleGenerateVariedRecipes = async () => {
    if (products.length === 0) {
      alert('Necesitas productos en tu nevera para generar recetas.');
      return;
    }

    console.log('🚀 Iniciando generación de recetas variadas...');
    try {
      await generateVariedRecipes();
      console.log('✅ Recetas variadas generadas exitosamente');
    } catch (error) {
      console.error('❌ Error generando recetas variadas:', error);
      alert(error.message || 'Error generando recetas variadas');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Recetas con Claude IA</h1>
              <p className="text-gray-600">Genera recetas personalizadas con tus productos</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  {isPremium ? 'Recetas ilimitadas' : `${mockUserStats.recipesGenerated}/5 usadas este mes`}
                </p>
              </div>
              
              {/* 🍋 BOTÓN PREMIUM */}
              {!isPremium && (
                <a 
                  href="https://neverafy.lemonsqueezy.com/buy/0d8fe582-01f6-4766-9075-44bbf46780e4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" />
                  </svg>
                  Upgrade Premium
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Botones de generación */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Recetas urgentes */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Recetas Urgentes</h3>
                <p className="text-sm text-gray-600">Para productos que caducan pronto</p>
              </div>
            </div>

            {urgentProducts.length > 0 ? (
              <>
                <div className="mb-4">
                  <p className="text-sm font-medium text-orange-800 mb-2">
                    🚨 {urgentProducts.length} productos urgentes:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {urgentProducts.slice(0, 3).map(product => (
                      <span key={product.id} className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                        {product.name} ({getDaysToExpiry(product.expiryDate)}d)
                      </span>
                    ))}
                    {urgentProducts.length > 3 && (
                      <span className="text-orange-600 text-xs">+{urgentProducts.length - 3} más</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleGenerateUrgentRecipes}
                  disabled={isGeneratingRecipes}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isGeneratingRecipes ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generando...
                    </div>
                  ) : (
                    'Generar Recetas Urgentes'
                  )}
                </button>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-orange-600">No hay productos urgentes</p>
              </div>
            )}
          </div>

          {/* Recetas variadas */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Recetas Variadas</h3>
                <p className="text-sm text-gray-600">Con todos tus productos</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                🥘 Usando {products.length} productos disponibles
              </p>
            </div>

            <button
              onClick={handleGenerateVariedRecipes}
              disabled={isGeneratingRecipes}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {isGeneratingRecipes ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generando...
                </div>
              ) : (
                'Generar Recetas Variadas'
              )}
            </button>
          </div>
        </div>

        {/* Recetas generadas */}
        {generatedRecipes.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              ✨ Recetas Generadas por Claude IA ({generatedRecipes.length})
            </h2>

            <div className="space-y-6">
              {generatedRecipes.map((recipe, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-900">{recipe.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      recipe.difficulty === 'Fácil' ? 'bg-green-100 text-green-800' :
                      recipe.difficulty === 'Medio' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {recipe.difficulty}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4">{recipe.description}</p>

                  <div className="mb-4">
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span>⏱️ {recipe.prepTime || recipe.cookingTime}</span>
                      <span>👥 {recipe.servings} personas</span>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Ingredientes:</h4>
                      <div className="flex flex-wrap gap-2">
                        {recipe.ingredients.map((ingredient, i) => (
                          <span 
                            key={i} 
                            className={`px-2 py-1 rounded text-sm ${
                              recipe.urgentIngredients?.includes(ingredient)
                                ? 'bg-red-100 text-red-700 border border-red-200'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {ingredient}
                            {recipe.urgentIngredients?.includes(ingredient) && ' ⚠️'}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {recipe.urgentIngredients && recipe.urgentIngredients.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
                      <p className="text-sm text-red-600 font-medium">
                        ⚠️ Esta receta utiliza ingredientes que caducan pronto
                      </p>
                    </div>
                  )}

                  <details className="mb-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer mb-2">
                      Ver instrucciones paso a paso
                    </summary>
                    <ol className="space-y-2">
                      {recipe.instructions.map((step, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                            {i + 1}
                          </span>
                          <span className="text-gray-700">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </details>

                  <button 
                    onClick={() => setSelectedRecipe(recipe)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Marcar como cocinada
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Estado inicial */}
        {generatedRecipes.length === 0 && !isGeneratingRecipes && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">¡Genera recetas inteligentes!</h3>
            <p className="text-gray-600 mb-4">Claude analizará tus productos y creará recetas personalizadas</p>
            <p className="text-sm text-gray-500">
              Productos urgentes: {urgentProducts.length} | Total productos: {products.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipesIntegration;
