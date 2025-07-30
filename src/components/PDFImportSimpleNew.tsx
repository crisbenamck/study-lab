import React, { useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import type { Question } from '../types/Question';

interface PDFImportProps {
  onImportQuestions: (questions: Question[]) => void;
}

const PDFImport: React.FC<PDFImportProps> = ({ onImportQuestions }) => {
  const [geminiApiKey, setGeminiApiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || '');

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Importar Preguntas desde PDF</h1>
        <p className="text-gray-600">Sube un archivo PDF para extraer preguntas automáticamente usando IA</p>
      </div>

      {/* Configuración API */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-yellow-800">Configuración API Key</h3>
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
              DEBUG - API Key: "{geminiApiKey}" (length: {geminiApiKey?.length || 0})
            </p>
            <input
              type="text"
              placeholder="Pega tu API key de Gemini aquí..."
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              className="mt-2 w-full px-3 py-2 border border-yellow-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            {geminiApiKey && geminiApiKey.trim() !== '' && (
              <p className="text-xs text-green-600 mt-1">✅ API Key configurada correctamente</p>
            )}
          </div>
        </div>
      </div>

      {/* Área de carga de archivos */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Arrastra un archivo PDF aquí</h3>
        <p className="text-gray-500 mb-4">o haz clic para seleccionar un archivo</p>
        
        <input
          type="file"
          accept=".pdf"
          className="hidden"
          id="pdf-upload"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              console.log('Archivo seleccionado:', file.name);
              alert('Archivo cargado: ' + file.name + '\\nFuncionalidad de procesamiento pendiente...');
            }
          }}
        />
        <label
          htmlFor="pdf-upload"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
        >
          Seleccionar PDF
        </label>
      </div>

      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-800 mb-2">🚀 Estado del desarrollo:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>✅ Input de API key funcionando</li>
          <li>✅ Carga de archivos básica</li>
          <li>⏳ Procesamiento de PDF con IA (en desarrollo)</li>
          <li>⏳ Extracción de preguntas (en desarrollo)</li>
        </ul>
      </div>
    </div>
  );
};

export default PDFImport;
