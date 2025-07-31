import React from 'react';
import GeminiTest from '../components/GeminiTest';
import type { AppState } from '../types/AppState';

interface TestAPIPageProps {
  appState: AppState;
  showAlert: (message: string, options?: { title?: string; type?: 'info' | 'success' | 'warning' | 'error'; buttonText?: string; }) => void;
}

const TestAPIPage: React.FC<TestAPIPageProps> = ({
  appState,
  showAlert
}) => {
  return (
    <div className="container space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Test de API Gemini
        </h1>
        <p className="text-gray-600">
          Prueba la conexión y configuración de la API de Gemini
        </p>
      </div>
      
      <GeminiTest 
        appState={appState}
        showAlert={showAlert}
      />
    </div>
  );
};

export default TestAPIPage;
