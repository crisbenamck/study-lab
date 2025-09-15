import type { FC } from 'react';

interface RetryProgressIndicatorProps {
  isVisible: boolean;
  currentModel: string;
  attemptNumber: number;
  maxAttempts: number;
  modelIndex: number;
  totalModels: number;
  isRetrying: boolean;
}

/**
 * Component that shows retry progress for Gemini API calls
 */
const RetryProgressIndicator: FC<RetryProgressIndicatorProps> = ({
  isVisible,
  currentModel,
  attemptNumber,
  maxAttempts,
  modelIndex,
  totalModels,
  isRetrying
}) => {
  if (!isVisible) {
    return null;
  }

  const progressPercentage = ((modelIndex * maxAttempts + attemptNumber) / (totalModels * maxAttempts)) * 100;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isRetrying ? 'bg-yellow-500 animate-pulse' : 'bg-blue-500'}`} />
          <span className="text-sm font-medium text-blue-900">
            Reintentando con modelo: {currentModel}
          </span>
        </div>
        <span className="text-xs text-blue-600">
          Modelo {modelIndex + 1}/{totalModels} • Intento {attemptNumber}/{maxAttempts}
        </span>
      </div>
      
      <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
        />
      </div>
      
      <p className="text-xs text-blue-700">
        {isRetrying ? (
          <>⏳ Esperando respuesta del servidor...</>
        ) : (
          <>🔄 Preparando siguiente intento...</>
        )}
      </p>
      
      {modelIndex > 0 && (
        <div className="mt-2 text-xs text-blue-600">
          💡 Algunos modelos anteriores estaban sobrecargados, probando alternativas
        </div>
      )}
    </div>
  );
};

export default RetryProgressIndicator;