import React from 'react';
import PDFImport from '../components/PDFImport';
import type { Question } from '../types/Question';
import type { AppState } from '../types/AppState';

interface ImportPDFPageProps {
  onImportQuestions: (importedQuestions: Question[]) => void;
  appState: AppState;
  nextQuestionNumber: number;
  showAlert: (message: string, options?: { title?: string; type?: 'info' | 'success' | 'warning' | 'error'; buttonText?: string; }) => void;
  showConfirm: (message: string, onConfirm: () => void, options?: { title?: string; confirmText?: string; cancelText?: string; }) => void;
}

const ImportPDFPage: React.FC<ImportPDFPageProps> = ({
  onImportQuestions,
  appState,
  nextQuestionNumber,
  showAlert,
  showConfirm
}) => {
  return (
    <div className="container space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Importar Preguntas desde PDF
        </h1>
        <p className="text-gray-600">
          Sube un archivo PDF para extraer preguntas automáticamente
        </p>
      </div>
      
      <PDFImport 
        onImportQuestions={onImportQuestions}
        appState={appState}
        nextQuestionNumber={nextQuestionNumber}
        showAlert={showAlert}
        showConfirm={showConfirm}
      />
    </div>
  );
};

export default ImportPDFPage;
