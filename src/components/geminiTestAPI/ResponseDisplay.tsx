import React from 'react';
import { MessageIcon, ErrorIcon } from '../../icons';

interface ResponseDisplayProps {
  response?: string;
  error?: string;
}

const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ response, error }) => {
  if (error) {
    return (
      <div className="bg-card rounded-lg shadow-sm border border-primary">
        <div className="p-6 border-l-4 border-l-red-500">
          <h3 className="font-semibold text-lg flex items-center gap-2 text-primary mb-4">
            <ErrorIcon className="w-5 h-5" />
            Error
          </h3>
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="text-red-700 text-sm leading-relaxed break-words">
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (response) {
    return (
      <div className="bg-card rounded-lg shadow-sm border border-primary">
        <div className="p-6 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg flex items-center gap-2 text-primary">
              <MessageIcon className="w-5 h-5" />
              Respuesta de Gemini
            </h3>
            <span className="text-sm text-secondary">
              {response.length.toLocaleString()} caracteres
            </span>
          </div>
          <div className="bg-elevated rounded-lg p-4 border border-primary">
            <div className="text-primary leading-relaxed whitespace-pre-wrap">
              {response}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ResponseDisplay;