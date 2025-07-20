// features/camera/components/ImageUpload.tsx

import React, { useRef, useCallback } from 'react';
import { Camera, X, Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '../../../shared/components/ui';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  imagePreview: string | null;
  onClearImage: () => void;
  disabled?: boolean;
  maxSizeMB?: number;
  acceptedFormats?: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  imagePreview,
  onClearImage,
  disabled = false,
  maxSizeMB = 10,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp']
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!acceptedFormats.includes(file.type)) {
      alert(`Formato no soportado. Usa: ${acceptedFormats.map(f => f.split('/')[1]).join(', ')}`);
      return;
    }

    // Validar tamaño
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      alert(`El archivo es demasiado grande. Máximo ${maxSizeMB}MB.`);
      return;
    }

    onImageSelect(file);
  }, [onImageSelect, acceptedFormats, maxSizeMB]);

  const handleDropZoneClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => acceptedFormats.includes(file.type));
    
    if (imageFile) {
      const sizeMB = imageFile.size / (1024 * 1024);
      if (sizeMB <= maxSizeMB) {
        onImageSelect(imageFile);
      } else {
        alert(`El archivo es demasiado grande. Máximo ${maxSizeMB}MB.`);
      }
    }
  }, [onImageSelect, acceptedFormats, maxSizeMB, disabled]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleClearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClearImage();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Zona de subida */}
      <div
        onClick={handleDropZoneClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          disabled 
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
            : imagePreview
              ? 'border-green-300 bg-green-50 cursor-pointer hover:border-green-400'
              : 'border-gray-300 bg-white cursor-pointer hover:border-blue-500 hover:bg-blue-50'
        }`}
      >
        <div className="flex flex-col items-center space-y-4">
          {imagePreview ? (
            <div className="relative group">
              <img
                src={imagePreview}
                alt="Vista previa"
                className="max-w-xs max-h-48 rounded-lg shadow-md"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
                <button
                  onClick={handleClearImage}
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                  title="Eliminar imagen"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Botón eliminar siempre visible en móvil */}
              <button
                onClick={handleClearImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 md:hidden"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <>
              <div className="p-4 bg-blue-100 rounded-full">
                <Camera size={48} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Sube una foto de tus productos
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  Arrastra y suelta una imagen o haz clic para seleccionar
                </p>
                <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <ImageIcon size={14} />
                    JPG, PNG, WEBP
                  </span>
                  <span className="flex items-center gap-1">
                    <Upload size={14} />
                    Máx {maxSizeMB}MB
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(',')}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {/* Acciones adicionales */}
      {imagePreview && (
        <div className="flex gap-3 justify-center">
          <Button
            onClick={handleDropZoneClick}
            variant="secondary"
            size="sm"
            disabled={disabled}
          >
            <Camera size={16} />
            Cambiar imagen
          </Button>
          
          <Button
            onClick={handleClearImage}
            variant="danger"
            size="sm"
            disabled={disabled}
          >
            <X size={16} />
            Eliminar
          </Button>
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">💡 Tips para mejores resultados:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Asegúrate de que las fechas de vencimiento sean legibles</li>
          <li>• Usa buena iluminación y evita sombras</li>
          <li>• Mantén la cámara estable y enfocada</li>
          <li>• Los productos individuales funcionan mejor que grupos</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageUpload;
