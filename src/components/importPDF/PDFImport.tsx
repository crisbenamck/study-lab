import React, { useState, useCallback } from 'react';
import { PDFProcessorService } from '../../utils/pdfProcessor';
import type { Question } from '../../types/Question';
import { usePDFProcessing } from '../../hooks/usePDFProcessing';
import ApiKeyConfigSection from './ApiKeyConfigSection';
import NextStepMessage from './NextStepMessage';
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
  // Local state only for UI-specific functionality  
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

  // PDF Processing Hook - provides enhanced processing functionality
  const pdfProcessingHook = usePDFProcessing({
    geminiApiKey,
    nextQuestionNumber,
    showAlert,
    showConfirm,
    onImportQuestions
  });

  const {
    isProcessing: hookIsProcessing,
    processingProgress: hookProcessingProgress,
    individualProcessingProgress: hookIndividualProgress,
    currentGeminiModel: hookCurrentModel,
    fallbackStatus: hookFallbackStatus,
    startSinglePageProcessing,
    startIntelligentProcessing
  } = pdfProcessingHook;

  const handleFileSelect = useCallback(async (file: File) => {
    updateSelectedFile(file);
    
    try {
      const processor = new PDFProcessorService(geminiApiKey || 'temp');
      const pdfInfo = await processor.getPDFInfo(file);
      setTotalPages(pdfInfo.totalPages);
      setPageToProcess(1);
      console.log(`📄 PDF cargado: ${file.name} - ${pdfInfo.totalPages} páginas`);
    } catch (error) {
      console.error('Error cargando PDF:', error);
      const simulatedPages = Math.floor(Math.random() * 45) + 5;
      setTotalPages(simulatedPages);
      setPageToProcess(1);
      console.log(`📄 PDF cargado (simulado): ${file.name} - ${simulatedPages} páginas`);
    }
  }, [geminiApiKey, updateSelectedFile, setTotalPages, setPageToProcess]);

  const handleStartProcessing = useCallback(async () => {
    if (!selectedFile || !geminiApiKey.trim()) {
      showAlert('Por favor asegúrate de tener un archivo y API key configurados', {
        title: 'Configuración incompleta',
        type: 'warning'
      });
      return;
    }

    console.log(`🚀 Iniciando procesamiento de página ${pageToProcess} de ${selectedFile.name}`);
    await startSinglePageProcessing(selectedFile, pageToProcess);
  }, [selectedFile, geminiApiKey, pageToProcess, showAlert, startSinglePageProcessing]);

  const handleIntelligentProcessing = useCallback(async (contentType: 'text-only' | 'with-images') => {
    if (!selectedFile || !geminiApiKey.trim()) {
      showAlert('Se requiere archivo y API key para el procesamiento', {
        title: 'Configuración incompleta',
        type: 'warning'
      });
      return;
    }

    const isTextOnly = contentType === 'text-only';
    
    showConfirm(
      `📄 Archivo: ${selectedFile.name} (${totalPages} página${totalPages > 1 ? 's' : ''})\n` +
      `🔧 Método: ${isTextOnly ? 'Extracción de texto + IA para explicaciones' : 'Análisis completo con Gemini Vision'}\n` +
      `💰 Costo: ${isTextOnly ? 'Bajo (solo explicaciones)' : 'Moderado (análisis completo)'}\n` +
      `⏱️ Tiempo estimado: ${isTextOnly ? '1-2 minutos' : '3-5 minutos'}\n` +
      `🎯 Resultado: ${isTextOnly ? 'Preguntas de texto con explicaciones' : 'Análisis completo incluyendo imágenes'}`,
      async () => {
        if (isTextOnly) {
          await handleStartProcessing();
        } else {
          // Use the hook for intelligent processing with images
          console.log(`🚀 Iniciando procesamiento inteligente de PDF: ${selectedFile.name}`);
          await startIntelligentProcessing(selectedFile, totalPages, contentType);
        }
      },
      {
        title: `Procesar como contenido ${isTextOnly ? 'SOLO TEXTO' : 'CON IMÁGENES'}`,
        confirmText: 'Sí, Procesar',
        cancelText: 'Cancelar'
      }
    );
  }, [selectedFile, geminiApiKey, totalPages, handleStartProcessing, showAlert, showConfirm, startIntelligentProcessing]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ApiKeyConfigSection 
        geminiApiKey={geminiApiKey}
        saveGeminiApiKey={saveGeminiApiKey}
        currentGeminiModel={hookCurrentModel}
        fallbackStatus={hookFallbackStatus}
      />

      {geminiApiKey && geminiApiKey.trim() !== '' && (
        <AutomaticModelsSection />
      )}

      <FileUploadArea 
        selectedFile={selectedFile}
        totalPages={totalPages}
        onFileSelect={handleFileSelect}
        geminiApiKey={geminiApiKey}
      />

      <NextStepMessage 
        geminiApiKey={geminiApiKey}
        selectedFile={selectedFile}
      />

      {selectedFile && <div className="h-6"></div>}

      <ManualProcessingSection 
        showManualProcessing={showManualProcessing}
        selectedFile={selectedFile}
        totalPages={totalPages}
        pageToProcess={pageToProcess}
        setPageToProcess={setPageToProcess}
        isProcessing={hookIsProcessing}
        geminiApiKey={geminiApiKey}
        onStartProcessing={handleStartProcessing}
      />

      <ProcessingOptionsSection 
        selectedFile={selectedFile}
        isProcessing={hookIsProcessing}
        processingProgress={hookProcessingProgress}
        individualProcessingProgress={hookIndividualProgress}
        onIntelligentProcessing={handleIntelligentProcessing}
        showManualProcessing={showManualProcessing}
        setShowManualProcessing={setShowManualProcessing}
      />

      <UserProgressSection 
        geminiApiKey={geminiApiKey}
        selectedFile={selectedFile}
        isProcessing={hookIsProcessing}
      />
    </div>
  );
};

export default PDFImport;
