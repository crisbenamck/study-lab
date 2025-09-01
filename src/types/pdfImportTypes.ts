import type { Question } from './Question';
import type { ProcessingProgress } from '../utils/geminiQuestionProcessor';

export interface PDFImportProps {
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

export interface GeminiStatusState {
  currentModel: string;
  currentModelIndex: number;
  totalModels: number;
  remainingModels: number;
  availableModels: string[];
}

export interface ProcessingOptions {
  contentType: 'text-only' | 'with-images';
  file: File;
  totalPages: number;
}

export interface ProcessingResult {
  questions: Question[];
  totalProcessed: number;
  processingTime: number;
  errors: string[];
}

export interface FileUploadState {
  selectedFile: File | null;
  totalPages: number;
  isLoadingFile: boolean;
  fileError: string | null;
}

export interface ManualProcessingState {
  showManualProcessing: boolean;
  pageToProcess: number;
}

export interface ProcessingState {
  isProcessing: boolean;
  processingProgress: string;
  individualProcessingProgress: ProcessingProgress | null;
}

// Helper type for component prop interfaces
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Alert and confirmation utilities
export interface AlertOptions {
  title?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  buttonText?: string;
}

export interface ConfirmOptions {
  title?: string;
  confirmText?: string;
  cancelText?: string;
}

export type ShowAlertFunction = (message: string, options?: AlertOptions) => void;
export type ShowConfirmFunction = (message: string, onConfirm: () => void, options?: ConfirmOptions) => void;

// Conversion utilities
export interface QuestionConversionOptions {
  startingNumber: number;
  preserveIds?: boolean;
  addMetadata?: boolean;
}

export interface ConversionResult {
  questions: Question[];
  skipped: number;
  errors: string[];
}

// Error handling types
export type ProcessingContentType = 'text-only' | 'with-images';

export type ProcessingErrorType = 
  | 'quota_exceeded'
  | 'server_overloaded' 
  | 'invalid_file'
  | 'api_key_invalid'
  | 'network_error'
  | 'unknown_error';

export interface ProcessingError {
  type: ProcessingErrorType;
  message: string;
  details?: string;
  suggestedAction?: string;
  retryable?: boolean;
}

export interface FallbackStatusType {
  currentModel: string;
  currentModelIndex: number;
  totalModels: number;
  remainingModels: number;
  availableModels: string[];
}
