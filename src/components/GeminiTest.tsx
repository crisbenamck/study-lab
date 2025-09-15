import React, { useState } from 'react';
import { Send, Eye, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Button from './common/Button';
import { useApiKeyValidation } from '../hooks/useApiKeyValidation';
import { 
  SettingsIcon, WriteIcon, LightBulbIcon, RocketIcon, MessageIcon, 
  KeyIcon, DocumentIcon, CheckMarkIcon, ErrorIcon, WarningIcon, 
  LoadingIcon, RobotIcon, LinkIcon 
} from '../icons';

interface RequestInfo {
  model: string;
  duration: string;
  timestamp: string;
  success: boolean;
  responseLength?: number;
  error?: string;
}

interface GeminiTestProps {
  appState: {
    geminiApiKey: string;
    saveGeminiApiKey: (key: string) => void;
    isLoaded: boolean;
  };
  showAlert: (message: string, options?: { title?: string; type?: 'info' | 'success' | 'warning' | 'error'; buttonText?: string; }) => void;
}

const GeminiTest: React.FC<GeminiTestProps> = ({ appState, showAlert }) => {
  const { geminiApiKey, saveGeminiApiKey } = appState;
  const { validationResult, validateApiKey } = useApiKeyValidation();
  
  const [prompt, setPrompt] = useState('Explain how AI works in a few words');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [requestInfo, setRequestInfo] = useState<RequestInfo | null>(null);
  const [model, setModel] = useState('gemini-2.5-flash');
  const [isDocumentationExpanded, setIsDocumentationExpanded] = useState(false);

  // Validate API key when it changes
  React.useEffect(() => {
    if (geminiApiKey && geminiApiKey.trim().length > 10) {
      const timeoutId = setTimeout(() => {
        validateApiKey(geminiApiKey);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [geminiApiKey, validateApiKey]);

  const getApiKeyValidationStatus = () => {
    if (!geminiApiKey.trim()) return { color: 'border-gray-300', status: '' };
    if (validationResult.isValidating) return { 
      color: 'border-blue-400', 
      status: (
        <span className="flex items-center gap-1">
          <LoadingIcon className="w-3 h-3 text-blue-600" />
          Validando...
        </span>
      ) 
    };
    if (validationResult.isValid) return { 
      color: 'border-success-400', 
      status: (
        <span className="flex items-center gap-1">
          <CheckMarkIcon className="w-3 h-3 text-success-600" />
          API key válida
        </span>
      )
    };
    if (validationResult.error) return { 
      color: 'border-error-400', 
      status: (
        <span className="flex items-center gap-1">
          <ErrorIcon className="w-3 h-3 text-error-600" />
          {validationResult.error}
        </span>
      )
    };
    return { color: 'border-gray-300', status: '' };
  };

  const testModels = [
    'gemini-2.5-pro',
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite'
  ];

  const samplePrompts = [
    'Explain how AI works in a few words',
    'Extract questions from this text: "1. What is JavaScript? A) A language B) A framework"',
    'Convert this to JSON: Question: What is React? Options: A) Library B) Language',
    'Hello, are you working?'
  ];

  const testGeminiDirect = async () => {
    if (!geminiApiKey.trim()) {
      setError('Por favor ingresa tu API key para continuar');
      return;
    }

    if (!prompt.trim()) {
      setError('Por favor ingresa un prompt para probar');
      return;
    }

    setIsLoading(true);
    setError('');
    setResponse('');
    setRequestInfo(null);

    const startTime = Date.now();

    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model_instance = genAI.getGenerativeModel({ model });
      const result = await model_instance.generateContent(prompt);
      
      const duration = Date.now() - startTime;
      const responseText = result.response.text();
      
      setResponse(responseText);
      setRequestInfo({
        model,
        duration: `${duration}ms`,
        responseLength: responseText.length,
        timestamp: new Date().toLocaleTimeString(),
        success: true
      });

      showAlert('Respuesta generada exitosamente', {
        title: 'Éxito',
        type: 'success',
        buttonText: 'Perfecto'
      });

    } catch (err) {
      const duration = Date.now() - startTime;
      
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMsg);
      setRequestInfo({
        model,
        duration: `${duration}ms`,
        error: errorMsg,
        timestamp: new Date().toLocaleTimeString(),
        success: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testWithCurl = () => {
    const curlCommand = `curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "contents": [{
      "parts": [{
        "text": "${prompt.replace(/"/g, '\\"')}"
      }]
    }]
  }'`;

    navigator.clipboard.writeText(curlCommand);
    showAlert('Comando cURL copiado al portapapeles', {
      title: 'Copiado',
      type: 'success',
      buttonText: 'Perfecto'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Configuración de API - Grid mejorado */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-gray-800" />
          Configuración
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <label 
              htmlFor="api-key-input"
              className="block text-sm font-semibold mb-4 text-gray-900"
            >
              API Key
            </label>
            <input
              id="api-key-input"
              type="password"
              value={geminiApiKey}
              onChange={(e) => saveGeminiApiKey(e.target.value)}
              placeholder="Ingresa tu API key de Google AI Studio"
              className={`w-full px-4 py-4 rounded-lg border-2 transition-all duration-200 shadow-sm 
                focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500
                ${getApiKeyValidationStatus().color} bg-white text-gray-900`}
            />
            <div className="mt-2 min-h-[1.5rem]">
              {getApiKeyValidationStatus().status ? (
                <p className="text-xs font-medium text-gray-900">
                  {getApiKeyValidationStatus().status}
                </p>
              ) : (
                <p className="text-xs text-gray-800">
                  Obtén tu clave en Google AI Studio
                </p>
              )}
            </div>
          </div>
          
          <div>
            <label 
              htmlFor="model-select"
              className="block text-sm font-semibold mb-4 text-gray-900"
            >
              Modelo
            </label>
            <select
              id="model-select"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full p-4 rounded-lg border-2 bg-white text-gray-900 shadow-sm appearance-none
                focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500 
                border-gray-300 transition-all duration-200"
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")',
                backgroundPosition: 'right 0.75rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.25em 1.25em',
                paddingRight: '2.5rem'
              }}
            >
              {testModels.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <p className="mt-3 text-xs text-gray-600">
              Selecciona el modelo a usar
            </p>
          </div>
        </div>
      </div>

      {/* Sección de Prompt - Contenedor mejorado */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <WriteIcon className="w-5 h-5 text-gray-800" />
          Prompt de prueba
        </h2>
        
        {/* Ejemplos rápidos */}
        <div className="mb-8">
          <p className="text-sm font-medium mb-4 text-gray-900 flex items-center gap-2">
            <LightBulbIcon className="w-4 h-4 text-amber-600" />
            Prueba con estos ejemplos:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {samplePrompts.map((sample, index) => (
              <Button
                key={index}
                onClick={() => setPrompt(sample)}
                variant="secondary"
                buttonType="ghost"
                size="md"
                className="text-left whitespace-normal h-auto py-3 px-4 text-sm 
                  border border-gray-200 hover:border-primary-300 hover:bg-primary-50"
              >
                {sample.length > 50 ? `${sample.substring(0, 50)}...` : sample}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Textarea del prompt */}
        <div>
          <label 
            htmlFor="prompt-textarea"
            className="block text-sm font-semibold mb-4 text-gray-900"
          >
            Tu prompt personalizado
          </label>
          <textarea
            id="prompt-textarea"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Escribe tu prompt aquí... Por ejemplo: 'Explica cómo funciona la IA'"
            rows={6}
            className={`w-full px-4 py-4 rounded-lg border-2 transition-all duration-200 resize-y shadow-sm
              focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500 font-mono
              ${prompt.trim() 
                ? 'border-success-400 bg-white text-gray-900' 
                : 'border-gray-300 bg-white text-gray-900'}`}
          />
          <p className="mt-3 text-xs text-gray-600">
            Escribe una pregunta o instrucción para Gemini
          </p>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <RocketIcon className="w-5 h-5 text-gray-800" />
          Acciones
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={testGeminiDirect}
            disabled={isLoading || !validationResult.isValid || !prompt.trim()}
            variant="primary"
            size="xl"
            icon={<Send size={18} />}
            iconPosition="left"
            isLoading={isLoading}
            className="min-w-[200px] shadow-md hover:shadow-lg"
          >
            {isLoading ? 'Enviando...' : 'Enviar a Gemini'}
          </Button>

          <Button
            onClick={testWithCurl}
            disabled={!validationResult.isValid || !prompt.trim()}
            variant="secondary"
            buttonType="outline"
            size="xl"
            icon={<Eye size={18} />}
            iconPosition="left"
            className="min-w-[200px] shadow-sm hover:shadow-md"
          >
            Generar cURL
          </Button>
        </div>
        
        {(!validationResult.isValid || !prompt.trim()) && (
          <div className="mt-4 text-center text-sm text-gray-500 flex items-center justify-center gap-1">
            {!validationResult.isValid && (
              <span className="flex items-center gap-1">
                <WarningIcon className="w-4 h-4 text-amber-500" />
                Se requiere una API key válida
              </span>
            )}
            {!validationResult.isValid && !prompt.trim() && " y "}
            {!prompt.trim() && (
              <span className="flex items-center gap-1">
                <WarningIcon className="w-4 h-4 text-amber-500" />
                Escribe un prompt
              </span>
            )}
            {" para continuar"}
          </div>
        )}
      </div>

      {/* Información de la petición */}
      {requestInfo && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className={`p-6 border-l-4 ${requestInfo.success 
            ? 'border-l-success-500 bg-success-50' 
            : 'border-l-error-500 bg-error-50'}`}
          >
            <div className="space-y-4">
            <h3 className={`font-semibold text-lg flex items-center gap-2
              ${requestInfo.success ? 'text-success-700' : 'text-error-700'}`}
            >
              <AlertCircle size={20} />
              {requestInfo.success ? (
                <span className="flex items-center gap-1">
                  <CheckMarkIcon className="w-5 h-5" />
                  Petición exitosa
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <ErrorIcon className="w-5 h-5" />
                  Error en la petición
                </span>
              )}
            </h3>              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div className="bg-white/70 rounded-lg p-3">
                  <span className="block text-gray-600 text-xs font-medium">Modelo:</span>
                  <div className="font-mono mt-1 text-gray-900 font-semibold">
                    {requestInfo.model}
                  </div>
                </div>
                <div className="bg-white/70 rounded-lg p-3">
                  <span className="block text-gray-600 text-xs font-medium">Duración:</span>
                  <div className="font-mono mt-1 text-gray-900 font-semibold">
                    {requestInfo.duration}
                  </div>
                </div>
                <div className="bg-white/70 rounded-lg p-3">
                  <span className="block text-gray-600 text-xs font-medium">Hora:</span>
                  <div className="font-mono mt-1 text-gray-900 font-semibold">
                    {requestInfo.timestamp}
                  </div>
                </div>
                {requestInfo.responseLength && (
                  <div className="bg-white/70 rounded-lg p-3">
                    <span className="block text-gray-600 text-xs font-medium">Caracteres:</span>
                    <div className="font-mono mt-1 text-gray-900 font-semibold">
                      {requestInfo.responseLength.toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Respuesta */}
      {response && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-l-4 border-l-success-500 bg-success-50">
            <h3 className="font-semibold text-lg flex items-center gap-2 text-success-700 mb-4">
              <MessageIcon className="w-5 h-5" />
              Respuesta de Gemini
            </h3>
            <div className="bg-white rounded-lg p-6 shadow-inner border border-success-200">
              <div className="text-sm leading-relaxed whitespace-pre-wrap font-mono text-gray-900">
                {response}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-l-4 border-l-error-500 bg-error-50">
            <h3 className="font-semibold text-lg flex items-center gap-2 text-error-700 mb-4">
              <ErrorIcon className="w-5 h-5" />
              Error
            </h3>
            <div className="bg-white rounded-lg p-6 shadow-inner border border-error-200">
              <div className="text-sm leading-relaxed font-mono break-words overflow-hidden text-error-600">
                {error}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Separador visual */}
      <div className="py-2"></div>

      {/* Documentación colapsible mejorada */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <button
          onClick={() => setIsDocumentationExpanded(!isDocumentationExpanded)}
          className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 
            transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-300 
            focus:ring-inset group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center
              group-hover:bg-primary-200 transition-colors">
              <DocumentIcon className="w-5 h-5 text-primary-700" />
            </div>
            <div>
              <span className="font-semibold text-base text-gray-900">
                Documentación y Ayuda
              </span>
              <p className="text-sm text-gray-600">
                Guías de uso, configuración y consejos
              </p>
            </div>
          </div>
          <div className="flex items-center">
            {isDocumentationExpanded ? (
              <ChevronUp size={24} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
            ) : (
              <ChevronDown size={24} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
            )}
          </div>
        </button>

        {isDocumentationExpanded && (
          <div className="border-t border-gray-200 bg-gray-50">
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Sección 1: API Key */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h4 className="font-semibold text-base mb-3 text-gray-900 flex items-center gap-2">
                    <KeyIcon className="w-4 h-4 text-primary-600" />
                    API Key
                  </h4>
                  <div className="text-sm leading-relaxed text-gray-900 space-y-2">
                    <p><strong className="text-gray-900">1.</strong> Ve a Google AI Studio</p>
                    <p><strong className="text-gray-900">2.</strong> Inicia sesión con Google</p>
                    <p><strong className="text-gray-900">3.</strong> Crea/selecciona proyecto</p>
                    <p><strong className="text-gray-900">4.</strong> Genera nueva API key</p>
                    <p><strong className="text-gray-900">5.</strong> Copia y pégala arriba</p>
                  </div>
                </div>

                {/* Sección 2: Modelos */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h4 className="font-semibold text-base mb-3 text-gray-900 flex items-center gap-2">
                    <RobotIcon className="w-4 h-4 text-primary-600" />
                    Modelos
                  </h4>
                  <div className="text-sm leading-relaxed text-gray-900 space-y-2">
                    <div><strong className="text-gray-900">Pro 2.5:</strong> Máximo rendimiento y capacidades avanzadas</div>
                    <div><strong className="text-gray-900">Flash 2.5:</strong> Rápido y eficiente para tareas generales</div>
                    <div><strong className="text-gray-900">Flash 2.5 Lite:</strong> Versión ligera y optimizada</div>
                    <div><strong className="text-gray-900">Flash 2.0:</strong> Rendimiento equilibrado</div>
                    <div><strong className="text-gray-900">Flash 2.0 Lite:</strong> Rápido para tareas básicas</div>
                  </div>
                </div>

                {/* Sección 3: Consejos */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h4 className="font-semibold text-base mb-3 text-gray-900 flex items-center gap-2">
                    <LightBulbIcon className="w-4 h-4 text-primary-600" />
                    Consejos
                  </h4>
                  <div className="text-sm leading-relaxed text-gray-900 space-y-2">
                    <p>• Prompts claros y específicos</p>
                    <p>• Flash para tareas simples</p>
                    <p>• Pro para tareas complejas</p>
                    <p>• Usa el generador cURL</p>
                  </div>
                </div>
              </div>

              {/* Enlaces útiles */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                  <a
                    href="https://makersuite.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 
                      bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl 
                      hover:from-primary-700 hover:to-primary-800 transition-all duration-200 
                      text-sm font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <LinkIcon className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
                    Google AI Studio
                  </a>
                  <a
                    href="https://ai.google.dev/gemini-api/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 
                      bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl 
                      hover:from-gray-700 hover:to-gray-800 transition-all duration-200 
                      text-sm font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <DocumentIcon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                    Documentación
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeminiTest;