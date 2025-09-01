import React from 'react';
import { FileText } from 'lucide-react';
import type { ProcessingProgress } from '../../utils/geminiQuestionProcessor';

interface ProcessingButtonProps {
  isProcessing: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const ProcessingButton: React.FC<ProcessingButtonProps> = ({ isProcessing, onClick, children }) => (
  <button
    onClick={onClick}
    disabled={isProcessing}
    className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-300 text-white border shadow-sm ${
      isProcessing 
        ? 'bg-gray-400 border-gray-400 cursor-not-allowed' 
        : 'bg-emerald-500 border-emerald-500 hover:bg-emerald-600 hover:border-emerald-600 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
    }`}
  >
    {isProcessing ? (
      <span className="flex items-center gap-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        Procesando...
      </span>
    ) : (
      <span className="flex items-center gap-2">
        <span>🚀</span>
        {children || 'Procesar PDF'}
      </span>
    )}
  </button>
);

interface ProcessingOptionsSectionProps {
  selectedFile: File | null;
  isProcessing: boolean;
  processingProgress: string;
  individualProcessingProgress: ProcessingProgress | null;
  onIntelligentProcessing: (contentType: 'text-only' | 'with-images') => void;
  showManualProcessing: boolean;
  setShowManualProcessing: (show: boolean) => void;
}

const ProcessingOptionsSection: React.FC<ProcessingOptionsSectionProps> = ({
  selectedFile,
  isProcessing,
  processingProgress,
  individualProcessingProgress,
  onIntelligentProcessing,
  showManualProcessing,
  setShowManualProcessing
}) => {
  if (!selectedFile) {
    return null;
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <div className="flex items-center space-x-2 mb-3">
        <FileText className="w-5 h-5 text-green-600" />
        <h3 className="font-medium text-green-800">🚀 Procesar PDF Completo</h3>
      </div>
      
      <div className="space-y-4">
        <p className="text-sm text-green-700 text-center">
          Para optimizar el procesamiento, indica qué tipo de contenido tiene tu PDF:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-2xl">📝</span>
              <h4 className="font-semibold text-gray-800">Solo texto</h4>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              PDF con preguntas en texto simple, sin imágenes complejas
            </p>
            <ProcessingButton
              isProcessing={isProcessing}
              onClick={() => onIntelligentProcessing('text-only')}
            >
              Solo texto
            </ProcessingButton>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-2xl">🖼️</span>
              <h4 className="font-semibold text-gray-800">Con imágenes</h4>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              PDF con diagramas, tablas complejas o preguntas con imágenes
            </p>
            <ProcessingButton
              isProcessing={isProcessing}
              onClick={() => onIntelligentProcessing('with-images')}
            >
              Con imágenes
            </ProcessingButton>
          </div>
        </div>
        
        <div className="text-center">
          <button
            onClick={() => setShowManualProcessing(!showManualProcessing)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 text-xs underline bg-gray-100 text-gray-700 border border-gray-300 shadow-sm hover:bg-gray-200 hover:border-gray-400 hover:shadow-md transform hover:-translate-y-0.5"
          >
            {showManualProcessing ? '🔽 Ocultar' : '⚙️ Mostrar'} configuración manual (página específica)
          </button>
        </div>
        
        {isProcessing && processingProgress && (
          <div className="mt-4 p-3 bg-green-100 border border-green-200 rounded-md">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
              <span className="text-sm text-green-700">{processingProgress}</span>
            </div>
            
            {individualProcessingProgress && individualProcessingProgress.stage === 'processing' && (
              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-xs text-green-600">
                  <span>Procesando preguntas individualmente</span>
                  <span>{individualProcessingProgress.currentQuestion}/{individualProcessingProgress.totalQuestions}</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.round((individualProcessingProgress.currentQuestion / individualProcessingProgress.totalQuestions) * 100)}%` 
                    }}
                  ></div>
                </div>
                {individualProcessingProgress.currentQuestionText && (
                  <p className="text-xs text-green-600 truncate">
                    📝 {individualProcessingProgress.currentQuestionText}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessingOptionsSection;
