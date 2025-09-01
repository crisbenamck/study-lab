/**
 * Business logic separators and function simplifiers for PDF Import
 */

import type { Question } from '../types/Question';
import type { ProcessingContentType } from '../types/pdfImportTypes';
import { createProcessingConfirmationMessage, createSuccessMessage, handleProcessingError } from './errorHandlers';

// Basic extracted question interface
interface ExtractedQuestion {
  question_text: string;
  options: Array<{
    option_letter: string;
    option_text: string;
    is_correct: boolean;
  }>;
  requires_multiple_answers: boolean;
  link?: string;
  explanation?: string;
}

// Function type definitions
type ShowAlertFunction = (message: string, options?: { 
  title?: string; 
  type?: 'info' | 'success' | 'warning' | 'error'; 
  buttonText?: string; 
}) => void;

type ShowConfirmFunction = (message: string, onConfirm: () => void, options?: { 
  title?: string; 
  confirmText?: string; 
  cancelText?: string; 
}) => void;

// Validation utilities
export const validateProcessingRequirements = (
  selectedFile: File | null,
  geminiApiKey: string
): { isValid: boolean; errorMessage?: string } => {
  if (!selectedFile) {
    return {
      isValid: false,
      errorMessage: 'No hay archivo seleccionado'
    };
  }
  
  if (!geminiApiKey.trim()) {
    return {
      isValid: false,
      errorMessage: 'API key de Gemini no configurada'
    };
  }
  
  return { isValid: true };
};

// UI state management utilities
export const shouldShowProcessingOptions = (
  selectedFile: File | null,
  geminiApiKey: string
): boolean => {
  return selectedFile !== null && geminiApiKey.trim() !== '';
};

export const shouldShowManualProcessing = (
  showManualProcessing: boolean,
  selectedFile: File | null
): boolean => {
  return showManualProcessing && selectedFile !== null;
};

// Processing strategy utilities
export const getProcessingStrategy = (contentType: ProcessingContentType) => {
  const strategies = {
    'text-only': {
      name: 'Solo Texto',
      description: 'Extracción de texto + IA para explicaciones',
      cost: 'Bajo (solo explicaciones)',
      estimatedTime: '1-2 minutos',
      result: 'Preguntas de texto con explicaciones'
    },
    'with-images': {
      name: 'Con Imágenes',
      description: 'Análisis completo con Gemini Vision',
      cost: 'Moderado (análisis completo)',
      estimatedTime: '3-5 minutos',
      result: 'Análisis completo incluyendo imágenes'
    }
  };
  
  return strategies[contentType];
};

// Question conversion utilities
export const convertToQuestions = (
  extractedQuestions: ExtractedQuestion[],
  startingNumber: number
): Question[] => {
  return extractedQuestions.map((q, index) => ({
    question_number: startingNumber + index,
    question_text: q.question_text,
    options: q.options.map((opt) => ({
      option_letter: opt.option_letter,
      option_text: opt.option_text,
      is_correct: opt.is_correct
    })),
    requires_multiple_answers: q.requires_multiple_answers,
    link: q.link || '',
    explanation: q.explanation || ''
  }));
};

// Processing flow orchestrators
export const createIntelligentProcessingConfirmation = (
  selectedFile: File,
  totalPages: number,
  contentType: ProcessingContentType,
  showConfirm: ShowConfirmFunction,
  onConfirm: () => Promise<void>
): void => {
  const isTextOnly = contentType === 'text-only';
  const message = createProcessingConfirmationMessage(selectedFile.name, totalPages, contentType);
  
  showConfirm(
    message,
    onConfirm,
    {
      title: `Procesar como contenido ${isTextOnly ? 'SOLO TEXTO' : 'CON IMÁGENES'}`,
      confirmText: 'Sí, Procesar',
      cancelText: 'Cancelar'
    }
  );
};

export const handleSuccessfulProcessing = (
  questions: Question[],
  processingType: ProcessingContentType,
  startingNumber: number,
  onImportQuestions: (questions: Question[]) => void,
  showAlert: ShowAlertFunction,
  additionalInfo?: string
): void => {
  onImportQuestions(questions);
  
  const successMessage = createSuccessMessage(
    questions.length,
    startingNumber,
    processingType,
    additionalInfo
  );
  
  const title = processingType === 'text-only' 
    ? 'Procesamiento exitoso' 
    : 'Procesamiento completo exitoso';
    
  const buttonText = processingType === 'text-only' 
    ? 'Perfecto!' 
    : 'Excelente!';
  
  showAlert(successMessage, {
    title,
    type: 'success',
    buttonText
  });
};

// Simplified processing workflow functions
export const createProcessingWorkflow = (
  selectedFile: File,
  geminiApiKey: string,
  showAlert: ShowAlertFunction
) => {
  // Validation step
  const validateAndPrepare = (): boolean => {
    const validation = validateProcessingRequirements(selectedFile, geminiApiKey);
    
    if (!validation.isValid) {
      showAlert(`Por favor asegúrate de tener un archivo y API key configurados`, {
        title: 'Configuración incompleta',
        type: 'warning'
      });
      return false;
    }
    
    return true;
  };
  
  // Error handling step
  const handleError = (error: Error | string, fallbackStatus?: { currentModel: string; currentModelIndex: number; totalModels: number; remainingModels: number; }): void => {
    handleProcessingError(error, fallbackStatus || null, showAlert);
  };
  
  // Log step
  const logProcessingStart = (pageNumber?: number): void => {
    if (pageNumber) {
      console.log(`🚀 Iniciando procesamiento de página ${pageNumber} de ${selectedFile.name}`);
    } else {
      console.log(`🚀 Iniciando procesamiento inteligente de PDF: ${selectedFile.name}`);
    }
  };
  
  return {
    validateAndPrepare,
    handleError,
    logProcessingStart
  };
};

// File processing utilities
export const createFileProcessingInfo = (file: File, totalPages?: number) => {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    totalPages: totalPages || 0,
    displaySize: formatFileSize(file.size)
  };
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Progress tracking utilities
export const createProgressTracker = () => {
  let currentStep = 0;
  const steps = [
    'Validando archivo',
    'Preparando procesamiento',
    'Extrayendo contenido',
    'Procesando con IA',
    'Generando explicaciones',
    'Finalizando'
  ];
  
  const getProgress = () => ({
    current: currentStep,
    total: steps.length,
    percentage: Math.round((currentStep / steps.length) * 100),
    currentStepName: steps[currentStep] || 'Completado'
  });
  
  const nextStep = () => {
    if (currentStep < steps.length) {
      currentStep++;
    }
    return getProgress();
  };
  
  const reset = () => {
    currentStep = 0;
    return getProgress();
  };
  
  return {
    getProgress,
    nextStep,
    reset
  };
};
