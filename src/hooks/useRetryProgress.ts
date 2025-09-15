import { useState, useCallback } from 'react';

interface RetryProgress {
  isRetrying: boolean;
  currentModel: string;
  attemptNumber: number;
  maxAttempts: number;
  modelIndex: number;
  totalModels: number;
  message: string;
}

interface UseRetryProgressReturn {
  retryProgress: RetryProgress | null;
  updateRetryProgress: (progress: Partial<RetryProgress>) => void;
  startRetrySequence: (totalModels: number, maxAttempts: number) => void;
  endRetrySequence: () => void;
  setRetryAttempt: (modelIndex: number, attemptNumber: number, currentModel: string, isRetrying?: boolean) => void;
}

/**
 * Hook for managing retry progress state during API calls
 */
export const useRetryProgress = (): UseRetryProgressReturn => {
  const [retryProgress, setRetryProgress] = useState<RetryProgress | null>(null);

  const updateRetryProgress = useCallback((progress: Partial<RetryProgress>) => {
    setRetryProgress(current => current ? { ...current, ...progress } : null);
  }, []);

  const startRetrySequence = useCallback((totalModels: number, maxAttempts: number) => {
    setRetryProgress({
      isRetrying: true,
      currentModel: '',
      attemptNumber: 1,
      maxAttempts,
      modelIndex: 0,
      totalModels,
      message: 'Iniciando reintentos automáticos...'
    });
  }, []);

  const endRetrySequence = useCallback(() => {
    setRetryProgress(null);
  }, []);

  const setRetryAttempt = useCallback((
    modelIndex: number, 
    attemptNumber: number, 
    currentModel: string, 
    isRetrying: boolean = true
  ) => {
    setRetryProgress(current => {
      if (!current) return null;
      
      let message = '';
      if (isRetrying) {
        message = attemptNumber === 1 
          ? `Probando modelo ${currentModel}...`
          : `Reintentando con ${currentModel} (intento ${attemptNumber})...`;
      } else {
        message = `Error con ${currentModel}, cambiando al siguiente modelo...`;
      }

      return {
        ...current,
        modelIndex,
        attemptNumber,
        currentModel,
        isRetrying,
        message
      };
    });
  }, []);

  return {
    retryProgress,
    updateRetryProgress,
    startRetrySequence,
    endRetrySequence,
    setRetryAttempt
  };
};