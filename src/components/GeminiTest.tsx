import React, { useState } from 'react';
import { Send, Eye, Zap, AlertCircle } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface RequestInfo {
  model: string;
  duration: string;
  timestamp: string;
  success: boolean;
  responseLength?: number;
  error?: string;
}

const GeminiTest: React.FC = () => {
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || '');
  const [prompt, setPrompt] = useState('Explain how AI works in a few words');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [requestInfo, setRequestInfo] = useState<RequestInfo | null>(null);
  const [model, setModel] = useState('gemini-2.5-flash');
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  const testModels = [
    'gemini-2.5-flash',
    'gemini-2.5-pro', 
    'gemini-2.5-flash-lite',
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
    'gemini-1.5-flash',
    'gemini-1.5-flash-8b',
    'gemini-1.5-pro'
  ];

  const listAvailableModels = async () => {
    if (!apiKey.trim()) {
      setError('Por favor ingresa tu API key para listar modelos');
      return;
    }

    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models', {
        headers: {
          'X-goog-api-key': apiKey
        }
      });

      if (response.ok) {
        const data = await response.json();
        const modelNames = data.models
          ?.filter((model: { supportedGenerationMethods?: string[] }) => 
            model.supportedGenerationMethods?.includes('generateContent'))
          ?.map((model: { name: string }) => model.name.replace('models/', '')) || [];
        
        setAvailableModels(modelNames);
        console.log('📋 Modelos disponibles:', modelNames);
      } else {
        console.error('Error listando modelos:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error conectando para listar modelos:', error);
    }
  };

  const samplePrompts = [
    'Explain how AI works in a few words',
    'Extract questions from this text: "1. What is JavaScript? A) A language B) A framework"',
    'Convert this to JSON: Question: What is React? Options: A) Library B) Language',
    'Hello, are you working?'
  ];

  const testGeminiDirect = async () => {
    if (!apiKey.trim()) {
      setError('Por favor ingresa tu API key');
      return;
    }

    if (!prompt.trim()) {
      setError('Por favor ingresa un prompt');
      return;
    }

    setIsLoading(true);
    setError('');
    setResponse('');
    setRequestInfo(null);

    const startTime = Date.now();

    try {
      console.log('🧪 Testing Gemini Direct API...');
      console.log('📡 Modelo:', model);
      console.log('📝 Prompt:', prompt);

      const genAI = new GoogleGenerativeAI(apiKey);
      const aiModel = genAI.getGenerativeModel({ model });

      const result = await aiModel.generateContent(prompt);
      const responseData = await result.response;
      const responseText = responseData.text();

      const endTime = Date.now();
      const duration = endTime - startTime;

      setResponse(responseText);
      setRequestInfo({
        model,
        duration: `${duration}ms`,
        responseLength: responseText.length,
        timestamp: new Date().toLocaleTimeString(),
        success: true
      });

      console.log('✅ Respuesta recibida:', responseText);
      console.log('⏱️ Duración:', duration + 'ms');

    } catch (err: unknown) {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      console.error('❌ Error en test:', err);
      
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
    const curlCommand = `curl "https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent" \\
  -H 'Content-Type: application/json' \\
  -H 'X-goog-api-key: ${apiKey}' \\
  -X POST \\
  -d '{
    "contents": [
      {
        "parts": [
          {
            "text": "${prompt.replace(/"/g, '\\"')}"
          }
        ]
      }
    ]
  }'`;

    navigator.clipboard.writeText(curlCommand).then(() => {
      alert('Comando curl copiado al portapapeles');
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Zap className="w-6 h-6 text-yellow-500" />
          Test de API Gemini
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Ingresa tu API key de Gemini"
              className="w-full p-2 border rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Modelo</label>
            <div className="flex gap-2">
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="flex-1 p-2 border rounded-md"
              >
                {(availableModels.length > 0 ? availableModels : testModels).map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <button
                onClick={listAvailableModels}
                className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded border"
                title="Listar modelos disponibles"
              >
                📋
              </button>
            </div>
            {availableModels.length > 0 && (
              <div className="mt-1 text-xs text-green-600">
                ✅ {availableModels.length} modelos disponibles cargados
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Prompt de prueba</label>
          <div className="mb-2 flex gap-2 flex-wrap">
            {samplePrompts.map((sample, index) => (
              <button
                key={index}
                onClick={() => setPrompt(sample)}
                className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
              >
                Ejemplo {index + 1}
              </button>
            ))}
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Escribe tu prompt aquí..."
            className="w-full p-3 border rounded-md h-24"
          />
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={testGeminiDirect}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {isLoading ? 'Enviando...' : 'Enviar a Gemini'}
          </button>
          
          <button
            onClick={testWithCurl}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            <Eye className="w-4 h-4" />
            Copiar como cURL
          </button>
        </div>

        {requestInfo && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <h4 className="font-medium mb-2">Información de la petición:</h4>
            <div className="text-sm space-y-1">
              <div><strong>Modelo:</strong> {requestInfo.model}</div>
              <div><strong>Duración:</strong> {requestInfo.duration}</div>
              <div><strong>Timestamp:</strong> {requestInfo.timestamp}</div>
              <div><strong>Estado:</strong> 
                <span className={requestInfo.success ? 'text-green-600' : 'text-red-600'}>
                  {requestInfo.success ? ' ✅ Éxito' : ' ❌ Error'}
                </span>
              </div>
              {requestInfo.responseLength && (
                <div><strong>Longitud respuesta:</strong> {requestInfo.responseLength} caracteres</div>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-4 h-4" />
              <strong>Error:</strong>
            </div>
            <div className="text-red-600 mt-1 text-sm font-mono">{error}</div>
          </div>
        )}

        {response && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <h4 className="font-medium text-green-800 mb-2">Respuesta de Gemini:</h4>
            <div className="text-sm bg-white p-3 rounded border">
              <pre className="whitespace-pre-wrap font-mono">{response}</pre>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-3">Información técnica</h3>
        <div className="text-sm space-y-2">
          <div><strong>Librería:</strong> @google/generative-ai</div>
          <div><strong>Endpoint:</strong> https://generativelanguage.googleapis.com/v1beta/models/[model]:generateContent</div>
          <div><strong>Método:</strong> POST</div>
          <div><strong>Headers:</strong> Content-Type: application/json, X-goog-api-key</div>
        </div>
        
        <div className="mt-4">
          <h4 className="font-medium mb-2">Modelos recomendados:</h4>
          <div className="text-sm space-y-1">
            <div><span className="font-medium text-green-600">gemini-2.5-flash:</span> Más reciente, pensamiento adaptativo y eficiencia de costos</div>
            <div><span className="font-medium text-blue-600">gemini-2.5-pro:</span> Máxima precisión, ideal para tareas complejas</div>
            <div><span className="font-medium text-orange-600">gemini-2.5-flash-lite:</span> Más rentable, alta velocidad</div>
            <div><span className="font-medium text-gray-600">gemini-1.5-flash:</span> Estable pero obsoleto</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiTest;
