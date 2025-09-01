import React from 'react';

interface NextStepMessageProps {
  geminiApiKey: string;
  selectedFile: File | null;
}

const NextStepMessage: React.FC<NextStepMessageProps> = ({ geminiApiKey, selectedFile }) => {
  const hasApiKey = !!(geminiApiKey && geminiApiKey.trim() !== '');
  
  if (!hasApiKey) {
    return null;
  }
  
  if (selectedFile) {
    return null;
  }
  
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center space-x-3">
        <div className="w-5 h-5 text-blue-600 flex-shrink-0">🎯</div>
        <div className="flex-1">
          <p className="text-sm font-medium text-blue-800">
            ¡API key configurada correctamente!
          </p>
          <p className="text-sm text-blue-700 mt-1">
            Arrastra un archivo PDF en el área de arriba para extraer preguntas automáticamente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NextStepMessage;
