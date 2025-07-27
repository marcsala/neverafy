import React from 'react';
import { MoreVertical } from 'lucide-react';
import { TouchableCard, TouchableButton, SwipeableCard } from '@/shared/components/mobile';

// Utility functions
const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    dairy: "🥛",
    vegetables: "🥬",
    fruits: "🍎",
    meat: "🥩",
    bakery: "🍞",
    seafood: "🐟"
  };
  return icons[category] || "🍽️";
};

const getUrgencyColor = (daysToExpiry: number) => {
  if (daysToExpiry < 0) return {
    bg: 'bg-red-100',
    border: 'border-l-red-500',
    text: 'text-red-700'
  };
  if (daysToExpiry === 0) return {
    bg: 'bg-red-50',
    border: 'border-l-red-400',
    text: 'text-red-600'
  };
  if (daysToExpiry === 1) return {
    bg: 'bg-amber-50',
    border: 'border-l-amber-400',
    text: 'text-amber-600'
  };
  if (daysToExpiry <= 3) return {
    bg: 'bg-orange-50',
    border: 'border-l-orange-300',
    text: 'text-orange-600'
  };
  return {
    bg: 'bg-green-50',
    border: 'border-l-green-300',
    text: 'text-green-600'
  };
};

const formatDate = (date: string | Date) => {
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short'
  }).format(new Date(date));
};

interface ProductCardMobileProps {
  product: {
    id: string | number;
    name: string;
    category: string;
    quantity: number;
    expiryDate: string | Date;
  };
  onSwipeComplete: () => void;
  onPress: () => void;
  showQuickActions?: boolean;
}

export const ProductCardMobile: React.FC<ProductCardMobileProps> = ({
  product,
  onSwipeComplete,
  onPress,
  showQuickActions = false
}) => {
  const daysToExpiry = Math.ceil((new Date(product.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const urgencyColor = getUrgencyColor(daysToExpiry);
  
  return (
    <SwipeableCard onSwipeComplete={onSwipeComplete}>
      <TouchableCard
        onPress={onPress}
        className={`
          bg-white border-l-4 ${urgencyColor.border} 
          p-4 rounded-xl shadow-sm min-h-[72px] ${urgencyColor.bg}
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <span className="text-2xl">{getCategoryIcon(product.category)}</span>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-800 truncate">
                {product.name}
              </h4>
              <p className="text-sm text-gray-500">
                {product.quantity} unidades
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className={`text-sm font-bold ${urgencyColor.text}`}>
              {daysToExpiry === 0 ? '¡HOY!' : 
               daysToExpiry === 1 ? 'Mañana' : 
               `${daysToExpiry} días`}
            </div>
            <div className="text-xs text-gray-400">
              {formatDate(product.expiryDate)}
            </div>
          </div>
          
          {showQuickActions && (
            <div className="ml-2">
              <TouchableButton variant="secondary" size="small">
                <MoreVertical size={16} />
              </TouchableButton>
            </div>
          )}
        </div>
      </TouchableCard>
    </SwipeableCard>
  );
};

interface QuickFridgeProps {
  products: any[];
  onViewAll: () => void;
  onMarkConsumed: (productId: string | number) => void;
  onViewProduct: (productId: string | number) => void;
}

export const QuickFridge: React.FC<QuickFridgeProps> = ({
  products,
  onViewAll,
  onMarkConsumed,
  onViewProduct
}) => {
  const upcomingProducts = products
    .map(p => ({
      ...p,
      daysToExpiry: Math.ceil((new Date(p.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    }))
    .filter(p => p.daysToExpiry <= 3)
    .sort((a, b) => a.daysToExpiry - b.daysToExpiry);

  return (
    <section className="px-4 py-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold">Tu nevera</h3>
        <TouchableButton 
          variant="secondary"
          size="small"
          onPress={onViewAll}
        >
          Ver todos ({products.length})
        </TouchableButton>
      </div>
      
      <div className="space-y-2">
        {upcomingProducts.slice(0, 4).map(product => (
          <ProductCardMobile
            key={product.id}
            product={product}
            onSwipeComplete={() => onMarkConsumed(product.id)}
            onPress={() => onViewProduct(product.id)}
            showQuickActions={true}
          />
        ))}
      </div>
      
      {upcomingProducts.length > 4 && (
        <TouchableButton 
          variant="secondary"
          className="w-full mt-3"
          onPress={onViewAll}
        >
          Ver {upcomingProducts.length - 4} productos más
        </TouchableButton>
      )}
      
      {upcomingProducts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <span className="text-4xl block mb-2">🎉</span>
          <p className="text-sm">¡Perfecto! No tienes productos próximos a vencer</p>
        </div>
      )}
    </section>
  );
};