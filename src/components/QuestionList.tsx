import React from 'react';
import type { Question } from '../types/Question';
import { formatQuestionNumber } from '../utils/downloadUtils';

interface QuestionListProps {
  questions: Question[];
  onRemoveQuestion: (questionNumber: number) => void;
}

const QuestionList: React.FC<QuestionListProps> = ({ questions, onRemoveQuestion }) => {
  if (questions.length === 0) {
    return (
      <div className="question-card container">
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4 text-2xl">📄</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay preguntas guardadas</h3>
          <p className="text-gray-600">Agrega tu primera pregunta usando el formulario de arriba</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container space-y-4">
      {questions.map((question, index) => (
        <div key={`${question.question_number}-${index}`} className="question-card">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Pregunta #{formatQuestionNumber(question.question_number)}
            </h3>
            <div className="flex items-center">
              {question.requires_multiple_answers && (
                <span className="badge badge-blue mr-2">
                  Múltiples respuestas
                </span>
              )}
              <button
                onClick={() => onRemoveQuestion(question.question_number)}
                className="delete-btn text-red-600 hover:text-red-800"
                title="Eliminar pregunta"
              >
                🗑️
              </button>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-gray-900 leading-relaxed">{question.question_text}</p>
          </div>

          <div className="space-y-2 mb-4">
            {question.options.map((option, optionIndex) => (
              <div
                key={`${question.question_number}-${option.option_letter}-${optionIndex}`}
                className={`option-item ${option.is_correct ? 'correct' : ''}`}
              >
                <div className="option-letter">
                  {option.option_letter}
                </div>
                <span className="flex-1 text-gray-900">{option.option_text}</span>
                <div className="ml-2">
                  {option.is_correct ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-gray-400">✗</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Explicación:</h4>
            <p className="text-gray-600 text-sm leading-relaxed">{question.explanation}</p>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-2">🔗 Fuente:</span>
              <a
                href={question.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 truncate"
              >
                {question.link}
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestionList;
