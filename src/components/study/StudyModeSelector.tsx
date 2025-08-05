import React from 'react';
import type { StudyMode } from '../../types/StudySession';

interface StudyModeSelectorProps {
  mode: StudyMode;
  onModeChange: (mode: StudyMode) => void;
}

const StudyModeSelector: React.FC<StudyModeSelectorProps> = ({ mode, onModeChange }) => {
  const modes = [
    {
      id: 'flashcards' as StudyMode,
      title: 'Flash Cards',
      description: 'Tarjetas interactivas con preguntas y respuestas. Perfecto para memorización y repaso rápido.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      id: 'test' as StudyMode,
      title: 'Test de Práctica',
      description: 'Examen con preguntas de opción múltiple. Incluye puntuación y análisis de resultados.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    }
  ];

  return (
    <div className="mb-10 pb-8 border-b border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        Modalidad de Estudio
      </h2>
      
      <div className="grid md:grid-cols-2 gap-4">
        {modes.map((modeOption) => (
          <button
            key={modeOption.id}
            onClick={() => onModeChange(modeOption.id)}
            className={`p-6 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-md ${
              mode === modeOption.id
                ? 'border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                mode === modeOption.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                {modeOption.icon}
              </div>
              <div>
                <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-sm)' }}>
                  {modeOption.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                  {modeOption.description}
                </p>
              </div>
            </div>
            {mode === modeOption.id && (
              <div className="flex items-center gap-2 text-blue-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium">Seleccionado</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StudyModeSelector;
