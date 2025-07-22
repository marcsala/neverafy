// features/products/components/ProductsView.tsx

import React, { useState, useMemo } from 'react';
import ProductFilters from './ProductFilters';
import QuickActions from './QuickActions';
import ProductList from './ProductList';
import AddProductForm from './AddProductForm';
import { getDaysToExpiry } from '../../../shared/utils/dateUtils';
import { normalizeProductName } from '../../../shared/utils/formatters';

interface Product {
  id: string;
  name: string;
  category: string;
  expiryDate: string;
  quantity: number;
  price?: number;
  source?: string;
  confidence?: number;
  addedDate?: string;
}

interface NewProduct {
  name: string;
  category: string;
  expiryDate: string;
  quantity: number;
  price: string;
}

interface ProductsViewProps {
  products: Product[];
  onAddProduct: (product: NewProduct) => void;
  onMarkAsConsumed: (product: Product, wasConsumed: boolean) => void;
  onRemoveProduct: (id: string) => void;
  onNavigateToCamera: () => void;
  isPremium: boolean;
  userStats: {
    ocrUsed: number;
  };
}

const ProductsView: React.FC<ProductsViewProps> = ({
  products,
  onAddProduct,
  onMarkAsConsumed,
  onRemoveProduct,
  onNavigateToCamera,
  isPremium,
  userStats
}) => {
  console.log('📋 DEBUG ProductsView: Rendered with products:', products);
  console.log('📋 DEBUG ProductsView: Products length:', products.length);
  
  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('expiry');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact'>('list');
  
  // Estados para formulario
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtrar y ordenar productos
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Filtro por búsqueda
      const matchesSearch = normalizeProductName(product.name).includes(
        normalizeProductName(searchTerm)
      );
      
      // Filtro por categoría
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Ordenar productos
    filtered.sort((a, b) => {
      let compareValue = 0;

      switch (sortBy) {
        case 'expiry':
          compareValue = getDaysToExpiry(a.expiryDate) - getDaysToExpiry(b.expiryDate);
          break;
        case 'name':
          compareValue = a.name.localeCompare(b.name);
          break;
        case 'category':
          compareValue = a.category.localeCompare(b.category);
          break;
        case 'added':
          const dateA = new Date(a.addedDate || a.expiryDate);
          const dateB = new Date(b.addedDate || b.expiryDate);
          compareValue = dateA.getTime() - dateB.getTime();
          break;
        case 'price':
          compareValue = (a.price || 0) - (b.price || 0);
          break;
        default:
          compareValue = 0;
      }

      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

    return filtered;
  }, [products, searchTerm, selectedCategory, sortBy, sortOrder]);

  // Handlers
  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowAddForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowAddForm(true);
  };

  const handleFormSubmit = async (formData: NewProduct) => {
    console.log('📝 DEBUG ProductsView: Received form data:', formData);
    setIsSubmitting(true);
    
    try {
      if (editingProduct) {
        // TODO: Implementar edición cuando esté la funcionalidad
        console.log('Editando producto:', editingProduct.id, formData);
      } else {
        console.log('📝 DEBUG ProductsView: Calling onAddProduct');
        await onAddProduct(formData);
        console.log('📝 DEBUG ProductsView: onAddProduct completed successfully');
      }
      
      setShowAddForm(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error al guardar producto:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingProduct(null);
  };

  const handleExportProducts = () => {
    // Crear CSV con los productos
    const csvHeader = 'Nombre,Categoría,Fecha Vencimiento,Cantidad,Precio,Fuente\n';
    const csvData = products.map(p => 
      `"${p.name}","${p.category}","${p.expiryDate}","${p.quantity}","${p.price || ''}","${p.source || 'manual'}"`
    ).join('\n');
    
    const blob = new Blob([csvHeader + csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neverafy-productos-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportProducts = () => {
    // TODO: Implementar importación
    alert('Función de importación próximamente disponible');
  };

  return (
    <div className="space-y-6">
      {/* Acciones rápidas */}
      <QuickActions
        onAddProduct={handleAddProduct}
        onUseCamera={onNavigateToCamera}
        onViewModeChange={setViewMode}
        viewMode={viewMode}
        onExport={products.length > 0 ? handleExportProducts : undefined}
        onImport={handleImportProducts}
        isPremium={isPremium}
        userStats={userStats}
        productCount={products.length}
      />

      {/* Filtros y búsqueda */}
      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        productCount={products.length}
        filteredCount={filteredAndSortedProducts.length}
      />

      {/* Lista de productos */}
      <ProductList
        products={filteredAndSortedProducts}
        onMarkAsConsumed={onMarkAsConsumed}
        onRemove={onRemoveProduct}
        onEdit={handleEditProduct}
        viewMode={viewMode}
        showEmpty={products.length === 0}
      />

      {/* Formulario de agregar/editar producto */}
      <AddProductForm
        isOpen={showAddForm}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        initialProduct={editingProduct ? {
          name: editingProduct.name,
          category: editingProduct.category,
          expiryDate: editingProduct.expiryDate,
          quantity: editingProduct.quantity,
          price: editingProduct.price?.toString() || ''
        } : undefined}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default ProductsView;
