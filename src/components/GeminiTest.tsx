import React, { useState } from 'react';
import { Send, Eye, AlertCircle } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Button from './common/Button';
import ApiKeyConfig from './common/ApiKeyConfig';
import { 
  WriteIcon, LightBulbIcon, MessageIcon, 
  CheckMarkIcon, ErrorIcon, WarningIcon
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
  
  const [prompt, setPrompt] = useState('Explain how AI works in a few words');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [requestInfo, setRequestInfo] = useState<RequestInfo | null>(null);
  const [model, setModel] = useState('gemini-2.5-flash');

  const isValidApiKey = geminiApiKey && geminiApiKey.trim().length > 10;

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
      {/* Configuración de API */}
      <ApiKeyConfig
        geminiApiKey={geminiApiKey}
        saveGeminiApiKey={saveGeminiApiKey}
        title="API Key de Gemini"
        description="Configura tu API key de Google AI Studio para probar la conexión."
        className="mb-6"
      />

      {/* Sección de Prompt - Contenedor mejorado */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <WriteIcon className="w-5 h-5 text-gray-800" />
          Prompt de prueba
        </h2>
        
        {/* Selector de modelo */}
        <div className="mb-8">
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
            className="w-full max-w-md p-4 rounded-lg border-2 bg-white text-gray-900 shadow-sm appearance-none
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
        
        {/* Ejemplos rápidos */}
        <div className="mb-8">
          <p className="text-sm font-medium mb-4 text-gray-900 flex items-center gap-2">
            <LightBulbIcon className="w-4 h-4 text-amber-600" />
            Prueba con estos ejemplos:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {samplePrompts.map((sample, index) => (
              <button
                key={index}
                onClick={() => setPrompt(sample)}
                className="text-left whitespace-normal h-auto py-4 px-5 text-sm 
                  bg-gradient-to-r from-gray-50 to-gray-100 hover:from-primary-50 hover:to-primary-100
                  border border-gray-200 hover:border-primary-300 rounded-lg transition-all duration-200
                  hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-1
                  text-gray-700 hover:text-primary-700 group"
              >
                <span className="font-medium group-hover:text-primary-800">
                  {sample.length > 50 ? `${sample.substring(0, 50)}...` : sample}
                </span>
              </button>
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
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={testGeminiDirect}
          disabled={isLoading || !isValidApiKey || !prompt.trim()}
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
          disabled={!isValidApiKey || !prompt.trim()}
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
      
      {(!isValidApiKey || !prompt.trim()) && (
        <div className="mt-4 text-center text-sm text-gray-500 flex items-center justify-center gap-1">
          {!isValidApiKey && (
            <span className="flex items-center gap-1">
              <WarningIcon className="w-4 h-4 text-amber-500" />
              Se requiere una API key válida
            </span>
          )}
          {!isValidApiKey && !prompt.trim() && " y "}
          {!prompt.trim() && (
            <span className="flex items-center gap-1">
              <WarningIcon className="w-4 h-4 text-amber-500" />
              Escribe un prompt
            </span>
          )}
          {" para continuar"}
        </div>
      )}

      {/* Información de la petición */}
      {requestInfo && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className={`p-6 border-l-4 ${requestInfo.success 
            ? 'border-l-success-500 bg-gradient-to-r from-success-50 to-success-25' 
            : 'border-l-error-500 bg-gradient-to-r from-error-50 to-error-25'}`}
          >
            <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className={`font-semibold text-lg flex items-center gap-2
                ${requestInfo.success ? 'text-success-700' : 'text-error-700'}`}
              >
                <AlertCircle size={20} />
                {requestInfo.success ? 'Información de la petición' : 'Error en la petición'}
              </h3>
              <div className={`flex items-center gap-2 text-xs px-3 py-1 rounded-full font-medium
                ${requestInfo.success 
                  ? 'text-success-600 bg-success-100' 
                  : 'text-error-600 bg-error-100'}`}
              >
                {requestInfo.success ? (
                  <>
                    <CheckMarkIcon className="w-4 h-4" />
                    Petición exitosa
                  </>
                ) : (
                  <>
                    <ErrorIcon className="w-4 h-4" />
                    Error en la petición
                  </>
                )}
              </div>
            </div>              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                  <span className="block text-gray-500 text-xs font-medium uppercase tracking-wide">Modelo:</span>
                  <div className="font-mono mt-2 text-gray-900 font-bold text-sm">
                    {requestInfo.model}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                  <span className="block text-gray-500 text-xs font-medium uppercase tracking-wide">Duración:</span>
                  <div className="font-mono mt-2 text-gray-900 font-bold text-sm">
                    {requestInfo.duration}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                  <span className="block text-gray-500 text-xs font-medium uppercase tracking-wide">Hora:</span>
                  <div className="font-mono mt-2 text-gray-900 font-bold text-sm">
                    {requestInfo.timestamp}
                  </div>
                </div>
                {requestInfo.responseLength && (
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <span className="block text-gray-500 text-xs font-medium uppercase tracking-wide">Caracteres:</span>
                    <div className="font-mono mt-2 text-gray-900 font-bold text-sm">
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
          <div className="p-6 border-l-4 border-l-success-500 bg-gradient-to-r from-success-50 to-success-25">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg flex items-center gap-2 text-success-700">
                <MessageIcon className="w-5 h-5" />
                Respuesta de Gemini
              </h3>
              <div className="flex items-center gap-2 text-xs text-success-600 bg-success-100 px-3 py-1 rounded-full">
                <CheckMarkIcon className="w-4 h-4" />
                Petición exitosa
              </div>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-inner border border-success-200 relative">
              <div className="absolute top-4 right-4 text-xs text-gray-400 font-medium">
                {response.length.toLocaleString()} caracteres
              </div>
              <div className="text-base leading-relaxed text-gray-800 max-w-none prose prose-sm">
                <div className="whitespace-pre-wrap break-words">
                  {response}
                </div>
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
    </div>
  );
};

export default GeminiTest;