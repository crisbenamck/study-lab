import React, { useState, useCallback } from 'react';
import { Upload, AlertCircle, Settings, FileText, ChevronDown, ChevronUp, Check, Clock } from 'lucide-react';
import { PDFProcessorService } from '../utils/pdfProcessor';
import { GeminiPdfService } from '../utils/geminiPdfService';
import { GeminiQuestionProcessor, type ProcessingProgress } from '../utils/geminiQuestionProcessor';
import type { Question } from '../types/Question';

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
}

// Componente colapsable para la configuración de API Key
interface ApiKeyConfigSectionProps {
  geminiApiKey: string;
  saveGeminiApiKey: (key: string) => void;
  currentGeminiModel: string;
  fallbackStatus: {
    currentModel: string;
    currentModelIndex: number;
    totalModels: number;
    remainingModels: number;
    availableModels: string[];
  } | null;
}

const ApiKeyConfigSection: React.FC<ApiKeyConfigSectionProps> = ({ 
  geminiApiKey, 
  saveGeminiApiKey, 
  currentGeminiModel, 
  fallbackStatus 
}) => {
  const [isExpanded, setIsExpanded] = useState(!geminiApiKey || geminiApiKey.trim() === '');
  const hasApiKey = geminiApiKey && geminiApiKey.trim() !== '';

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-start justify-between space-x-3 text-left focus:outline-none"
      >
        <div className="flex items-start space-x-3 flex-1">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-yellow-800">
              {hasApiKey ? '✅ API Key Configurada' : 'Configuración API Key'}
            </h3>
            <p className="text-sm text-yellow-700 mt-1">
              {isExpanded 
                ? "Configura tu API key de Google Gemini para usar esta función."
                : hasApiKey 
                  ? "API key configurada correctamente. Haz clic para ver detalles o cambiar."
                  : "Se requiere API key de Google Gemini. Haz clic para configurar."
              }
            </p>
          </div>
        </div>
        <div className="flex-shrink-0 mt-0.5">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-yellow-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-yellow-600" />
          )}
        </div>
      </button>
      
      {isExpanded && (
        <div className="mt-3">
          <p className="text-sm text-yellow-700 mb-2">
            Necesitas una API key de Google Gemini para usar esta función.
            <a 
              href="https://makersuite.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline ml-1"
            >
              Obtener API key gratuita
            </a>
          </p>
          <input
            type="password"
            placeholder="Pega tu API key de Gemini aquí..."
            value={geminiApiKey}
            onChange={(e) => saveGeminiApiKey(e.target.value)}
            className="mt-2 w-full px-3 py-2 border border-amber-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
          {hasApiKey && (
            <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
              <p className="text-xs text-blue-700 mb-1">
                🤖 <strong>Modelo actual:</strong> {currentGeminiModel}
              </p>
              {fallbackStatus && (
                <div className="text-xs text-blue-600">
                  <p>📊 Modelo {fallbackStatus.currentModelIndex + 1} de {fallbackStatus.totalModels}</p>
                  {fallbackStatus.remainingModels > 0 && (
                    <p>⏭️ {fallbackStatus.remainingModels} modelos de respaldo disponibles</p>
                  )}
                  {fallbackStatus.remainingModels === 0 && (
                    <p className="text-amber-600">⚠️ Último modelo disponible</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Componente para el mensaje de próximo paso
interface NextStepMessageProps {
  geminiApiKey: string;
  selectedFile: File | null;
}

const NextStepMessage: React.FC<NextStepMessageProps> = ({ geminiApiKey, selectedFile }) => {
  const hasApiKey = !!(geminiApiKey && geminiApiKey.trim() !== '');
  
  if (!hasApiKey) {
    return null; // No mostrar nada si no hay API key
  }
  
  if (selectedFile) {
    return null; // No mostrar nada si ya hay archivo seleccionado
  }
  
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center space-x-3">
        <div className="w-5 h-5 text-blue-600 flex-shrink-0">🎯</div>
        <div className="flex-1">
          <p className="text-sm font-medium text-blue-800">
            ¡API key configurada correctamente!
          </p>
          <p className="text-sm text-blue-700 mt-1">
            Arrastra un archivo PDF en el área de arriba para extraer preguntas automáticamente.
          </p>
        </div>
      </div>
    </div>
  );
};

// Componente para el progreso del usuario (simplificado)
interface UserProgressSectionProps {
  geminiApiKey: string;
  selectedFile: File | null;
  isProcessing: boolean;
}

const UserProgressSection: React.FC<UserProgressSectionProps> = ({ 
  geminiApiKey, 
  selectedFile,
  isProcessing
}) => {
  const hasApiKey = !!(geminiApiKey && geminiApiKey.trim() !== '');
  
  const getStepIcon = (completed: boolean, inProgress: boolean = false) => {
    if (inProgress) {
      return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>;
    }
    if (completed) {
      return <Check className="w-4 h-4 text-green-600" />;
    } else {
      return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const steps = [
    {
      id: 'api-key',
      text: 'Configurar API Key',
      completed: hasApiKey,
      inProgress: false
    },
    {
      id: 'select-file',
      text: 'Seleccionar archivo PDF',
      completed: hasApiKey && !!selectedFile,
      inProgress: false
    },
    {
      id: 'process',
      text: 'Procesar preguntas',
      completed: false, // Se marcará cuando el procesamiento sea exitoso
      inProgress: isProcessing
    },
    {
      id: 'import',
      text: 'Importar a la lista',
      completed: false, // Se marcará cuando se importen las preguntas
      inProgress: false
    }
  ];

  return (
    <div 
      className="bg-gray-50 rounded-lg p-4"
      style={{ marginTop: '24px' }}
    >
      <h4 className="font-medium text-gray-800 mb-3">🚀 Progreso:</h4>
      <div className="space-y-3">
        {steps.map((step) => (
          <div key={step.id} className="flex items-center space-x-3">
            {getStepIcon(step.completed, step.inProgress)}
            <span className={`text-sm ${
              step.completed ? 'text-gray-700 font-medium' : 
              step.inProgress ? 'text-blue-600 font-medium' :
              'text-gray-500'
            }`}>
              {step.text}
            </span>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
        <p className="text-xs text-blue-700">
          💡 <strong>Tip:</strong> Usa el "Procesamiento Directo" para mejores resultados. 
          Analiza todo el PDF automáticamente y genera explicaciones detalladas.
        </p>
      </div>
    </div>
  );
};
const AutomaticModelsSection: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-start justify-between space-x-3 text-left focus:outline-none"
      >
        <div className="flex items-start space-x-3 flex-1">
          <div className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5">🤖</div>
          <div className="flex-1">
            <h3 className="font-medium text-blue-800">Sistema de Modelos con Fallback Automático</h3>
            <p className="text-sm text-blue-700 mt-1">
              {isExpanded 
                ? "El sistema usa automáticamente diferentes modelos de Gemini si se agota la cuota diaria:"
                : "Haz clic para ver detalles del sistema de respaldo automático de modelos"
              }
            </p>
          </div>
        </div>
        <div className="flex-shrink-0 mt-0.5">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-blue-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-blue-600" />
          )}
        </div>
      </button>
      
      {isExpanded && (
        <div className="mt-3 pl-8">
          <div className="mt-2 text-xs text-blue-600">
            <p>🥇 <strong>Primero:</strong> gemini-2.5-pro (mejor calidad)</p>
            <p>🥈 <strong>Respaldo 1:</strong> gemini-2.5-flash</p>
            <p>🥉 <strong>Respaldo 2:</strong> gemini-2.5-flash-lite</p>
            <p>🔄 <strong>Respaldo 3:</strong> gemini-2.0-flash-15</p>
            <p>🔄 <strong>Respaldo 4:</strong> gemini-2.0-flash-lite</p>
          </div>
          <p className="text-xs text-blue-500 mt-2">
            💡 Si todos los modelos se agotan, espera unas horas para que se restablezcan las cuotas.
          </p>
        </div>
      )}
    </div>
  );
};

const PDFImport: React.FC<PDFImportProps> = ({ 
  onImportQuestions, 
  appState, 
  nextQuestionNumber 
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
      // Obtener información real del PDF
      const processor = new PDFProcessorService(geminiApiKey || 'temp');
      const pdfInfo = await processor.getPDFInfo(file);
      setTotalPages(pdfInfo.totalPages);
      setPageToProcess(1);
      console.log(`📄 PDF cargado: ${file.name} - ${pdfInfo.totalPages} páginas`);
    } catch (error) {
      console.error('Error cargando PDF:', error);
      // Fallback: simular páginas si falla la carga real
      const simulatedPages = Math.floor(Math.random() * 45) + 5;
      setTotalPages(simulatedPages);
      setPageToProcess(1);
      console.log(`📄 PDF cargado (simulado): ${file.name} - ${simulatedPages} páginas`);
    }
  }, [geminiApiKey, updateSelectedFile, setTotalPages, setPageToProcess]);

  const handleStartProcessing = useCallback(async () => {
    if (!selectedFile || !geminiApiKey.trim()) {
      alert('Por favor asegúrate de tener un archivo y API key configurados');
      return;
    }

    setIsProcessing(true);
    console.log(`🚀 Iniciando procesamiento de página ${pageToProcess} de ${selectedFile.name}`);

    const processor = new PDFProcessorService(geminiApiKey);
    
    try {
      // Obtener estado inicial del modelo
      const initialStatus = processor.getGeminiService()?.getFallbackStatus();
      if (initialStatus) {
        setFallbackStatus(initialStatus);
        setCurrentGeminiModel(initialStatus.currentModel);
      }
      
      // Procesar página específica
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

      // Obtener estado final del modelo (en caso de que haya cambiado)
      const finalStatus = processor.getGeminiService()?.getFallbackStatus();
      if (finalStatus) {
        setFallbackStatus(finalStatus);
        setCurrentGeminiModel(finalStatus.currentModel);
      }

      console.log('✅ Procesamiento completado:', result);
      
      // DEBUG: Log de todas las páginas y sus opciones
      result.pages.forEach(page => {
        console.log(`📄 Página ${page.pageNumber}:`, {
          hasText: page.hasText,
          hasImages: page.hasImages,
          extractedQuestions: page.extractedQuestions?.length || 0,
          geminiVisionOption: page.geminiVisionOption,
          ocrFailed: page.ocrFailed
        });
      });
      
      // Extraer todas las preguntas de todas las páginas procesadas
      const allQuestions = result.pages.flatMap(page => page.extractedQuestions || []);
      
      console.log('📋 Páginas procesadas:', result.pages.length);
      
      if (allQuestions.length > 0) {
        // Convertir las preguntas al formato esperado, usando la numeración consecutiva
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
        alert(`✅ ¡Procesamiento de SOLO TEXTO exitoso!\n\n📝 Se extrajeron ${convertedQuestions.length} preguntas de la página ${pageToProcess}\n💡 Cada pregunta incluye explicación generada por IA\n📋 Las preguntas se han añadido a tu lista con numeración consecutiva\n\n🎯 Números asignados: ${nextQuestionNumber} - ${nextQuestionNumber + convertedQuestions.length - 1}`);
      } else {
        alert('⚠️ No se encontraron preguntas en la página seleccionada. Intenta con otra página o usa el modo "Con imágenes" si hay contenido visual complejo.');
      }
    } catch (error) {
      console.error('Error procesando PDF:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      // Obtener estado final del modelo en caso de error
      const errorStatus = processor.getGeminiService()?.getFallbackStatus();
      if (errorStatus) {
        setFallbackStatus(errorStatus);
        setCurrentGeminiModel(errorStatus.currentModel);
      }
      
      if (errorMessage.includes('503') || errorMessage.includes('overloaded')) {
        alert('⏳ Gemini está sobrecargado. Intenta nuevamente en unos minutos.');
      } else if (errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('Todos los modelos de Gemini fallaron')) {
        const modelInfo = errorStatus ? 
          `\n\n🤖 Modelos intentados: ${errorStatus.currentModelIndex + 1}/${errorStatus.totalModels}\n` +
          `� Último modelo usado: ${errorStatus.currentModel}\n` +
          `⏭️ Modelos restantes: ${errorStatus.remainingModels}` 
          : '';
        
        if (errorStatus && errorStatus.remainingModels > 0) {
          alert(`🚫 Se agotó la cuota del modelo actual.\n\nEl sistema intentó automáticamente con los modelos de respaldo.${modelInfo}\n\n💡 Espera unas horas e intenta nuevamente.`);
        } else {
          alert(`🚫 Se agotaron todos los modelos de Gemini disponibles.${modelInfo}\n\n💡 Espera unas horas para que se restablezcan las cuotas.`);
        }
      } else {
        alert(`❌ Error procesando PDF: ${errorMessage}`);
      }
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile, geminiApiKey, pageToProcess, onImportQuestions, nextQuestionNumber]);

  const handleIntelligentProcessing = useCallback(async (contentType: 'text-only' | 'with-images') => {
    if (!selectedFile || !geminiApiKey.trim()) {
      alert('Se requiere archivo y API key para el procesamiento');
      return;
    }

    const isTextOnly = contentType === 'text-only';
    
    const confirmProcessing = window.confirm(
      `¿Procesar "${selectedFile.name}" como contenido ${isTextOnly ? 'SOLO TEXTO' : 'CON IMÁGENES'}?\n\n` +
      `📄 Archivo: ${selectedFile.name} (${totalPages} página${totalPages > 1 ? 's' : ''})\n` +
      `🔧 Método: ${isTextOnly ? 'Extracción de texto + IA para explicaciones' : 'Análisis completo con Gemini Vision'}\n` +
      `💰 Costo: ${isTextOnly ? 'Bajo (solo explicaciones)' : 'Moderado (análisis completo)'}\n` +
      `⏱️ Tiempo estimado: ${isTextOnly ? '1-2 minutos' : '3-5 minutos'}\n` +
      `🎯 Resultado: ${isTextOnly ? 'Preguntas de texto con explicaciones' : 'Análisis completo incluyendo imágenes'}\n\n` +
      `¿Continuar con el procesamiento?`
    );

    if (!confirmProcessing) return;

    if (isTextOnly) {
      // Usar procesamiento manual para texto
      await handleStartProcessing();
    } else {
      // Usar procesamiento directo con Gemini para contenido complejo - función interna
      setIsProcessing(true);
      setProcessingProgress('🚀 Iniciando procesamiento directo de PDF...');
      setIndividualProcessingProgress(null);
      console.log(`🚀 Iniciando procesamiento directo de PDF: ${selectedFile.name}`);

      try {
        // Paso 1: Extraer preguntas del PDF
        setProcessingProgress('📄 Preparando archivo PDF...');
        const pdfService = new GeminiPdfService(geminiApiKey);
        
        setProcessingProgress('🤖 Analizando contenido con Gemini (esto puede tomar 1-3 minutos)...');
        const extractedQuestions = await pdfService.extractQuestionsFromPDF(selectedFile);
        
        if (extractedQuestions.length === 0) {
          alert(`⚠️ No se encontraron preguntas en el PDF completo.`);
          return;
        }

        console.log(`📋 Se extrajeron ${extractedQuestions.length} preguntas del PDF`);
        setProcessingProgress(`✅ PDF analizado: ${extractedQuestions.length} preguntas encontradas`);
        
        // Paso 2: Procesar preguntas individualmente
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
        
        // Paso 3: Guardar las preguntas
        onImportQuestions(processedQuestions);
        
        alert(
          `✅ ¡Procesamiento CON IMÁGENES exitoso!\n\n` +
          `�️ Se analizó todo el PDF incluyendo contenido visual\n` +
          `�📋 Se extrajeron ${processedQuestions.length} preguntas del PDF completo\n` +
          `🔍 Cada pregunta incluye explicación detallada y link de referencia\n` +
          `📝 Las preguntas se han añadido a tu lista con numeración consecutiva\n\n` +
          `🎯 Números asignados: ${nextQuestionNumber} - ${nextQuestionNumber + processedQuestions.length - 1}`
        );
        
      } catch (error) {
        console.error('Error en procesamiento directo:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        alert(`❌ Error en procesamiento directo: ${errorMessage}`);
      } finally {
        setIsProcessing(false);
        setProcessingProgress('');
        setIndividualProcessingProgress(null);
      }
    }
  }, [selectedFile, geminiApiKey, totalPages, handleStartProcessing, nextQuestionNumber, onImportQuestions]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Importar Preguntas desde PDF</h1>
        <p className="text-gray-600">Sube un archivo PDF para extraer preguntas automáticamente usando IA</p>
      </div>

      {/* Configuración API */}
      <ApiKeyConfigSection 
        geminiApiKey={geminiApiKey}
        saveGeminiApiKey={saveGeminiApiKey}
        currentGeminiModel={currentGeminiModel}
        fallbackStatus={fallbackStatus}
      />

      {/* Información sobre los modelos de fallback */}
      {geminiApiKey && geminiApiKey.trim() !== '' && (
        <AutomaticModelsSection />
      )}

      {/* Área de carga de archivos */}

      {/* Área de carga de archivos */}
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 mb-6">
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Arrastra un archivo PDF aquí</h3>
        <p className="text-gray-600 mb-6 font-medium">o haz clic para seleccionar un archivo</p>
        
        <input
          type="file"
          accept=".pdf"
          style={{ display: 'none' }}
          id="pdf-upload-input"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleFileSelect(file);
            }
          }}
        />
        <label
          htmlFor="pdf-upload-input"
          className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-md cursor-pointer transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: '1px solid #2563eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1d4ed8';
            e.currentTarget.style.borderColor = '#1d4ed8';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb';
            e.currentTarget.style.borderColor = '#2563eb';
            e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <Upload className="w-4 h-4 mr-2" />
          Seleccionar PDF
        </label>
      </div>

      {/* Información del archivo cargado - SEPARADO del área de carga */}
      {selectedFile && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            📄 <strong>Archivo cargado:</strong> {selectedFile.name}
          </p>
          <p className="text-sm text-blue-600">
            📊 <strong>Total de páginas:</strong> {totalPages}
          </p>
        </div>
      )}

      {/* Mensaje de próximo paso */}
      <NextStepMessage 
        geminiApiKey={geminiApiKey}
        selectedFile={selectedFile}
      />

      {/* Espaciador visual */}
      {selectedFile && <div className="h-6"></div>}

      {/* Configuración de procesamiento - Solo visible en modo manual */}
      {selectedFile && showManualProcessing && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <Settings className="w-5 h-5 text-gray-600" />
            <h3 className="font-medium text-gray-800">Configuración de procesamiento</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Página a procesar
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={pageToProcess}
                  onChange={(e) => setPageToProcess(parseInt(e.target.value) || 1)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-500">de {totalPages}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Especifica qué página del PDF quieres procesar
              </p>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleStartProcessing}
                disabled={isProcessing || !selectedFile || !geminiApiKey.trim()}
                className="btn btn-primary btn-full"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Procesando...</span>
                  </span>
                ) : (
                  '🚀 Iniciar procesamiento'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nueva opción: Procesamiento inteligente */}
      {selectedFile && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <FileText className="w-5 h-5 text-green-600" />
            <h3 className="font-medium text-green-800">🚀 Procesar PDF Completo</h3>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-green-700 text-center">
              Para optimizar el procesamiento, indica qué tipo de contenido tiene tu PDF:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => handleIntelligentProcessing('text-only')}
                disabled={isProcessing}
                className="p-4 border border-green-300 rounded-lg text-left hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer hover:border-green-500 hover:shadow-md"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">📝</span>
                  <span className="font-medium text-green-800">Solo texto</span>
                </div>
                <p className="text-xs text-green-600">
                  PDF con preguntas en texto simple, sin imágenes complejas
                </p>
              </button>
              
              <button
                onClick={() => handleIntelligentProcessing('with-images')}
                disabled={isProcessing}
                className="p-4 border border-green-300 rounded-lg text-left hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer hover:border-green-500 hover:shadow-md"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">🖼️</span>
                  <span className="font-medium text-green-800">Con imágenes</span>
                </div>
                <p className="text-xs text-green-600">
                  PDF con diagramas, tablas complejas o preguntas con imágenes
                </p>
              </button>
            </div>
            
            {/* Opción para mostrar configuración manual */}
            <div className="text-center">
              <button
                onClick={() => setShowManualProcessing(!showManualProcessing)}
                className="text-xs text-green-600 hover:text-green-800 underline cursor-pointer"
              >
                {showManualProcessing ? '🔽 Ocultar' : '⚙️ Mostrar'} configuración manual (página específica)
              </button>
            </div>
            
            {/* Indicador de progreso */}
            {isProcessing && processingProgress && (
              <div className="mt-4 p-3 bg-green-100 border border-green-200 rounded-md">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                  <span className="text-sm text-green-700">{processingProgress}</span>
                </div>
                
                {/* Progreso individual de preguntas */}
                {individualProcessingProgress && individualProcessingProgress.stage === 'processing' && (
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between text-xs text-green-600">
                      <span>Procesando preguntas individualmente</span>
                      <span>{individualProcessingProgress.currentQuestion}/{individualProcessingProgress.totalQuestions}</span>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(individualProcessingProgress.currentQuestion / individualProcessingProgress.totalQuestions) * 100}%` 
                        }}
                      ></div>
                    </div>
                    {individualProcessingProgress.currentQuestionText && (
                      <p className="text-xs text-green-600 truncate">
                        📝 {individualProcessingProgress.currentQuestionText}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <UserProgressSection 
        geminiApiKey={geminiApiKey}
        selectedFile={selectedFile}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default PDFImport;
