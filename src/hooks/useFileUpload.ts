import { useState, useCallback } from 'react';
import { PDFProcessorService } from '../utils/pdfProcessor';

interface UseFileUploadProps {
  geminiApiKey: string;
}

interface UseFileUploadReturn {
  selectedFile: File | null;
  totalPages: number;
  isLoadingFile: boolean;
  fileError: string | null;
  handleFileSelect: (file: File) => Promise<void>;
  clearFile: () => void;
}

export const useFileUpload = ({ geminiApiKey }: UseFileUploadProps): UseFileUploadReturn => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    setIsLoadingFile(true);
    setFileError(null);
    setSelectedFile(file);
    
    try {
      const processor = new PDFProcessorService(geminiApiKey || 'temp');
      const pdfInfo = await processor.getPDFInfo(file);
      setTotalPages(pdfInfo.totalPages);
      console.log(`📄 PDF cargado: ${file.name} - ${pdfInfo.totalPages} páginas`);
    } catch (error) {
      console.error('Error cargando PDF:', error);
      
      // Fallback: generar número simulado de páginas
      const simulatedPages = Math.floor(Math.random() * 45) + 5;
      setTotalPages(simulatedPages);
      
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setFileError(`Error al cargar información del PDF: ${errorMessage}. Usando páginas simuladas.`);
      
      console.log(`📄 PDF cargado (simulado): ${file.name} - ${simulatedPages} páginas`);
    } finally {
      setIsLoadingFile(false);
    }
  }, [geminiApiKey]);

  const clearFile = useCallback(() => {
    setSelectedFile(null);
    setTotalPages(0);
    setFileError(null);
  }, []);

  return {
    selectedFile,
    totalPages,
    isLoadingFile,
    fileError,
    handleFileSelect,
    clearFile
  };
};
