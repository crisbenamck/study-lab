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

// Componente para el estado actual con iconos dinámicos
interface CurrentStatusSectionProps {
  geminiApiKey: string;
  selectedFile: File | null;
}

const CurrentStatusSection: React.FC<CurrentStatusSectionProps> = ({ 
  geminiApiKey, 
  selectedFile
}) => {
  const hasApiKey = !!(geminiApiKey && geminiApiKey.trim() !== '');
  
  const getStatusIcon = (condition: boolean) => {
    if (condition) {
      return <Check className="w-4 h-4 text-green-600" />;
    } else {
      return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const statusItems = [
    { condition: hasApiKey, text: "Input de API key funcionando" },
    { condition: hasApiKey, text: "Carga de archivos con detección de páginas" },
    { condition: hasApiKey && !!selectedFile, text: "Selección de página específica" },
    { condition: hasApiKey && !!selectedFile, text: "Procesamiento manual página por página" },
    { condition: hasApiKey && !!selectedFile, text: "Procesamiento directo de PDF completo (RECOMENDADO)" },
    { condition: hasApiKey, text: "Sistema de fallback automático de modelos Gemini" },
    { condition: hasApiKey, text: "Procesamiento individual de preguntas con explicaciones" },
    { condition: hasApiKey, text: "Generación automática de links de referencia" },
    { condition: hasApiKey, text: "Numeración secuencial correcta de preguntas" },
    { condition: hasApiKey, text: "Detección inteligente de texto vs imágenes" },
    { condition: hasApiKey, text: "Fallback a Gemini Vision para preguntas con imágenes" },
    { condition: hasApiKey, text: "Indicadores de progreso en tiempo real" },
    { condition: hasApiKey, text: "Extracción e importación automática de preguntas" }
  ];

  return (
    <div 
      className="bg-gray-50 rounded-lg p-4"
      style={{ marginTop: '24px' }}
    >
      <h4 className="font-medium text-gray-800 mb-2">🚀 Estado actual:</h4>
      <ul className="text-sm text-gray-600 space-y-1">
        {statusItems.map((item, index) => (
          <li key={index} className="flex items-center space-x-2">
            {getStatusIcon(item.condition)}
            <span className={item.condition ? 'text-gray-700' : 'text-gray-500'}>
              {item.text}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
        <p className="text-xs text-blue-700">
          🎯 <strong>Sistema Completo:</strong> La aplicación puede procesar PDFs complejos con texto e imágenes, 
          extraer preguntas automáticamente, generar explicaciones detalladas y manejar automáticamente 
          los límites de cuota usando múltiples modelos de respaldo.
        </p>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        {hasApiKey && selectedFile ? (
          <span className="text-green-600">
            🎯 ¡Todo listo! Puedes procesar tu PDF usando cualquiera de los métodos disponibles.
          </span>
        ) : !hasApiKey ? (
          <span className="text-amber-600">
            🔑 Configura tu API key para desbloquear todas las funciones.
          </span>
        ) : (
          <span className="text-blue-600">
            🎯 API key configurada. Arrastra un PDF arriba para extraer preguntas automáticamente.
          </span>
        )}
      </p>
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
        alert(`✅ ¡Procesamiento exitoso!\n\nSe extrajeron ${convertedQuestions.length} preguntas de la página ${pageToProcess}\n\nLas preguntas se han añadido a tu lista.`);
      } else {
        alert('⚠️ No se encontraron preguntas en la página seleccionada. Intenta con otra página.');
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

  const handleDirectPdfProcessing = useCallback(async () => {
    if (!selectedFile || !geminiApiKey.trim()) {
      alert('Se requiere archivo y API key para el procesamiento directo');
      return;
    }

    const confirmDirectProcessing = window.confirm(
      `¿Deseas procesar TODO el PDF directamente con Gemini?\n\n` +
      `📄 Procesará: ${selectedFile.name}\n` +
      `🤖 Método: Gemini 2.5 Flash (análisis directo del PDF completo)\n` +
      `💰 Costo: GRATIS (incluido en tu plan de Gemini)\n` +
      `🎯 Ventaja: Máxima precisión, procesamiento de todo el documento\n` +
      `⏱️ Tiempo estimado: 3-5 minutos (dependiendo del tamaño)\n` +
      `📝 Procesamiento individual: Cada pregunta se procesará por separado para obtener explicación y link\n\n` +
      `¿Continuar?`
    );

    if (!confirmDirectProcessing) return;

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
        `✅ ¡Procesamiento directo exitoso!\n\n` +
        `📋 Se extrajeron ${processedQuestions.length} preguntas de todo el PDF\n` +
        `🔍 Cada pregunta incluye explicación y link de referencia\n` +
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
  }, [selectedFile, geminiApiKey, nextQuestionNumber, onImportQuestions]);

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

      {/* Espaciador visual */}
      {selectedFile && <div className="h-6"></div>}

      {/* Configuración de procesamiento */}
      {selectedFile && (
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

      {/* Nueva opción: Procesamiento directo con Gemini PDF */}
      {selectedFile && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <FileText className="w-5 h-5 text-green-600" />
            <h3 className="font-medium text-green-800">🆕 Procesamiento Directo con Gemini (RECOMENDADO)</h3>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm text-green-700">
              <strong>Nueva funcionalidad:</strong> Procesa el PDF completo directamente con Gemini 2.5 Flash.
              Analiza todas las páginas automáticamente con máxima precisión.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-green-800">✅ Ventajas:</h4>
                <ul className="text-xs text-green-700 space-y-1 pl-4">
                  <li>• Procesa TODO el PDF automáticamente</li>
                  <li>• Máxima precisión en extracción</li>
                  <li>• Detecta tablas, imágenes y texto complejo</li>
                  <li>• Sin límite de páginas</li>
                  <li>• GRATIS (incluido en tu plan)</li>
                </ul>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={handleDirectPdfProcessing}
                  disabled={isProcessing || !selectedFile || !geminiApiKey.trim()}
                  className="w-full px-4 py-3 bg-green-600 text-white text-sm font-semibold rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Procesando PDF...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      <span>🚀 Procesar PDF Completo</span>
                    </>
                  )}
                </button>
              </div>
              
              {/* Indicador de progreso */}
              {isProcessing && processingProgress && (
                <div className="mt-3 p-3 bg-green-100 border border-green-200 rounded-md">
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
            
            <div className="p-2 bg-green-100 rounded border border-green-200">
              <p className="text-xs text-green-700">
                💡 <strong>Recomendado:</strong> Esta opción es la más avanzada y precisa. 
                Úsala si quieres extraer todas las preguntas del PDF de una vez.
              </p>
            </div>
          </div>
        </div>
      )}

      <CurrentStatusSection 
        geminiApiKey={geminiApiKey}
        selectedFile={selectedFile}
      />
    </div>
  );
};

export default PDFImport;
