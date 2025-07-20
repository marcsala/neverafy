// features/camera/components/OCRProgress.tsx

import React from 'react';
import { Loader2, Zap, Eye, Brain, CheckCircle } from 'lucide-react';
import { LoadingSpinner } from '../../../shared/components/ui';

interface OCRProgressProps {
  isProcessing: boolean;
  stage?: 'uploading' | 'analyzing' | 'extracting' | 'processing' | 'complete';
  progress?: number;
  estimatedTime?: number;
}

const OCRProgress: React.FC<OCRProgressProps> = ({
  isProcessing,
  stage = 'analyzing',
  progress = 0,
  estimatedTime
}) => {
  const stages = [
    {
      key: 'uploading',
      icon: Loader2,
      title: 'Subiendo imagen...',
      description: 'Preparando archivo para análisis',
      color: 'text-blue-600'
    },
    {
      key: 'analyzing',
      icon: Eye,
      title: 'Analizando imagen...',
      description: 'Detectando elementos en la foto',
      color: 'text-purple-600'
    },
    {
      key: 'extracting',
      icon: Brain,
      title: 'Extrayendo texto...',
      description: 'Reconociendo fechas y productos',
      color: 'text-green-600'
    },
    {
      key: 'processing',
      icon: Zap,
      title: 'Procesando con IA...',
      description: 'Claude está interpretando los datos',
      color: 'text-orange-600'
    },
    {
      key: 'complete',
      icon: CheckCircle,
      title: '¡Análisis completado!',
      description: 'Resultados listos',
      color: 'text-green-600'
    }
  ];

  const currentStage = stages.find(s => s.key === stage) || stages[1];
  const currentStageIndex = stages.findIndex(s => s.key === stage);

  if (!isProcessing && stage !== 'complete') {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
      <div className="space-y-6">
        {/* Etapa actual */}
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            {stage === 'complete' ? (
              <CheckCircle className={`w-12 h-12 ${currentStage.color}`} />
            ) : (
              <div className="relative">
                <currentStage.icon className={`w-12 h-12 ${currentStage.color} ${stage !== 'complete' ? 'animate-spin' : ''}`} />
                {progress > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-700">
                      {Math.round(progress)}%
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800">
              {currentStage.title}
            </h3>
            <p className="text-gray-600">
              {currentStage.description}
            </p>
            {estimatedTime && stage !== 'complete' && (
              <p className="text-sm text-gray-500 mt-1">
                Tiempo estimado: ~{estimatedTime}s
              </p>
            )}
          </div>
        </div>

        {/* Barra de progreso general */}
        {isProcessing && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progreso del análisis</span>
              <span>{Math.round((currentStageIndex / (stages.length - 1)) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${(currentStageIndex / (stages.length - 1)) * 100}%`
                }}
              />
            </div>
          </div>
        )}

        {/* Pasos del proceso */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {stages.slice(0, -1).map((stageItem, index) => {
            const Icon = stageItem.icon;
            const isActive = index <= currentStageIndex;
            const isCurrent = index === currentStageIndex;
            
            return (
              <div
                key={stageItem.key}
                className={`text-center p-2 rounded-lg transition-all ${
                  isActive 
                    ? isCurrent 
                      ? 'bg-blue-100 border border-blue-300' 
                      : 'bg-green-100 border border-green-300'
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <Icon
                  className={`w-6 h-6 mx-auto mb-1 ${
                    isActive 
                      ? isCurrent 
                        ? 'text-blue-600' 
                        : 'text-green-600'
                      : 'text-gray-400'
                  }`}
                />
                <p className={`text-xs font-medium ${
                  isActive ? 'text-gray-800' : 'text-gray-500'
                }`}>
                  {stageItem.title.replace('...', '')}
                </p>
              </div>
            );
          })}
        </div>

        {/* Información adicional durante el procesamiento */}
        {isProcessing && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <LoadingSpinner size="sm" />
              <span className="text-sm font-medium text-blue-800">
                Procesando con tecnología Claude AI
              </span>
            </div>
            <p className="text-sm text-blue-700">
              Nuestro sistema está analizando tu imagen para detectar productos, fechas de vencimiento 
              y otra información relevante. Este proceso puede tardar unos segundos.
            </p>
          </div>
        )}

        {/* Mensaje de completado */}
        {stage === 'complete' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                ¡Análisis completado exitosamente!
              </span>
            </div>
            <p className="text-sm text-green-700">
              Revisa los productos detectados abajo y añade los que desees a tu nevera virtual.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OCRProgress;
