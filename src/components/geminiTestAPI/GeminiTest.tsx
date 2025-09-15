import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ApiKeyConfig from '../common/ApiKeyConfig';
import PromptForm from './PromptForm';
import ExampleButtons from './ExampleButtons';
import RequestInfo from './RequestInfo';
import ResponseDisplay from './ResponseDisplay';

interface RequestInfoData {
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
  const [requestInfo, setRequestInfo] = useState<RequestInfoData | null>(null);
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
        timestamp: new Date().toLocaleTimeString(),
        success: false,
        error: errorMsg
      });

      showAlert('Error al probar Gemini API', {
        title: 'Error',
        type: 'error',
        buttonText: 'Entendido'
      });
      
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptSelect = (selectedPrompt: string) => {
    setPrompt(selectedPrompt);
  };

  return (
    <div className="space-y-6">
      {/* API Key Configuration */}
      <ApiKeyConfig
        geminiApiKey={geminiApiKey}
        saveGeminiApiKey={saveGeminiApiKey}
        showModelInfo={false}
        title="Configuración API Key"
        description="Configura tu clave API de Google Gemini para realizar pruebas directas"
      />

      {/* Example Buttons */}
      <ExampleButtons
        samplePrompts={samplePrompts}
        onPromptSelect={handlePromptSelect}
        isDisabled={!isValidApiKey || isLoading}
      />

      {/* Prompt Form */}
      <PromptForm
        prompt={prompt}
        onPromptChange={setPrompt}
        model={model}
        onModelChange={setModel}
        isLoading={isLoading}
        onSubmit={testGeminiDirect}
        isDisabled={!isValidApiKey}
        testModels={testModels}
      />

      {/* Request Information */}
      {requestInfo && (
        <RequestInfo requestInfo={requestInfo} />
      )}

      {/* Response or Error Display */}
      <ResponseDisplay response={response} error={error} />
    </div>
  );
};

export default GeminiTest;