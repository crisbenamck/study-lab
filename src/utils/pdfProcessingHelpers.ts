import type { Question } from '../types/Question';
import type { ExtractedQuestion } from '../types/PDFProcessor';
import type { QuestionConversionOptions, ConversionResult } from '../types/pdfImportTypes';

/**
 * Converts ExtractedQuestion[] to Question[] with proper numbering
 */
export const convertExtractedToQuestions = (
  extractedQuestions: ExtractedQuestion[], 
  startingNumber: number,
  options: Partial<QuestionConversionOptions> = {}
): ConversionResult => {
  const { addMetadata = false } = options;
  const questions: Question[] = [];
  const errors: string[] = [];
  let skipped = 0;

  extractedQuestions.forEach((extracted, index) => {
    try {
      // Validate required fields
      if (!extracted.question_text || !extracted.options || extracted.options.length === 0) {
        errors.push(`Question ${index + 1}: Missing required fields`);
        skipped++;
        return;
      }

      // Validate options
      if (extracted.options.some(opt => !opt.option_text)) {
        errors.push(`Question ${index + 1}: Empty option text found`);
        skipped++;
        return;
      }

      const question: Question = {
        question_number: startingNumber + index,
        question_text: extracted.question_text,
        options: extracted.options,
        requires_multiple_answers: extracted.requires_multiple_answers,
        explanation: extracted.explanation || 'Explicación no disponible',
        link: extracted.link || 'Sin referencia'
      };

      // Add metadata if requested
      if (addMetadata && 'source' in extracted) {
        question.link = `${question.link} (Fuente: ${extracted.source})`;
      }

      questions.push(question);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      errors.push(`Question ${index + 1}: ${errorMessage}`);
      skipped++;
    }
  });

  return {
    questions,
    skipped,
    errors
  };
};

/**
 * Validates PDF file before processing
 */
export const validatePDFFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file type
  if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
    return {
      isValid: false,
      error: 'El archivo seleccionado no es un PDF válido'
    };
  }

  // Check file size (limit to 50MB)
  const maxSize = 50 * 1024 * 1024; // 50MB in bytes
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'El archivo es demasiado grande. El tamaño máximo permitido es 50MB'
    };
  }

  // Check file name for special characters that might cause issues
  const invalidChars = /[<>:"/\\|?*]/;
  if (invalidChars.test(file.name)) {
    return {
      isValid: false,
      error: 'El nombre del archivo contiene caracteres no válidos'
    };
  }

  return { isValid: true };
};

/**
 * Formats processing progress messages for user display
 */
export const formatProcessingMessage = (
  stage: string,
  currentPage?: number,
  totalPages?: number,
  additionalInfo?: string
): string => {
  const stageMessages: Record<string, string> = {
    'initializing': '🚀 Iniciando procesamiento...',
    'loading': '📄 Cargando archivo PDF...',
    'analyzing': '🔍 Analizando contenido...',
    'extracting': '📝 Extrayendo preguntas...',
    'enhancing': '✨ Mejorando preguntas con IA...',
    'completing': '✅ Finalizando procesamiento...'
  };

  let message = stageMessages[stage] || `🔄 ${stage}...`;

  if (currentPage && totalPages) {
    message += ` (Página ${currentPage}/${totalPages})`;
  }

  if (additionalInfo) {
    message += ` - ${additionalInfo}`;
  }

  return message;
};

/**
 * Calculates estimated processing time based on file size and page count
 */
export const estimateProcessingTime = (
  totalPages: number,
  contentType: 'text-only' | 'with-images',
  fileSize?: number
): { estimatedMinutes: number; estimatedRange: string } => {
  let baseTimePerPage = contentType === 'text-only' ? 0.5 : 2; // minutes per page

  // Adjust based on file size if provided
  if (fileSize) {
    const sizeMB = fileSize / (1024 * 1024);
    if (sizeMB > 10) {
      baseTimePerPage *= 1.5; // Larger files take longer
    }
  }

  const estimatedMinutes = Math.ceil(totalPages * baseTimePerPage);
  const minTime = Math.max(1, Math.floor(estimatedMinutes * 0.7));
  const maxTime = Math.ceil(estimatedMinutes * 1.3);

  return {
    estimatedMinutes,
    estimatedRange: `${minTime}-${maxTime} minutos`
  };
};

/**
 * Generates a processing summary for user feedback
 */
export const generateProcessingSummary = (
  totalQuestions: number,
  processingTime: number,
  startingNumber: number,
  contentType: 'text-only' | 'with-images',
  errors: string[] = []
): string => {
  const endingNumber = startingNumber + totalQuestions - 1;
  const timeDisplay = processingTime > 60 
    ? `${Math.floor(processingTime / 60)}m ${Math.floor(processingTime % 60)}s`
    : `${Math.floor(processingTime)}s`;

  let summary = `✅ ¡Procesamiento exitoso!\n\n`;
  summary += `📋 Se extrajeron ${totalQuestions} pregunta${totalQuestions > 1 ? 's' : ''}\n`;
  summary += `🔧 Método: ${contentType === 'text-only' ? 'Solo texto' : 'Con imágenes'}\n`;
  summary += `⏱️ Tiempo de procesamiento: ${timeDisplay}\n`;
  summary += `🎯 Números asignados: ${startingNumber} - ${endingNumber}\n`;

  if (errors.length > 0) {
    summary += `\n⚠️ Se encontraron ${errors.length} advertencia${errors.length > 1 ? 's' : ''}`;
  }

  return summary;
};

/**
 * Sanitizes user input for PDF processing
 */
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/[^\x20-\x7E\u00A0-\uFFFF]/g, '') // Keep only printable characters
    .substring(0, 1000); // Limit length
};

/**
 * Checks if Gemini API key format is valid
 */
export const validateGeminiApiKey = (apiKey: string): { isValid: boolean; error?: string } => {
  if (!apiKey || apiKey.trim().length === 0) {
    return {
      isValid: false,
      error: 'API key es requerida'
    };
  }

  // Basic format validation for Gemini API keys
  if (apiKey.length < 20) {
    return {
      isValid: false,
      error: 'API key parece ser muy corta'
    };
  }

  // Check for common invalid patterns
  if (apiKey.includes(' ') || apiKey.includes('\n') || apiKey.includes('\t')) {
    return {
      isValid: false,
      error: 'API key contiene espacios o caracteres no válidos'
    };
  }

  return { isValid: true };
};
