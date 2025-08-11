
import React, { useState } from 'react';
import type { Question } from '../../types/Question';
import Button from '../common/Button';
import { ArrowLeftIcon, ArrowRightIcon, EyeIcon } from '../../icons';
import ExplanationReference from '../common/ExplanationReference';

// Card header subcomponent
const CardHeader: React.FC<{ label: string; helper: string }> = ({ label, helper }) => (
  <div className="flex items-center justify-between mb-4">
    <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
      {label}
    </span>
    <span className="text-xs text-gray-500">{helper}</span>
  </div>
);

// Card footer subcomponent
const CardFooter: React.FC<{ helper: string }> = ({ helper }) => (
  <div className="text-center">
    <div className="inline-flex items-center text-sm text-gray-500">
      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
      </svg>
      {helper}
    </div>
  </div>
);

// Question face subcomponent
const QuestionFace: React.FC<{ question: Question }> = ({ question }) => (
  <div className="p-6 h-full flex flex-col">
    <CardHeader label={`Pregunta #${question.question_number}`} helper="Click para ver respuesta" />
    <div className="flex-1 flex items-center justify-center">
      <p className="text-xl text-gray-800 text-center leading-relaxed">
        {question.question_text}
      </p>
    </div>
    <CardFooter helper="Toca para voltear" />
  </div>
);

// Answer face subcomponent
const AnswerFace: React.FC<{ correctOptions: Question['options']; multi: boolean }> = ({ correctOptions, multi }) => (
  <div className="p-6 h-full flex flex-col">
    <CardHeader label={multi ? 'Respuestas Correctas' : 'Respuesta Correcta'} helper="Click para volver" />
    <div className="flex-1 flex flex-col justify-center space-y-4">
      {multi && (
        <div className="text-center mb-2">
          <span className="text-sm font-medium" data-testid="flashcard-answer">
            {correctOptions.length} respuestas correctas
          </span>
        </div>
      )}
      {correctOptions.map((option, index) => (
        <span
          key={index}
          className="block text-xl font-medium text-gray-800 text-center"
          data-testid="flashcard-answer"
        >
          {multi && (
            <span className="font-bold text-lg mr-3 bg-white rounded-full w-8 h-8 inline-flex items-center justify-center border border-gray-300">
              {index + 1}
            </span>
          )}
          {option.option_text}
        </span>
      ))}
    </div>
    <CardFooter helper="Toca para volver" />
  </div>
);

interface FlashCardProps {
  question: Question;
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  currentIndex: number;
  totalQuestions: number;
}

const FlashCard: React.FC<FlashCardProps> = ({
  question,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
  currentIndex,
  totalQuestions,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    onNext();
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    onPrevious();
  };

  const correctOptions = question.options.filter(opt => opt.is_correct);

  return (
    <div className="w-full max-w-none mx-auto">
      {/* Progress indicator */}
      <div className="mb-6 w-full">
        <div className="flex justify-between text-sm text-gray-600 mb-2 mt-2">
          <span>Pregunta {currentIndex + 1} de {totalQuestions}</span>
          <span>{Math.round(((currentIndex + 1) / totalQuestions) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          ></div>
        </div>
        {/* Add margin between progress bar and below content */}
        <div className="mt-6"></div>
      </div>

      {/* Centered card */}
      <div className="relative h-96 mb-6 w-full flex justify-center">
        <div
          className={`w-full max-w-2xl h-full transition-transform duration-500 transform-style-preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''
            }`}
          onClick={handleFlip}
        >
          {/* Card front - Question */}
          <div className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-lg shadow-lg border-2 border-gray-200 hover:border-blue-300 transition-colors">
            <QuestionFace question={question} />
          </div>

          {/* Card back - Only correct answers */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-white rounded-lg shadow-lg border-2 border-gray-200 hover:border-blue-300 transition-colors">
            <AnswerFace correctOptions={correctOptions} multi={correctOptions.length > 1} />
          </div>
        </div>
      </div>

      {/* Navigation controls */}
      <div className="flex justify-between items-center w-full mb-6">
        <Button
          onClick={handlePrevious}
          disabled={!canGoPrevious}
          variant="secondary"
          buttonType="outline"
          size="md"
          icon={<ArrowLeftIcon />}
          iconPosition="left"
        >
          Anterior
        </Button>

        <div className="flex space-x-2">
          <Button
            onClick={handleFlip}
            variant="info"
            buttonType="outline"
            size="md"
            icon={<EyeIcon />}
            iconPosition="left"
          >
            {isFlipped ? 'Ver Pregunta' : 'Ver Respuesta'}
          </Button>
        </div>

        <Button
          onClick={handleNext}
          disabled={!canGoNext}
          variant="secondary"
          buttonType="outline"
          size="md"
          icon={<ArrowRightIcon />}
          iconPosition="right"
        >
          Siguiente
        </Button>
      </div>

      {/* Additional info below buttons */}
      <div className="w-full space-y-4 border-t pt-6">
        <ExplanationReference explanation={question.explanation} link={question.link} />
      </div>
    </div>
  );
};

export default FlashCard;
