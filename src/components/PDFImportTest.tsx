import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

const PDFImportTest: React.FC = () => {
  const [geminiApiKey, setGeminiApiKey] = useState('');

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">TEST: Importar Preguntas desde PDF</h1>
        <p className="text-gray-600">Prueba del input de API key</p>
      </div>

      {/* SIEMPRE mostrar el input para test */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-yellow-800">TEST: Configuración API Key</h3>
            <p className="text-sm text-yellow-700 mt-1">
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
            <p className="text-xs text-gray-600 mt-1">
              DEBUG - API Key actual: "{geminiApiKey}" (length: {geminiApiKey.length})
            </p>
            <input
              type="text"
              placeholder="Pega tu API key aquí... (ESTE ES EL TEST)"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              className="mt-2 w-full px-3 py-2 border-2 border-red-500 bg-red-50 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <p className="text-gray-700">
          Este es un componente de test. Si puedes ver este mensaje y el input rojo arriba, 
          entonces el problema no es con React sino con la lógica condicional del componente original.
        </p>
      </div>
    </div>
  );
};

export default PDFImportTest;
