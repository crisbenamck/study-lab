import React from 'react';
import { Upload } from 'lucide-react';
import { useFileUpload } from '../../hooks/useFileUpload';
import { PDFProcessorService } from '../../utils/pdfProcessor';

interface FileUploadAreaProps {
  onFileSelect: (file: File, totalPages: number) => void;
  selectedFile: File | null;
  totalPages: number;
  geminiApiKey: string;
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({ 
  onFileSelect, 
  selectedFile, 
  totalPages,
  geminiApiKey 
}) => {
  const { 
    isLoadingFile, 
    fileError, 
    handleFileSelect 
  } = useFileUpload({ geminiApiKey });

  const handleFileChange = async (file: File) => {
    await handleFileSelect(file);
    // The hook will update the internal state, but we need to pass the file up
    // We'll use a callback approach for now
    const processor = new PDFProcessorService(geminiApiKey || 'temp');
    try {
      const pdfInfo = await processor.getPDFInfo(file);
      onFileSelect(file, pdfInfo.totalPages);
    } catch (error) {
      console.error('Error getting PDF info:', error);
    }
  };

  return (
    <>
      {fileError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            ❌ <strong>Error:</strong> {fileError}
          </p>
        </div>
      )}

      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 mb-6">
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Arrastra un archivo PDF aquí</h3>
        <p className="text-gray-600 mb-6 font-medium">o haz clic para seleccionar un archivo</p>
        
        <input
          type="file"
          accept=".pdf"
          className="hidden"
          id="pdf-upload-input"
          disabled={isLoadingFile}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleFileChange(file);
            }
          }}
        />
        <label
          htmlFor="pdf-upload-input"
          className={`inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-md cursor-pointer transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isLoadingFile 
              ? 'bg-gray-400 border-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 border-blue-600 hover:bg-blue-700 hover:border-blue-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
          } text-white border shadow-sm`}
        >
          <Upload className="w-4 h-4 mr-2" />
          {isLoadingFile ? 'Procesando...' : 'Seleccionar PDF'}
        </label>
      </div>

      {selectedFile && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            📄 <strong>Archivo cargado:</strong> {selectedFile.name}
          </p>
          <p className="text-sm text-blue-600">
            📊 <strong>Total de páginas:</strong> {totalPages}
          </p>
        </div>
      )}
    </>
  );
};

export default FileUploadArea;
