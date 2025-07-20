// features/camera/hooks/useOCR.ts

import { useState, useCallback, useRef } from 'react';
import { parseOCRDate } from '../../../shared/utils/dateUtils';

export interface DetectedProduct {
  name: string;
  category: string;
  expiryDate: string;
  estimatedPrice: number;
  confidence: number;
  detectedText?: string;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface OCRResult {
  success: boolean;
  message: string;
  products: DetectedProduct[];
  confidence?: number;
  processingTime?: number;
  rawText?: string;
}

/**
 * Hook para manejar el procesamiento OCR
 */
export const useOCR = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<OCRResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const processingStartTime = useRef<number>(0);

  const processImage = useCallback(async (
    file: File,
    apiFunction: (file: File) => Promise<any>
  ): Promise<OCRResult> => {
    setIsProcessing(true);
    setError(null);
    processingStartTime.current = Date.now();

    try {
      const result = await apiFunction(file);
      const processingTime = (Date.now() - processingStartTime.current) / 1000;

      const ocrResult: OCRResult = {
        ...result,
        processingTime
      };

      setResults(ocrResult);
      return ocrResult;
    } catch (err: any) {
      const errorResult: OCRResult = {
        success: false,
        message: err.message || 'Error procesando la imagen',
        products: [],
        processingTime: (Date.now() - processingStartTime.current) / 1000
      };

      setError(err.message);
      setResults(errorResult);
      return errorResult;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults(null);
    setError(null);
  }, []);

  return {
    isProcessing,
    results,
    error,
    processImage,
    clearResults
  };
};

/**
 * Hook para manejar la cámara y captura de imágenes
 */
export const useCamera = () => {
  const [isActive, setIsActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Cámara trasera por defecto
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      setStream(mediaStream);
      setIsActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      setError('No se pudo acceder a la cámara: ' + err.message);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsActive(false);
    setError(null);
  }, [stream]);

  const captureImage = useCallback((): Promise<File | null> => {
    if (!videoRef.current || !isActive) return Promise.resolve(null);

    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return Promise.resolve(null);

    ctx.drawImage(video, 0, 0);

    return new Promise<File | null>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `neverafy-capture-${Date.now()}.jpg`, {
            type: 'image/jpeg'
          });
          resolve(file);
        } else {
          resolve(null);
        }
      }, 'image/jpeg', 0.9);
    });
  }, [isActive]);

  const switchCamera = useCallback(async () => {
    if (!isActive) return;

    try {
      stopCamera();
      
      // Obtener lista de dispositivos
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      if (videoDevices.length > 1) {
        const currentDevice = stream?.getVideoTracks()[0]?.getSettings()?.deviceId;
        const nextDevice = videoDevices.find(device => device.deviceId !== currentDevice);
        
        if (nextDevice) {
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: nextDevice.deviceId }
          });
          
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        }
      }
    } catch (err: any) {
      setError('Error cambiando cámara: ' + err.message);
    }
  }, [isActive, stream, stopCamera]);

  return {
    isActive,
    error,
    videoRef,
    startCamera,
    stopCamera,
    captureImage,
    switchCamera,
    hasCamera: !!navigator.mediaDevices?.getUserMedia
  };
};

/**
 * Hook para validar archivos de imagen
 */
export const useImageValidation = () => {
  const validateImage = useCallback((file: File): { isValid: boolean; error?: string } => {
    // Validar tipo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `Tipo de archivo no válido. Usa: ${allowedTypes.map(t => t.split('/')[1]).join(', ')}`
      };
    }

    // Validar tamaño (10MB máximo)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'El archivo es demasiado grande. Máximo 10MB.'
      };
    }

    // Validar dimensiones mínimas
    return new Promise<{ isValid: boolean; error?: string }>((resolve) => {
      const img = new Image();
      img.onload = () => {
        if (img.width < 100 || img.height < 100) {
          resolve({
            isValid: false,
            error: 'La imagen es demasiado pequeña. Mínimo 100x100 píxeles.'
          });
        } else {
          resolve({ isValid: true });
        }
      };
      img.onerror = () => {
        resolve({
          isValid: false,
          error: 'No se pudo cargar la imagen.'
        });
      };
      img.src = URL.createObjectURL(file);
    }).then(result => {
      URL.revokeObjectURL(img.src);
      return result;
    });
  }, []);

  const optimizeImage = useCallback((file: File, maxWidth = 1920, quality = 0.8): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo aspecto
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        // Dibujar imagen optimizada
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            const optimizedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(optimizedFile);
          } else {
            resolve(file);
          }
        }, 'image/jpeg', quality);
      };

      img.src = URL.createObjectURL(file);
    });
  }, []);

  return {
    validateImage,
    optimizeImage
  };
};

/**
 * Hook principal que combina OCR, cámara y validación
 */
export const useCameraOCR = (apiFunction: (file: File) => Promise<any>) => {
  const ocrHook = useOCR();
  const cameraHook = useCamera();
  const validationHook = useImageValidation();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageSelect = useCallback(async (file: File) => {
    const validation = await validationHook.validateImage(file);
    
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // Optimizar imagen si es muy grande
    const optimizedFile = await validationHook.optimizeImage(file);
    
    setSelectedImage(optimizedFile);
    
    // Crear preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(optimizedFile);
  }, [validationHook]);

  const handleCameraCapture = useCallback(async () => {
    const capturedFile = await cameraHook.captureImage();
    if (capturedFile) {
      await handleImageSelect(capturedFile);
    }
  }, [cameraHook, handleImageSelect]);

  const processSelectedImage = useCallback(async () => {
    if (!selectedImage) return null;
    return await ocrHook.processImage(selectedImage, apiFunction);
  }, [selectedImage, ocrHook, apiFunction]);

  const clearAll = useCallback(() => {
    setSelectedImage(null);
    setImagePreview(null);
    ocrHook.clearResults();
    cameraHook.stopCamera();
  }, [ocrHook, cameraHook]);

  return {
    // Estados de imagen
    selectedImage,
    imagePreview,
    
    // Funciones de imagen
    handleImageSelect,
    handleCameraCapture,
    processSelectedImage,
    clearAll,
    
    // OCR
    ...ocrHook,
    
    // Cámara
    ...cameraHook,
    
    // Validación
    ...validationHook
  };
};
