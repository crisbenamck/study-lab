import React from 'react';
import Button from '../common/Button';
import { TargetIcon } from '../../icons';
import type { StudyMode } from '../../types/StudySession';

interface StartStudyButtonProps {
  mode: StudyMode;
  onStartSession: () => void;
}

const StartStudyButton: React.FC<StartStudyButtonProps> = ({ mode, onStartSession }) => {
  return (
    <div className="flex justify-center mt-8">
      <Button
        onClick={onStartSession}
        variant="primary"
        size="xl"
        icon={<TargetIcon />}
        iconPosition="left"
        className="start-study-button"
      >
        Iniciar {mode === 'flashcards' ? 'Flash Cards' : 'Examen'}
      </Button>
    </div>
  );
};

export default StartStudyButton;
