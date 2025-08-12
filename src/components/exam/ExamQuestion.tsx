import React from 'react';

interface Option {
  option_letter: string;
  option_text: string;
  is_correct: boolean;
}

interface ExamQuestionProps {
  questionText: string;
  options: Option[];
  selectedAnswers: string[];
  requiresMultipleAnswers: boolean;
  showAnswers: boolean;
  onSelect: (optionLetter: string) => void;
}

const ExamQuestion: React.FC<ExamQuestionProps> = ({
  questionText,
  options,
  selectedAnswers,
  requiresMultipleAnswers,
  showAnswers,
  onSelect,
}) => (
  <div className="mb-6 h-auto md:h-[400px] overflow-y-auto">
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-gray-800">{questionText}</h2>
    </div>
    <div className="space-y-3">
      {options.map((option) => {
        const isSelected = selectedAnswers.includes(option.option_letter);
        const isCorrect = option.is_correct;
        const shouldShowCorrect = showAnswers && isCorrect;
        const shouldShowIncorrect = showAnswers && isSelected && !isCorrect;
        return (
          <div
            key={option.option_letter}
            className={`p-2 cursor-pointer transition-all ${
              shouldShowCorrect
                ? 'bg-green-50'
                : shouldShowIncorrect
                ? 'bg-red-50'
                : isSelected
                ? 'bg-blue-50'
                : ''
            } ${showAnswers ? 'cursor-default' : ''}`}
            onClick={() => onSelect(option.option_letter)}
          >
            <div className="flex items-center">
              <div className={`w-6 h-6 flex items-center justify-center mr-3 rounded-full border-2 transition-colors
                ${shouldShowCorrect
                  ? 'border-green-500 bg-green-50 text-green-600'
                  : shouldShowIncorrect
                  ? 'border-red-500 bg-red-50 text-red-600'
                  : isSelected
                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                  : 'border-gray-300 bg-white text-gray-400'}
              `}>
                {requiresMultipleAnswers ? (
                  (isSelected || shouldShowCorrect) ? (
                    <span className="text-lg">✓</span>
                  ) : shouldShowIncorrect ? (
                    <span className="text-lg">✗</span>
                  ) : null
                ) : (
                  (isSelected || shouldShowCorrect) ? (
                    <span className="w-3 h-3 bg-current rounded-full block"></span>
                  ) : shouldShowIncorrect ? (
                    <span className="text-lg">✗</span>
                  ) : null
                )}
              </div>
              <span className="font-medium mr-2">{option.option_letter})</span>
              <span className="flex-1">{option.option_text}</span>
              {showAnswers && isCorrect && (
                <span className="text-green-600 ml-2">✓ Correcta</span>
              )}
              {showAnswers && isSelected && !isCorrect && (
                <span className="text-red-600 ml-2">✗ Incorrecta</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default ExamQuestion;
