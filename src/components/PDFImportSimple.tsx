import React from 'react';

interface PDFImportProps {
  onImportQuestions: (questions: any[]) => void;
}

const PDFImport: React.FC<PDFImportProps> = ({ onImportQuestions }) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Importar Preguntas desde PDF
      </h2>
      <p className="text-gray-600">
        Funcionalidad en desarrollo...
      </p>
    </div>
  );
};

export default PDFImport;
