import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useStudyStorage } from '../hooks/useStudyStorage';
import { useStudySession } from '../hooks/useStudySession';
import Button from '../components/common/Button';
import ExplanationReference from '../components/common/ExplanationReference';
import { CloseIcon, ArrowLeftIcon, ArrowRightIcon, FileTextIcon, ClipboardIcon } from '../icons';

const StudyTestPage: React.FC = () => {
  const navigate = useNavigate();
  const { questions } = useLocalStorage();
  const { currentSession, completeSession, updateCurrentSession, isLoaded, createStudySession } = useStudyStorage();

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
      
      // Verificar si hay una configuración guardada para repetir test
      const repeatConfig = localStorage.getItem('repeat-session-config');
      
      if (repeatConfig && !currentSession) {
        try {
          const config = JSON.parse(repeatConfig);
          console.log('🔄 Configuración para repetir encontrada:', config);
          
          // Crear nueva sesión con la configuración guardada
          const newSession = createStudySession(config, questions);
          console.log('✅ Nueva sesión creada para repetir test');
          
          // Limpiar la configuración temporal
          localStorage.removeItem('repeat-session-config');
          
        } catch (error) {
          console.error('❌ Error al crear sesión para repetir:', error);
          localStorage.removeItem('repeat-session-config');
          navigate('/study');
        }
      } else {
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
    }
  }, [currentSession, navigate, isLoaded, hasCheckedSession, createStudySession, questions]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev && prev <= 1) {
          // Tiempo agotado, finalizar test automáticamente
          if (currentSession) {
            completeSession(currentSession);
            navigate('/study/session-results');
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
        navigate('/study/session-results');
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
      navigate('/study/session-results');
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
      navigate('/study/session-results');
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
              <Button
                onClick={handleExit}
                variant="danger"
                buttonType="outline"
                size="sm"
                icon={<CloseIcon />}
                iconPosition="left"
              >
                Salir
              </Button>
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
              <Button
                onClick={handleMarkForReview}
                variant={currentSessionQuestion?.markedForReview ? "warning" : "secondary"}
                buttonType="outline"
                size="sm"
                icon={<ClipboardIcon />}
                iconPosition="left"
              >
                {currentSessionQuestion?.markedForReview ? 'Marcada para revisión' : 'Marcar para revisión'}
              </Button>
              
              {currentQuestion.explanation && (
                <Button
                  onClick={() => setShowExplanation(!showExplanation)}
                  variant={showExplanation ? "info" : "secondary"}
                  buttonType="outline"
                  size="sm"
                  icon={<FileTextIcon />}
                  iconPosition="left"
                >
                  {showExplanation ? 'Ocultar explicación' : 'Ver explicación'}
                </Button>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Button
              onClick={handlePrevious}
              disabled={!canGoPrevious()}
              variant="secondary"
              buttonType="outline"
              size="md"
              icon={<ArrowLeftIcon />}
              iconPosition="left"
            >
              Anterior
            </Button>

            <div className="flex space-x-3">
              <Button
                onClick={handleSkip}
                variant="secondary"
                buttonType="outline"
                size="md"
              >
                Saltar
              </Button>
              <Button
                onClick={handleNext}
                disabled={selectedAnswers.length === 0 && !isAnswered}
                variant="primary"
                size="md"
                icon={<ArrowRightIcon />}
                iconPosition="right"
              >
                {canGoNext() ? 'Siguiente' : 'Finalizar Test'}
              </Button>
            </div>
          </div>
        </div>

        {/* Explicación (solo cuando el usuario la solicite) */}
        {showExplanation && (currentQuestion.explanation || currentQuestion.link) && (
          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <ExplanationReference explanation={currentQuestion.explanation} link={currentQuestion.link} />
          </div>
        )}

        {/* Explicación con respuestas (solo si se muestran respuestas automáticamente) */}
        {showAnswers && !showExplanation && (currentQuestion.explanation || currentQuestion.link) && (
          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <ExplanationReference explanation={currentQuestion.explanation} link={currentQuestion.link} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyTestPage;
