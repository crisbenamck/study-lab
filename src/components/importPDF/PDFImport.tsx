import React, { useState, useCallback } from 'react';
import type { Question } from '../../types/Question';
import { usePDFProcessing } from '../../hooks/usePDFProcessing';
import ApiKeyConfigSection from './ApiKeyConfigSection';
import UserProgressSection from './UserProgressSection';
import AutomaticModelsSection from './AutomaticModelsSection';
import FileUploadArea from './FileUploadArea';
import ManualProcessingSection from './ManualProcessingSection';
import ProcessingOptionsSection from './ProcessingOptionsSection';

interface PDFImportProps {
  onImportQuestions: (questions: Question[]) => void;
  appState: {
    geminiApiKey: string;
    saveGeminiApiKey: (key: string) => void;
    selectedFile: File | null;
    updateSelectedFile: (file: File | null, pages?: number) => void;
    totalPages: number;
    setTotalPages: (pages: number) => void;
    pageToProcess: number;
    setPageToProcess: (page: number) => void;
    isLoaded: boolean;
  };
  nextQuestionNumber: number;
  showAlert: (message: string, options?: { title?: string; type?: 'info' | 'success' | 'warning' | 'error'; buttonText?: string; }) => void;
  showConfirm: (message: string, onConfirm: () => void, options?: { title?: string; confirmText?: string; cancelText?: string; }) => void;
}

const PDFImport: React.FC<PDFImportProps> = ({
  onImportQuestions,
  appState,
  nextQuestionNumber,
  showAlert,
  showConfirm
}) => {
  const [showManualProcessing, setShowManualProcessing] = useState(false);
  const {
    geminiApiKey,
    saveGeminiApiKey,
    selectedFile,
    updateSelectedFile,
    totalPages,
    setTotalPages,
    pageToProcess,
    setPageToProcess
  } = appState;

  const {
    isProcessing,
    processingProgress,
    individualProcessingProgress,
    currentGeminiModel,
    fallbackStatus,
    startSinglePageProcessing,
    startIntelligentProcessing
  } = usePDFProcessing({
    geminiApiKey,
    nextQuestionNumber,
    showAlert,
    showConfirm,
    onImportQuestions
  });

  const validateFileAndApiKey = useCallback(() => {
    if (!selectedFile || !geminiApiKey?.trim()) {
      showAlert('Se requiere archivo y API key para el procesamiento', {
        title: 'Configuración incompleta',
        type: 'warning'
      });
      return false;
    }
    return true;
  }, [selectedFile, geminiApiKey, showAlert]);

  const handleFileSelect = useCallback((file: File, pages: number) => {
    if (selectedFile?.name === file.name && totalPages === pages) {
      return;
    }

    updateSelectedFile(file, pages);
    setTotalPages(pages);
    setPageToProcess(1);
  }, [updateSelectedFile, setTotalPages, setPageToProcess, selectedFile, totalPages]);

  const handleResetFile = useCallback(() => {
    updateSelectedFile(null);
    setTotalPages(0);
    setPageToProcess(1);
  }, [updateSelectedFile, setTotalPages, setPageToProcess]);

  const handleStartProcessing = useCallback(async () => {
    if (!validateFileAndApiKey() || !selectedFile) return;
    await startSinglePageProcessing(selectedFile, pageToProcess);
  }, [validateFileAndApiKey, selectedFile, pageToProcess, startSinglePageProcessing]);

  const handleIntelligentProcessing = useCallback(async (contentType: 'text-only' | 'with-images') => {
    if (!validateFileAndApiKey() || !selectedFile) return;
    await startIntelligentProcessing(selectedFile, totalPages, contentType);
  }, [validateFileAndApiKey, selectedFile, totalPages, startIntelligentProcessing]);

  const hasApiKey = Boolean(geminiApiKey?.trim());

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <ApiKeyConfigSection
        geminiApiKey={geminiApiKey}
        saveGeminiApiKey={saveGeminiApiKey}
        currentGeminiModel={currentGeminiModel}
        fallbackStatus={fallbackStatus}
      />

      {hasApiKey && <AutomaticModelsSection />}

      <FileUploadArea
        selectedFile={selectedFile}
        totalPages={totalPages}
        onFileSelect={handleFileSelect}
        geminiApiKey={geminiApiKey}
        onResetFile={handleResetFile}
      />

      <ProcessingOptionsSection
        selectedFile={selectedFile}
        isProcessing={isProcessing}
        processingProgress={processingProgress}
        individualProcessingProgress={individualProcessingProgress}
        onIntelligentProcessing={handleIntelligentProcessing}
        showManualProcessing={showManualProcessing}
        setShowManualProcessing={setShowManualProcessing}
      />

      <ManualProcessingSection
        showManualProcessing={showManualProcessing}
        selectedFile={selectedFile}
        totalPages={totalPages}
        pageToProcess={pageToProcess}
        setPageToProcess={setPageToProcess}
        isProcessing={isProcessing}
        geminiApiKey={geminiApiKey}
        onStartProcessing={handleStartProcessing}
      />

      <UserProgressSection
        geminiApiKey={geminiApiKey}
        selectedFile={selectedFile}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default PDFImport;
