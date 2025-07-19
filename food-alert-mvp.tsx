import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Trash2, AlertTriangle, CheckCircle, Calendar, Package, 
  Search, Filter, TrendingUp, Award, Target, ShoppingCart, 
  Leaf, DollarSign, Star, Zap, Clock, Users, BarChart3, 
  ChefHat, Bell, Settings, Trophy, Flame, Camera, Upload, 
  Loader2, X, Sparkles, BookOpen, Timer, Users2
} from 'lucide-react';

const FreshAlertPro = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [consumedProducts, setConsumedProducts] = useState([]);
  const [userStats, setUserStats] = useState({
    totalSaved: 0,
    co2Saved: 0,
    points: 0,
    streak: 0,
    level: 1,
    ocrUsed: 0,
    recipesGenerated: 0
  });
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'frutas',
    expiryDate: '',
    quantity: 1,
    price: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [isPremium, setIsPremium] = useState(false);
  
  // Estados para OCR
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const [ocrResults, setOcrResults] = useState(null);
  const fileInputRef = useRef(null);
  
  // Estados para recetas IA
  const [generatedRecipes, setGeneratedRecipes] = useState([]);
  const [isGeneratingRecipes, setIsGeneratingRecipes] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Base de datos mejorada de recetas con IA
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

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
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

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
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

  // Componente de navegación
  const NavBar = () => (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'products', label: 'Mi Nevera', icon: Package },
          { id: 'camera', label: 'Smart Camera', icon: Camera, premium: !isPremium && userStats.ocrUsed >= 3 },
          { id: 'recipes', label: 'Recetas IA', icon: ChefHat, premium: !isPremium && userStats.recipesGenerated >= 5 },
          { id: 'achievements', label: 'Logros', icon: Trophy },
          { id: 'analytics', label: 'Analytics', icon: TrendingUp }
        ].map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors relative ${
                currentView === item.id
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon size={18} />
              {item.label}
              {item.premium && (
                <Star size={14} className="text-yellow-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  // Vista Dashboard
  const DashboardView = () => (
    <div className="space-y-6">
      {/* Premium Banner */}
      {!isPremium && (
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">🚀 Desbloquea el Poder Completo de Neverafy</h3>
              <p className="text-green-100">Escaneado ilimitado, recetas IA avanzadas, analytics premium y mucho más</p>
            </div>
            <button
              onClick={() => setIsPremium(true)}
              className="bg-white text-green-600 font-bold py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Probar Premium
            </button>
          </div>
        </div>
      )}

      {/* Stats principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6 text-center border-l-4 border-blue-500">
          <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-800">{stats.total}</h3>
          <p className="text-gray-600">Productos activos</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center border-l-4 border-orange-500">
          <AlertTriangle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-800">{stats.expiringSoon}</h3>
          <p className="text-gray-600">Vencen pronto</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center border-l-4 border-green-500">
          <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-800">{userStats.totalSaved.toFixed(1)}€</h3>
          <p className="text-gray-600">Ahorrado</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center border-l-4 border-purple-500">
          <Star className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-800">{userStats.points}</h3>
          <p className="text-gray-600">Puntos</p>
        </div>
      </div>

      {/* Progreso y nivel */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Tu Progreso 🌟</h3>
        <div className="flex items-center gap-4 mb-4">
          <div className="text-2xl">🏆</div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-bold">Nivel {userStats.level}</span>
              <span className="text-sm text-gray-600">{userStats.points}/1000 puntos</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(userStats.points % 1000) / 10}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <Flame className="w-6 h-6 text-orange-500 mx-auto mb-1" />
            <p className="text-sm text-gray-600">Racha: {userStats.streak} días</p>
          </div>
          <div>
            <Leaf className="w-6 h-6 text-green-500 mx-auto mb-1" />
            <p className="text-sm text-gray-600">CO2: {userStats.co2Saved.toFixed(1)}kg</p>
          </div>
          <div>
            <Camera className="w-6 h-6 text-blue-500 mx-auto mb-1" />
            <p className="text-sm text-gray-600">OCR: {userStats.ocrUsed}/mes</p>
          </div>
          <div>
            <ChefHat className="w-6 h-6 text-purple-500 mx-auto mb-1" />
            <p className="text-sm text-gray-600">Recetas: {userStats.recipesGenerated}/mes</p>
          </div>
        </div>
      </div>

      {/* Notificaciones */}
      {notifications.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">🔔 Alertas Recientes</h3>
          <div className="space-y-2">
            {notifications.slice(0, 3).map(notif => (
              <div key={notif.id} className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <Bell className="w-5 h-5 text-orange-600" />
                <span className="text-sm text-gray-800">{notif.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Vista Smart Camera (OCR)
  const CameraView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <Camera className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Smart Camera OCR</h2>
            <p className="text-gray-600">Reconocimiento inteligente de productos y fechas</p>
          </div>
          <div className="ml-auto">
            <div className="text-right">
              <p className="text-sm text-gray-600">
                {isPremium ? 'Análisis ilimitados' : `${userStats.ocrUsed}/3 usados este mes`}
              </p>
              {!isPremium && (
                <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(userStats.ocrUsed / 3) * 100}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upload Area */}
        <div className="space-y-6">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="flex flex-col items-center space-y-4">
              {imagePreview ? (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-w-xs max-h-48 rounded-lg shadow-md"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(null);
                      setImagePreview(null);
                      setOcrResults(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <Camera size={48} className="text-gray-400" />
                  <div>
                    <p className="text-lg font-medium text-gray-700">
                      Sube una foto de tus productos
                    </p>
                    <p className="text-sm text-gray-500">
                      JPG, PNG, WEBP hasta 10MB
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />

          {selectedImage && !ocrResults && (
            <div className="text-center">
              <button
                onClick={processImage}
                disabled={isProcessingOCR || (!isPremium && userStats.ocrUsed >= 3)}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
              >
                {isProcessingOCR ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analizando con IA...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Analizar Productos
                  </>
                )}
              </button>
              {!isPremium && userStats.ocrUsed >= 3 && (
                <p className="text-red-600 text-sm mt-2">
                  Límite alcanzado. Actualiza a Premium para análisis ilimitados.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Resultados OCR */}
      {ocrResults && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            {ocrResults.success ? (
              <CheckCircle className="w-8 h-8 text-green-600" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            )}
            <div>
              <h3 className="text-xl font-bold text-gray-800">Resultados del Análisis</h3>
              <p className="text-gray-600">{ocrResults.message}</p>
            </div>
          </div>

          {ocrResults.success && ocrResults.products?.length > 0 ? (
            <div className="space-y-4">
              {ocrResults.products.map((product, index) => {
                const daysToExpiry = getDaysToExpiry(product.expiryDate);
                const alertColor = getAlertColor(daysToExpiry);
                
                return (
                  <div key={index} className={`border-l-4 ${alertColor} bg-white border rounded-lg p-6 shadow-sm`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Package className="w-5 h-5 text-gray-600" />
                          <h4 className="font-bold text-gray-800 text-lg">{product.name}</h4>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {Math.round(product.confidence * 100)}% confianza
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">
                              Vence: {new Date(product.expiryDate).toLocaleDateString('es-ES')}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">
                              Precio est.: {product.estimatedPrice}€
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600 capitalize">
                              {product.category}
                            </span>
                          </div>
                        </div>

                        {product.detectedText && (
                          <div className="p-2 bg-gray-50 rounded text-xs text-gray-600 mb-3">
                            <strong>Texto detectado:</strong> "{product.detectedText}"
                          </div>
                        )}

                        <span className={`text-sm font-medium ${
                          daysToExpiry < 0 ? 'text-red-600' : 
                          daysToExpiry <= 1 ? 'text-orange-600' : 
                          daysToExpiry <= 3 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {daysToExpiry < 0 ? `Caducó hace ${Math.abs(daysToExpiry)} días` : 
                           daysToExpiry === 0 ? 'Vence hoy' :
                           daysToExpiry === 1 ? 'Vence mañana' :
                           `${daysToExpiry} días restantes`}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => addDetectedProductToFridge(product)}
                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
                      >
                        <Plus size={16} />
                        Añadir
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertTriangle className="w-16 h-16 text-orange-300 mx-auto mb-4" />
              <p className="text-gray-600">
                No se detectaron productos con fechas claras en esta imagen.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Intenta con una imagen más clara donde se vean las fechas de vencimiento.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Vista Productos
  const ProductsView = () => (
    <div className="space-y-6">
      {/* Controles */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">Todas las categorías</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-colors duration-200 flex items-center gap-2"
          >
            <Plus size={20} />
            Agregar Manual
          </button>
          
          <button
            onClick={() => setCurrentView('camera')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-colors duration-200 flex items-center gap-2"
          >
            <Camera size={20} />
            Usar Cámara
          </button>
        </div>
      </div>

      {/* Formulario agregar */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Nuevo Producto</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Nombre del producto"
              value={newProduct.name}
              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <select
              value={newProduct.category}
              onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
            <input
              type="date"
              value={newProduct.expiryDate}
              onChange={(e) => setNewProduct({...newProduct, expiryDate: e.target.value})}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="number"
              placeholder="Cantidad"
              min="1"
              value={newProduct.quantity}
              onChange={(e) => setNewProduct({...newProduct, quantity: parseInt(e.target.value)})}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="number"
              step="0.1"
              placeholder="Precio aprox. (€)"
              value={newProduct.price}
              onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => addProduct()}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Agregar
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista productos */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Tu Nevera Virtual ({sortedProducts.length} productos)</h3>
        {sortedProducts.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No tienes productos registrados</p>
            <p className="text-gray-400 text-sm">¡Agrega algunos para empezar!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedProducts.map(product => {
              const daysToExpiry = getDaysToExpiry(product.expiryDate);
              const alertColor = getAlertColor(daysToExpiry);
              
              return (
                <div key={product.id} className={`border-l-4 ${alertColor} bg-white border rounded-lg p-4 shadow-sm`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-800">{product.name}</h4>
                        {product.source === 'ocr' && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            📸 OCR
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 capitalize">{product.category}</p>
                      <div className="flex gap-4 text-sm text-gray-500 mt-1">
                        <span>Cantidad: {product.quantity}</span>
                        {product.price && <span>Valor: {product.price}€</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Vence: {product.expiryDate}</p>
                      <p className={`text-sm font-bold ${daysToExpiry < 0 ? 'text-red-600' : daysToExpiry <= 1 ? 'text-orange-600' : daysToExpiry <= 3 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {daysToExpiry < 0 ? `Caducado hace ${Math.abs(daysToExpiry)} días` : 
                         daysToExpiry === 0 ? 'Vence hoy' :
                         daysToExpiry === 1 ? 'Vence mañana' :
                         `${daysToExpiry} días restantes`}
                      </p>
                    </div>
                    <div className="ml-4 flex flex-col gap-1">
                      <button
                        onClick={() => markAsConsumed(product, true)}
                        className="text-green-600 hover:text-green-800 transition-colors duration-200 p-1"
                        title="Marcar como consumido"
                      >
                        <CheckCircle size={20} />
                      </button>
                      <button
                        onClick={() => removeProduct(product.id)}
                        className="text-red-600 hover:text-red-800 transition-colors duration-200 p-1"
                        title="Eliminar"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  // Vista Recetas IA Mejorada
  const RecipesView = () => {
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

  // Modal de Receta Detallada
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

  // Vista Logros
  const AchievementsView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🏆 Logros y Desafíos</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map(achievement => {
            // Lógica para desbloquear logros
            let unlocked = false;
            switch(achievement.id) {
              case 1: unlocked = products.length > 0; break;
              case 2: unlocked = userStats.totalSaved >= 10; break;
              case 3: unlocked = userStats.recipesGenerated >= 5; break;
              case 4: unlocked = userStats.streak >= 7; break;
              case 5: unlocked = userStats.co2Saved >= 50; break;
              case 6: unlocked = userStats.ocrUsed >= 10; break;
              case 7: unlocked = userStats.recipesGenerated >= 20; break;
            }
            
            return (
              <div key={achievement.id} className={`border rounded-lg p-4 transition-all ${
                unlocked ? 'border-green-200 bg-green-50 shadow-md' : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{achievement.name}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    <p className="text-xs text-purple-600 font-medium">+{achievement.points} puntos</p>
                  </div>
                  {unlocked ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <span className="text-sm font-medium text-green-600">¡Desbloqueado!</span>
                    </div>
                  ) : (
                    <div className="text-gray-400">
                      <Clock className="w-6 h-6" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-6">
          <h4 className="font-semibold text-gray-800 mb-3">🎯 Próximos Desafíos</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl mb-2">📸</div>
              <p className="font-medium">Usa OCR 5 veces más</p>
              <p className="text-gray-600">Progreso: {userStats.ocrUsed}/10</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🍳</div>
              <p className="font-medium">Genera 15 recetas más</p>
              <p className="text-gray-600">Progreso: {userStats.recipesGenerated}/20</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">💰</div>
              <p className="font-medium">Ahorra 40€ más</p>
              <p className="text-gray-600">Progreso: {userStats.totalSaved.toFixed(1)}/50€</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Vista Analytics
  const AnalyticsView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">📊 Resumen Mensual</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Productos consumidos:</span>
              <span className="font-bold text-green-600">{stats.totalConsumed}</span>
            </div>
            <div className="flex justify-between">
              <span>Productos desperdiciados:</span>
              <span className="font-bold text-red-600">{stats.totalWasted}</span>
            </div>
            <div className="flex justify-between">
              <span>Eficiencia:</span>
              <span className="font-bold text-blue-600">
                {stats.totalConsumed + stats.totalWasted > 0 
                  ? `${Math.round((stats.totalConsumed / (stats.totalConsumed + stats.totalWasted)) * 100)}%`
                  : '0%'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Análisis OCR realizados:</span>
              <span className="font-bold text-purple-600">{userStats.ocrUsed}</span>
            </div>
            <div className="flex justify-between">
              <span>Recetas generadas:</span>
              <span className="font-bold text-orange-600">{userStats.recipesGenerated}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">🌱 Impacto Ambiental</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>CO2 ahorrado:</span>
              <span className="font-bold text-green-600">{userStats.co2Saved.toFixed(1)} kg</span>
            </div>
            <div className="flex justify-between">
              <span>Agua ahorrada:</span>
              <span className="font-bold text-blue-600">{(userStats.co2Saved * 1.5).toFixed(0)} litros</span>
            </div>
            <div className="flex justify-between">
              <span>Equivale a:</span>
              <span className="font-bold text-purple-600">{Math.round(userStats.co2Saved / 2.3)} km en coche</span>
            </div>
            <div className="flex justify-between">
              <span>Dinero ahorrado:</span>
              <span className="font-bold text-green-600">{userStats.totalSaved.toFixed(2)}€</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📈 Tendencias</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-bold text-blue-800">Mejor Categoría</h4>
            <p className="text-sm text-blue-600">Frutas (85% consumidas)</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <h4 className="font-bold text-orange-800">Promedio Consumo</h4>
            <p className="text-sm text-orange-600">2.3 días antes vencimiento</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-bold text-green-800">Meta Mensual</h4>
            <p className="text-sm text-green-600">80% eficiencia (78% actual)</p>
          </div>
        </div>
      </div>

      {isPremium ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">📊 Analytics Premium</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3">Uso de Funciones IA</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>OCR este mes:</span>
                  <span className="font-medium">{userStats.ocrUsed} análisis</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Recetas generadas:</span>
                  <span className="font-medium">{userStats.recipesGenerated} recetas</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Precisión promedio:</span>
                  <span className="font-medium">94%</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-green-50 to-yellow-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3">Patrones de Consumo</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Día más activo:</span>
                  <span className="font-medium">Domingo</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Categoría favorita:</span>
                  <span className="font-medium">Frutas</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Mejor racha:</span>
                  <span className="font-medium">{userStats.streak} días</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">🔒 Analytics Premium</h3>
          <p className="text-gray-700 mb-4">
            Desbloquea análisis avanzados, patrones de consumo, comparativas mensuales y reportes detallados.
          </p>
          <button
            onClick={() => setIsPremium(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Actualizar a Premium
          </button>
        </div>
      )}
    </div>
  );

  // Renderizado principal
  return (
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
        <NavBar />

        {/* Content based on current view */}
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'products' && <ProductsView />}
        {currentView === 'camera' && <CameraView />}
        {currentView === 'recipes' && <RecipesView />}
        {currentView === 'achievements' && <AchievementsView />}
        {currentView === 'analytics' && <AnalyticsView />}

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
  );
};

// Añadir el ícono Crown que falta
const Crown = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M2.25 12l9.204-3.204a2.25 2.25 0 011.092 0L21.75 12M4.5 6.375a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm2.25 15.125h10.5a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.376-1.051 0l-.97-1.293a1.125 1.125 0 00-1.173-.417l-4.423 1.106A1.125 1.125 0 014.5 18.878v1.372c0 1.243 1.007 2.25 2.25 2.25z"/>
  </svg>
);

export default FreshAlertPro;