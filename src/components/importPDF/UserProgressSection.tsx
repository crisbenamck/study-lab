import React from 'react';
import { Check, Clock } from 'lucide-react';

interface UserProgressSectionProps {
  geminiApiKey: string;
  selectedFile: File | null;
  isProcessing: boolean;
}

const UserProgressSection: React.FC<UserProgressSectionProps> = ({ 
  geminiApiKey, 
  selectedFile,
  isProcessing
}) => {
  const hasApiKey = !!(geminiApiKey && geminiApiKey.trim() !== '');
  
  const getStepIcon = (completed: boolean, inProgress: boolean = false) => {
    if (inProgress) {
      return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>;
    }
    if (completed) {
      return <Check className="w-4 h-4 text-green-600" />;
    } else {
      return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const steps = [
    {
      id: 'api-key',
      text: 'Configurar API Key',
      completed: hasApiKey,
      inProgress: false
    },
    {
      id: 'select-file',
      text: 'Seleccionar archivo PDF',
      completed: hasApiKey && !!selectedFile,
      inProgress: false
    },
    {
      id: 'process',
      text: 'Procesar preguntas',
      completed: false,
      inProgress: isProcessing
    },
    {
      id: 'import',
      text: 'Importar a la lista',
      completed: false,
      inProgress: false
    }
  ];

  return (
    <div 
      className="bg-gray-50 rounded-lg p-4 mt-6"
    >
      <h4 className="font-medium text-gray-800 mb-3">🚀 Progreso:</h4>
      <div className="space-y-3">
        {steps.map((step) => (
          <div key={step.id} className="flex items-center space-x-3">
            {getStepIcon(step.completed, step.inProgress)}
            <span className={`text-sm ${
              step.completed ? 'text-gray-700 font-medium' : 
              step.inProgress ? 'text-blue-600 font-medium' :
              'text-gray-500'
            }`}>
              {step.text}
            </span>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
        <p className="text-xs text-blue-700">
          💡 <strong>Tip:</strong> Usa el "Procesamiento Directo" para mejores resultados. 
          Analiza todo el PDF automáticamente y genera explicaciones detalladas.
        </p>
      </div>
    </div>
  );
};

export default UserProgressSection;
