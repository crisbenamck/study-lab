import React from 'react';
import Button from '../common/Button';
import { TargetIcon } from '../icons';
import type { StudyMode } from '../../types/StudySession';

interface StartStudyButtonProps {
  mode: StudyMode;
  onStartSession: () => void;
}

const StartStudyButton: React.FC<StartStudyButtonProps> = ({ mode, onStartSession }) => {
  return (
    <div className="pt-8">
      <Button
        onClick={onStartSession}
        variant="primary"
        size="xl"
        icon={<TargetIcon />}
        iconPosition="left"
      >
        Iniciar {mode === 'flashcards' ? 'Flash Cards' : 'Test'}
      </Button>
    </div>
  );
};

export default StartStudyButton;
