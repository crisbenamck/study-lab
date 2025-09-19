import React from 'react';
import { FileText } from 'lucide-react';
import type { ProcessingProgress } from '../../utils/geminiQuestionProcessor';

interface ProcessingButtonProps {
  isProcessing: boolean;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

const ProcessingButton: React.FC<ProcessingButtonProps> = ({ isProcessing, onClick, children, disabled = false }) => (
  <button
    onClick={onClick}
    disabled={isProcessing || disabled}
    className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-300 text-white border shadow-sm ${
      (isProcessing || disabled)
        ? 'bg-gray-400 border-gray-400 cursor-not-allowed' 
        : 'bg-emerald-500 border-emerald-500 hover:bg-emerald-600 hover:border-emerald-600 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
    }`}
  >
    {isProcessing ? (
      <span className="flex items-center gap-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        Procesando...
      </span>
    ) : disabled ? (
      <span className="flex items-center gap-2">
        <span>🚫</span>
        {children || 'No disponible'}
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
    <div className="bg-theme-success rounded-lg p-4 mb-6">
      <div className="flex items-center space-x-2 mb-3">
        <FileText className="w-5 h-5 text-theme-success" />
        <h3 className="font-medium text-theme-success">🚀 Procesar PDF Completo</h3>
      </div>
      
      <div className="space-y-4">
        <p className="text-sm text-theme-success text-center">
          Para optimizar el procesamiento, indica qué tipo de contenido tiene tu PDF:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card border border-primary rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-2xl">📝</span>
              <h4 className="font-semibold text-primary">Solo texto</h4>
            </div>
            <p className="text-sm text-secondary mb-4">
              PDF con preguntas en texto simple, sin imágenes complejas
            </p>
            <ProcessingButton
              isProcessing={isProcessing}
              onClick={() => onIntelligentProcessing('text-only')}
              disabled={true}
            >
              Solo texto
            </ProcessingButton>
          </div>
          
          <div className="bg-card border border-primary rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-2xl">🖼️</span>
              <h4 className="font-semibold text-primary">Con imágenes</h4>
            </div>
            <p className="text-sm text-secondary mb-4">
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
            className="flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 text-xs underline bg-blue-600 text-white border border-blue-700 shadow-sm hover:bg-blue-700 hover:border-blue-800 hover:shadow-md transform hover:-translate-y-0.5"
          >
            {showManualProcessing ? '🔽 Ocultar' : '⚙️ Mostrar'} configuración manual (página específica)
          </button>
        </div>
        
        {isProcessing && processingProgress && (
          <div className="mt-4 p-3 bg-theme-success rounded-md border border-primary">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span className="text-sm text-theme-success">{processingProgress}</span>
            </div>
            
            {individualProcessingProgress && individualProcessingProgress.stage === 'processing' && (
              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-xs text-theme-success">
                  <span>Procesando preguntas individualmente</span>
                  <span>{individualProcessingProgress.currentQuestion}/{individualProcessingProgress.totalQuestions}</span>
                </div>
                <div className="w-full bg-elevated rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      backgroundColor: 'var(--color-success)',
                      width: `${Math.round((individualProcessingProgress.currentQuestion / individualProcessingProgress.totalQuestions) * 100)}%` 
                    }}
                  ></div>
                </div>
                {individualProcessingProgress.currentQuestionText && (
                  <p className="text-xs text-theme-success truncate">
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
