
import React, { useState } from 'react';
import type { Question } from '../../types/Question';
import Button from '../common/Button';
import { ArrowLeftIcon, ArrowRightIcon, EyeIcon } from '../../icons';
import ExplanationReference from '../common/ExplanationReference';

// Card header subcomponent
const CardHeader: React.FC<{ label: string; helper: string }> = ({ label, helper }) => (
  <div className="flex items-center justify-between mb-4">
    <span className="flashcard-header-label text-sm font-medium px-3 py-1 rounded-full border">
      {label}
    </span>
    <span className="text-xs text-tertiary">{helper}</span>
  </div>
);

// Question face subcomponent
const QuestionFace: React.FC<{ question: Question }> = ({ question }) => (
  <div className="p-6 h-full flex flex-col bg-orange-50 flashcard-question-bg rounded-xl">
    <CardHeader label={`Pregunta #${question.question_number}`} helper="Click para ver respuesta" />
    <div className="flex-1 flex items-center justify-center">
      <p className="text-xl text-gray-800 flashcard-question-text text-center leading-relaxed font-medium">
        {question.question_text}
      </p>
    </div>
  </div>
);

// Answer face subcomponent
const AnswerFace: React.FC<{ correctOptions: Question['options']; multi: boolean }> = ({ correctOptions, multi }) => (
  <div className="p-6 h-full flex flex-col bg-green-50 flashcard-answer-bg rounded-xl">
    <CardHeader label={multi ? 'Respuestas Correctas' : 'Respuesta Correcta'} helper="Click para volver" />
    <div className="flex-1 flex flex-col justify-center space-y-4">
      {multi && (
        <div className="text-center mb-2">
          <span className="flashcard-answer-label text-sm font-medium px-3 py-1 rounded-full border" data-testid="flashcard-answer">
            {correctOptions.length} respuestas correctas
          </span>
        </div>
      )}
      {correctOptions.map((option, index) => (
        <span
          key={index}
          className="block text-xl font-medium text-gray-800 flashcard-answer-text text-center"
          data-testid="flashcard-answer"
        >
          {multi && (
            <span className="font-bold text-lg mr-3 bg-purple-100 text-purple-700 rounded-full w-8 h-8 inline-flex items-center justify-center border border-purple-300">
              {index + 1}
            </span>
          )}
          {option.option_text}
        </span>
      ))}
    </div>
  </div>
);

interface FlashCardProps {
  question: Question;
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

const FlashCard: React.FC<FlashCardProps> = ({
  question,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
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
      {/* Centered card */}
      <div className="relative h-96 mb-6 w-full flex justify-center">
        <div
          className={`w-full max-w-2xl h-full transition-transform duration-500 transform-style-preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''
            }`}
          onClick={handleFlip}
        >
          {/* Card front - Question */}
          <div className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-xl shadow-xl border-2 border-orange-200 hover:border-orange-300 hover:shadow-2xl transition-all duration-300 theme-transition flashcard-card-border">
            <QuestionFace question={question} />
          </div>

          {/* Card back - Only correct answers */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-white rounded-xl shadow-xl border-2 border-emerald-200 hover:border-emerald-300 hover:shadow-2xl transition-all duration-300 theme-transition flashcard-card-border">
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
          className="border-gray-300 text-gray-700 bg-white hover:bg-gray-100 hover:border-gray-400 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flashcard-nav-button"
        >
          Anterior
        </Button>

        <div className="flex space-x-2">
          <Button
            onClick={handleFlip}
            variant="info"
            buttonType="solid"
            size="md"
            icon={<EyeIcon />}
            iconPosition="left"
            className="bg-indigo-500 text-white hover:bg-indigo-600 transition-colors duration-200"
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
          className="border-gray-300 text-gray-700 bg-white hover:bg-gray-100 hover:border-gray-400 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flashcard-nav-button"
        >
          Siguiente
        </Button>
      </div>

      {/* Additional info below buttons */}
      <div className="flashcard-explanation-container w-full space-y-4 border-t pt-6 rounded-lg p-4 theme-transition">
        <ExplanationReference explanation={question.explanation} link={question.link} />
      </div>
    </div>
  );
};

export default FlashCard;
