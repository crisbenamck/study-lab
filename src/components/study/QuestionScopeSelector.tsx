import React from 'react';
import ScopeSelectorContent from './scope/ScopeSelectorContent';
import type { StudyScope } from '../../types/StudySession';

interface QuestionScopeSelectorProps {
  scope: StudyScope | null;
  onScopeChange: (scope: StudyScope | null) => void;
  questionsCount: number;
  rangeStart: string;
  rangeEnd: string;
  randomCount: string;
  rangeError: string;
  onRangeStartChange: (value: string) => void;
  onRangeEndChange: (value: string) => void;
  onRandomCountChange: (value: string) => void;
}

const QuestionScopeSelector: React.FC<QuestionScopeSelectorProps> = (props) => {
  return (
    <div className="mb-10 pb-8 border-b border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        Preguntas a Estudiar
      </h2>
      
      <ScopeSelectorContent {...props} />
    </div>
  );
};

export default QuestionScopeSelector;
