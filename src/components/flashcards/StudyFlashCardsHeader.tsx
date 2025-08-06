import React from 'react';
import type { StudySession } from '../../types/StudySession';
import Button from '../common/Button';
import { CloseIcon } from '../../icons';

interface StudyFlashCardsHeaderProps {
  currentSession: StudySession;
  progress: {
    current: number;
    total: number;
  };
  onExit: () => void;
}

const StudyFlashCardsHeader: React.FC<StudyFlashCardsHeaderProps> = ({
  currentSession,
  progress,
  onExit,
}) => {
  const getScopeText = () => {
    switch (currentSession.config.scope) {
      case 'all':
        return 'Todas las preguntas';
      case 'range':
        return `Preguntas ${currentSession.config.rangeStart} - ${currentSession.config.rangeEnd}`;
      case 'random':
        return `${currentSession.config.randomCount} preguntas aleatorias`;
      default:
        return '';
    }
  };

  return (
    <div className="bg-white shadow-sm border-b sticky top-0 z-10">
      <div className="container py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-800 flex items-center">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-100 text-blue-600 mr-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              Modo Flashcards
            </h1>
            <p className="text-sm text-gray-600">
              {getScopeText()}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              {progress.current} / {progress.total}
            </div>
            <Button
              onClick={onExit}
              variant="danger"
              buttonType="outline"
              size="sm"
              icon={<CloseIcon />}
              iconPosition="left"
            >
              Salir
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyFlashCardsHeader;
