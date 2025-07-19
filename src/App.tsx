import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Star, Flame, DollarSign, Crown } from 'lucide-react';
import NavBar from './components/NavBar';
import DashboardView from './components/DashboardView';
import CameraView from './components/CameraView';
import ProductsView from './components/ProductsView';
import RecipesView from './components/RecipesView';
import AchievementsView from './components/AchievementsView';
import AnalyticsView from './components/AnalyticsView';
import RecipeModal from './components/RecipeModal';
import useStore from './store/useStore';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Testimonials from './pages/Testimonials';
import HelpCenter from './pages/HelpCenter';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

const FreshAlertPro = () => {
  const {
    currentView,
    products,
    consumedProducts,
    userStats,
    newProduct,
    showAddForm,
    searchTerm,
    selectedCategory,
    notifications,
    isPremium,
    selectedImage,
    imagePreview,
    isProcessingOCR,
    ocrResults,
    generatedRecipes,
    isGeneratingRecipes,
    selectedRecipe,
    setCurrentView,
    setProducts,
    setConsumedProducts,
    setUserStats,
    setNewProduct,
    setShowAddForm,
    setSearchTerm,
    setSelectedCategory,
    setNotifications,
    setIsPremium,
    setSelectedImage,
    setImagePreview,
    setIsProcessingOCR,
    setOcrResults,
    setGeneratedRecipes,
    setIsGeneratingRecipes,
    setSelectedRecipe,
  } = useStore();

  const fileInputRef = useRef(null);

  const enhancedRecipeDatabase = {
    'plátano': {
      recipes: ['Smoothie tropical energético', 'Pan de plátano casero', 'Pancakes de plátano'],
      urgency: ['Batido express (5 min)', 'Plátano con canela al horno'],
      difficulty: 'Fácil'
    },
    'manzana': {
      recipes: ['Tarta de manzana clásica', 'Compota casera', 'Ensalada waldorf'],
      urgency: ['Manzana asada con miel', 'Smoothie verde detox'],
      difficulty: 'Medio'
    },
    'tomate': {
      recipes: ['Gazpacho andaluz', 'Salsa marinara', 'Ensalada caprese'],
      urgency: ['Tostadas con tomate', 'Zumo de tomate natural'],
      difficulty: 'Fácil'
    },
    'lechuga': {
      recipes: ['Caesar salad', 'Wraps healthy', 'Smoothie verde'],
      urgency: ['Ensalada rápida', 'Sandwich vegetal'],
      difficulty: 'Fácil'
    },
    'pollo': {
      recipes: ['Pollo al curry', 'Ensalada césar', 'Sopa de pollo'],
      urgency: ['Pollo a la plancha', 'Sandwich de pollo'],
      difficulty: 'Medio'
    },
    'leche': {
      recipes: ['Natillas caseras', 'Bechamel', 'Flan de huevo'],
      urgency: ['Batidos variados', 'Café con leche especial'],
      difficulty: 'Fácil'
    },
    'pan': {
      recipes: ['Torrijas tradicionales', 'Pan rallado casero', 'Tostadas francesas'],
      urgency: ['Tostadas gourmet', 'Picatostes para sopa'],
      difficulty: 'Fácil'
    },
    'huevos': {
      recipes: ['Tortilla española', 'Huevos benedictinos', 'Merengue casero'],
      urgency: ['Huevos revueltos', 'Tortilla francesa'],
      difficulty: 'Medio'
    }
  };

  const categories = [
    'frutas', 'verduras', 'lácteos', 'carne', 'pescado',
    'pan', 'conservas', 'congelados', 'huevos', 'otros'
  ];

  const achievements = [
    { id: 1, name: 'Primer Paso', description: 'Añade tu primer producto', icon: '🌱', unlocked: false, points: 10 },
    { id: 2, name: 'Eco Guerrero', description: 'Ahorra 10€ en comida', icon: '💚', unlocked: false, points: 50 },
    { id: 3, name: 'Chef Sostenible', description: 'Cocina 5 recetas sugeridas', icon: '👨‍🍳', unlocked: false, points: 30 },
    { id: 4, name: 'Racha de Fuego', description: '7 días sin desperdiciar', icon: '🔥', unlocked: false, points: 100 },
    { id: 5, name: 'Maestro Verde', description: 'Reduce 50kg de CO2', icon: '🌍', unlocked: false, points: 200 },
    { id: 6, name: 'Ojo de Halcón', description: 'Usa OCR 10 veces', icon: '📸', unlocked: false, points: 75 },
    { id: 7, name: 'Chef IA', description: 'Genera 20 recetas con IA', icon: '🤖', unlocked: false, points: 150 }
  ];

  // Cargar datos al iniciar
  useEffect(() => {
    const savedProducts = localStorage.getItem('freshAlertProducts');
    const savedConsumed = localStorage.getItem('freshAlertConsumed');
    const savedStats = localStorage.getItem('freshAlertStats');
    const savedNotifications = localStorage.getItem('freshAlertNotifications');
    const savedPremium = localStorage.getItem('freshAlertPremium');

    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedConsumed) setConsumedProducts(JSON.parse(savedConsumed));
    if (savedStats) setUserStats(JSON.parse(savedStats));
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
    if (savedPremium) setIsPremium(JSON.parse(savedPremium));

    generateNotifications();
  }, []);

  // Guardar datos
  useEffect(() => {
    localStorage.setItem('freshAlertProducts', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('freshAlertConsumed', JSON.stringify(consumedProducts));
  }, [consumedProducts]);

  useEffect(() => {
    localStorage.setItem('freshAlertStats', JSON.stringify(userStats));
  }, [userStats]);

  useEffect(() => {
    localStorage.setItem('freshAlertPremium', JSON.stringify(isPremium));
  }, [isPremium]);

  // Generar notificaciones
  const generateNotifications = () => {
    const newNotifications = [];
    products.forEach(product => {
      const daysToExpiry = getDaysToExpiry(product.expiryDate);
      if (daysToExpiry <= 1 && daysToExpiry >= 0) {
        newNotifications.push({
          id: Date.now() + Math.random(),
          type: 'warning',
          message: `¡${product.name} vence ${daysToExpiry === 0 ? 'hoy' : 'mañana'}!`,
          timestamp: new Date().toISOString()
        });
      }
    });
    setNotifications(prev => [...prev, ...newNotifications].slice(-5));
  };

  const getDaysToExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getAlertColor = (daysToExpiry) => {
    if (daysToExpiry < 0) return 'text-red-600 bg-red-50 border-red-200';
    if (daysToExpiry <= 1) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (daysToExpiry <= 3) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const addProduct = (productData = null) => {
    const product = productData || {
      ...newProduct,
      id: Date.now(),
      addedDate: new Date().toISOString().split('T')[0],
      price: parseFloat(newProduct.price) || 0,
      source: 'manual'
    };

    if (product.name && product.expiryDate) {
      setProducts(prev => [...prev, product]);
      if (!productData) {
        setNewProduct({ name: '', category: 'frutas', expiryDate: '', quantity: 1, price: '' });
        setShowAddForm(false);
      }

      // Aumentar puntos
      setUserStats(prev => ({
        ...prev,
        points: prev.points + 10
      }));
    }
  };

  const markAsConsumed = (product, wasConsumed = true) => {
    const consumedProduct = {
      ...product,
      consumedDate: new Date().toISOString().split('T')[0],
      wasConsumed,
      daysBeforeExpiry: getDaysToExpiry(product.expiryDate)
    };

    setConsumedProducts(prev => [...prev, consumedProduct]);
    setProducts(prev => prev.filter(p => p.id !== product.id));

    if (wasConsumed) {
      setUserStats(prev => ({
        ...prev,
        points: prev.points + (getDaysToExpiry(product.expiryDate) >= 0 ? 25 : 10),
        totalSaved: prev.totalSaved + (product.price || 3),
        co2Saved: prev.co2Saved + 0.5,
        streak: prev.streak + 1
      }));
    }
  };

  const removeProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  // Funcionalidad OCR
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      setOcrResults(null);
    }
  };

  const processImageWithClaude = async (imageFile) => {
    try {
      const base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result.split(",")[1];
          resolve(base64);
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(imageFile);
      });

      const prompt = `
Analiza esta imagen de productos alimentarios y extrae información detallada.

Busca productos de comida y sus fechas de vencimiento. Formatos comunes de fechas:
- DD/MM/YY o DD/MM/YYYY
- "CONSUMIR ANTES DE", "FECHA LÍMITE", "BEST BEFORE"
- "CADUCIDAD", "VENCE", "EXP"

Devuelve ÚNICAMENTE un JSON válido:
{
  "products": [
    {
      "name": "nombre específico del producto",
      "category": "frutas|verduras|lácteos|carne|pescado|pan|conservas|congelados|huevos|otros",
      "expiryDate": "YYYY-MM-DD",
      "confidence": 0.85,
      "estimatedPrice": 2.50,
      "detectedText": "texto original donde viste la fecha"
    }
  ],
  "success": true,
  "message": "Se detectaron X productos"
}

IMPORTANTE:
- Solo incluye productos con fechas legibles
- Convierte fechas al formato YYYY-MM-DD
- Precios aproximados en euros
- Confidence entre 0.70-0.95
- NO añadas explicaciones, solo JSON puro
`;

      const response = await fetch("http://localhost:3001/api/claude", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-3-haiku-20240307",
          max_tokens: 1500,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "image",
                  source: {
                    type: "base64",
                    media_type: imageFile.type,
                    data: base64Data,
                  }
                },
                {
                  type: "text",
                  text: prompt
                }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      let responseText = data.content[0].text;
      responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

      try {
        return JSON.parse(responseText);
      } catch (parseError) {
        // Fallback a datos mock
        return {
          products: [
            {
              name: "Producto detectado",
              category: "otros",
              expiryDate: "2025-07-25",
              confidence: 0.75,
              estimatedPrice: 2.0,
              detectedText: "Fecha detectada en imagen"
            }
          ],
          success: true,
          message: "Producto detectado (modo demo)"
        };
      }

    } catch (error) {
      return {
        products: [],
        success: false,
        message: "Error procesando la imagen. Intenta de nuevo."
      };
    }
  };

  const processImage = async () => {
    if (!selectedImage) return;

    // Verificar límites freemium
    if (!isPremium && userStats.ocrUsed >= 3) {
      alert('🔒 Has alcanzado el límite de 3 análisis mensuales. ¡Actualiza a Premium para análisis ilimitados!');
      return;
    }

    setIsProcessingOCR(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const results = await processImageWithClaude(selectedImage);

      setOcrResults(results);

      // Actualizar estadísticas
      setUserStats(prev => ({
        ...prev,
        ocrUsed: prev.ocrUsed + 1,
        points: prev.points + 15
      }));

    } catch (error) {
      setOcrResults({
        products: [],
        success: false,
        message: "Error procesando la imagen."
      });
    } finally {
      setIsProcessingOCR(false);
    }
  };

  const addDetectedProductToFridge = (detectedProduct) => {
    const product = {
      ...detectedProduct,
      id: Date.now() + Math.random(),
      addedDate: new Date().toISOString().split('T')[0],
      source: 'ocr',
      quantity: 1
    };

    addProduct(product);
    alert(`✅ ${product.name} añadido a tu nevera virtual!`);
  };

  // Motor de recetas con IA
  const generateAIRecipes = async (urgentProducts) => {
    // Verificar límites freemium
    if (!isPremium && userStats.recipesGenerated >= 5) {
      alert('🔒 Has alcanzado el límite de 5 recetas mensuales. ¡Actualiza a Premium para recetas ilimitadas!');
      return [];
    }

    setIsGeneratingRecipes(true);

    try {
      const productsList = urgentProducts.map(p => `${p.name} (vence en ${getDaysToExpiry(p.expiryDate)} días)`).join(', ');

      const prompt = `
Tengo estos productos que vencen pronto: ${productsList}

Genera 3 recetas creativas que usen AL MENOS 2 de estos ingredientes.

Responde ÚNICAMENTE con JSON válido:
{
  "recipes": [
    {
      "name": "Nombre de la receta",
      "description": "Descripción breve y apetitosa",
      "ingredients": ["ingrediente1", "ingrediente2"],
      "prepTime": "15 minutos",
      "difficulty": "Fácil|Medio|Difícil",
      "steps": ["paso 1", "paso 2", "paso 3"],
      "tips": "Consejo útil para la receta",
      "nutrition": "Información nutricional básica"
    }
  ],
  "success": true
}

Las recetas deben ser:
- Prácticas y rápidas (max 45 min)
- Con ingredientes comunes españoles
- Adaptadas para evitar desperdicio
- Creativas pero realistas
`;

      const response = await fetch("http://localhost:3001/api/claude", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-3-haiku-20240307",
          max_tokens: 2000,
          messages: [
            { role: "user", content: prompt }
          ]
        })
      });

      if (!response.ok) throw new Error('API Error');

      const data = await response.json();
      let responseText = data.content[0].text;
      responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

      const parsedResponse = JSON.parse(responseText);

      setUserStats(prev => ({
        ...prev,
        recipesGenerated: prev.recipesGenerated + 1,
        points: prev.points + 20
      }));

      return parsedResponse.recipes || [];

    } catch (error) {
      // Fallback a recetas básicas
      return urgentProducts.slice(0, 3).map((product, index) => ({
        name: `Receta con ${product.name}`,
        description: `Deliciosa receta para aprovechar ${product.name} antes de que venza`,
        ingredients: [product.name, "Ingredientes básicos"],
        prepTime: "20 minutos",
        difficulty: "Fácil",
        steps: ["Preparar ingredientes", "Cocinar según instrucciones", "Servir caliente"],
        tips: `Ideal para consumir ${product.name} que vence pronto`,
        nutrition: "Rica en nutrientes"
      }));
    } finally {
      setIsGeneratingRecipes(false);
    }
  };

  // Filtros y búsqueda
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const daysA = getDaysToExpiry(a.expiryDate);
    const daysB = getDaysToExpiry(b.expiryDate);
    return daysA - daysB;
  });

  // Sugerir recetas básicas
  const getSuggestedRecipes = () => {
    const urgentProducts = products.filter(p => getDaysToExpiry(p.expiryDate) <= 3);
    const suggestions = [];

    urgentProducts.forEach(product => {
      const productName = product.name.toLowerCase();
      Object.keys(enhancedRecipeDatabase).forEach(ingredient => {
        if (productName.includes(ingredient)) {
          const recipeData = enhancedRecipeDatabase[ingredient];
          const isUrgent = getDaysToExpiry(product.expiryDate) <= 1;
          const recipesToUse = isUrgent ? recipeData.urgency : recipeData.recipes;

          recipesToUse.forEach(recipe => {
            if (!suggestions.find(s => s.recipe === recipe)) {
              suggestions.push({
                recipe,
                ingredients: [product.name],
                urgency: getDaysToExpiry(product.expiryDate),
                difficulty: recipeData.difficulty,
                isUrgent
              });
            }
          });
        }
      });
    });

    return suggestions.slice(0, 6);
  };

  // Estadísticas
  const stats = {
    total: products.length,
    expiringSoon: products.filter(p => getDaysToExpiry(p.expiryDate) <= 3).length,
    expired: products.filter(p => getDaysToExpiry(p.expiryDate) < 0).length,
    totalConsumed: consumedProducts.filter(p => p.wasConsumed).length,
    totalWasted: consumedProducts.filter(p => !p.wasConsumed).length
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">🥬 Neverafy</h1>
            <p className="text-gray-600">Tu nevera, inteligente</p>
            <div className="mt-2 inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-blue-100 text-gray-700 px-3 py-1 rounded-full text-sm">
              <span className="text-red-600">🇪🇸</span>
              <span className="font-medium">Hecho en España</span>
            </div>
            <div className="mt-4 flex justify-center items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="font-bold">{userStats.points} puntos</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="font-bold">{userStats.streak} días</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
                <DollarSign className="w-5 h-5 text-green-500" />
                <span className="font-bold">{userStats.totalSaved.toFixed(1)}€</span>
              </div>
              {isPremium && (
                <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full shadow-md">
                  <Crown className="w-5 h-5" />
                  <span className="font-bold">Premium</span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <NavBar
            currentView={currentView}
            setCurrentView={setCurrentView}
            isPremium={isPremium}
            userStats={userStats}
          />

          {/* Content based on current view */}
          <Routes>
            <Route path="/" element={<DashboardView stats={stats} userStats={userStats} notifications={notifications} setIsPremium={setIsPremium} />} />
            <Route path="/products" element={<ProductsView
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categories}
              setShowAddForm={setShowAddForm}
              showAddForm={showAddForm}
              setCurrentView={setCurrentView}
              newProduct={newProduct}
              setNewProduct={setNewProduct}
              addProduct={addProduct}
              sortedProducts={sortedProducts}
              getDaysToExpiry={getDaysToExpiry}
              getAlertColor={getAlertColor}
              markAsConsumed={markAsConsumed}
              removeProduct={removeProduct}
            />} />
            <Route path="/camera" element={<CameraView
              isPremium={isPremium}
              userStats={userStats}
              handleImageSelect={handleImageSelect}
              imagePreview={imagePreview}
              setSelectedImage={setSelectedImage}
              setImagePreview={setImagePreview}
              setOcrResults={setOcrResults}
              processImage={processImage}
              isProcessingOCR={isProcessingOCR}
              ocrResults={ocrResults}
              addDetectedProductToFridge={addDetectedProductToFridge}
              getAlertColor={getAlertColor}
              getDaysToExpiry={getDaysToExpiry}
              fileInputRef={fileInputRef}
            />} />
            <Route path="/recipes" element={<RecipesView
              isPremium={isPremium}
              userStats={userStats}
              products={products}
              getDaysToExpiry={getDaysToExpiry}
              generateAIRecipes={generateAIRecipes}
              isGeneratingRecipes={isGeneratingRecipes}
              generatedRecipes={generatedRecipes}
              setSelectedRecipe={setSelectedRecipe}
              getSuggestedRecipes={getSuggestedRecipes}
            />} />
            <Route path="/achievements" element={<AchievementsView achievements={achievements} products={products} userStats={userStats} />} />
            <Route path="/analytics" element={<AnalyticsView stats={stats} userStats={userStats} isPremium={isPremium} setIsPremium={setIsPremium} />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>

          {/* Recipe Modal */}
          {selectedRecipe && (
            <RecipeModal
              recipe={selectedRecipe}
              onClose={() => setSelectedRecipe(null)}
            />
          )}

          {/* Footer */}
          <div className="text-center mt-8 text-gray-500">
            <p className="mb-2">Neverafy v1.0 | Nunca más desperdicies 🇪🇸</p>
            <div className="flex justify-center gap-4 text-sm flex-wrap">
              <span>🌍 {userStats.co2Saved.toFixed(1)}kg CO2 ahorrado</span>
              <span>💰 {userStats.totalSaved.toFixed(1)}€ ahorrado</span>
              <span>⭐ Nivel {userStats.level}</span>
              <span>📸 {userStats.ocrUsed} análisis OCR</span>
              <span>🍳 {userStats.recipesGenerated} recetas IA</span>
            </div>
            <div className="mt-3 text-xs text-gray-400">
              <p>Desarrollado con ❤️ en España | Powered by Claude AI</p>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default FreshAlertPro;
