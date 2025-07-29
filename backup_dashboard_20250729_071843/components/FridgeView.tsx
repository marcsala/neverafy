import React, { useState } from 'react';

interface Product {
  id: number;
  name: string;
  quantity: string;
  expiryDate: string;
  daysLeft: number;
}

interface FridgeViewProps {
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  onBack: () => void;
  isMobile: boolean;
}

const FridgeView: React.FC<FridgeViewProps> = ({ products, onUpdateProducts, onBack, isMobile }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [swipingProductId, setSwipingProductId] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const getExpiryBadge = (daysLeft: number) => {
    if (daysLeft < 1) return { class: 'urgent', text: 'Hoy', bgColor: 'bg-red-50', textColor: 'text-red-600' };
    if (daysLeft === 1) return { class: 'urgent', text: 'Mañana', bgColor: 'bg-red-50', textColor: 'text-red-600' };
    if (daysLeft < 4) return { class: 'warning', text: 'Pronto', bgColor: 'bg-amber-50', textColor: 'text-amber-600' };
    return { class: 'safe', text: 'Fresco', bgColor: 'bg-green-50', textColor: 'text-green-600' };
  };

  const handleAddProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const productName = formData.get('product-name') as string;
    const expiryDate = formData.get('expiry-date') as string;
    const quantity = formData.get('quantity') as string;
    
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
    
    onUpdateProducts([...products, newProduct]);
    setIsAddModalOpen(false);
    event.currentTarget.reset();
  };

  const handleEditProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingProduct) return;

    const formData = new FormData(event.currentTarget);
    const productName = formData.get('product-name') as string;
    const expiryDate = formData.get('expiry-date') as string;
    const quantity = formData.get('quantity') as string;
    
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysLeft = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    const updatedProduct: Product = {
      ...editingProduct,
      name: productName,
      quantity: quantity,
      expiryDate: expiryDate,
      daysLeft: daysLeft
    };
    
    const updatedProducts = products.map(p => p.id === editingProduct.id ? updatedProduct : p);
    onUpdateProducts(updatedProducts);
    setIsEditModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId: number) => {
    const updatedProducts = products.filter(p => p.id !== productId);
    onUpdateProducts(updatedProducts);
    setSwipingProductId(null);
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent, productId: number) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent, productId: number) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (productId: number) => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setSwipingProductId(productId);
    } else if (isRightSwipe) {
      setSwipingProductId(null);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Mi Nevera</h1>
          </div>
          <div className="text-sm text-gray-500">
            {products.length} productos
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-4">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tu nevera está vacía</h3>
            <p className="text-gray-500 mb-6">Añade productos para empezar a gestionar tu nevera inteligente</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Añadir primer producto
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => {
              const badge = getExpiryBadge(product.daysLeft);
              const isSwipeOpen = swipingProductId === product.id;
              
              return (
                <div key={product.id} className="relative">
                  {/* Swipe Background - Solo en móvil */}
                  {isMobile && (
                    <div className="absolute inset-0 bg-red-500 rounded-xl flex items-center justify-end pr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Product Card */}
                  <div
                    className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 cursor-pointer transform transition-transform duration-200 ${
                      isSwipeOpen ? 'translate-x-[-80px]' : 'translate-x-0'
                    }`}
                    onClick={() => !isMobile && handleEditClick(product)}
                    onTouchStart={isMobile ? (e) => handleTouchStart(e, product.id) : undefined}
                    onTouchMove={isMobile ? (e) => handleTouchMove(e, product.id) : undefined}
                    onTouchEnd={isMobile ? () => handleTouchEnd(product.id) : undefined}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        badge.bgColor
                      } ${badge.textColor}`}>
                        {badge.text}
                      </div>
                      
                      {/* Desktop Actions */}
                      {!isMobile && (
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(product);
                            }}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                          >
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProduct(product.id);
                            }}
                            className="p-1 hover:bg-red-100 rounded transition-colors group"
                          >
                            <svg className="w-4 h-4 text-gray-400 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2 text-lg">{product.name}</h3>
                    <div className="text-sm text-gray-500 mb-3">{product.quantity}</div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <div className="text-gray-400">
                        {new Date(product.expiryDate).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </div>
                      <div className="font-medium text-gray-600">
                        {product.daysLeft > 0 ? `${product.daysLeft} días` : 'Vencido'}
                      </div>
                    </div>
                    
                    {/* Mobile tap to edit indicator */}
                    {isMobile && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="text-xs text-gray-400 text-center">Desliza ← para eliminar • Toca para editar</div>
                      </div>
                    )}
                  </div>
                  
                  {/* Mobile Delete Button */}
                  {isMobile && isSwipeOpen && (
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-red-500 text-white p-3 rounded-full shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      {products.length > 0 && (
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors z-30"
          style={{ bottom: isMobile ? '100px' : '24px' }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-end md:items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-t-3xl md:rounded-3xl max-h-[80vh] overflow-y-auto">
            <div className="p-6 text-center relative">
              <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-5 md:hidden"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Añadir producto</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
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

      {/* Edit Product Modal */}
      {isEditModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-end md:items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-t-3xl md:rounded-3xl max-h-[80vh] overflow-y-auto">
            <div className="p-6 text-center relative">
              <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-5 md:hidden"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Editar producto</h3>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingProduct(null);
                }}
                className="absolute top-6 right-6 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="px-6 pb-6">
              <form onSubmit={handleEditProduct} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre del producto
                  </label>
                  <input
                    type="text"
                    name="product-name"
                    defaultValue={editingProduct.name}
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
                    defaultValue={editingProduct.expiryDate}
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
                    defaultValue={editingProduct.quantity}
                    className="w-full h-13 border border-gray-300 rounded-xl px-4 text-base bg-white focus:outline-none focus:border-blue-600 transition-colors"
                    style={{height: '52px'}}
                    placeholder="Ej: 1 litro, 500g, 6 unidades..."
                    required
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setEditingProduct(null);
                    }}
                    className="flex-1 h-13 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                    style={{height: '52px'}}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 h-13 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                    style={{height: '52px'}}
                  >
                    Guardar cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FridgeView;