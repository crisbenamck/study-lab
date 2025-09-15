import React from 'react';
import GeminiTest from '../components/GeminiTest';
import PageHeader from '../components/common/PageHeader';
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header mejorado usando PageHeader */}
        <PageHeader
          title="Test de API Gemini"
          description="Prueba la conexión y configuración de la API de Google AI Studio"
        />
        
        <GeminiTest 
          appState={appState}
          showAlert={showAlert}
        />
      </div>
    </div>
  );
};

export default TestAPIPage;
