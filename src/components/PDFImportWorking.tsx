import React, { useState, useCallback } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import type { Question } from '../types/Question';

interface PDFImportProps {
  onImportQuestions: (questions: Question[]) => void;
}

const PDFImport: React.FC<PDFImportProps> = ({ onImportQuestions }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || '');

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    console.log(`📄 PDF seleccionado: ${file.name}`);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');
    
    if (pdfFile) {
      handleFileSelect(pdfFile);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Importar Preguntas desde PDF
        </h2>
        <p className="text-gray-600">
          Sube un archivo PDF para extraer preguntas automáticamente usando IA
        </p>
      </div>

      {/* Configuración API */}
      {!geminiApiKey && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-yellow-800">Configuración requerida</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Necesitas una API key de Google Gemini para usar esta función.
                <a 
                  href="https://makersuite.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline ml-1"
                >
                  Obtener API key gratuita
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Zona de carga */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Arrastra un archivo PDF aquí
        </h3>
        <p className="text-gray-600 mb-4">
          o haz clic para seleccionar un archivo
        </p>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileInputChange}
          className="hidden"
          id="pdf-upload"
        />
        <label
          htmlFor="pdf-upload"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
        >
          Seleccionar PDF
        </label>
        
        {selectedFile && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                {selectedFile.name}
              </span>
              <span className="text-xs text-blue-700">
                ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Estado temporal */}
      <div className="text-center text-gray-500">
        <p>Funcionalidad de procesamiento en desarrollo...</p>
        <p className="text-xs mt-1">Versión básica - Solo carga de archivos</p>
      </div>
    </div>
  );
};

export default PDFImport;
