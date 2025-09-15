import { useState, useCallback } from 'react';
import { GeminiPdfService } from '../utils/geminiPdfService';
import { useRetryProgress } from '../hooks/useRetryProgress';
import RetryProgressIndicator from '../components/common/RetryProgressIndicator';

/**
 * Ejemplo de cómo usar el sistema de reintentos con indicador visual
 */
export const ExamplePDFProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { retryProgress, startRetrySequence, endRetrySequence, setRetryAttempt } = useRetryProgress();

  const processPDFWithRetries = useCallback(async (file: File, apiKey: string) => {
    setIsProcessing(true);
    
    // Iniciar seguimiento de reintentos
    startRetrySequence(5, 3); // 5 modelos, 3 intentos max
    
    try {
      // Crear servicio con callback de progreso
      const pdfService = new GeminiPdfService(apiKey, (modelIndex, attempt, model, isRetrying) => {
        setRetryAttempt(modelIndex, attempt, model, isRetrying);
      });
      
      // Procesar PDF
      const questions = await pdfService.extractQuestionsFromPDF(file);
      
      console.log(`✅ Procesamiento exitoso: ${questions.length} preguntas extraídas`);
      return questions;
      
    } catch (error) {
      console.error('❌ Error final en procesamiento:', error);
      throw error;
    } finally {
      // Limpiar estado de reintentos
      endRetrySequence();
      setIsProcessing(false);
    }
  }, [startRetrySequence, endRetrySequence, setRetryAttempt]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Procesamiento de PDF con Reintentos</h2>
      
      {/* Indicador de progreso de reintentos */}
      {retryProgress && (
        <RetryProgressIndicator
          isVisible={true}
          currentModel={retryProgress.currentModel}
          attemptNumber={retryProgress.attemptNumber}
          maxAttempts={retryProgress.maxAttempts}
          modelIndex={retryProgress.modelIndex}
          totalModels={retryProgress.totalModels}
          isRetrying={retryProgress.isRetrying}
        />
      )}
      
      {/* Estado de procesamiento */}
      {isProcessing && !retryProgress && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-sm font-medium text-blue-900">
              Procesando archivo PDF...
            </span>
          </div>
        </div>
      )}
      
      <div className="space-y-2 text-sm text-gray-600">
        <p><strong>💡 Ventajas del nuevo sistema:</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Reintentos automáticos para errores 503/502/overloaded</li>
          <li>Fallback a 5 modelos diferentes de Gemini</li>
          <li>Backoff exponencial inteligente (4s, 8s, 16s)</li>
          <li>Indicador visual del progreso de reintentos</li>
          <li>Mensajes de error mejorados y actionables</li>
        </ul>
      </div>
    </div>
  );
};

export default ExamplePDFProcessing;