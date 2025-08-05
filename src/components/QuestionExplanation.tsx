import React from 'react';

interface QuestionExplanationProps {
  explanation: string;
}

const QuestionExplanation: React.FC<QuestionExplanationProps> = ({ explanation }) => {
  if (!explanation || explanation.trim() === '') {
    return (
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Explicación:</h4>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-gray-500 italic">
            No se proporcionó explicación para esta pregunta.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h4 className="text-sm font-medium text-gray-700 mb-2">Explicación:</h4>
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <p className="text-gray-900 leading-relaxed">
          {explanation}
        </p>
      </div>
    </div>
  );
};

export default QuestionExplanation;
