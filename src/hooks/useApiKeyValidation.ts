import { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ApiKeyValidationResult {
  isValid: boolean;
  isValidating: boolean;
  error: string | null;
  validatedApiKey?: string; // Store which API key was validated
}

interface UseApiKeyValidationReturn {
  validationResult: ApiKeyValidationResult;
  validateApiKey: (apiKey: string) => Promise<void>;
  resetValidation: () => void;
  isApiKeyLocked: boolean;
}

const VALIDATION_CACHE_KEY = 'gemini_api_validation_cache';

interface ValidationCache {
  apiKeyHash: string;
  isValid: boolean;
  timestamp: number;
}

// Simple hash function for API key (for security, don't store the actual key)
const hashApiKey = (apiKey: string): string => {
  let hash = 0;
  for (let i = 0; i < apiKey.length; i++) {
    const char = apiKey.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
};

export const useApiKeyValidation = (): UseApiKeyValidationReturn => {
  const [validationResult, setValidationResult] = useState<ApiKeyValidationResult>({
    isValid: false,
    isValidating: false,
    error: null
  });

  // Keep track of the last validated API key to prevent duplicate calls
  const lastValidatedApiKey = useRef<string>('');
  // Keep track of ongoing validation to prevent multiple simultaneous calls
  const isValidatingRef = useRef<boolean>(false);

  // Load cached validation on mount
  useEffect(() => {
    const loadCachedValidation = () => {
      try {
        const cached = localStorage.getItem(VALIDATION_CACHE_KEY);
        if (cached) {
          const parsedCache: ValidationCache = JSON.parse(cached);
          // Cache is valid for 24 hours
          const isExpired = Date.now() - parsedCache.timestamp > 24 * 60 * 60 * 1000;
          
          if (!isExpired && parsedCache.isValid) {
            return parsedCache;
          }
        }
      } catch (error) {
        console.warn('Failed to load validation cache:', error);
      }
      return null;
    };

    const cached = loadCachedValidation();
    if (cached) {
      setValidationResult({
        isValid: cached.isValid,
        isValidating: false,
        error: null,
        validatedApiKey: 'cached' // Don't store actual key
      });
    }
  }, []);

  // Check if current API key is the validated one from cache
  const isApiKeyLocked = validationResult.isValid && validationResult.validatedApiKey !== undefined;

  const validateApiKey = useCallback(async (apiKey: string) => {
    if (!apiKey || apiKey.trim() === '') {
      setValidationResult({
        isValid: false,
        isValidating: false,
        error: 'API key no puede estar vacía'
      });
      lastValidatedApiKey.current = '';
      // Clear cache
      localStorage.removeItem(VALIDATION_CACHE_KEY);
      return;
    }

    // Check if this API key is already cached as valid
    try {
      const cached = localStorage.getItem(VALIDATION_CACHE_KEY);
      if (cached) {
        const parsedCache: ValidationCache = JSON.parse(cached);
        const currentApiKeyHash = hashApiKey(apiKey);
        const isExpired = Date.now() - parsedCache.timestamp > 24 * 60 * 60 * 1000;
        
        if (!isExpired && parsedCache.apiKeyHash === currentApiKeyHash && parsedCache.isValid) {
          setValidationResult({
            isValid: true,
            isValidating: false,
            error: null,
            validatedApiKey: 'cached'
          });
          lastValidatedApiKey.current = apiKey;
          return;
        }
      }
    } catch (error) {
      console.warn('Failed to check validation cache:', error);
    }

    // Prevent duplicate validations for the same API key
    if (apiKey === lastValidatedApiKey.current) {
      return;
    }

    // Prevent multiple simultaneous validations
    if (isValidatingRef.current) {
      return;
    }

    isValidatingRef.current = true;
    lastValidatedApiKey.current = apiKey;

    setValidationResult({
      isValid: false,
      isValidating: true,
      error: null
    });

    try {
      // Use the cheapest model for validation: gemini-2.0-flash
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      
      // Simple test prompt to validate the API key
      const result = await model.generateContent('Responde solo: OK');
      const response = await result.response;
      const text = response.text().trim().toLowerCase();
      
      if (text.includes('ok')) {
        // Cache the successful validation
        const cache: ValidationCache = {
          apiKeyHash: hashApiKey(apiKey),
          isValid: true,
          timestamp: Date.now()
        };
        localStorage.setItem(VALIDATION_CACHE_KEY, JSON.stringify(cache));

        setValidationResult({
          isValid: true,
          isValidating: false,
          error: null,
          validatedApiKey: apiKey
        });
      } else {
        setValidationResult({
          isValid: false,
          isValidating: false,
          error: 'La API key no respondió correctamente'
        });
      }
    } catch (error: unknown) {
      let errorMessage = 'API key inválida';
      
      // Handle specific error types
      if (error instanceof Error) {
        if (error.message?.includes('API_KEY_INVALID')) {
          errorMessage = 'La API key proporcionada no es válida';
        } else if (error.message?.includes('PERMISSION_DENIED')) {
          errorMessage = 'La API key no tiene permisos suficientes';
        } else if (error.message?.includes('QUOTA_EXCEEDED')) {
          errorMessage = 'Se ha excedido la cuota de la API key';
        } else if (error.message?.includes('RATE_LIMIT_EXCEEDED')) {
          errorMessage = 'Se ha excedido el límite de velocidad, intenta más tarde';
        } else {
          errorMessage = error.message;
        }
      }
      
      console.error('❌ Error validando API key:', error);
      
      setValidationResult({
        isValid: false,
        isValidating: false,
        error: errorMessage
      });
    } finally {
      isValidatingRef.current = false;
    }
  }, []);

  const resetValidation = useCallback(() => {
    setValidationResult({
      isValid: false,
      isValidating: false,
      error: null
    });
    lastValidatedApiKey.current = '';
    isValidatingRef.current = false;
    // Clear cache
    localStorage.removeItem(VALIDATION_CACHE_KEY);
  }, []);

  return {
    validationResult,
    validateApiKey,
    resetValidation,
    isApiKeyLocked
  };
};
