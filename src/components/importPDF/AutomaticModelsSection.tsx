import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const AutomaticModelsSection: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-start justify-between space-x-3 text-left focus:outline-none"
      >
        <div className="flex items-start space-x-3 flex-1">
          <div className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5">🤖</div>
          <div className="flex-1">
            <h3 className="font-medium text-blue-800">Sistema de Modelos con Fallback Automático</h3>
            <p className="text-sm text-blue-700 mt-1">
              {isExpanded 
                ? "El sistema usa automáticamente diferentes modelos de Gemini si se agota la cuota diaria:"
                : "Haz clic para ver detalles del sistema de respaldo automático de modelos"
              }
            </p>
          </div>
        </div>
        <div className="flex-shrink-0 mt-0.5">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-blue-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-blue-600" />
          )}
        </div>
      </button>
      
      {isExpanded && (
        <div className="mt-3 pl-8">
          <div className="mt-2 text-xs text-blue-600">
            <p>🥇 <strong>Primero:</strong> gemini-2.5-pro (mejor calidad)</p>
            <p>🥈 <strong>Respaldo 1:</strong> gemini-2.5-flash</p>
            <p>🥉 <strong>Respaldo 2:</strong> gemini-2.5-flash-lite</p>
            <p>🔄 <strong>Respaldo 3:</strong> gemini-2.0-flash-15</p>
            <p>🔄 <strong>Respaldo 4:</strong> gemini-2.0-flash-lite</p>
          </div>
          <p className="text-xs text-blue-500 mt-2">
            💡 Si todos los modelos se agotan, espera unas horas para que se restablezcan las cuotas.
          </p>
        </div>
      )}
    </div>
  );
};

export default AutomaticModelsSection;
