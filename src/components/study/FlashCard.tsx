import React, { useState } from 'react';
import type { Question } from '../../types/Question';
import Button from '../Button';
import { ArrowLeftIcon, ArrowRightIcon, EyeIcon } from '../icons';

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
      {/* Indicador de progreso */}
      <div className="mb-6 w-full">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Pregunta {currentIndex + 1} de {totalQuestions}</span>
          <span>{Math.round(((currentIndex + 1) / totalQuestions) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Tarjeta centrada */}
      <div className="relative h-96 mb-6 w-full flex justify-center">
        <div
          className={`w-full max-w-2xl h-full transition-transform duration-500 transform-style-preserve-3d cursor-pointer ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          onClick={handleFlip}
        >
          {/* Frente de la tarjeta - Pregunta */}
          <div className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-lg shadow-lg border-2 border-gray-200 hover:border-blue-300 transition-colors">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                  Pregunta #{question.question_number}
                </span>
                <span className="text-xs text-gray-500">
                  Click para ver respuesta
                </span>
              </div>
              
              <div className="flex-1 flex items-center justify-center">
                <p className="text-lg text-gray-800 text-center leading-relaxed">
                  {question.question_text}
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  Toca para voltear
                </div>
              </div>
            </div>
          </div>

          {/* Reverso de la tarjeta - Solo Respuestas Correctas */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg shadow-lg border-2 border-green-200">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">
                  {correctOptions.length > 1 ? 'Respuestas Correctas' : 'Respuesta Correcta'}
                </span>
                <span className="text-xs text-gray-500">
                  Click para volver
                </span>
              </div>

              <div className="flex-1 flex flex-col justify-center space-y-4">
                {correctOptions.length > 1 && (
                  <div className="text-center mb-2">
                    <span className="text-sm font-medium text-green-700 bg-green-200 px-3 py-1 rounded-full">
                      {correctOptions.length} respuestas correctas
                    </span>
                  </div>
                )}
                
                {correctOptions.map((option, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-green-100 border-2 border-green-300 text-green-800"
                  >
                    <div className="flex items-center">
                      {correctOptions.length > 1 && (
                        <span className="font-bold text-lg mr-3 bg-green-200 rounded-full w-8 h-8 flex items-center justify-center">
                          {index + 1}
                        </span>
                      )}
                      <span className="flex-1 text-lg font-medium">{option.option_text}</span>
                      <svg className="w-6 h-6 text-green-600 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <div className="inline-flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  Toca para volver
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controles de navegación */}
      <div className="flex justify-between items-center w-full mb-6">
        <Button
          onClick={handlePrevious}
          disabled={!canGoPrevious}
          variant="secondary"
          buttonType="ghost"
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
          buttonType="ghost"
          size="md"
          icon={<ArrowRightIcon />}
          iconPosition="right"
        >
          Siguiente
        </Button>
      </div>

      {/* Información adicional abajo de los botones */}
      <div className="w-full space-y-4">
        {/* Explicación */}
        {question.explanation && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Explicación:
            </h4>
            <p className="text-blue-700">{question.explanation}</p>
          </div>
        )}

        {/* Enlace */}
        {question.link && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Referencia:
            </h4>
            <a
              href={question.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 break-all"
            >
              {question.link}
              <svg className="w-4 h-4 ml-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashCard;
