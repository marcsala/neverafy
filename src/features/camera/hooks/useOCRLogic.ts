import { useState, useCallback } from 'react';
import { processImageWithClaude } from '../../../services/claudeApi';
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

  const processImage = useCallback(async () => {
    if (!selectedImage) return null;

    // Verificar límites freemium
    if (!isPremium && userStats.ocrUsed >= FREEMIUM_LIMITS.OCR_MONTHLY) {
      throw new Error('🔒 Has alcanzado el límite de 3 análisis mensuales. ¡Actualiza a Premium para análisis ilimitados!');
    }

    setIsProcessingOCR(true);

    try {
      const results = await processImageWithClaude(selectedImage);
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
        message: "Error procesando la imagen."
      };
      setOcrResults(errorResults);
      throw error;
    } finally {
      setIsProcessingOCR(false);
    }
  }, [selectedImage, isPremium, userStats.ocrUsed, setUserStats]);

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
    handleImageSelect,
    processImage,
    resetOCR,
    setSelectedImage,
    setImagePreview,
    setOcrResults
  };
};