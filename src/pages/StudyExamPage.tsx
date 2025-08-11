import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useStudyStorage } from '../hooks/useStudyStorage';
import { useStudySession } from '../hooks/useStudySession';
import { ExamHeader, ExamQuestion, ExamControls } from '../components/exam';
import ExplanationReference from '../components/common/ExplanationReference';

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

  // Robust session validation and logging (in English)
  // Utility for contextual logging
  const log = (message: string, ...args: unknown[]) => {
    // Enhanced logging for development
    if (process.env.NODE_ENV !== 'production') {
      // Only log if not the 'Questions:' or 'Mode: exam' message
      if (message !== 'Questions:' && message !== 'Mode: exam') {
        console.log(`[StudyExamPage] ${message}`, ...args);
      }
    }
  };

  useEffect(() => {
    // Wait for state to load before validating session
    if (!isLoaded) {
      log('Waiting for state to load...');
      return;
    }
    if (!hasCheckedSession) {
      setHasCheckedSession(true);
      const repeatConfig = localStorage.getItem('repeat-session-config');
      if (repeatConfig && !currentSession) {
        try {
          const config = JSON.parse(repeatConfig);
          log('Repeat session config found:', config);
          createStudySession(config, questions);
          localStorage.removeItem('repeat-session-config');
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('[StudyExamPage] Error creating repeat session:', error);
          localStorage.removeItem('repeat-session-config');
          navigate('/study');
        }
      } else {
        setTimeout(() => {
          let session = currentSession;
          if (!session) {
            const stored = localStorage.getItem('study-lab-current-session');
            if (stored) {
              try {
                const parsed = JSON.parse(stored);
                session = {
                  ...parsed,
                  startTime: new Date(parsed.startTime),
                  endTime: parsed.endTime ? new Date(parsed.endTime) : undefined,
                };
              } catch {
                session = null;
              }
            }
          }
          // Only allow mode 'exam' for this page
          if (!session || session.config.mode !== 'exam') {
            log('No valid session found, redirecting to /study');
            navigate('/study');
          } else {
            log('Valid session found');
            if (session.config.timeLimit) {
              setTimeLeft(session.config.timeLimit * 60);
            }
          }
        }, 250);
      }
    }
  }, [currentSession, navigate, isLoaded, hasCheckedSession, createStudySession, questions]);

  // Timer countdown for exam mode
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev && prev <= 1) {
          // Time is up, finish the exam automatically
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

  // Load saved answers when the question changes
  useEffect(() => {
    if (currentSession && currentQuestionIndex !== undefined) {
      const sessionQuestion = currentSession.questions[currentQuestionIndex];
      if (sessionQuestion) {
        setSelectedAnswers(sessionQuestion.selectedOptions);
        setShowAnswers(sessionQuestion.answered && currentSession.config.showAnswersMode === 'immediate');
        setShowExplanation(false); // Hide explanation when changing question
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

  // ...existing code...

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
        <ExamHeader
          title="Modo Examen"
          questionIndex={currentQuestionIndex!}
          totalQuestions={currentSession.totalQuestions}
          timeLeft={timeLeft ?? undefined}
          onExit={handleExit}
        />
        {/* Barra de progreso */}
        <div className="mt-4">
          <div className="w-full h-2 bg-gray-100">
            <div
              className="bg-blue-500 h-2 transition-all duration-300"
              style={{ width: `${progress.percentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Respondidas: {sessionStats.answered}</span>
            <span>Restantes: {sessionStats.total - sessionStats.answered}</span>
          </div>
        </div>
        <ExamQuestion
          questionText={currentQuestion.question_text}
          options={currentQuestion.options}
          selectedAnswers={selectedAnswers}
          requiresMultipleAnswers={currentQuestion.requires_multiple_answers}
          showAnswers={showAnswers}
          onSelect={handleAnswerSelect}
        />
        <ExamControls
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSkip={handleSkip}
          onMarkForReview={handleMarkForReview}
          canGoPrevious={canGoPrevious()}
          canGoNext={canGoNext()}
          isAnswered={isAnswered}
          selectedAnswers={selectedAnswers}
          markedForReview={currentSessionQuestion?.markedForReview}
          showExplanation={showExplanation}
          onToggleExplanation={() => setShowExplanation(!showExplanation)}
          hasExplanation={!!currentQuestion.explanation}
        />
        {/* Explicación (solo cuando el usuario la solicite) */}
        {showExplanation && (currentQuestion.explanation || currentQuestion.link) && (
          <div className="mt-6">
            <ExplanationReference explanation={currentQuestion.explanation} link={currentQuestion.link} />
          </div>
        )}
        {/* Explicación con respuestas (solo si se muestran respuestas automáticamente) */}
        {showAnswers && !showExplanation && (currentQuestion.explanation || currentQuestion.link) && (
          <div className="mt-6">
            <ExplanationReference explanation={currentQuestion.explanation} link={currentQuestion.link} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyTestPage;
