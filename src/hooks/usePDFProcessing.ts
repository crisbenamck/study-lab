import { useState, useCallback } from 'react';
import { PDFProcessorService } from '../utils/pdfProcessor';
import { GeminiPdfService } from '../utils/geminiPdfService';
import { GeminiQuestionProcessor, type ProcessingProgress } from '../utils/geminiQuestionProcessor';
import type { Question } from '../types/Question';
import type { ExtractedQuestion } from '../types/PDFProcessor';

interface UsePDFProcessingProps {
  geminiApiKey: string;
  nextQuestionNumber: number;
  showAlert: (message: string, options?: { title?: string; type?: 'info' | 'success' | 'warning' | 'error'; buttonText?: string; }) => void;
  showConfirm: (message: string, onConfirm: () => void, options?: { title?: string; confirmText?: string; cancelText?: string; }) => void;
  onImportQuestions: (questions: Question[]) => void;
}

interface UsePDFProcessingReturn {
  isProcessing: boolean;
  processingProgress: string;
  individualProcessingProgress: ProcessingProgress | null;
  currentGeminiModel: string;
  fallbackStatus: {
    currentModel: string;
    currentModelIndex: number;
    totalModels: number;
    remainingModels: number;
    availableModels: string[];
  } | null;
  startSinglePageProcessing: (file: File, pageToProcess: number) => Promise<void>;
  startIntelligentProcessing: (file: File, totalPages: number, contentType: 'text-only' | 'with-images') => Promise<void>;
}

// Helper function to convert ExtractedQuestion to Question
const convertToQuestions = (extractedQuestions: ExtractedQuestion[], startingNumber: number): Question[] => {
  return extractedQuestions.map((extracted, index) => ({
    question_number: startingNumber + index,
    question_text: extracted.question_text,
    options: extracted.options,
    requires_multiple_answers: extracted.requires_multiple_answers,
    explanation: extracted.explanation,
    link: extracted.link
  }));
};

