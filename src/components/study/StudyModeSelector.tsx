import React from 'react';
import type { StudyMode } from '../../types/StudySession';
import StudyModeCard from './StudyModeCard';
import { FlashcardsIcon, ExamIcon } from '../../icons';

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
      icon: <FlashcardsIcon className="w-6 h-6" />
    },
    {
      id: 'exam' as StudyMode,
      title: 'Examen',
      description: 'Examen con preguntas de opción múltiple. Incluye puntuación y análisis de resultados.',
  icon: <ExamIcon className="w-6 h-6" />
    }
  ];

  return (
    <div className="mb-10 pb-8 border-b theme-transition" style={{ borderColor: 'var(--border-primary)' }}>
      <h2 className="text-2xl font-semibold mb-4 study-section-title">
        Tipo de Práctica
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
