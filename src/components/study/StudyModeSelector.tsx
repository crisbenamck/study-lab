import React from 'react';
import type { StudyMode } from '../../types/StudySession';
import StudyModeCard from './StudyModeCard';

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
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      id: 'test' as StudyMode,
      title: 'Test de Práctica',
      description: 'Examen con preguntas de opción múltiple. Incluye puntuación y análisis de resultados.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <StudyModeCard
            key={modeOption.id}
            title={modeOption.title}
            description={modeOption.description}
            icon={modeOption.icon}
            isSelected={mode === modeOption.id}
            onClick={() => onModeChange(modeOption.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default StudyModeSelector;
