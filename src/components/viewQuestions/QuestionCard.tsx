import React from 'react';
import type { Question } from '../../types/Question';
import { formatQuestionNumber } from '../../utils/downloadUtils';
import Button from '../common/Button';
import QuestionExplanation from './QuestionExplanation';
import QuestionSource from './QuestionSource';
import {
  EditIcon,
  TrashIcon,
  CheckIcon,
  CloseIcon
} from '../../icons';

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
    <div className="bg-elevated rounded-xl shadow-theme-sm border border-primary hover:shadow-theme-md transition-all duration-200 overflow-hidden theme-transition">
      {/* Header de la pregunta */}
      <div className="bg-secondary px-6 py-4 border-b border-primary">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-16 h-10 bg-blue-200 dark:bg-blue-800 rounded-xl flex items-center justify-center mx-2 my-0.5 theme-transition">
              <span className="text-primary font-semibold text-lg tracking-wide select-none">
                {formatQuestionNumber(question.question_number)}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-3 mt-1">
                {question.requires_multiple_answers && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 theme-transition">
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
          <h4 className="text-sm font-bold text-primary mb-2">Pregunta:</h4>
          <p className="text-primary leading-relaxed text-base">
            {question.question_text}
          </p>
        </div>

        {/* Opciones de respuesta */}
        <div className="mb-6">
          <h4 className="text-sm font-bold text-primary mb-3">Opciones de respuesta:</h4>
          <div className="grid gap-3">
            {question.options.map((option, optionIndex) => (
              <div
                key={`${question.question_number}-${option.option_letter}-${optionIndex}`}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors theme-transition ${
                  option.is_correct 
                    ? 'bg-theme-success border-green-200 dark:border-green-700' 
                    : 'bg-secondary border-primary'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold theme-transition ${
                  option.is_correct 
                    ? 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200' 
                    : 'bg-tertiary text-secondary'
                }`}>
                  {option.option_letter}
                </div>
                <span className="flex-1 text-primary">
                  {option.option_text}
                </span>
                <div className="flex items-center">
                  {option.is_correct ? (
                    <CheckIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <CloseIcon className="w-5 h-5 text-tertiary" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

  {/* Explicación */}
  <QuestionExplanation explanation={question.explanation} />

  {/* Fuente/Link */}
  <h4 className="text-sm font-bold text-primary mb-2">Fuente:</h4>
  <QuestionSource link={question.link} />
      </div>
    </div>
  );
};

export default QuestionCard;
