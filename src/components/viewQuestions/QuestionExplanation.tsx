import React from 'react';

interface QuestionExplanationProps {
  explanation: string;
}

const QuestionExplanation: React.FC<QuestionExplanationProps> = ({ explanation }) => {
  if (!explanation || explanation.trim() === '') {
    return (
      <div className="mb-6">
        <h4 className="text-sm font-medium text-secondary mb-2">Explicación:</h4>
        <div className="bg-secondary rounded-lg p-4 border border-primary theme-transition">
          <p className="text-tertiary italic">
            No se proporcionó explicación para esta pregunta.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h4 className="text-sm font-bold text-primary mb-2">Explicación:</h4>
      <div className="bg-theme-info rounded-lg p-4 border border-blue-200 dark:border-blue-700 theme-transition">
        <p className="text-primary leading-relaxed">
          {explanation}
        </p>
      </div>
    </div>
  );
};

export default QuestionExplanation;
