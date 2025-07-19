import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Star, Flame, DollarSign, Crown } from 'lucide-react';
import { supabase, onAuthStateChange } from './services/supabase';
import { processImageWithClaude, generateAIRecipes } from './services/claudeApi';
import NavBar from './components/NavBar';
import DashboardView from './components/DashboardView';
import CameraView from './components/CameraView';
import ProductsView from './components/ProductsView';
import RecipesView from './components/RecipesView';
import AchievementsView from './components/AchievementsView';
import AnalyticsView from './components/AnalyticsView';
import RecipeModal from './components/RecipeModal';
import useStore from './store/useStore';

// Componente de autenticación simple
const AuthForm = ({ onAuthSuccess }: { onAuthSuccess: () => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setMessage('¡Inicio de sesión exitoso!');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage('¡Cuenta creada exitosamente! Revisa tu email para confirmar.');
      }
      onAuthSuccess();
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🥬 Neverafy</h1>
          <p className="text-gray-600">Tu nevera, inteligente</p>
        </div>

        <div className="flex mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 px-4 rounded-l-lg font-medium ${
              isLogin ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 px-4 rounded-r-lg font-medium ${
              !isLogin ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Registrarse
          </button>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="tu@email.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-3 rounded-lg text-sm ${
            message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {message}
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>🔒 Tus datos están seguros y protegidos</p>
        </div>
      </div>
    </div>
  );
};

const FreshAlertPro = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
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

  // Inicializar sesión
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = onAuthStateChange((session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Cargar datos al iniciar sesión
  useEffect(() => {
    if (!session) return;
    
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
  }, [session]);

  // Guardar datos
  useEffect(() => {
    if (session) {
      localStorage.setItem('freshAlertProducts', JSON.stringify(products));
    }
  }, [products, session]);

  useEffect(() => {
    if (session) {
      localStorage.setItem('freshAlertConsumed', JSON.stringify(consumedProducts));
    }
  }, [consumedProducts, session]);

  useEffect(() => {
    if (session) {
      localStorage.setItem('freshAlertStats', JSON.stringify(userStats));
    }
  }, [userStats, session]);

  useEffect(() => {
    if (session) {
      localStorage.setItem('freshAlertPremium', JSON.stringify(isPremium));
    }
  }, [isPremium, session]);

  // Funciones auxiliares
  const generateNotifications = () => {
    const newNotifications: any[] = [];
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

  const getDaysToExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getAlertColor = (daysToExpiry: number) => {
    if (daysToExpiry < 0) return 'text-red-600 bg-red-50 border-red-200';
    if (daysToExpiry <= 1) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (daysToExpiry <= 3) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const addProduct = (productData: any = null) => {
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

      setUserStats(prev => ({
        ...prev,
        points: prev.points + 10
      }));
    }
  };

  const markAsConsumed = (product: any, wasConsumed = true) => {
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

  const removeProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  // Funcionalidad OCR mejorada
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      setOcrResults(null);
    }
  };

  const processImage = async () => {
    if (!selectedImage) return;

    if (!isPremium && userStats.ocrUsed >= 3) {
      alert('🔒 Has alcanzado el límite de 3 análisis mensuales. ¡Actualiza a Premium para análisis ilimitados!');
      return;
    }

    setIsProcessingOCR(true);

    try {
      const results = await processImageWithClaude(selectedImage);
      setOcrResults(results);

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

  const addDetectedProductToFridge = (detectedProduct: any) => {
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

  // Motor de recetas con IA mejorado
  const generateAIRecipesHandler = async (urgentProducts: any[]) => {
    if (!isPremium && userStats.recipesGenerated >= 5) {
      alert('🔒 Has alcanzado el límite de 5 recetas mensuales. ¡Actualiza a Premium para recetas ilimitadas!');
      return [];
    }

    setIsGeneratingRecipes(true);

    try {
      const recipes = await generateAIRecipes(urgentProducts);
      
      setUserStats(prev => ({
        ...prev,
        recipesGenerated: prev.recipesGenerated + 1,
        points: prev.points + 20
      }));

      return recipes;
    } catch (error) {
      console.error('Error generating recipes:', error);
      return [];
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
    const suggestions: any[] = [];

    urgentProducts.forEach(product => {
      const productName = product.name.toLowerCase();
      Object.keys(enhancedRecipeDatabase).forEach(ingredient => {
        if (productName.includes(ingredient)) {
          const recipeData = enhancedRecipeDatabase[ingredient as keyof typeof enhancedRecipeDatabase];
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🥬</div>
          <div className="text-xl font-bold text-gray-800">Cargando Neverafy...</div>
        </div>
      </div>
    );
  }

  if (!session) {
    return <AuthForm onAuthSuccess={() => {}} />;
  }

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
            onLogout={handleLogout}
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
            />} />
            <Route path="/recipes" element={<RecipesView
              isPremium={isPremium}
              userStats={userStats}
              products={products}
              getDaysToExpiry={getDaysToExpiry}
              generateAIRecipes={generateAIRecipesHandler}
              isGeneratingRecipes={isGeneratingRecipes}
              generatedRecipes={generatedRecipes}
              setSelectedRecipe={setSelectedRecipe}
              getSuggestedRecipes={getSuggestedRecipes}
            />} />
            <Route path="/achievements" element={<AchievementsView achievements={achievements} products={products} userStats={userStats} />} />
            <Route path="/analytics" element={<AnalyticsView stats={stats} userStats={userStats} isPremium={isPremium} setIsPremium={setIsPremium} />} />
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
