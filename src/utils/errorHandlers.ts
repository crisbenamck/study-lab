/**
 * Error handling utilities for PDF processing
 */

import type { ProcessingError, ProcessingErrorType } from '../types/pdfImportTypes';

// Error type detection utilities
export const detectErrorType = (error: Error | string): ProcessingErrorType => {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const lowerMessage = errorMessage.toLowerCase();

  if (lowerMessage.includes('429') || lowerMessage.includes('quota') || lowerMessage.includes('todos los modelos de gemini fallaron')) {
    return 'quota_exceeded';
  }
  
  if (lowerMessage.includes('503') || lowerMessage.includes('overloaded')) {
    return 'server_overloaded';
  }
  
  if (lowerMessage.includes('invalid file') || lowerMessage.includes('file format')) {
    return 'invalid_file';
  }
  
  if (lowerMessage.includes('api key') || lowerMessage.includes('authentication')) {
    return 'api_key_invalid';
  }
  
  if (lowerMessage.includes('network') || lowerMessage.includes('connection')) {
    return 'network_error';
  }
  
  return 'unknown_error';
};

// Error message creation utilities
export const createProcessingError = (error: Error | string, fallbackStatus?: { currentModel: string; currentModelIndex: number; totalModels: number; remainingModels: number; }): ProcessingError => {
  const errorType = detectErrorType(error);
  const errorMessage = typeof error === 'string' ? error : error.message;
  
  switch (errorType) {
    case 'quota_exceeded':
      return {
        type: 'quota_exceeded',
        message: 'Se agotó la cuota del modelo actual',
        details: createQuotaErrorDetails(fallbackStatus),
        suggestedAction: 'Espera unas horas e intenta nuevamente',
        retryable: true
      };
      
    case 'server_overloaded':
      return {
        type: 'server_overloaded',
        message: 'Gemini está sobrecargado',
        details: 'El servidor está experimentando alta demanda',
        suggestedAction: 'Intenta nuevamente en unos minutos',
        retryable: true
      };
      
    case 'invalid_file':
      return {
        type: 'invalid_file',
        message: 'Archivo no válido',
        details: errorMessage,
        suggestedAction: 'Verifica que el archivo sea un PDF válido',
        retryable: false
      };
      
    case 'api_key_invalid':
      return {
        type: 'api_key_invalid',
        message: 'API key inválida o expirada',
        details: errorMessage,
        suggestedAction: 'Verifica tu API key de Gemini',
        retryable: false
      };
      
    case 'network_error':
      return {
        type: 'network_error',
        message: 'Error de conectividad',
        details: errorMessage,
        suggestedAction: 'Verifica tu conexión a internet',
        retryable: true
      };
      
    default:
      return {
        type: 'unknown_error',
        message: 'Error desconocido',
        details: errorMessage,
        suggestedAction: 'Intenta nuevamente o contacta soporte',
        retryable: true
      };
  }
};

// Helper for quota error details
const createQuotaErrorDetails = (fallbackStatus?: { currentModel: string; currentModelIndex: number; totalModels: number; remainingModels: number; }): string => {
  if (!fallbackStatus) {
    return 'No hay información de modelos disponible';
  }
  
  return `Modelos intentados: ${fallbackStatus.currentModelIndex + 1}/${fallbackStatus.totalModels}\n` +
         `Último modelo usado: ${fallbackStatus.currentModel}\n` +
         `Modelos restantes: ${fallbackStatus.remainingModels}`;
};

// Alert message creation utilities
export const createAlertMessage = (error: ProcessingError): string => {
  const { type, message, details, suggestedAction } = error;
  
  const icons: Record<ProcessingErrorType, string> = {
    quota_exceeded: '🚫',
    server_overloaded: '⏳',
    invalid_file: '📁',
    api_key_invalid: '🔑',
    network_error: '🌐',
    unknown_error: '❌'
  };
  
  const icon = icons[type];
  let alertMessage = `${icon} ${message}`;
  
  if (details) {
    alertMessage += `\n\n${details}`;
  }
  
  if (suggestedAction) {
    alertMessage += `\n\n💡 ${suggestedAction}`;
  }
  
  return alertMessage;
};

// Alert options creation
export const createAlertOptions = (error: ProcessingError) => {
  const titles: Record<ProcessingErrorType, string> = {
    quota_exceeded: 'Cuota agotada',
    server_overloaded: 'Servidor sobrecargado',
    invalid_file: 'Archivo inválido',
    api_key_invalid: 'API Key inválida',
    network_error: 'Error de conexión',
    unknown_error: 'Error de procesamiento'
  };
  
  return {
    title: titles[error.type],
    type: error.retryable ? 'warning' as const : 'error' as const,
    buttonText: error.retryable ? 'Reintentar' : 'Entendido'
  };
};

// Centralized error handling function
export const handleProcessingError = (
  error: Error | string,
  fallbackStatus: { currentModel: string; currentModelIndex: number; totalModels: number; remainingModels: number; } | null,
  showAlert: (message: string, options?: { title?: string; type?: 'info' | 'success' | 'warning' | 'error'; buttonText?: string; }) => void
): void => {
  console.error('Error procesando PDF:', error);
  
  const processingError = createProcessingError(error, fallbackStatus || undefined);
  const alertMessage = createAlertMessage(processingError);
  const alertOptions = createAlertOptions(processingError);
  
  showAlert(alertMessage, alertOptions);
};

// Success message utilities
export const createSuccessMessage = (
  questionsCount: number,
  startNumber: number,
  processingType: 'text-only' | 'with-images',
  additionalInfo?: string
): string => {
  const typeLabels = {
    'text-only': 'SOLO TEXTO',
    'with-images': 'CON IMÁGENES'
  };
  
  const typeDescriptions = {
    'text-only': '📝 Se extrajeron preguntas con explicaciones generadas por IA',
    'with-images': '🖼️ Se analizó todo el PDF incluyendo contenido visual'
  };
  
  const endNumber = startNumber + questionsCount - 1;
  
  let message = `✅ ¡Procesamiento ${typeLabels[processingType]} exitoso!\n\n`;
  message += `${typeDescriptions[processingType]}\n`;
  message += `📋 Total de preguntas extraídas: ${questionsCount}\n`;
  message += `💡 Cada pregunta incluye explicación detallada\n`;
  message += `📝 Las preguntas se han añadido a tu lista con numeración consecutiva\n\n`;
  message += `🎯 Números asignados: ${startNumber} - ${endNumber}`;
  
  if (additionalInfo) {
    message += `\n\n${additionalInfo}`;
  }
  
  return message;
};

// Processing confirmation message utilities
export const createProcessingConfirmationMessage = (
  fileName: string,
  totalPages: number,
  contentType: 'text-only' | 'with-images'
): string => {
  const isTextOnly = contentType === 'text-only';
  
  return `📄 Archivo: ${fileName} (${totalPages} página${totalPages > 1 ? 's' : ''})\n` +
         `🔧 Método: ${isTextOnly ? 'Extracción de texto + IA para explicaciones' : 'Análisis completo con Gemini Vision'}\n` +
         `💰 Costo: ${isTextOnly ? 'Bajo (solo explicaciones)' : 'Moderado (análisis completo)'}\n` +
         `⏱️ Tiempo estimado: ${isTextOnly ? '1-2 minutos' : '3-5 minutos'}\n` +
         `🎯 Resultado: ${isTextOnly ? 'Preguntas de texto con explicaciones' : 'Análisis completo incluyendo imágenes'}`;
};