export const usePDFProcessing = ({
  geminiApiKey,
  nextQuestionNumber,
  showAlert,
  showConfirm,
  onImportQuestions
}: UsePDFProcessingProps): UsePDFProcessingReturn => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState<string>('');
  const [individualProcessingProgress, setIndividualProcessingProgress] = useState<ProcessingProgress | null>(null);
  const [currentGeminiModel, setCurrentGeminiModel] = useState<string>('gemini-2.5-pro');
  const [fallbackStatus, setFallbackStatus] = useState<{
    currentModel: string;
    currentModelIndex: number;
    totalModels: number;
    remainingModels: number;
    availableModels: string[];
  } | null>(null);

  const handleProcessingError = useCallback((error: unknown, processor: PDFProcessorService) => {
    console.error('Error procesando PDF:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    
    const errorStatus = processor.getGeminiService()?.getFallbackStatus();
    if (errorStatus) {
      setFallbackStatus(errorStatus);
      setCurrentGeminiModel(errorStatus.currentModel);
    }
    
    if (errorMessage.includes('503') || errorMessage.includes('overloaded')) {
      showAlert('⚠️ El servicio de Gemini está temporalmente sobrecargado. Intenta de nuevo en unos minutos.', {
        title: 'Servicio sobrecargado',
        type: 'warning'
      });
    } else if (errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('Todos los modelos de Gemini fallaron')) {
      showAlert(`⚠️ Se agotó la cuota de todos los modelos de Gemini disponibles.\n\n🕐 Espera unas horas para que se restablezcan las cuotas diarias.\n\n💡 Tip: Las cuotas se restablecen automáticamente cada 24 horas.`, {
        title: 'Cuota agotada',
        type: 'warning'
      });
    } else {
      showAlert(`❌ Error procesando PDF: ${errorMessage}`, {
        title: 'Error de procesamiento',
        type: 'error'
      });
    }
  }, [showAlert]);

  const startSinglePageProcessing = useCallback(async (file: File, pageToProcess: number) => {
    if (!file || !geminiApiKey.trim()) {
      showAlert('Por favor asegúrate de tener un archivo y API key configurados', {
        title: 'Configuración incompleta',
        type: 'warning'
      });
      return;
    }

    setIsProcessing(true);
    console.log(`🚀 Iniciando procesamiento de página ${pageToProcess} de ${file.name}`);

    const processor = new PDFProcessorService(geminiApiKey);
    
    try {
      const initialStatus = processor.getGeminiService()?.getFallbackStatus();
      if (initialStatus) {
        setFallbackStatus(initialStatus);
        setCurrentGeminiModel(initialStatus.currentModel);
      }
      
      const result = await processor.processPDF(
        file, 
        (progress) => {
          console.log(`Progreso: ${progress.stage} - página ${progress.currentPage}/${progress.totalPages}`);
        },
        pageToProcess,
        (question, pageNum) => {
          console.log(`Pregunta extraída de página ${pageNum}:`, question.question_text);
        }
      );

      const finalStatus = processor.getGeminiService()?.getFallbackStatus();
      if (finalStatus) {
        setFallbackStatus(finalStatus);
        setCurrentGeminiModel(finalStatus.currentModel);
      }

      console.log('✅ Procesamiento completado:', result);
      
      const allQuestions = result.pages.flatMap(page => page.extractedQuestions || []);
      
      if (allQuestions.length > 0) {
        const questions = convertToQuestions(allQuestions, nextQuestionNumber);
        onImportQuestions(questions);
        
        showAlert(
          `✅ ¡Procesamiento exitoso!\n\n📋 Se extrajeron ${allQuestions.length} pregunta${allQuestions.length > 1 ? 's' : ''} de la página ${pageToProcess}\n🔍 Cada pregunta incluye explicación detallada y link de referencia\n📝 Las preguntas se han añadido a tu lista con numeración consecutiva\n\n🎯 Números asignados: ${nextQuestionNumber} - ${nextQuestionNumber + allQuestions.length - 1}`,
          {
            title: 'Importación completada',
            type: 'success',
            buttonText: 'Excelente!'
          }
        );
      } else {
        showAlert(`⚠️ No se encontraron preguntas en la página ${pageToProcess} del PDF.`, {
          title: 'Sin resultados',
          type: 'warning'
        });
      }
    } catch (error) {
      handleProcessingError(error, processor);
    } finally {
      setIsProcessing(false);
    }
  }, [geminiApiKey, nextQuestionNumber, onImportQuestions, showAlert, handleProcessingError]);

  const processWithTextOnly = useCallback(async (file: File) => {
    await startSinglePageProcessing(file, 1);
  }, [startSinglePageProcessing]);

  const processWithImages = useCallback(async (file: File) => {
    setIsProcessing(true);
    setProcessingProgress('🚀 Iniciando procesamiento directo de PDF...');
    setIndividualProcessingProgress(null);
    console.log(`🚀 Iniciando procesamiento directo de PDF: ${file.name}`);

    try {
      setProcessingProgress('📄 Preparando archivo PDF...');
      const pdfService = new GeminiPdfService(geminiApiKey);
      
      setProcessingProgress('🤖 Analizando contenido con Gemini (esto puede tomar 1-3 minutos)...');
      const extractedQuestions = await pdfService.extractQuestionsFromPDF(file);
      
      if (extractedQuestions.length === 0) {
        showAlert(`⚠️ No se encontraron preguntas en el PDF completo.`, {
          title: 'Sin resultados',
          type: 'warning'
        });
        return;
      }

      console.log(`📋 Se extrajeron ${extractedQuestions.length} preguntas del PDF`);
      setProcessingProgress(`✅ PDF analizado: ${extractedQuestions.length} preguntas encontradas`);
    
      setProcessingProgress('🔄 Procesando preguntas individualmente...');
      const questionProcessor = new GeminiQuestionProcessor(geminiApiKey);
      
      const processedQuestions = await questionProcessor.processQuestionsIndividually(
        extractedQuestions,
        nextQuestionNumber,
        (progress) => {
          setIndividualProcessingProgress(progress);
          if (progress.stage === 'processing') {
            setProcessingProgress(
              `🔄 Procesando pregunta ${progress.currentQuestion}/${progress.totalQuestions}: ${progress.currentQuestionText || 'Obteniendo explicación...'}`
            );
          }
        }
      );
      
      setProcessingProgress('✅ Todas las preguntas procesadas exitosamente');
      setIndividualProcessingProgress(null);
      
      onImportQuestions(processedQuestions);
      
      showAlert(
        `✅ ¡Procesamiento CON IMÁGENES exitoso!\n\n` +
        `🖼️ Se analizó todo el PDF incluyendo contenido visual\n` +
        `📋 Se extrajeron ${processedQuestions.length} preguntas del PDF completo\n` +
        `🔍 Cada pregunta incluye explicación detallada y link de referencia\n` +
        `📝 Las preguntas se han añadido a tu lista con numeración consecutiva\n\n` +
        `🎯 Números asignados: ${nextQuestionNumber} - ${nextQuestionNumber + processedQuestions.length - 1}`,
        {
          title: 'Procesamiento completo exitoso',
          type: 'success',
          buttonText: 'Excelente!'
        }
      );
      
    } catch (error) {
      console.error('Error en procesamiento directo:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      showAlert(`❌ Error en procesamiento directo: ${errorMessage}`, {
        title: 'Error de procesamiento',
        type: 'error'
      });
    } finally {
      setIsProcessing(false);
      setProcessingProgress('');
      setIndividualProcessingProgress(null);
    }
  }, [geminiApiKey, nextQuestionNumber, onImportQuestions, showAlert]);

  const startIntelligentProcessing = useCallback(async (file: File, totalPages: number, contentType: 'text-only' | 'with-images') => {
    if (!file || !geminiApiKey.trim()) {
      showAlert('Se requiere archivo y API key para el procesamiento', {
        title: 'Configuración incompleta',
        type: 'warning'
      });
      return;
    }

    const isTextOnly = contentType === 'text-only';
    
    showConfirm(
      `📄 Archivo: ${file.name} (${totalPages} página${totalPages > 1 ? 's' : ''})\n` +
      `🔧 Método: ${isTextOnly ? 'Extracción de texto + IA para explicaciones' : 'Análisis completo con Gemini Vision'}\n` +
      `💰 Costo: ${isTextOnly ? 'Bajo (solo explicaciones)' : 'Moderado (análisis completo)'}\n` +
      `⏱️ Tiempo estimado: ${isTextOnly ? '1-2 minutos' : '3-5 minutos'}\n` +
      `🎯 Resultado: ${isTextOnly ? 'Preguntas de texto con explicaciones' : 'Análisis completo incluyendo imágenes'}`,
      async () => {
        if (isTextOnly) {
          await processWithTextOnly(file);
        } else {
          await processWithImages(file);
        }
      },
      {
        title: `Procesar como contenido ${isTextOnly ? 'SOLO TEXTO' : 'CON IMÁGENES'}`,
        confirmText: 'Sí, Procesar',
        cancelText: 'Cancelar'
      }
    );
  }, [geminiApiKey, showAlert, showConfirm, processWithTextOnly, processWithImages]);

  return {
    isProcessing,
    processingProgress,
    individualProcessingProgress,
    currentGeminiModel,
    fallbackStatus,
    startSinglePageProcessing,
    startIntelligentProcessing
  };
};
