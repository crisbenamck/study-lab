import React from 'react';
import Button from '../../components/common/Button';
import { ArrowLeftIcon, ArrowRightIcon, FileTextIcon, ClipboardIcon } from '../../icons';

interface ExamControlsProps {
  onPrevious: () => void;
  onNext: () => void;
  onSkip: () => void;
  onMarkForReview: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isAnswered: boolean;
  selectedAnswers: string[];
  markedForReview: boolean;
  showExplanation: boolean;
  onToggleExplanation: () => void;
  hasExplanation: boolean;
}

const ExamControls: React.FC<ExamControlsProps> = ({
  onPrevious,
  onNext,
  onSkip,
  onMarkForReview,
  canGoPrevious,
  canGoNext,
  isAnswered,
  selectedAnswers,
  markedForReview,
  showExplanation,
  onToggleExplanation,
  hasExplanation,
}) => (
  <div className="p-0">
    <div className="mb-4 pb-4 border-b border-gray-200">
      <div className="flex space-x-3">
        <Button
          onClick={onMarkForReview}
          variant={markedForReview ? 'warning' : 'secondary'}
          buttonType={markedForReview ? 'solid' : 'outline'}
          size="sm"
          icon={<ClipboardIcon />}
          iconPosition="left"
        >
          {markedForReview ? 'Marcada para revisión' : 'Marcar para revisión'}
        </Button>
        {hasExplanation && (
          <Button
            onClick={onToggleExplanation}
            variant={showExplanation ? 'info' : 'secondary'}
            buttonType="outline"
            size="sm"
            icon={<FileTextIcon />}
            iconPosition="left"
          >
            {showExplanation ? 'Ocultar explicación' : 'Ver explicación'}
          </Button>
        )}
      </div>
    </div>
    <div className="flex justify-between items-center">
      <Button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        variant="secondary"
        buttonType="outline"
        size="md"
        icon={<ArrowLeftIcon />}
        iconPosition="left"
      >
        Anterior
      </Button>
      <div className="flex space-x-3">
        <Button
          onClick={onSkip}
          variant="secondary"
          buttonType="outline"
          size="md"
        >
          Saltar
        </Button>
        <Button
          onClick={onNext}
          disabled={selectedAnswers.length === 0 && !isAnswered}
          variant="primary"
          size="md"
          icon={<ArrowRightIcon />}
          iconPosition="right"
        >
          {canGoNext ? 'Siguiente' : 'Finalizar Test'}
        </Button>
      </div>
    </div>
  </div>
);

export default ExamControls;
