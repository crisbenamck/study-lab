import React from 'react';
import { GeminiTest } from '../components/geminiTestAPI';
import PageHeader from '../components/common/PageHeader';
import Layout from '../components/Layout';
import type { AppState } from '../types/AppState';

interface GeminiTestAPIPageProps {
  appState: AppState;
  showAlert: (message: string, options?: { title?: string; type?: 'info' | 'success' | 'warning' | 'error'; buttonText?: string; }) => void;
}

const GeminiTestAPIPage: React.FC<GeminiTestAPIPageProps> = ({
  appState,
  showAlert
}) => {
  return (
    <Layout>
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <PageHeader
            title="Gemini Test API"
            description="Prueba la conexión y configuración de la API de Google AI Studio"
          />
          
          <GeminiTest 
            appState={appState}
            showAlert={showAlert}
          />
        </div>
      </div>
    </Layout>
  );
};

export default GeminiTestAPIPage;