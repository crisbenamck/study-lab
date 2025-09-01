import React, { useState, useEffect } from 'react';
import { AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { CheckMarkIcon, RobotIcon, ChartIcon, NextIcon, WarningIcon, LoadingIcon, ErrorIcon, UnlockIcon } from '../../icons';
import { useApiKeyValidation } from '../../hooks/useApiKeyValidation';

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
  const { validationResult, validateApiKey, resetValidation, isApiKeyLocked } = useApiKeyValidation();
  const [isEditMode, setIsEditMode] = useState(false);
  
  const hasApiKey = geminiApiKey && geminiApiKey.trim() !== '';
  const isValidApiKey = hasApiKey && validationResult.isValid;
  const hasValidationError = hasApiKey && validationResult.error;

  // Auto-validate when API key changes, but only if not locked and not in edit mode
  useEffect(() => {
    if (!hasApiKey) {
      resetValidation();
      return;
    }

    // Don't auto-validate if the API key is locked (already validated)
    if (isApiKeyLocked && !isEditMode) {
      return;
    }

    // Only validate if we haven't validated this exact API key before
    const timeoutId = setTimeout(() => {
      if (hasApiKey && !validationResult.isValidating && !isApiKeyLocked) {
        validateApiKey(geminiApiKey);
      }
    }, 1000); // Wait 1 second after user stops typing

    return () => clearTimeout(timeoutId);
  }, [geminiApiKey, hasApiKey, resetValidation, validateApiKey, validationResult.isValidating, isApiKeyLocked, isEditMode]);

  // Determine the main icon based on validation state
  const getMainIcon = () => {
    if (validationResult.isValidating) {
      return <LoadingIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />;
    }
    if (isValidApiKey) {
      return <CheckMarkIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />;
    }
    if (hasValidationError) {
      return <ErrorIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />;
    }
    return <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />;
  };

  // Determine container colors based on validation state
  const getContainerColors = () => {
    if (validationResult.isValidating) {
      return 'bg-blue-50 border-blue-200';
    }
    if (isValidApiKey) {
      return 'bg-green-50 border-green-200';
    }
    if (hasValidationError) {
      return 'bg-red-50 border-red-200';
    }
    return 'bg-yellow-50 border-yellow-200';
  };

  // Determine text colors based on validation state
  const getTextColors = () => {
    if (validationResult.isValidating) {
      return { title: 'text-blue-800', description: 'text-blue-700', chevron: 'text-blue-600' };
    }
    if (isValidApiKey) {
      return { title: 'text-green-800', description: 'text-green-700', chevron: 'text-green-600' };
    }
    if (hasValidationError) {
      return { title: 'text-red-800', description: 'text-red-700', chevron: 'text-red-600' };
    }
    return { title: 'text-yellow-800', description: 'text-yellow-700', chevron: 'text-yellow-600' };
  };

  const colors = getTextColors();

  // Determine title text based on validation state
  const getTitleText = () => {
    if (validationResult.isValidating) {
      return { main: 'Validando API Key...', additional: null };
    }
    if (isValidApiKey) {
      return { 
        main: 'API Key Configurada', 
        additional: '. Haz clic para ver detalles o cambiar.' 
      };
    }
    if (hasValidationError) {
      return { main: 'API Key Inválida', additional: null };
    }
    return { main: 'Configuración API Key', additional: null };
  };

  // Determine description text based on validation state
  const getDescriptionText = () => {
    if (validationResult.isValidating) {
      return "Verificando la validez de la API key...";
    }
    if (isValidApiKey) {
      return null; // No mostrar descripción cuando está validada
    }
    if (hasValidationError) {
      return `Error: ${validationResult.error}. Haz clic para corregir.`;
    }
    return "Se requiere API key de Google Gemini. Haz clic para configurar.";
  };

  return (
    <div className={`border rounded-lg p-4 mb-6 ${getContainerColors()}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseDown={(e) => e.preventDefault()}
        tabIndex={-1}
        className="w-full flex items-start justify-between space-x-3 text-left focus:outline-none focus:ring-0"
      >
        <div className="flex items-start space-x-3 flex-1">
          {getMainIcon()}
          <div className="flex-1">
            <h3 className={`font-medium flex items-center ${colors.title}`}>
              <span className="font-medium">{getTitleText().main}</span>
              {getTitleText().additional && (
                <span className="font-normal">{getTitleText().additional}</span>
              )}
            </h3>
            {getDescriptionText() && (
              <p className={`text-sm mt-1 ${colors.description}`}>
                {getDescriptionText()}
              </p>
            )}
          </div>
        </div>
        <div className="flex-shrink-0 mt-0.5">
          {isExpanded ? (
            <ChevronUp className={`w-5 h-5 ${colors.chevron}`} />
          ) : (
            <ChevronDown className={`w-5 h-5 ${colors.chevron}`} />
          )}
        </div>
      </button>
      
      {isExpanded && (
        <div className="mt-3">
          {!hasApiKey && (
            <p className={`text-sm mb-2 ${colors.description}`}>
              Configura tu API key de Google Gemini para usar esta función.
              <a 
                href="https://makersuite.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline ml-1"
              >
                Obtener API key gratuita
              </a>
            </p>
          )}
          <input
            type="password"
            placeholder="Pega tu API key de Gemini aquí..."
            value={geminiApiKey}
            onChange={(e) => saveGeminiApiKey(e.target.value)}
            readOnly={isApiKeyLocked && !isEditMode}
            className={`mt-2 w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
              isApiKeyLocked && !isEditMode
                ? 'bg-gray-50 cursor-not-allowed border-gray-300'
                : validationResult.isValidating
                  ? 'border-blue-300 focus:ring-blue-500 focus:border-blue-500'
                  : isValidApiKey 
                    ? 'border-green-300 focus:ring-green-500 focus:border-green-500' 
                    : hasValidationError
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-amber-300 focus:ring-amber-500 focus:border-amber-500'
            }`}
          />
          
          {isApiKeyLocked && !isEditMode && (
            <div className="mt-2 flex items-center justify-between p-2 bg-green-50 rounded border border-green-200">
              <div className="flex items-center">
                <CheckMarkIcon className="w-4 h-4 mr-2" />
                <span className="text-sm text-green-700 font-medium">API key validada y bloqueada por seguridad</span>
              </div>
              <button
                onClick={() => setIsEditMode(true)}
                className="flex items-center px-2 py-1 text-xs text-green-700 hover:text-green-800 hover:bg-green-100 rounded transition-colors"
                aria-label="Desbloquear para editar API key"
              >
                <UnlockIcon className="w-3 h-3 mr-1" />
                Cambiar
              </button>
            </div>
          )}

          {isEditMode && isApiKeyLocked && (
            <div className="mt-2 p-2 bg-yellow-50 rounded border border-yellow-200">
              <p className="text-xs text-yellow-700 mb-2">
                ⚠️ Estás editando una API key ya validada. Los cambios requerirán nueva validación.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsEditMode(false);
                    // Restore original API key if needed
                  }}
                  className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    resetValidation();
                    setIsEditMode(false);
                  }}
                  className="px-2 py-1 text-xs text-yellow-700 hover:text-yellow-800 hover:bg-yellow-100 rounded transition-colors"
                >
                  Confirmar cambios
                </button>
              </div>
            </div>
          )}
          {hasValidationError && (
            <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
              <p className="text-xs text-red-700 flex items-center">
                <ErrorIcon className="w-4 h-4 mr-1" />
                {validationResult.error}
              </p>
            </div>
          )}
          {isValidApiKey && (
            <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
              <p className="text-xs text-blue-700 mb-1 flex items-center">
                <RobotIcon className="w-4 h-4 mr-1" />
                <strong>Modelo actual:</strong> {currentGeminiModel}
              </p>
              {fallbackStatus && (
                <div className="text-xs text-blue-600">
                  <p className="flex items-center">
                    <ChartIcon className="w-4 h-4 mr-1" />
                    Modelo {fallbackStatus.currentModelIndex + 1} de {fallbackStatus.totalModels}
                  </p>
                  {fallbackStatus.remainingModels > 0 && (
                    <p className="flex items-center">
                      <NextIcon className="w-4 h-4 mr-1" />
                      {fallbackStatus.remainingModels} modelos de respaldo disponibles
                    </p>
                  )}
                  {fallbackStatus.remainingModels === 0 && (
                    <p className="text-amber-600 flex items-center">
                      <WarningIcon className="w-4 h-4 mr-1" />
                      Último modelo disponible
                    </p>
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
