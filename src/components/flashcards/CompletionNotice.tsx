import React from 'react';
import Button from '../common/Button';
import { CheckIcon } from '../../icons';

interface CompletionNoticeProps {
  isLastQuestion: boolean;
  onComplete: () => void;
}

const CompletionNotice: React.FC<CompletionNoticeProps> = ({
  isLastQuestion,
  onComplete,
}) => {
  if (!isLastQuestion) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto mt-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <p className="text-green-800 mb-3">
          🎉 ¡Has llegado al final de las flash cards!
        </p>
        <Button
          onClick={onComplete}
          variant="success"
          size="md"
          icon={<CheckIcon />}
          iconPosition="left"
        >
          Completar Sesión
        </Button>
      </div>
    </div>
  );
};

export default CompletionNotice;
