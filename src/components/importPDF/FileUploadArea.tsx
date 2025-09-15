import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';
import { useFileUpload } from '../../hooks/useFileUpload';
import { PDFProcessorService } from '../../utils/pdfProcessor';
import { ErrorIcon } from '../../icons';
import NextStepMessage from './NextStepMessage';

interface FileUploadAreaProps {
  onFileSelect: (file: File, totalPages: number) => void;
  selectedFile: File | null;
  totalPages: number;
  geminiApiKey: string;
  onResetFile?: () => void;
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  onFileSelect,
  selectedFile,
  totalPages,
  geminiApiKey,
  onResetFile
}) => {
  const {
    isLoadingFile,
    fileError,
    handleFileSelect
  } = useFileUpload({ geminiApiKey });

  const handleFileChange = useCallback(async (file: File) => {
    try {
      // Use hook for loading state and error handling only
      await handleFileSelect(file);

      // Process PDF info and notify parent
      const processor = new PDFProcessorService(geminiApiKey || 'temp');
      const pdfInfo = await processor.getPDFInfo(file);
      onFileSelect(file, pdfInfo.totalPages);
    } catch (error) {
      console.error('Error getting PDF info:', error);
    }
  }, [handleFileSelect, geminiApiKey, onFileSelect]);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  }, [handleFileChange]);

  const baseButtonClasses = "inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-md cursor-pointer transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 text-white border shadow-sm theme-transition";
  const buttonClasses = isLoadingFile
    ? `${baseButtonClasses} bg-gray-disabled border-gray-disabled cursor-not-allowed`
    : `${baseButtonClasses} bg-primary-600 border-primary-600 hover:bg-primary-700 hover:border-primary-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0`;

  if (selectedFile) {
    return (
      <NextStepMessage
        geminiApiKey={geminiApiKey}
        selectedFile={selectedFile}
        totalPages={totalPages}
        onChangeFile={onResetFile}
      />
    );
  }

  return (
    <>
      {fileError && (
        <div className="mb-4 p-4 bg-danger-50 border border-danger-200 rounded-lg theme-transition">
          <div className="text-sm text-danger-800 flex items-center">
            <ErrorIcon className="w-4 h-4 text-danger-600 mr-2 flex-shrink-0" />
            <strong>Error:</strong> {fileError}
          </div>
        </div>
      )}

      <div className="border-2 border-dashed border-primary rounded-xl p-8 text-center hover:border-primary-400 hover:bg-primary-50 transition-all duration-300 mb-6 theme-transition">
        <Upload className="w-12 h-12 text-tertiary mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-primary mb-2">
          Arrastra un archivo PDF aquí
        </h3>
        <p className="text-secondary mb-6 font-medium">
          o haz clic para seleccionar un archivo
        </p>

        <input
          type="file"
          accept=".pdf"
          className="hidden"
          id="pdf-upload-input"
          disabled={isLoadingFile}
          onChange={handleInputChange}
        />
        <label htmlFor="pdf-upload-input" className={buttonClasses}>
          <Upload className="w-4 h-4 mr-2" />
          {isLoadingFile ? 'Procesando...' : 'Seleccionar PDF'}
        </label>
      </div>

      <NextStepMessage
        geminiApiKey={geminiApiKey}
        selectedFile={null}
        totalPages={0}
      />
    </>
  );
};

export default FileUploadArea;
