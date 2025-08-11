import React from 'react';
import Button from '../../components/common/Button';
import { CloseIcon, ExamIcon } from '../../icons';

interface ExamHeaderProps {
  title: string;
  questionIndex: number;
  totalQuestions: number;
  timeLeft?: number | null;
  onExit: () => void;
}

const formatTime = (seconds: number) => {
  if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) return '';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const ExamHeader: React.FC<ExamHeaderProps> = ({
  title,
  questionIndex,
  totalQuestions,
  timeLeft,
  onExit,
}) => (
  <div className="mb-6">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 min-w-12 min-h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-blue-100 text-blue-600`}>
          <div className="w-6 h-6">
            <ExamIcon className="w-full h-full" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          <p className="text-gray-600">
            Pregunta {questionIndex + 1} de {totalQuestions}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          {typeof timeLeft === 'number' && !isNaN(timeLeft) && timeLeft >= 0 && formatTime(timeLeft) !== '' && (
            <div className={`text-lg font-mono ${timeLeft < 300 ? 'text-red-600' : 'text-gray-700'}`}>
              ⏰ {formatTime(timeLeft)}
            </div>
          )}
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
);

export default ExamHeader;
