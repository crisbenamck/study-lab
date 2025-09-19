import React from 'react';
import { FileTextIcon, ChartIcon, TargetIcon, RefreshIcon } from '../../icons';

interface NextStepMessageProps {
  geminiApiKey: string;
  selectedFile: File | null;
  totalPages?: number;
  onChangeFile?: () => void;
}

const NextStepMessage: React.FC<NextStepMessageProps> = ({
  geminiApiKey,
  selectedFile,
  totalPages,
  onChangeFile
}) => {
  if (!geminiApiKey?.trim()) {
    return null;
  }

  const baseClasses = "p-4 bg-theme-info rounded-lg border border-primary";
  const showFileInfo = selectedFile && totalPages;

  if (showFileInfo) {
    return (
      <div className={baseClasses}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-sm text-primary flex items-center mb-2">
              <FileTextIcon className="w-4 h-4 text-theme-info mr-2 flex-shrink-0" />
              <strong>Archivo cargado:</strong> {selectedFile.name}
            </div>
            <div className="text-sm text-theme-info flex items-center">
              <ChartIcon className="w-4 h-4 text-theme-info mr-2 flex-shrink-0" />
              <strong>Total de páginas:</strong> {totalPages}
            </div>
          </div>
          {onChangeFile && (
            <button
              onClick={onChangeFile}
              className="ml-4 inline-flex items-center px-3 py-1.5 text-xs font-medium text-theme-info bg-input border border-primary rounded-md hover:bg-elevated hover:border-secondary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            >
              <RefreshIcon className="w-3 h-3 mr-1" />
              Cambiar archivo
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`${baseClasses} mb-6`}>
      <div className="flex items-center space-x-3">
        <TargetIcon className="w-5 h-5 text-theme-info flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-primary">
            ¡Listo para comenzar!
          </p>
          <p className="text-sm text-secondary mt-1">
            Arrastra un archivo PDF en el área de arriba para extraer preguntas automáticamente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NextStepMessage;
