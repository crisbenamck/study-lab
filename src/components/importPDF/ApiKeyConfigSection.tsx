import React, { useState } from 'react';
import { AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

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

export default ApiKeyConfigSection;
