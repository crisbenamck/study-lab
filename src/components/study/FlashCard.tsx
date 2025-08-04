import React, { useState } from 'react';
import type { Question } from '../../types/Question';

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
    <div className="max-w-2xl mx-auto">
      {/* Indicador de progreso */}
      <div className="mb-6">
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

      {/* Tarjeta */}
      <div className="relative h-96 mb-6">
        <div
          className={`absolute inset-0 w-full h-full transition-transform duration-500 transform-style-preserve-3d cursor-pointer ${
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

          {/* Reverso de la tarjeta - Respuestas */}
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

              <div className="flex-1 space-y-3">
                {question.options.map((option, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      option.is_correct
                        ? 'bg-green-100 border-green-300 text-green-800'
                        : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="font-medium mr-2">
                        {option.option_letter}.
                      </span>
                      <span className="flex-1">{option.option_text}</span>
                      {option.is_correct && (
                        <svg className="w-5 h-5 text-green-600 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}

                {/* Explicación */}
                {question.explanation && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Explicación:</h4>
                    <p className="text-blue-700 text-sm">{question.explanation}</p>
                  </div>
                )}

                {/* Enlace */}
                {question.link && (
                  <div className="mt-2">
                    <a
                      href={question.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Ver referencia
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controles de navegación */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={!canGoPrevious}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Anterior
        </button>

        <div className="flex space-x-2">
          <button
            onClick={handleFlip}
            className="px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors"
          >
            {isFlipped ? 'Ver Pregunta' : 'Ver Respuesta'}
          </button>
        </div>

        <button
          onClick={handleNext}
          disabled={!canGoNext}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Siguiente
          <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FlashCard;
