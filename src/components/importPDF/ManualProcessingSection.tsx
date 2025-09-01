import React from 'react';
import { Settings } from 'lucide-react';

interface ManualProcessingSectionProps {
  showManualProcessing: boolean;
  selectedFile: File | null;
  totalPages: number;
  pageToProcess: number;
  setPageToProcess: (page: number) => void;
  isProcessing: boolean;
  geminiApiKey: string;
  onStartProcessing: () => void;
}

const ManualProcessingSection: React.FC<ManualProcessingSectionProps> = ({
  showManualProcessing,
  selectedFile,
  totalPages,
  pageToProcess,
  setPageToProcess,
  isProcessing,
  geminiApiKey,
  onStartProcessing
}) => {
  if (!selectedFile || !showManualProcessing) {
    return null;
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-center space-x-2 mb-3">
        <Settings className="w-5 h-5 text-gray-600" />
        <h3 className="font-medium text-gray-800">Configuración de procesamiento</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Página a procesar
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="1"
              max={totalPages}
              value={pageToProcess}
              onChange={(e) => setPageToProcess(parseInt(e.target.value) || 1)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-500">de {totalPages}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Especifica qué página del PDF quieres procesar
          </p>
        </div>

        <div className="flex items-end">
          <button
            onClick={onStartProcessing}
            disabled={isProcessing || !selectedFile || !geminiApiKey.trim()}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 w-full justify-center"
            style={{
              backgroundColor: (isProcessing || !selectedFile || !geminiApiKey.trim()) ? '#e5e7eb' : '#2563eb',
              color: (isProcessing || !selectedFile || !geminiApiKey.trim()) ? '#9ca3af' : '#ffffff',
              border: `1px solid ${(isProcessing || !selectedFile || !geminiApiKey.trim()) ? '#e5e7eb' : '#2563eb'}`,
              boxShadow: (isProcessing || !selectedFile || !geminiApiKey.trim()) ? 'none' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              cursor: (isProcessing || !selectedFile || !geminiApiKey.trim()) ? 'not-allowed' : 'pointer'
            }}
            onMouseEnter={(e) => {
              if (!isProcessing && selectedFile && geminiApiKey.trim()) {
                e.currentTarget.style.backgroundColor = '#1d4ed8';
                e.currentTarget.style.borderColor = '#1d4ed8';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isProcessing && selectedFile && geminiApiKey.trim()) {
                e.currentTarget.style.backgroundColor = '#2563eb';
                e.currentTarget.style.borderColor = '#2563eb';
                e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Procesando...</span>
              </span>
            ) : (
              '🚀 Iniciar procesamiento'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManualProcessingSection;
