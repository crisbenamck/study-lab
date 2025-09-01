import React from 'react';
import PDFImport from '../components/PDFImport';
import PageHeader from '../components/common/PageHeader';
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
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4">
        <PageHeader
          title="Importar preguntas desde PDF"
          description="Sube un archivo PDF para extraer preguntas automáticamente."
        />
        <PDFImport 
          onImportQuestions={onImportQuestions}
          appState={appState}
          nextQuestionNumber={nextQuestionNumber}
          showAlert={showAlert}
          showConfirm={showConfirm}
        />
      </div>
    </div>
  );
};

export default ImportPDFPage;
