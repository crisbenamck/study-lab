import { useState, useCallback, useEffect } from 'react';
import type { StudySession, StudySessionQuestion } from '../types/StudySession';
import type { Question } from '../types/Question';

export const useStudySession = (session: StudySession | null, questions: Question[]) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);

  // Resetear índice cuando cambia la sesión
  useEffect(() => {
    if (session) {
      setCurrentQuestionIndex(0);
      setStartTime(new Date());
    } else {
      setStartTime(null);
    }
  }, [session]);

  // Obtener pregunta actual
  const getCurrentQuestion = useCallback((): Question | null => {
    if (!session || !questions.length) return null;
    
    const currentSessionQuestion = session.questions[currentQuestionIndex];
    if (!currentSessionQuestion) return null;
    
    return questions.find(q => q.question_number === currentSessionQuestion.questionId) || null;
  }, [session, questions, currentQuestionIndex]);

  // Obtener pregunta de sesión actual
  const getCurrentSessionQuestion = useCallback((): StudySessionQuestion | null => {
    if (!session) return null;
    return session.questions[currentQuestionIndex] || null;
  }, [session, currentQuestionIndex]);

  // Navegar a la siguiente pregunta
  const goToNext = useCallback((): boolean => {
    if (!session) return false;
    
    if (currentQuestionIndex < session.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      return true;
    }
    return false;
  }, [session, currentQuestionIndex]);

  // Navegar a la pregunta anterior
  const goToPrevious = useCallback((): boolean => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      return true;
    }
    return false;
  }, [currentQuestionIndex]);

  // Ir a una pregunta específica
  const goToQuestion = useCallback((index: number): boolean => {
    if (!session) return false;
    
    if (index >= 0 && index < session.questions.length) {
      setCurrentQuestionIndex(index);
      return true;
    }
    return false;
  }, [session]);

  // Verificar si una respuesta es correcta
  const checkAnswer = useCallback((selectedOptions: string[], question: Question): boolean => {
    const correctOptions = question.options
      .filter(opt => opt.is_correct)
      .map(opt => opt.option_letter)
      .sort();
    
    const selectedSorted = [...selectedOptions].sort();
    
    return correctOptions.length === selectedSorted.length &&
           correctOptions.every((opt, index) => opt === selectedSorted[index]);
  }, []);

  // Actualizar respuesta de pregunta
  const updateQuestionAnswer = useCallback((
    sessionQuestion: StudySessionQuestion,
    selectedOptions: string[],
    question: Question
  ): StudySessionQuestion => {
    const isCorrect = checkAnswer(selectedOptions, question);
    const now = new Date();
    const timeSpent = startTime ? (now.getTime() - startTime.getTime()) / 1000 : 0;

    return {
      ...sessionQuestion,
      answered: true,
      selectedOptions,
      isCorrect,
      timeSpent: timeSpent,
    };
  }, [checkAnswer, startTime]);

  // Marcar pregunta para revisión
  const toggleMarkForReview = useCallback((questionIndex?: number): boolean => {
    const targetIndex = questionIndex ?? currentQuestionIndex;
    if (!session || targetIndex < 0 || targetIndex >= session.questions.length) {
      return false;
    }
    
    return true; // Se manejará en el componente padre
  }, [session, currentQuestionIndex]);

  // Marcar pregunta como omitida
  const skipQuestion = useCallback((questionIndex?: number): boolean => {
    const targetIndex = questionIndex ?? currentQuestionIndex;
    if (!session || targetIndex < 0 || targetIndex >= session.questions.length) {
      return false;
    }
    
    return true; // Se manejará en el componente padre
  }, [session, currentQuestionIndex]);

  // Calcular progreso
  const getProgress = useCallback(() => {
    if (!session) return { current: 0, total: 0, percentage: 0 };
    
    return {
      current: currentQuestionIndex + 1,
      total: session.questions.length,
      percentage: ((currentQuestionIndex + 1) / session.questions.length) * 100,
    };
  }, [session, currentQuestionIndex]);

  // Obtener estadísticas de la sesión
  const getSessionStats = useCallback(() => {
    if (!session) return {
      answered: 0,
      correct: 0,
      skipped: 0,
      markedForReview: 0,
      total: 0,
    };

    const stats = session.questions.reduce((acc, q) => ({
      answered: acc.answered + (q.answered ? 1 : 0),
      correct: acc.correct + (q.isCorrect ? 1 : 0),
      skipped: acc.skipped + (q.skipped ? 1 : 0),
      markedForReview: acc.markedForReview + (q.markedForReview ? 1 : 0),
      total: acc.total + 1,
    }), {
      answered: 0,
      correct: 0,
      skipped: 0,
      markedForReview: 0,
      total: 0,
    });

    return stats;
  }, [session]);

  // Verificar si la sesión está completa
  const isSessionComplete = useCallback((): boolean => {
    if (!session) return false;
    
    // En modo flash cards, se considera completo cuando se han visto todas las tarjetas
    if (session.config.mode === 'flashcards') {
      return currentQuestionIndex >= session.questions.length - 1;
    }
    
    // En modo test, se considera completo cuando todas las preguntas están respondidas o saltadas
    return session.questions.every(q => q.answered || q.skipped);
  }, [session, currentQuestionIndex]);

  // Verificar si se puede avanzar
  const canGoNext = useCallback((): boolean => {
    if (!session) return false;
    return currentQuestionIndex < session.questions.length - 1;
  }, [session, currentQuestionIndex]);

  // Verificar si se puede retroceder
  const canGoPrevious = useCallback((): boolean => {
    return currentQuestionIndex > 0;
  }, [currentQuestionIndex]);

  // Obtener preguntas pendientes
  const getPendingQuestions = useCallback(() => {
    if (!session) return [];
    
    return session.questions
      .map((q, index) => ({ ...q, index }))
      .filter(q => !q.answered && !q.skipped);
  }, [session]);

  return {
    // Estado
    currentQuestionIndex,
    startTime,

    // Navegación
    goToNext,
    goToPrevious,
    goToQuestion,
    canGoNext,
    canGoPrevious,

    // Datos actuales
    getCurrentQuestion,
    getCurrentSessionQuestion,

    // Acciones sobre preguntas
    updateQuestionAnswer,
    toggleMarkForReview,
    skipQuestion,
    checkAnswer,

    // Estadísticas y progreso
    getProgress,
    getSessionStats,
    isSessionComplete,
    getPendingQuestions,
  };
};
