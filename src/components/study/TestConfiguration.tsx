import React from 'react';
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
      description: 'Después de terminar todo el examen'
    }
  ];

  return (
    <div className="mb-10 pb-8 border-b border-gray-light theme-transition">
      <h2 className="text-2xl font-semibold text-primary mb-4">
        Configuración del Examen
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Card: Mostrar respuestas */}
        <div className="p-6 border border-gray-light rounded-xl bg-surface theme-transition">
          <div className="mb-3">
            <h3 className="text-base font-semibold text-primary">
              Mostrar Respuestas
            </h3>
          </div>
            <p className="mb-4 text-sm text-secondary">
            Elige cuándo quieres ver las respuestas correctas durante el examen
            </p>

          <div className="space-y-3">
            {answersModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => onShowAnswersModeChange(mode.id)}
                className={`w-full p-3 rounded-lg border transition-colors text-left theme-transition ${
                  showAnswersMode === mode.id
                    ? 'border-primary bg-primary-50'
                    : 'border-gray-light hover:border-gray'
                }`}
              >
                <h4 className="font-medium mb-1 text-primary">{mode.title}</h4>
                <p className="text-sm text-secondary">{mode.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Card: Límite de tiempo */}
        <div className="p-6 border border-gray-light rounded-xl bg-surface theme-transition">
          <div className="mb-3">
            <h3 className="text-base font-semibold text-primary">
              Límite de Tiempo (opcional)
            </h3>
          </div>
            <p className="mb-4 text-sm text-secondary">
            Establece un tiempo límite para completar el examen. <b>Deja vacío para tiempo ilimitado</b>
            </p>

          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Ej: 30"
              value={timeLimit}
              onChange={(e) => onTimeLimitChange(e.target.value)}
              className="flex-1 p-3 border border-gray rounded-lg bg-background text-primary theme-transition focus:border-primary focus:ring-2 focus:ring-primary-200"
              min="1"
            />
            <span className="text-secondary">minutos</span>
          </div>
          <p className="text-secondary text-xs mt-2">
            Deja vacío para tiempo ilimitado
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestConfiguration;
