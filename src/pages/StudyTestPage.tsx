import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useStudyStorage } from '../hooks/useStudyStorage';
import { useStudySession } from '../hooks/useStudySession';

const StudyTestPage: React.FC = () => {
  const navigate = useNavigate();
  const { questions } = useLocalStorage();
  const { currentSession, completeSession, updateCurrentSession, isLoaded } = useStudyStorage();

  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [showAnswers, setShowAnswers] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [hasCheckedSession, setHasCheckedSession] = useState(false);

  const {
    currentQuestionIndex,
    goToNext,
    goToPrevious,
    canGoNext,
    canGoPrevious,
    getCurrentQuestion,
    getProgress,
    getSessionStats,
    updateQuestionAnswer,
  } = useStudySession(currentSession, questions);

  // Verificar si hay sesión activa
  useEffect(() => {
    console.log('🧪 StudyTestPage - currentSession:', currentSession, 'isLoaded:', isLoaded);
    
    // Esperar a que se cargue el estado antes de verificar
    if (!isLoaded) {
      console.log('⏳ Esperando a que se cargue el estado...');
      return;
    }

    if (!hasCheckedSession) {
      setHasCheckedSession(true);
      
      // Dar un pequeño delay para asegurar que la sesión se haya creado
      setTimeout(() => {
        if (!currentSession || currentSession.config.mode !== 'test') {
          console.log('❌ No hay sesión válida, redirigiendo a /study');
          navigate('/study');
        } else {
          console.log('✅ Sesión válida encontrada');
          // Configurar timer si hay límite de tiempo
          if (currentSession.config.timeLimit) {
            setTimeLeft(currentSession.config.timeLimit * 60); // convertir a segundos
          }
        }
      }, 100);
    }
  }, [currentSession, navigate, isLoaded, hasCheckedSession]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev && prev <= 1) {
          // Tiempo agotado, finalizar test automáticamente
          if (currentSession) {
            completeSession(currentSession);
            navigate('/study/results');
          }
          return 0;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, currentSession, completeSession, navigate]);

  // Cargar respuestas guardadas cuando cambia la pregunta
  useEffect(() => {
    if (currentSession && currentQuestionIndex !== undefined) {
      const sessionQuestion = currentSession.questions[currentQuestionIndex];
      if (sessionQuestion) {
        setSelectedAnswers(sessionQuestion.selectedOptions);
        setShowAnswers(sessionQuestion.answered && currentSession.config.showAnswersMode === 'immediate');
        setShowExplanation(false); // Ocultar explicación al cambiar de pregunta
      }
    }
  }, [currentQuestionIndex, currentSession]);

  const currentQuestion = getCurrentQuestion();
  const progress = getProgress();
  const sessionStats = getSessionStats();

  if (!currentSession || !currentQuestion) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p className="text-gray-600">Cargando test...</p>
        </div>
      </div>
    );
  }

  // Formatear tiempo restante
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Manejar selección de respuesta
  const handleAnswerSelect = (optionLetter: string) => {
    if (showAnswers) return; // No permitir cambios si ya se muestran las respuestas

    if (currentQuestion.requires_multiple_answers) {
      // Respuesta múltiple
      setSelectedAnswers(prev => {
        if (prev.includes(optionLetter)) {
          return prev.filter(letter => letter !== optionLetter);
        } else {
          return [...prev, optionLetter];
        }
      });
    } else {
      // Respuesta única
      setSelectedAnswers([optionLetter]);
    }
  };

  // Procesar respuesta automáticamente
  const processAnswer = (answers: string[]) => {
    if (answers.length === 0 || !currentSession) return;

    const currentSessionQuestion = currentSession.questions[currentQuestionIndex];
    const updatedQuestion = updateQuestionAnswer(currentSessionQuestion, answers, currentQuestion);
    
    // Actualizar la sesión
    const updatedQuestions = [...currentSession.questions];
    updatedQuestions[currentQuestionIndex] = updatedQuestion;
    
    const correctAnswers = updatedQuestions.filter(q => q.isCorrect).length;
    
    updateCurrentSession({
      questions: updatedQuestions,
      correctAnswers,
    });

    // Mostrar respuestas si la configuración lo permite
    if (currentSession.config.showAnswersMode === 'immediate') {
      setShowAnswers(true);
    }
  };

  // Ir a siguiente pregunta
  const handleNext = () => {
    // Procesar la respuesta actual si hay alguna seleccionada
    if (selectedAnswers.length > 0 && !currentSession?.questions[currentQuestionIndex]?.answered) {
      processAnswer(selectedAnswers);
    }

    if (canGoNext()) {
      setSelectedAnswers([]);
      setShowAnswers(false);
      setShowExplanation(false);
      setStartTime(new Date());
      goToNext();
    } else {
      // Es la última pregunta, finalizar test automáticamente
      if (currentSession) {
        completeSession(currentSession);
        navigate('/study/results');
      }
    }
  };

  // Ir a pregunta anterior
  const handlePrevious = () => {
    if (canGoPrevious()) {
      setShowAnswers(false);
      setShowExplanation(false);
      goToPrevious();
    }
  };

  // Saltar pregunta
  const handleSkip = () => {
    if (!currentSession) return;

    const currentSessionQuestion = currentSession.questions[currentQuestionIndex];
    const updatedQuestion = {
      ...currentSessionQuestion,
      answered: false,
      selectedOptions: [],
      timeSpent: Math.floor((new Date().getTime() - startTime.getTime()) / 1000),
      markedForReview: currentSessionQuestion.markedForReview || false,
      skipped: true,
    };

    // Actualizar la sesión
    const updatedQuestions = [...currentSession.questions];
    updatedQuestions[currentQuestionIndex] = updatedQuestion;
    
    updateCurrentSession({
      questions: updatedQuestions,
    });

    // Avanzar a la siguiente pregunta o finalizar
    if (canGoNext()) {
      setSelectedAnswers([]);
      setShowAnswers(false);
      setShowExplanation(false);
      setStartTime(new Date());
      goToNext();
    } else {
      // Es la última pregunta, finalizar test
      completeSession(currentSession);
      navigate('/study/results');
    }
  };

  // Marcar para revisión
  const handleMarkForReview = () => {
    const currentSessionQuestion = currentSession.questions[currentQuestionIndex];
    const updatedQuestion = {
      ...currentSessionQuestion,
      markedForReview: !currentSessionQuestion.markedForReview,
    };

    // Actualizar la sesión
    const updatedQuestions = [...currentSession.questions];
    updatedQuestions[currentQuestionIndex] = updatedQuestion;
    
    updateCurrentSession({
      questions: updatedQuestions,
    });
  };

  // Salir del test
  const handleExit = () => {
    if (currentSession) {
      completeSession(currentSession);
      navigate('/study/results');
    } else {
      navigate('/study');
    }
  };

  const currentSessionQuestion = currentSession.questions[currentQuestionIndex];
  const isAnswered = currentSessionQuestion?.answered || false;

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header del test */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Test de Práctica
              </h1>
              <p className="text-gray-600">
                Pregunta {currentQuestionIndex! + 1} de {currentSession.totalQuestions}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                {timeLeft !== null && (
                  <div className={`text-lg font-mono ${timeLeft < 300 ? 'text-red-600' : 'text-gray-700'}`}>
                    ⏰ {formatTime(timeLeft)}
                  </div>
                )}
                <div className="text-sm text-gray-600">
                  Correctas: {sessionStats.correct} / {sessionStats.answered}
                </div>
              </div>
              <button
                onClick={handleExit}
                className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 text-sm border border-red-300 rounded-lg hover:border-red-400 transition-colors font-medium"
              >
                Salir
              </button>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Respondidas: {sessionStats.answered}</span>
              <span>Restantes: {sessionStats.total - sessionStats.answered}</span>
            </div>
          </div>
        </div>

        {/* Pregunta */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {currentQuestion.question_text}
            </h2>
          </div>

          {/* Opciones */}
          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedAnswers.includes(option.option_letter);
              const isCorrect = option.is_correct;
              const shouldShowCorrect = showAnswers && isCorrect;
              const shouldShowIncorrect = showAnswers && isSelected && !isCorrect;

              return (
                <div
                  key={option.option_letter}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    shouldShowCorrect
                      ? 'border-green-500 bg-green-50'
                      : shouldShowIncorrect
                      ? 'border-red-500 bg-red-50'
                      : isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${showAnswers ? 'cursor-default' : ''}`}
                  onClick={() => handleAnswerSelect(option.option_letter)}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                      shouldShowCorrect
                        ? 'border-green-500 bg-green-500 text-white'
                        : shouldShowIncorrect
                        ? 'border-red-500 bg-red-500 text-white'
                        : isSelected
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-gray-300'
                    }`}>
                      {currentQuestion.requires_multiple_answers ? (
                        (isSelected || shouldShowCorrect) ? '✓' : shouldShowIncorrect ? '✗' : ''
                      ) : (
                        shouldShowCorrect ? '●' : shouldShowIncorrect ? '✗' : isSelected ? '●' : ''
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

        {/* Controles */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Botón de marcar para revisión y explicación */}
          <div className="mb-4 pb-4 border-b border-gray-200">
            <div className="flex space-x-3">
              <button
                onClick={handleMarkForReview}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  currentSessionQuestion?.markedForReview
                    ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                    : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                {currentSessionQuestion?.markedForReview ? '🔖 Marcada para revisión' : '🔖 Marcar para revisión'}
              </button>
              
              {currentQuestion.explanation && (
                <button
                  onClick={() => setShowExplanation(!showExplanation)}
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    showExplanation
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {showExplanation ? '📖 Ocultar explicación' : '📖 Ver explicación'}
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={!canGoPrevious()}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Anterior
            </button>

            <div className="flex space-x-3">
              <button
                onClick={handleSkip}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Saltar
              </button>
              <button
                onClick={handleNext}
                disabled={selectedAnswers.length === 0 && !isAnswered}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                {canGoNext() ? 'Siguiente →' : 'Finalizar Test'}
              </button>
            </div>
          </div>
        </div>

        {/* Explicación (solo cuando el usuario la solicite) */}
        {showExplanation && currentQuestion.explanation && (
          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Explicación:</h4>
              <p className="text-blue-700">{currentQuestion.explanation}</p>
            </div>

            {/* Link de referencia */}
            {currentQuestion.link && (
              <div className="mt-4">
                <a
                  href={currentQuestion.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline text-sm"
                >
                  📚 Ver referencia
                </a>
              </div>
            )}
          </div>
        )}

        {/* Explicación con respuestas (solo si se muestran respuestas automáticamente) */}
        {showAnswers && !showExplanation && currentQuestion.explanation && (
          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Explicación:</h4>
              <p className="text-blue-700">{currentQuestion.explanation}</p>
            </div>

            {/* Link de referencia */}
            {currentQuestion.link && (
              <div className="mt-4">
                <a
                  href={currentQuestion.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline text-sm"
                >
                  📚 Ver referencia
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyTestPage;
