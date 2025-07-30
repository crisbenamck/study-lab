export interface PDFPage {
  pageNumber: number;
  hasText: boolean;
  hasImages: boolean;
  textContent?: string;
  imageData?: string;
  extractedQuestions?: ExtractedQuestion[];
  processingStatus: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
}

export interface ExtractedQuestion {
  id: string;
  question_text: string;
  options: {
    option_letter: string;
    option_text: string;
    is_correct: boolean;
  }[];
  requires_multiple_answers: boolean;
  explanation: string;
  link: string;
  confidence: number; // 0-1 score de confianza del procesamiento
  source: 'text' | 'ocr' | 'hybrid';
  needsReview: boolean;
}

export interface PDFProcessingResult {
  file: File;
  pages: PDFPage[];
  totalQuestions: number;
  processingTime: number;
  errors: string[];
}

export interface GeminiConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

export interface ProcessingProgress {
  currentPage: number;
  totalPages: number;
  stage: 'analyzing' | 'extracting-text' | 'ocr' | 'ai-processing' | 'completed';
  message: string;
}
