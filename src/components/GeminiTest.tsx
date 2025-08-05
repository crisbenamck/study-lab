import React, { useState } from 'react';
import { Send, Eye, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
  const [isDocumentationExpanded, setIsDocumentationExpanded] = useState(false);

  const testModels = [
    'gemini-2.5-flash',
    'gemini-2.5-pro', 
    'gemini-2.5-flash-lite',
    'gemini-1.5-flash',
    'gemini-1.5-pro'
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
        title: '✅ Éxito',
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
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-12">
      {/* Configuración de API */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label 
            htmlFor="api-key-input"
            className="block text-sm font-semibold mb-4"
            style={{ color: 'var(--secondary-900)' }}
          >
            API Key
          </label>
          <input
            id="api-key-input"
            type="password"
            value={geminiApiKey}
            onChange={(e) => saveGeminiApiKey(e.target.value)}
            placeholder="Ingresa tu API key de Google AI Studio"
            className="w-full px-4 py-4 rounded-lg border-2 focus:outline-none focus:border-blue-500 transition-all"
            style={{
              backgroundColor: 'white',
              borderColor: geminiApiKey.trim() ? 'var(--success-400)' : 'var(--secondary-300)',
              color: 'var(--secondary-900)',
              fontSize: '14px',
              boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)'
            }}
          />
          <p 
            className="mt-3 text-xs"
            style={{ color: 'var(--secondary-600)' }}
          >
            Obtén tu clave en Google AI Studio
          </p>
        </div>
        
        <div>
          <label 
            htmlFor="model-select"
            className="block text-sm font-semibold mb-4"
            style={{ color: 'var(--secondary-900)' }}
          >
            Modelo
          </label>
          <select
            id="model-select"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full p-4 rounded-lg border-2 focus:outline-none focus:border-blue-500 transition-all appearance-none"
            style={{
              backgroundColor: 'white',
              borderColor: 'var(--secondary-300)',
              color: 'var(--secondary-900)',
              fontSize: '14px',
              boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
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
          <p 
            className="mt-3 text-xs"
            style={{ color: 'var(--secondary-600)' }}
          >
            Selecciona el modelo a usar
          </p>
        </div>
      </div>

      {/* Prompt */}
      <div className="space-y-6">
        <div>
          <label 
            htmlFor="prompt-textarea"
            className="block text-sm font-semibold mb-4"
            style={{ color: 'var(--secondary-900)' }}
          >
            Prompt de prueba
          </label>
          
          <div className="mb-6">
            <p 
              className="text-sm font-medium mb-4"
              style={{ color: 'var(--secondary-900)' }}
            >
              Prueba con estos ejemplos:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {samplePrompts.map((sample, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(sample)}
                  className="text-sm px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
                  style={{
                    backgroundColor: 'white',
                    borderColor: 'var(--secondary-300)',
                    color: 'var(--secondary-900)'
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.currentTarget.style.borderColor = 'var(--primary-400)';
                    e.currentTarget.style.backgroundColor = 'var(--primary-50)';
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.currentTarget.style.borderColor = 'var(--secondary-300)';
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  {sample.length > 50 ? `${sample.substring(0, 50)}...` : sample}
                </button>
              ))}
            </div>
          </div>
          
          <textarea
            id="prompt-textarea"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Escribe tu prompt aquí... Por ejemplo: 'Explica cómo funciona la IA'"
            rows={6}
            className="w-full px-4 py-4 rounded-lg border-2 focus:outline-none focus:border-blue-500 transition-all resize-y"
            style={{
              backgroundColor: 'white',
              borderColor: prompt.trim() ? 'var(--success-400)' : 'var(--secondary-300)',
              color: 'var(--secondary-900)',
              fontSize: '14px',
              lineHeight: '1.6',
              boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
              fontFamily: 'ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace'
            }}
          />
          <p 
            className="mt-3 text-xs"
            style={{ color: 'var(--secondary-600)' }}
          >
            Escribe una pregunta o instrucción para Gemini
          </p>
        </div>
      </div>

      {/* Botones de acción con mejor espaciado */}
      <div className="flex flex-col sm:flex-row gap-6 justify-center">
        <button
          onClick={testGeminiDirect}
          disabled={isLoading || !geminiApiKey.trim() || !prompt.trim()}
          className="flex items-center justify-center gap-3 px-8 py-4 rounded-lg border-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: isLoading ? 'var(--secondary-100)' : 'var(--primary-500)',
            borderColor: isLoading ? 'var(--secondary-300)' : 'var(--primary-500)',
            color: isLoading ? 'var(--secondary-500)' : 'white',
            boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)'
          }}
        >
          <Send size={18} />
          {isLoading ? 'Enviando...' : 'Enviar a Gemini'}
        </button>

        <button
          onClick={testWithCurl}
          disabled={!geminiApiKey.trim() || !prompt.trim()}
          className="flex items-center justify-center gap-3 px-8 py-4 rounded-lg border-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'white',
            borderColor: 'var(--secondary-300)',
            color: 'var(--secondary-700)',
            boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)'
          }}
          onMouseEnter={(e) => {
            if (!e.currentTarget.disabled) {
              e.currentTarget.style.backgroundColor = 'var(--secondary-50)';
              e.currentTarget.style.borderColor = 'var(--secondary-400)';
            }
          }}
          onMouseLeave={(e) => {
            if (!e.currentTarget.disabled) {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.borderColor = 'var(--secondary-300)';
            }
          }}
        >
          <Eye size={18} />
          Generar cURL
        </button>
      </div>

      {/* Información de la petición con mejor espaciado */}
      {requestInfo && (
        <div 
          className="p-6 rounded-lg border-l-4"
          style={{
            backgroundColor: requestInfo.success ? 'var(--success-50)' : 'var(--error-50)',
            borderLeftColor: requestInfo.success ? 'var(--success-400)' : 'var(--error-400)',
            borderWidth: '1px',
            borderLeftWidth: '4px',
            borderColor: requestInfo.success ? 'var(--success-200)' : 'var(--error-200)'
          }}
        >
          <div className="space-y-3">
            <h3 
              className="font-semibold text-sm flex items-center gap-2"
              style={{ 
                color: requestInfo.success ? 'var(--success-700)' : 'var(--error-700)' 
              }}
            >
              <AlertCircle size={16} />
              {requestInfo.success ? 'Petición exitosa' : 'Error en la petición'}
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span style={{ color: 'var(--secondary-600)' }}>Modelo:</span>
                <div style={{ color: 'var(--secondary-900)' }} className="font-mono mt-1">
                  {requestInfo.model}
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--secondary-600)' }}>Duración:</span>
                <div style={{ color: 'var(--secondary-900)' }} className="font-mono mt-1">
                  {requestInfo.duration}
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--secondary-600)' }}>Hora:</span>
                <div style={{ color: 'var(--secondary-900)' }} className="font-mono mt-1">
                  {requestInfo.timestamp}
                </div>
              </div>
              {requestInfo.responseLength && (
                <div>
                  <span style={{ color: 'var(--secondary-600)' }}>Caracteres:</span>
                  <div style={{ color: 'var(--secondary-900)' }} className="font-mono mt-1">
                    {requestInfo.responseLength}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Respuesta con mejor espaciado */}
      {response && (
        <div 
          className="p-6 rounded-lg border-l-4"
          style={{
            backgroundColor: 'var(--success-50)',
            borderLeftColor: 'var(--success-400)',
            borderWidth: '1px',
            borderLeftWidth: '4px',
            borderColor: 'var(--success-200)'
          }}
        >
          <h3 
            className="font-semibold text-sm mb-4 flex items-center gap-2"
            style={{ color: 'var(--success-700)' }}
          >
            <Send size={16} />
            Respuesta de Gemini
          </h3>
          <div 
            className="text-sm leading-relaxed whitespace-pre-wrap font-mono"
            style={{ 
              color: 'var(--secondary-900)',
              lineHeight: '1.7'
            }}
          >
            {response}
          </div>
        </div>
      )}

      {/* Error con mejor espaciado y word-wrap arreglado */}
      {error && (
        <div 
          className="p-6 rounded-lg border-l-4"
          style={{
            backgroundColor: 'var(--error-50)',
            borderLeftColor: 'var(--error-400)',
            borderWidth: '1px',
            borderLeftWidth: '4px',
            borderColor: 'var(--error-200)'
          }}
        >
          <h3 
            className="font-semibold text-sm mb-4 flex items-center gap-2"
            style={{ color: 'var(--error-700)' }}
          >
            <AlertCircle size={16} />
            Error
          </h3>
          <div 
            className="text-sm leading-relaxed font-mono break-words overflow-hidden"
            style={{ 
              color: 'var(--error-600)',
              lineHeight: '1.7',
              wordBreak: 'break-all',
              overflowWrap: 'anywhere'
            }}
          >
            {error}
          </div>
        </div>
      )}

      {/* Separador visual adicional antes de documentación */}
      <div className="py-4"></div>

      {/* Documentación colapsible */}
      <div 
        className="border rounded-lg"
        style={{ 
          borderColor: 'var(--secondary-300)',
          backgroundColor: 'var(--secondary-50)'
        }}
      >
        <button
          onClick={() => setIsDocumentationExpanded(!isDocumentationExpanded)}
          className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <span 
            className="font-medium text-sm"
            style={{ color: 'var(--secondary-900)' }}
          >
            📖 Documentación y Ayuda
          </span>
          {isDocumentationExpanded ? (
            <ChevronUp size={20} style={{ color: 'var(--secondary-600)' }} />
          ) : (
            <ChevronDown size={20} style={{ color: 'var(--secondary-600)' }} />
          )}
        </button>

        {isDocumentationExpanded && (
          <div 
            className="p-6 border-t space-y-4"
            style={{ borderTopColor: 'var(--secondary-300)' }}
          >
            <div>
              <h4 
                className="font-semibold text-sm mb-2"
                style={{ color: 'var(--secondary-900)' }}
              >
                🔑 Cómo obtener tu API Key
              </h4>
              <p 
                className="text-xs leading-relaxed"
                style={{ color: 'var(--secondary-600)' }}
              >
                1. Ve a <strong>Google AI Studio</strong><br />
                2. Inicia sesión con tu cuenta de Google<br />
                3. Crea un nuevo proyecto o selecciona uno existente<br />
                4. Ve a "API Keys" y genera una nueva clave<br />
                5. Copia la clave y pégala en el campo de arriba
              </p>
            </div>

            <div>
              <h4 
                className="font-semibold text-sm mb-2"
                style={{ color: 'var(--secondary-900)' }}
              >
                🤖 Modelos disponibles
              </h4>
              <div 
                className="text-xs leading-relaxed space-y-1"
                style={{ color: 'var(--secondary-600)' }}
              >
                <div><strong>gemini-2.5-flash:</strong> Rápido y eficiente</div>
                <div><strong>gemini-2.5-pro:</strong> Máximo rendimiento</div>
                <div><strong>gemini-1.5-flash:</strong> Versión estable rápida</div>
                <div><strong>gemini-1.5-pro:</strong> Versión estable completa</div>
              </div>
            </div>

            <div>
              <h4 
                className="font-semibold text-sm mb-2"
                style={{ color: 'var(--secondary-900)' }}
              >
                💡 Consejos de uso
              </h4>
              <p 
                className="text-xs leading-relaxed"
                style={{ color: 'var(--secondary-600)' }}
              >
                • Usa prompts claros y específicos<br />
                • El modelo Flash es más rápido para tareas simples<br />
                • El modelo Pro es mejor para tareas complejas<br />
                • Puedes generar comandos cURL para testing externo
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeminiTest;