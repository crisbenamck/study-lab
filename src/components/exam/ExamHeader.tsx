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
}) => {
  return (
    <div className="bg-white border-b top-0 z-10">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-100 text-blue-600 mr-3 mt-1">
              <ExamIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
              <p className="text-sm text-gray-600">
                Pregunta {questionIndex + 1} de {totalQuestions}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {typeof timeLeft === 'number' && !isNaN(timeLeft) && timeLeft >= 0 && formatTime(timeLeft) !== '' && (
              <div className={`text-base font-mono ${timeLeft < 300 ? 'text-red-600' : 'text-gray-700'}`}> 
                ⏰ {formatTime(timeLeft)}
              </div>
            )}
            <Button
              onClick={onExit}
              variant="danger"
              buttonType="outline"
              size="sm"
              icon={<CloseIcon />}
              iconPosition="left"
              aria-label="Exit exam"
            >
              Salir
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamHeader;
