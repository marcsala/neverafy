import React from 'react';
import { Camera, X, Loader2, Zap, CheckCircle, AlertTriangle, Plus, Package, Calendar, DollarSign } from 'lucide-react';

const CameraView = ({
  isPremium,
  userStats,
  handleImageSelect,
  imagePreview,
  setSelectedImage,
  setImagePreview,
  setOcrResults,
  processImage,
  isProcessingOCR,
  ocrResults,
  addDetectedProductToFridge,
  getAlertColor,
  getDaysToExpiry,
  fileInputRef
}) => (
  <div className="space-y-6">
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-4">
        <Camera className="w-8 h-8 text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Smart Camera OCR</h2>
          <p className="text-gray-600">Reconocimiento inteligente de productos y fechas</p>
        </div>
        <div className="ml-auto">
          <div className="text-right">
            <p className="text-sm text-gray-600">
              {isPremium ? 'Análisis ilimitados' : `${userStats.ocrUsed}/3 usados este mes`}
            </p>
            {!isPremium && (
              <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${(userStats.ocrUsed / 3) * 100}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="space-y-6">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
        >
          <div className="flex flex-col items-center space-y-4">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-xs max-h-48 rounded-lg shadow-md"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(null);
                    setImagePreview(null);
                    setOcrResults(null);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <Camera size={48} className="text-gray-400" />
                <div>
                  <p className="text-lg font-medium text-gray-700">
                    Sube una foto de tus productos
                  </p>
                  <p className="text-sm text-gray-500">
                    JPG, PNG, WEBP hasta 10MB
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />

        {imagePreview && !ocrResults && (
          <div className="text-center">
            <button
              onClick={processImage}
              disabled={isProcessingOCR || (!isPremium && userStats.ocrUsed >= 3)}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
            >
              {isProcessingOCR ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analizando con IA...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Analizar Productos
                </>
              )}
            </button>
            {!isPremium && userStats.ocrUsed >= 3 && (
              <p className="text-red-600 text-sm mt-2">
                Límite alcanzado. Actualiza a Premium para análisis ilimitados.
              </p>
            )}
          </div>
        )}
      </div>
    </div>

    {/* Resultados OCR */}
    {ocrResults && (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          {ocrResults.success ? (
            <CheckCircle className="w-8 h-8 text-green-600" />
          ) : (
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          )}
          <div>
            <h3 className="text-xl font-bold text-gray-800">Resultados del Análisis</h3>
            <p className="text-gray-600">{ocrResults.message}</p>
          </div>
        </div>

        {ocrResults.success && ocrResults.products?.length > 0 ? (
          <div className="space-y-4">
            {ocrResults.products.map((product, index) => {
              const daysToExpiry = getDaysToExpiry(product.expiryDate);
              const alertColor = getAlertColor(daysToExpiry);

              return (
                <div key={index} className={`border-l-4 ${alertColor} bg-white border rounded-lg p-6 shadow-sm`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Package className="w-5 h-5 text-gray-600" />
                        <h4 className="font-bold text-gray-800 text-lg">{product.name}</h4>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {Math.round(product.confidence * 100)}% confianza
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">
                            Vence: {new Date(product.expiryDate).toLocaleDateString('es-ES')}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">
                            Precio est.: {product.estimatedPrice}€
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600 capitalize">
                            {product.category}
                          </span>
                        </div>
                      </div>

                      {product.detectedText && (
                        <div className="p-2 bg-gray-50 rounded text-xs text-gray-600 mb-3">
                          <strong>Texto detectado:</strong> "{product.detectedText}"
                        </div>
                      )}

                      <span className={`text-sm font-medium ${
                        daysToExpiry < 0 ? 'text-red-600' :
                        daysToExpiry <= 1 ? 'text-orange-600' :
                        daysToExpiry <= 3 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {daysToExpiry < 0 ? `Caducó hace ${Math.abs(daysToExpiry)} días` :
                         daysToExpiry === 0 ? 'Vence hoy' :
                         daysToExpiry === 1 ? 'Vence mañana' :
                         `${daysToExpiry} días restantes`}
                      </span>
                    </div>

                    <button
                      onClick={() => addDetectedProductToFridge(product)}
                      className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Añadir
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertTriangle className="w-16 h-16 text-orange-300 mx-auto mb-4" />
            <p className="text-gray-600">
              No se detectaron productos con fechas claras en esta imagen.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Intenta con una imagen más clara donde se vean las fechas de vencimiento.
            </p>
          </div>
        )}
      </div>
    )}
  </div>
);

export default CameraView;
