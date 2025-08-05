import React from 'react';
import { InfoIcon } from '../../icons';
import type { ShowAnswersMode } from '../../types/StudySession';

interface TestConfigurationProps {
  showAnswersMode: ShowAnswersMode;
  onShowAnswersModeChange: (mode: ShowAnswersMode) => void;
  timeLimit: string;
  onTimeLimitChange: (value: string) => void;
}

const TestConfiguration: React.FC<TestConfigurationProps> = ({
  showAnswersMode,
  onShowAnswersModeChange,
  timeLimit,
  onTimeLimitChange,
}) => {
  const answersModes = [
    {
      id: 'immediate' as ShowAnswersMode,
      title: 'Inmediatamente',
      description: 'Después de cada pregunta'
    },
    {
      id: 'end' as ShowAnswersMode,
      title: 'Al finalizar',
      description: 'Todo el test completo'
    }
  ];

  return (
    <div className="mb-10 pb-8 border-b border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        Configuración del Test
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Mostrar respuestas */}
        <div>
          <div className="flex items-start gap-2 mb-3">
            <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)' }}>
              Mostrar Respuestas
            </h3>
            <InfoIcon className="text-blue-500 mt-0.5" size="sm" />
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-sm)' }}>
            Elige cuándo quieres ver las respuestas correctas durante el test
          </p>
          
          <div className="space-y-3">
            {answersModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => onShowAnswersModeChange(mode.id)}
                className={`w-full p-3 rounded-lg border transition-colors text-left ${
                  showAnswersMode === mode.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h4 className="font-medium mb-1">{mode.title}</h4>
                <p className="text-sm text-gray-600">{mode.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Límite de tiempo */}
        <div>
          <div className="flex items-start gap-2 mb-3">
            <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)' }}>
              Límite de Tiempo (opcional)
            </h3>
            <InfoIcon className="text-blue-500 mt-0.5" size="sm" />
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-sm)' }}>
            Establece un tiempo límite para completar el test. Deja vacío para tiempo ilimitado
          </p>
          
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Ej: 30"
              value={timeLimit}
              onChange={(e) => onTimeLimitChange(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-lg"
              min="1"
            />
            <span className="text-gray-500">minutos</span>
          </div>
          <p className="text-gray-500 text-xs mt-2">
            Deja vacío para tiempo ilimitado
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestConfiguration;
