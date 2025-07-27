import React from 'react';
import { Plus, Camera } from 'lucide-react';
import { TouchableButton } from '@/shared/components/mobile';

interface MainActionsProps {
  onAddProduct: () => void;
  onOpenCamera: () => void;
}

export const MainActions: React.FC<MainActionsProps> = ({
  onAddProduct,
  onOpenCamera
}) => (
  <section className="px-4 py-4 bg-gray-50">
    <div className="grid grid-cols-2 gap-3">
      <TouchableButton
        className="bg-gradient-to-r from-green-600 to-green-700 h-16 rounded-2xl"
        onPress={onAddProduct}
      >
        <div className="text-center text-white">
          <Plus size={24} className="mx-auto mb-1" />
          <div className="text-sm font-bold">Añadir</div>
          <div className="text-xs opacity-90">Producto</div>
        </div>
      </TouchableButton>
      
      <TouchableButton
        className="bg-gradient-to-r from-blue-600 to-blue-700 h-16 rounded-2xl"
        onPress={onOpenCamera}
      >
        <div className="text-center text-white">
          <Camera size={24} className="mx-auto mb-1" />
          <div className="text-sm font-bold">Escanear</div>
          <div className="text-xs opacity-90">con IA</div>
        </div>
      </TouchableButton>
    </div>
  </section>
);