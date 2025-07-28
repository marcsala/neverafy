import React, { useState, useEffect } from 'react';
import FridgeView from './FridgeView';
import ProfileView from './ProfileView';
import { useSupabaseProducts, useSupabaseUserStats } from '../shared/hooks/useSupabase';

interface Product {
  id: number;
  name: string;
  quantity: string;
  expiryDate: string;
  daysLeft: number;
}

interface DashboardProps {
  userStats?: any;
  stats?: any;
  notifications?: any[];
  products?: Product[];
  productActions?: any;
  userName?: string;
  userId?: string;
}

const DashboardComponent: React.FC<DashboardProps> = ({
  userStats,
  stats,
  notifications,
  products: initialProducts,
  productActions,
  userName = 'Usuario',
  userId
}) => {
  // Usar hooks de Supabase para datos reales
  const { products: realProducts, loading: productsLoading, addProduct, deleteProduct: removeProduct, refetch } = useSupabaseProducts(userId);
  const { userStats: realUserStats, loading: statsLoading } = useSupabaseUserStats(userId);
  
  // Convertir productos de Supabase al formato local
  const convertSupabaseProduct = (supabaseProduct: any): Product => {
    const today = new Date();
    const expiryDate = new Date(supabaseProduct.expiry_date);
    const daysLeft = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      id: parseInt(supabaseProduct.id) || Date.now(),
      name: supabaseProduct.name,
      quantity: supabaseProduct.quantity?.toString() || '1 unidad',
      expiryDate: supabaseProduct.expiry_date,
      daysLeft
    };
  };
  
  // Usar productos reales de Supabase si están disponibles
  const [products, setProducts] = useState<Product[]>(
    realProducts.length > 0 
      ? realProducts.map(convertSupabaseProduct)
      : initialProducts || [
          {id: 1, name: "Leche entera", quantity: "1 litro", expiryDate: "2025-07-30", daysLeft: 3},
          {id: 2, name: "Tomates cherry", quantity: "500g", expiryDate: "2025-08-01", daysLeft: 5},
          {id: 3, name: "Yogur natural", quantity: "4 unidades", expiryDate: "2025-07-28", daysLeft: 1},
          {id: 4, name: "Pollo fileteado", quantity: "600g", expiryDate: "2025-07-29", daysLeft: 2},
          {id: 5, name: "Pan integral", quantity: "1 barra", expiryDate: "2025-08-01", daysLeft: 5}
        ]
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'fridge' | 'profile'>('dashboard');

  // Actualizar productos cuando cambien los datos de Supabase
  useEffect(() => {
    if (realProducts.length > 0) {
      setProducts(realProducts.map(convertSupabaseProduct));
    }
  }, [realProducts]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleAddProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const productName = formData.get('product-name') as string;
    const expiryDate = formData.get('expiry-date') as string;
    const quantity = formData.get('quantity') as string;
    
    try {
      if (userId) {
        // Usar Supabase para guardar el producto
        const supabaseProduct = await addProduct({
          name: productName,
          category: 'general', // Podrías añadir selección de categoría
          expiry_date: expiryDate,
          quantity: quantity,
          source: 'manual'
        });
        
        if (supabaseProduct) {
          showNotification(`${productName} añadido a tu nevera`);
          setIsModalOpen(false);
          event.currentTarget.reset();
          return;
        }
      }
      
      // Fallback: añadir localmente si no hay userId o falla Supabase
      const today = new Date();
      const expiry = new Date(expiryDate);
      const daysLeft = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      const newProduct: Product = {
        id: Date.now(),
        name: productName,
        quantity: quantity,
        expiryDate: expiryDate,
        daysLeft: daysLeft
      };
      
      setProducts(prev => [...prev, newProduct]);
      showNotification(`${productName} añadido a tu nevera`);
    } catch (error) {
      console.error('Error adding product:', error);
      showNotification('Error al añadir producto');
    } finally {
      setIsModalOpen(false);
      event.currentTarget.reset();
    }
  };

  const urgentProducts = products.filter(p => p.daysLeft < 2);
  const expiringSoon = products.filter(p => p.daysLeft < 4).length;

  const getExpiryBadge = (daysLeft: number) => {
    if (daysLeft < 1) return { class: 'urgent', text: 'Hoy' };
    if (daysLeft === 1) return { class: 'urgent', text: 'Mañana' };
    if (daysLeft < 4) return { class: 'warning', text: 'Pronto' };
    return { class: 'safe', text: 'Fresco' };
  };

  const today = new Date().toISOString().split('T')[0];

  // Si estamos en la vista de nevera, mostrar el componente FridgeView
  if (currentView === 'fridge') {
    return (
      <FridgeView
        products={products}
        onUpdateProducts={setProducts}
        onBack={() => setCurrentView('dashboard')}
        isMobile={isMobile}
      />
    );
  }

  // Si estamos en la vista de perfil, mostrar el componente ProfileView
  if (currentView === 'profile') {
    return (
      <ProfileView
        onBack={() => setCurrentView('dashboard')}
        isMobile={isMobile}
        userName={userName}
        userEmail="usuario@neverafy.com"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar - Solo visible en desktop */}
      <aside 
        className="fixed left-0 top-0 h-screen bg-white border-r border-gray-200 p-6 z-50"
        style={{
          width: '280px',
          display: isMobile ? 'none' : 'block'
        }}
      >
        <div className="mb-8">
          <div className="text-2xl font-semibold text-gray-900 mb-2">Neverafy</div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-semibold text-sm text-gray-900">{userName}</div>
              <div className="text-xs text-gray-500">Nevera inteligente</div>
            </div>
          </div>
        </div>
        
        <nav>
          <ul className="space-y-2">
            <li>
              <a href="#" className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 text-blue-600 font-medium">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9,22 9,12 15,12 15,22"/>
                </svg>
                Dashboard
              </a>
            </li>
            <li>
              <button
                onClick={() => setCurrentView('fridge')}
                className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2.5 2v6h19V2"/>
                  <path d="M2.5 8v10c0 1.1.9 2 2 2h15c1.1 0 2-.9 2-2V8"/>
                </svg>
                Mi Nevera
              </button>
            </li>
            <li>
              <button
                onClick={() => showNotification('Abriendo cámara para escanear productos...')}
                className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
                Escanear Producto
              </button>
            </li>
            <li>
              <a href="#" className="flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                Recetas
              </a>
            </li>
            <li>
              <button
                onClick={() => setCurrentView('profile')}
                className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Perfil
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Mobile Header - Solo visible en móvil */}
      <header 
        className="bg-white p-4 border-b border-gray-200 sticky top-0 z-50"
        style={{
          display: isMobile ? 'block' : 'none'
        }}
      >
        <div className="flex justify-between items-center">
          <div className="text-xl font-semibold text-gray-900">Neverafy</div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => showNotification('Panel de notificaciones')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="m13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </button>
            <div className="w-9 h-9 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold">
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main 
        className="min-h-screen"
        style={{
          marginLeft: isMobile ? '0' : '280px',
          paddingBottom: isMobile ? '80px' : '0'
        }}
      >
        {/* Desktop Layout - Solo visible en desktop */}
        <div 
          className="max-w-6xl mx-auto p-6"
          style={{
            display: isMobile ? 'none' : 'block'
          }}
        >
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Urgent Alerts */}
              {urgentProducts.length > 0 && (
                <section>
                  {urgentProducts.map((product) => {
                    const isToday = product.daysLeft < 1;
                    return (
                      <div
                        key={product.id}
                        className={`bg-white rounded-xl p-5 mb-3 border-l-4 shadow-sm ${
                          isToday ? 'border-red-500' : 'border-amber-500'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold text-gray-900 mb-1">
                              {product.name} {isToday ? 'caduca hoy' : 'caduca mañana'}
                            </div>
                            <div className="text-sm text-gray-500">{product.quantity}</div>
                          </div>
                          <button className="text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors">
                            Ver recetas
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </section>
              )}

              {/* Products List */}
              <section>
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-xl font-semibold text-gray-900">Mi nevera</h2>
                  <button className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
                    Ver todo
                  </button>
                </div>
                
                <div className="space-y-3">
                  {products.slice(0, 6).map((product) => {
                    const badge = getExpiryBadge(product.daysLeft);
                    return (
                      <div key={product.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-gray-900 mb-1">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.quantity}</div>
                        </div>
                        <div className="text-right">
                          <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-1 ${
                            badge.class === 'urgent' ? 'bg-red-50 text-red-600' :
                            badge.class === 'warning' ? 'bg-amber-50 text-amber-600' :
                            'bg-green-50 text-green-600'
                          }`}>
                            {badge.text}
                          </div>
                          <div className="text-xs text-gray-400">{product.daysLeft} días</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>

            {/* Desktop Sidebar Content */}
            <div className="space-y-6">
              {/* Add Product Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full h-14 bg-blue-600 text-white rounded-xl font-medium flex items-center justify-center gap-3 hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Añadir producto
              </button>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">{products.length}</div>
                  <div className="text-sm text-gray-500">Total productos</div>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">{expiringSoon}</div>
                  <div className="text-sm text-gray-500">Caducan pronto</div>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">47€</div>
                  <div className="text-sm text-gray-500">Ahorrado este mes</div>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">2.3kg</div>
                  <div className="text-sm text-gray-500">CO₂ evitado</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout - Solo visible en móvil */}
        <div style={{
          display: isMobile ? 'block' : 'none'
        }}>
          {/* Urgent Alerts Mobile */}
          {urgentProducts.length > 0 && (
            <section className="p-6">
              {urgentProducts.map((product) => {
                const isToday = product.daysLeft < 1;
                return (
                  <div
                    key={product.id}
                    className={`bg-white rounded-xl p-5 mb-3 border-l-4 shadow-sm ${
                      isToday ? 'border-red-500' : 'border-amber-500'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-gray-900 mb-1">
                          {product.name} {isToday ? 'caduca hoy' : 'caduca mañana'}
                        </div>
                        <div className="text-sm text-gray-500">{product.quantity}</div>
                      </div>
                      <button className="text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors">
                        Ver recetas
                      </button>
                    </div>
                  </div>
                );
              })}
            </section>
          )}

          {/* Add Product Button Mobile */}
          <section className="px-6 pb-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full h-14 bg-blue-600 text-white rounded-xl font-medium flex items-center justify-center gap-3 hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Añadir producto
            </button>
          </section>

          {/* Stats Mobile */}
          <section className="px-6 pb-6">
            <div className="flex gap-4 overflow-x-auto pb-2">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center min-w-[140px]">
                <div className="text-2xl font-bold text-gray-900 mb-1">{products.length}</div>
                <div className="text-sm text-gray-500">Total productos</div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center min-w-[140px]">
                <div className="text-2xl font-bold text-gray-900 mb-1">{expiringSoon}</div>
                <div className="text-sm text-gray-500">Caducan pronto</div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center min-w-[140px]">
                <div className="text-2xl font-bold text-gray-900 mb-1">47€</div>
                <div className="text-sm text-gray-500">Ahorrado este mes</div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center min-w-[140px]">
                <div className="text-2xl font-bold text-gray-900 mb-1">2.3kg</div>
                <div className="text-sm text-gray-500">CO₂ evitado</div>
              </div>
            </div>
          </section>

          {/* Products List Mobile */}
          <section className="px-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold text-gray-900">Mi nevera</h2>
              <button className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
                Ver todo
              </button>
            </div>
            
            <div className="space-y-3">
              {products.map((product) => {
                const badge = getExpiryBadge(product.daysLeft);
                return (
                  <div key={product.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.quantity}</div>
                    </div>
                    <div className="text-right">
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-1 ${
                        badge.class === 'urgent' ? 'bg-red-50 text-red-600' :
                        badge.class === 'warning' ? 'bg-amber-50 text-amber-600' :
                        'bg-green-50 text-green-600'
                      }`}>
                        {badge.text}
                      </div>
                      <div className="text-xs text-gray-400">{product.daysLeft} días</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      {/* Mobile Bottom Navigation - Solo visible en móvil */}
      <nav 
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center z-50"
        style={{
          display: isMobile ? 'flex' : 'none'
        }}
      >
        <button className="flex flex-col items-center gap-1 text-blue-600 p-2">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9,22 9,12 15,12 15,22"/>
          </svg>
          <span className="text-xs font-medium">Inicio</span>
        </button>
        
        <button
          onClick={() => setCurrentView('fridge')}
          className="flex flex-col items-center gap-1 text-gray-400 p-2"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2.5 2v6h19V2"/>
            <path d="M2.5 8v10c0 1.1.9 2 2 2h15c1.1 0 2-.9 2-2V8"/>
          </svg>
          <span className="text-xs font-medium">Nevera</span>
        </button>
        
        <button
          onClick={() => showNotification('Abriendo cámara para escanear productos...')}
          className="bg-blue-600 text-white w-14 h-14 rounded-full flex items-center justify-center mx-4 shadow-lg"
        >
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        </button>
        
        <button className="flex flex-col items-center gap-1 text-gray-400 p-2">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <span className="text-xs font-medium">Recetas</span>
        </button>
        
        <button
          onClick={() => setCurrentView('profile')}
          className="flex flex-col items-center gap-1 text-gray-400 p-2"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <span className="text-xs font-medium">Perfil</span>
        </button>
      </nav>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-end md:items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-t-3xl md:rounded-3xl max-h-[80vh] overflow-y-auto">
            <div className="p-6 text-center relative">
              <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-5 md:hidden"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Añadir producto</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="px-6 pb-6">
              <form onSubmit={handleAddProduct} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre del producto
                  </label>
                  <input
                    type="text"
                    name="product-name"
                    className="w-full h-13 border border-gray-300 rounded-xl px-4 text-base bg-white focus:outline-none focus:border-blue-600 transition-colors"
                    style={{height: '52px'}}
                    placeholder="Ej: Leche, Tomates, Yogurt..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Fecha de caducidad
                  </label>
                  <input
                    type="date"
                    name="expiry-date"
                    min={today}
                    className="w-full h-13 border border-gray-300 rounded-xl px-4 text-base bg-white focus:outline-none focus:border-blue-600 transition-colors"
                    style={{height: '52px'}}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cantidad
                  </label>
                  <input
                    type="text"
                    name="quantity"
                    className="w-full h-13 border border-gray-300 rounded-xl px-4 text-base bg-white focus:outline-none focus:border-blue-600 transition-colors"
                    style={{height: '52px'}}
                    placeholder="Ej: 1 litro, 500g, 6 unidades..."
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full h-13 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors mt-4"
                  style={{height: '52px'}}
                >
                  Añadir a nevera
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className="fixed top-5 left-5 right-5 bg-gray-900 text-white p-4 rounded-xl font-medium z-50 md:max-w-md md:left-auto md:right-5">
          {notification}
        </div>
      )}
    </div>
  );
};

export default DashboardComponent;