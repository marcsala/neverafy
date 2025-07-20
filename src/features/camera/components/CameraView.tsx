// features/camera/components/CameraView.tsx

import React, { useState, useCallback } from 'react';
import { Camera, Crown, Zap } from 'lucide-react';
import ImageUpload from './ImageUpload';
import OCRProgress from './OCRProgress';
import OCRResults from './OCRResults';
import { Button } from '../../../shared/components/ui';
import { FREEMIUM_LIMITS } from '../../../shared/utils/constants';

interface CameraViewProps {
  isPremium: boolean;
  userStats: {
    ocrUsed: number;
  };
  onProcessImage: (file: File) => Promise<any>;
  onAddProduct: (product: any) => void;
  onUpgradeToPremium?: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({
  isPremium,
  userStats,
  onProcessImage,
  onAddProduct,
  onUpgradeToPremium
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<'uploading' | 'analyzing' | 'extracting' | 'processing' | 'complete'>('analyzing');
  const [ocrResults, setOcrResults] = useState<any>(null);
  const [processingProgress, setProcessingProgress] = useState(0);

  const limitReached = !isPremium && userStats.ocrUsed >= FREEMIUM_LIMITS.OCR_MONTHLY;
  const usagePercentage = isPremium ? 0 : (userStats.ocrUsed / FREEMIUM_LIMITS.OCR_MONTHLY) * 100;

  const handleImageSelect = useCallback((file: File) => {
    setSelectedImage(file);
    setOcrResults(null);
    
    // Crear preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleClearImage = useCallback(() => {
    setSelectedImage(null);
    setImagePreview(null);
    setOcrResults(null);
    setProcessingProgress(0);
  }, []);

  const handleProcessImage = async () => {
    if (!selectedImage || limitReached) return;

    setIsProcessing(true);
    setProcessingProgress(0);
    setOcrResults(null);

    try {
      // Simular progreso del procesamiento
      setProcessingStage('uploading');
      setProcessingProgress(20);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProcessingStage('analyzing');
      setProcessingProgress(40);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProcessingStage('extracting');
      setProcessingProgress(60);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProcessingStage('processing');
      setProcessingProgress(80);

      const results = await onProcessImage(selectedImage);
      
      setProcessingProgress(100);
      setProcessingStage('complete');
      setOcrResults(results);
      
    } catch (error) {
      console.error('Error processing image:', error);
      setOcrResults({
        success: false,
        message: 'Error al procesar la imagen. Inténtalo de nuevo.',
        products: []
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddDetectedProduct = async (product: any) => {
    const productWithId = {
      ...product,
      id: `${Date.now()}-${Math.random()}`,
      addedDate: new Date().toISOString().split('T')[0],
      source: 'ocr',
      quantity: 1
    };
    
    await onAddProduct(productWithId);
  };

  const handleAddAllProducts = async () => {
    if (ocrResults?.products) {
      for (const product of ocrResults.products) {
        await handleAddDetectedProduct(product);
      }
    }
  };

  const handleRetryAnalysis = () => {
    setOcrResults(null);
    setProcessingProgress(0);
  };

  return (
    <div className="space-y-6">
      {/* Header con información de límites */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Camera className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Smart Camera OCR</h2>
              <p className="text-gray-600">
                Reconocimiento inteligente de productos y fechas con Claude AI
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              {isPremium ? (
                <div className="flex items-center gap-2 text-purple-600">
                  <Crown className="w-5 h-5" />
                  <span className="font-medium">Análisis ilimitados</span>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-600">
                    {userStats.ocrUsed}/{FREEMIUM_LIMITS.OCR_MONTHLY} análisis usados este mes
                  </p>
                  <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        usagePercentage >= 100 ? 'bg-red-500' : 
                        usagePercentage >= 80 ? 'bg-orange-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {limitReached && onUpgradeToPremium && (
              <Button
                onClick={onUpgradeToPremium}
                variant="premium"
                size="sm"
              >
                <Crown className="w-4 h-4" />
                Actualizar
              </Button>
            )}
          </div>
        </div>

        {/* Banner de límite alcanzado */}
        {limitReached && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="text-orange-600">⚠️</div>
              <div className="flex-1">
                <h4 className="font-medium text-orange-800">
                  Límite mensual alcanzado
                </h4>
                <p className="text-sm text-orange-700">
                  Has usado todos tus análisis OCR gratuitos este mes. 
                  {onUpgradeToPremium && ' Actualiza a Premium para análisis ilimitados.'}
                </p>
              </div>
              {onUpgradeToPremium && (
                <Button
                  onClick={onUpgradeToPremium}
                  variant="premium"
                  size="sm"
                >
                  Ver Premium
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Upload de imagen */}
      <ImageUpload
        onImageSelect={handleImageSelect}
        imagePreview={imagePreview}
        onClearImage={handleClearImage}
        disabled={limitReached}
      />

      {/* Botón de análisis */}
      {imagePreview && !ocrResults && !isProcessing && (
        <div className="text-center">
          <Button
            onClick={handleProcessImage}
            disabled={limitReached}
            variant="primary"
            size="lg"
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          >
            <Zap className="w-5 h-5" />
            Analizar con IA
          </Button>
          
          {!limitReached && (
            <p className="text-sm text-gray-500 mt-2">
              Análisis {isPremium ? 'premium' : `${FREEMIUM_LIMITS.OCR_MONTHLY - userStats.ocrUsed} restante${FREEMIUM_LIMITS.OCR_MONTHLY - userStats.ocrUsed !== 1 ? 's' : ''}`}
            </p>
          )}
        </div>
      )}

      {/* Progreso del procesamiento */}
      {isProcessing && (
        <OCRProgress
          isProcessing={isProcessing}
          stage={processingStage}
          progress={processingProgress}
          estimatedTime={5}
        />
      )}

      {/* Resultados */}
      {ocrResults && (
        <OCRResults
          results={ocrResults}
          onAddProduct={handleAddDetectedProduct}
          onAddAllProducts={handleAddAllProducts}
          onRetryAnalysis={handleRetryAnalysis}
          showRawData={false}
        />
      )}

      {/* Información adicional para usuarios gratuitos */}
      {!isPremium && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
          <div className="flex items-start gap-4">
            <Crown className="w-8 h-8 text-purple-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">
                ¿Necesitas más análisis?
              </h3>
              <p className="text-purple-700 mb-4">
                Con Premium obtienes análisis OCR ilimitados, mayor precisión y funciones exclusivas.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-purple-600 mb-4">
                <div className="flex items-center gap-2">
                  <span>✅</span>
                  <span>Análisis ilimitados</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🎯</span>
                  <span>Mayor precisión</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>⚡</span>
                  <span>Procesamiento más rápido</span>
                </div>
              </div>
              {onUpgradeToPremium && (
                <Button
                  onClick={onUpgradeToPremium}
                  variant="premium"
                >
                  <Crown className="w-4 h-4" />
                  Actualizar a Premium
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraView;
