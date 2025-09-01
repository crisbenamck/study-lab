import { useState, useCallback } from 'react';

interface GeminiStatus {
  currentModel: string;
  currentModelIndex: number;
  totalModels: number;
  remainingModels: number;
  availableModels: string[];
}

interface UseGeminiStatusReturn {
  currentGeminiModel: string;
  fallbackStatus: GeminiStatus | null;
  updateGeminiStatus: (status: GeminiStatus) => void;
  resetGeminiStatus: () => void;
}

export const useGeminiStatus = (): UseGeminiStatusReturn => {
  const [currentGeminiModel, setCurrentGeminiModel] = useState<string>('gemini-2.5-pro');
  const [fallbackStatus, setFallbackStatus] = useState<GeminiStatus | null>(null);

  const updateGeminiStatus = useCallback((status: GeminiStatus) => {
    setCurrentGeminiModel(status.currentModel);
    setFallbackStatus(status);
  }, []);

  const resetGeminiStatus = useCallback(() => {
    setCurrentGeminiModel('gemini-2.5-pro');
    setFallbackStatus(null);
  }, []);

  return {
    currentGeminiModel,
    fallbackStatus,
    updateGeminiStatus,
    resetGeminiStatus
  };
};
