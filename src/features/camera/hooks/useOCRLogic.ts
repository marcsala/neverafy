import { useState, useCallback } from 'react';
import ClaudeAIService from '../../../services/claudeAI';
import { FREEMIUM_LIMITS, POINTS } from '../../../shared/utils/constants';

interface UseOCRLogicProps {
  isPremium: boolean;
  userStats: { ocrUsed: number };
  setUserStats: (updater: (prev: any) => any) => void;
}

export const useOCRLogic = ({ isPremium, userStats, setUserStats }: UseOCRLogicProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const [ocrResults, setOcrResults] = useState<any>(null);
  const [processingType, setProcessingType] = useState<'expiry' | 'receipt' | null>(null);

  const handleImageSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
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
  }, []);

  // Procesar imagen para detectar fechas de caducidad
  const processExpiryImage = useCallback(async () => {
    if (!selectedImage) return null;

    // Verificar límites freemium
    if (!isPremium && userStats.ocrUsed >= FREEMIUM_LIMITS.OCR_MONTHLY) {
      throw new Error('🔒 Has alcanzado el límite de 3 análisis mensuales. ¡Actualiza a Premium para análisis ilimitados!');
    }

    setIsProcessingOCR(true);
    setProcessingType('expiry');

    try {
      const results = await ClaudeAIService.processExpiryDateImage(selectedImage);
      setOcrResults(results);

      // Actualizar estadísticas
      setUserStats(prev => ({
        ...prev,
        ocrUsed: prev.ocrUsed + 1,
        points: prev.points + POINTS.USE_OCR
      }));

      return results;
    } catch (error) {
      const errorResults = {
        products: [],
        success: false,
        message: "Error procesando la imagen de fecha de caducidad."
      };
      setOcrResults(errorResults);
      throw error;
    } finally {
      setIsProcessingOCR(false);
      setProcessingType(null);
    }
  }, [selectedImage, isPremium, userStats.ocrUsed, setUserStats]);

  // Procesar imagen para detectar ticket completo
  const processReceiptImage = useCallback(async () => {
    if (!selectedImage) return null;

    // Verificar límites freemium
    if (!isPremium && userStats.ocrUsed >= FREEMIUM_LIMITS.OCR_MONTHLY) {
      throw new Error('🔒 Has alcanzado el límite de 3 análisis mensuales. ¡Actualiza a Premium para análisis ilimitados!');
    }

    setIsProcessingOCR(true);
    setProcessingType('receipt');

    try {
      const results = await ClaudeAIService.processReceiptImage(selectedImage);
      setOcrResults(results);

      // Actualizar estadísticas
      setUserStats(prev => ({
        ...prev,
        ocrUsed: prev.ocrUsed + 1,
        points: prev.points + POINTS.USE_OCR
      }));

      return results;
    } catch (error) {
      const errorResults = {
        success: false,
        message: "Error procesando el ticket de compra.",
        receiptData: null
      };
      setOcrResults(errorResults);
      throw error;
    } finally {
      setIsProcessingOCR(false);
      setProcessingType(null);
    }
  }, [selectedImage, isPremium, userStats.ocrUsed, setUserStats]);

  // Mantener compatibilidad con el método anterior
  const processImage = processExpiryImage;

  const resetOCR = useCallback(() => {
    setSelectedImage(null);
    setImagePreview(null);
    setOcrResults(null);
    setIsProcessingOCR(false);
  }, []);

  return {
    selectedImage,
    imagePreview,
    isProcessingOCR,
    ocrResults,
    processingType,
    handleImageSelect,
    processImage,
    processExpiryImage,
    processReceiptImage,
    resetOCR,
    setSelectedImage,
    setImagePreview,
    setOcrResults
  };
};