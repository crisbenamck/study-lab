import React from 'react';
import { AlertCircle } from 'lucide-react';

interface RequestInfoData {
  model: string;
  duration: string;
  timestamp: string;
  success: boolean;
  responseLength?: number;
  error?: string;
}

interface RequestInfoProps {
  requestInfo: RequestInfoData;
}

const RequestInfo: React.FC<RequestInfoProps> = ({ requestInfo }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className={`p-6 border-l-4 ${requestInfo.success 
        ? 'border-l-green-500' 
        : 'border-l-red-500'}`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg flex items-center gap-2 text-gray-800">
            <AlertCircle size={20} />
            Información de la petición
          </h3>
          <span className={`text-sm px-2 py-1 rounded font-medium
            ${requestInfo.success 
              ? 'text-green-700 bg-green-100' 
              : 'text-red-700 bg-red-100'}`}
          >
            {requestInfo.success ? 'Exitosa' : 'Error'}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <span className="block text-gray-500 text-sm font-medium">Modelo:</span>
            <div className="font-mono text-gray-900 font-semibold">
              {requestInfo.model}
            </div>
          </div>
          <div>
            <span className="block text-gray-500 text-sm font-medium">Duración:</span>
            <div className="font-mono text-gray-900 font-semibold">
              {requestInfo.duration}
            </div>
          </div>
          <div>
            <span className="block text-gray-500 text-sm font-medium">Hora:</span>
            <div className="font-mono text-gray-900 font-semibold">
              {requestInfo.timestamp}
            </div>
          </div>
          {requestInfo.responseLength && (
            <div>
              <span className="block text-gray-500 text-sm font-medium">Caracteres:</span>
              <div className="font-mono text-gray-900 font-semibold">
                {requestInfo.responseLength.toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestInfo;