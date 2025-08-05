import React from 'react';
import type { Question } from '../types/Question';
import { formatQuestionNumber } from '../utils/downloadUtils';
import Button from './Button';
import QuestionExplanation from './QuestionExplanation';
import QuestionSource from './QuestionSource';
import {
  EditIcon,
  TrashIcon,
  CheckIcon,
  CloseIcon
} from './icons';

interface QuestionCardProps {
  question: Question;
  onEdit: (question: Question) => void;
  onDelete: (questionNumber: number) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ 
  question, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Header de la pregunta */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">
                #{formatQuestionNumber(question.question_number)}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-3 mt-1">
                {question.requires_multiple_answers && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Múltiples respuestas
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => onEdit(question)}
            >
              <EditIcon className="w-4 h-4" />
              Editar
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete(question.question_number)}
            >
              <TrashIcon className="w-4 h-4" />
              Eliminar
            </Button>
          </div>
        </div>
      </div>

      {/* Contenido de la pregunta */}
      <div className="p-6">
        {/* Texto de la pregunta */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Pregunta:</h4>
          <p className="text-gray-900 leading-relaxed text-base">
            {question.question_text}
          </p>
        </div>

        {/* Opciones de respuesta */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Opciones de respuesta:</h4>
          <div className="grid gap-3">
            {question.options.map((option, optionIndex) => (
              <div
                key={`${question.question_number}-${option.option_letter}-${optionIndex}`}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  option.is_correct 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  option.is_correct 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {option.option_letter}
                </div>
                <span className="flex-1 text-gray-900">
                  {option.option_text}
                </span>
                <div className="flex items-center">
                  {option.is_correct ? (
                    <CheckIcon className="w-5 h-5 text-green-600" />
                  ) : (
                    <CloseIcon className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Explicación */}
        <QuestionExplanation explanation={question.explanation} />

        {/* Fuente/Link */}
        <QuestionSource link={question.link} />
      </div>
    </div>
  );
};

export default QuestionCard;
