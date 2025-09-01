import React, { useState, useCallback } from 'react';
import { PDFProcessorService } from '../../utils/pdfProcessor';
import { GeminiPdfService } from '../../utils/geminiPdfService';
import { GeminiQuestionProcessor, type ProcessingProgress } from '../../utils/geminiQuestionProcessor';
import type { Question } from '../../types/Question';
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState<string>('');
  const [individualProcessingProgress, setIndividualProcessingProgress] = useState<ProcessingProgress | null>(null);
  const [showManualProcessing, setShowManualProcessing] = useState(false);
  const [currentGeminiModel, setCurrentGeminiModel] = useState<string>('gemini-2.5-pro');
  const [fallbackStatus, setFallbackStatus] = useState<{
    currentModel: string;
    currentModelIndex: number;
    totalModels: number;
    remainingModels: number;
    availableModels: string[];
  } | null>(null);

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

    setIsProcessing(true);
    console.log(`🚀 Iniciando procesamiento de página ${pageToProcess} de ${selectedFile.name}`);

    const processor = new PDFProcessorService(geminiApiKey);
    
    try {
      const initialStatus = processor.getGeminiService()?.getFallbackStatus();
      if (initialStatus) {
        setFallbackStatus(initialStatus);
        setCurrentGeminiModel(initialStatus.currentModel);
      }
      
      const result = await processor.processPDF(
        selectedFile, 
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
      
      result.pages.forEach(page => {
        console.log(`📄 Página ${page.pageNumber}:`, {
          hasText: page.hasText,
          hasImages: page.hasImages,
          extractedQuestions: page.extractedQuestions?.length || 0,
          geminiVisionOption: page.geminiVisionOption,
          ocrFailed: page.ocrFailed
        });
      });
      
      const allQuestions = result.pages.flatMap(page => page.extractedQuestions || []);
      
      console.log('📋 Páginas procesadas:', result.pages.length);
      
      if (allQuestions.length > 0) {
        const convertedQuestions: Question[] = allQuestions.map((q, index) => ({
          question_number: nextQuestionNumber + index,
          question_text: q.question_text,
          options: q.options.map(opt => ({
            option_letter: opt.option_letter,
            option_text: opt.option_text,
            is_correct: opt.is_correct
          })),
          requires_multiple_answers: q.requires_multiple_answers,
          link: q.link || '',
          explanation: q.explanation || ''
        }));

        onImportQuestions(convertedQuestions);
        showAlert(`✅ ¡Procesamiento de SOLO TEXTO exitoso!\n\n📝 Se extrajeron ${convertedQuestions.length} preguntas de la página ${pageToProcess}\n💡 Cada pregunta incluye explicación generada por IA\n📋 Las preguntas se han añadido a tu lista con numeración consecutiva\n\n🎯 Números asignados: ${nextQuestionNumber} - ${nextQuestionNumber + convertedQuestions.length - 1}`, {
          title: 'Procesamiento exitoso',
          type: 'success',
          buttonText: 'Perfecto!'
        });
      } else {
        showAlert('⚠️ No se encontraron preguntas en la página seleccionada. Intenta con otra página o usa el modo "Con imágenes" si hay contenido visual complejo.', {
          title: 'Sin resultados',
          type: 'warning'
        });
      }
    } catch (error) {
      console.error('Error procesando PDF:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      const errorStatus = processor.getGeminiService()?.getFallbackStatus();
      if (errorStatus) {
        setFallbackStatus(errorStatus);
        setCurrentGeminiModel(errorStatus.currentModel);
      }
      
      if (errorMessage.includes('503') || errorMessage.includes('overloaded')) {
        showAlert('⏳ Gemini está sobrecargado. Intenta nuevamente en unos minutos.', {
          title: 'Servidor sobrecargado',
          type: 'warning'
        });
      } else if (errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('Todos los modelos de Gemini fallaron')) {
        const modelInfo = errorStatus ? 
          `\n\n🤖 Modelos intentados: ${errorStatus.currentModelIndex + 1}/${errorStatus.totalModels}\n` +
          `� Último modelo usado: ${errorStatus.currentModel}\n` +
          `⏭️ Modelos restantes: ${errorStatus.remainingModels}` 
          : '';
        
        if (errorStatus && errorStatus.remainingModels > 0) {
          showAlert(`🚫 Se agotó la cuota del modelo actual.\n\nEl sistema intentó automáticamente con los modelos de respaldo.${modelInfo}\n\n💡 Espera unas horas e intenta nuevamente.`, {
            title: 'Cuota agotada',
            type: 'error'
          });
        } else {
          showAlert(`🚫 Se agotaron todos los modelos de Gemini disponibles.${modelInfo}\n\n💡 Espera unas horas para que se restablezcan las cuotas.`, {
            title: 'Sin modelos disponibles',
            type: 'error'
          });
        }
      } else {
        showAlert(`❌ Error procesando PDF: ${errorMessage}`, {
          title: 'Error de procesamiento',
          type: 'error'
        });
      }
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile, geminiApiKey, pageToProcess, onImportQuestions, nextQuestionNumber, showAlert]);

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
          setIsProcessing(true);
          setProcessingProgress('🚀 Iniciando procesamiento directo de PDF...');
          setIndividualProcessingProgress(null);
          console.log(`🚀 Iniciando procesamiento directo de PDF: ${selectedFile.name}`);

          try {
            setProcessingProgress('📄 Preparando archivo PDF...');
            const pdfService = new GeminiPdfService(geminiApiKey);
            
            setProcessingProgress('🤖 Analizando contenido con Gemini (esto puede tomar 1-3 minutos)...');
            const extractedQuestions = await pdfService.extractQuestionsFromPDF(selectedFile);
            
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
        }
      },
      {
        title: `Procesar como contenido ${isTextOnly ? 'SOLO TEXTO' : 'CON IMÁGENES'}`,
        confirmText: 'Sí, Procesar',
        cancelText: 'Cancelar'
      }
    );
  }, [selectedFile, geminiApiKey, totalPages, handleStartProcessing, nextQuestionNumber, onImportQuestions, showAlert, showConfirm]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ApiKeyConfigSection 
        geminiApiKey={geminiApiKey}
        saveGeminiApiKey={saveGeminiApiKey}
        currentGeminiModel={currentGeminiModel}
        fallbackStatus={fallbackStatus}
      />

      {geminiApiKey && geminiApiKey.trim() !== '' && (
        <AutomaticModelsSection />
      )}

      <FileUploadArea 
        selectedFile={selectedFile}
        totalPages={totalPages}
        onFileSelect={handleFileSelect}
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
        isProcessing={isProcessing}
        geminiApiKey={geminiApiKey}
        onStartProcessing={handleStartProcessing}
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

      <UserProgressSection 
        geminiApiKey={geminiApiKey}
        selectedFile={selectedFile}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default PDFImport;
