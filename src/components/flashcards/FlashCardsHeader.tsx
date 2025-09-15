import React from 'react';
import type { StudySession } from '../../types/StudySession';
import Button from '../common/Button';
import { CloseIcon } from '../../icons';


interface FlashCardsHeaderProps {
  currentSession: StudySession;
  onExit: () => void;
}

const FlashCardsHeader: React.FC<FlashCardsHeaderProps> = ({
  currentSession,
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
    <div className="bg-surface border-b border-gray-light top-0 z-10 theme-transition">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary-100 text-primary-600 mr-3 mt-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-primary">Modo Flashcards</h1>
              <p className="text-sm text-secondary">{getScopeText()}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
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

export default FlashCardsHeader;
