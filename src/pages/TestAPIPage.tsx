import React from 'react';
import { Zap } from 'lucide-react';
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
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-6xl mx-auto p-8">
        {/* Header unificado sin sombra */}
        <div 
          className="rounded-lg mb-8 text-center p-8"
          style={{ 
            backgroundColor: 'var(--surface-elevated)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-primary-100)' }}
            >
              <Zap className="w-6 h-6" style={{ color: 'var(--color-primary-600)' }} />
            </div>
            <h1 
              className="text-3xl font-bold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Test de API Gemini
            </h1>
          </div>
          <p 
            className="text-lg"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Prueba la conexión y configuración de la API de Google AI Studio
          </p>
        </div>
        
        <GeminiTest 
          appState={appState}
          showAlert={showAlert}
        />
      </div>
    </div>
  );
};

export default TestAPIPage;
