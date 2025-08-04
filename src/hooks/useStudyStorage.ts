import { useState, useEffect, useCallback } from 'react';
import type { StudySession, StudySessionConfig, StudySessionQuestion } from '../types/StudySession';
import type { StudyAnalytics, QuestionStats } from '../types/StudyAnalytics';
import type { Question } from '../types/Question';

const STUDY_SESSIONS_KEY = 'study-lab-sessions';
const STUDY_ANALYTICS_KEY = 'study-lab-analytics';
const CURRENT_SESSION_KEY = 'study-lab-current-session';

export const useStudyStorage = () => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [analytics, setAnalytics] = useState<StudyAnalytics | null>(null);
  const [currentSession, setCurrentSession] = useState<StudySession | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Generar ID único para sesiones
  const generateSessionId = (): string => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Cargar datos del localStorage al inicializar
  useEffect(() => {
    try {
      // Cargar sesiones
      const storedSessions = localStorage.getItem(STUDY_SESSIONS_KEY);
      if (storedSessions) {
        const parsedSessions = JSON.parse(storedSessions);
        // Convertir strings de fecha de vuelta a Date objects
        const sessionsWithDates = parsedSessions.map((session: StudySession & { startTime: string; endTime?: string }) => ({
          ...session,
          startTime: new Date(session.startTime),
          endTime: session.endTime ? new Date(session.endTime) : undefined,
        }));
        setSessions(sessionsWithDates);
      }

      // Cargar analytics
      const storedAnalytics = localStorage.getItem(STUDY_ANALYTICS_KEY);
      if (storedAnalytics) {
        const parsedAnalytics = JSON.parse(storedAnalytics);
        // Convertir dates en analytics
        const analyticsWithDates = {
          ...parsedAnalytics,
          createdAt: new Date(parsedAnalytics.createdAt),
          updatedAt: new Date(parsedAnalytics.updatedAt),
          questionsStats: Object.keys(parsedAnalytics.questionsStats).reduce((acc, key) => {
            acc[parseInt(key)] = {
              ...parsedAnalytics.questionsStats[key],
              lastStudied: new Date(parsedAnalytics.questionsStats[key].lastStudied)
            };
            return acc;
          }, {} as Record<number, QuestionStats>)
        };
        setAnalytics(analyticsWithDates);
      }

      // Cargar sesión actual si existe
      const storedCurrentSession = localStorage.getItem(CURRENT_SESSION_KEY);
      if (storedCurrentSession) {
        const parsedCurrentSession = JSON.parse(storedCurrentSession);
        const sessionWithDates = {
          ...parsedCurrentSession,
          startTime: new Date(parsedCurrentSession.startTime),
          endTime: parsedCurrentSession.endTime ? new Date(parsedCurrentSession.endTime) : undefined,
        };
        setCurrentSession(sessionWithDates);
      }
    } catch (error) {
      console.error('Error al cargar datos de estudio del localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Guardar sesiones en localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STUDY_SESSIONS_KEY, JSON.stringify(sessions));
      } catch (error) {
        console.error('Error al guardar sesiones en localStorage:', error);
      }
    }
  }, [sessions, isLoaded]);

  // Guardar analytics en localStorage
  useEffect(() => {
    if (isLoaded && analytics) {
      try {
        localStorage.setItem(STUDY_ANALYTICS_KEY, JSON.stringify(analytics));
      } catch (error) {
        console.error('Error al guardar analytics en localStorage:', error);
      }
    }
  }, [analytics, isLoaded]);

  // Guardar sesión actual en localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        if (currentSession) {
          localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(currentSession));
        } else {
          localStorage.removeItem(CURRENT_SESSION_KEY);
        }
      } catch (error) {
        console.error('Error al guardar sesión actual en localStorage:', error);
      }
    }
  }, [currentSession, isLoaded]);

  // Crear nueva sesión de estudio
  const createStudySession = useCallback((config: StudySessionConfig, questions: Question[]): StudySession => {
    let selectedQuestions: Question[] = [];

    // Seleccionar preguntas según configuración
    switch (config.scope) {
      case 'all':
        selectedQuestions = [...questions];
        break;
      case 'range':
        if (config.rangeStart && config.rangeEnd) {
          selectedQuestions = questions.filter(q => 
            q.question_number >= config.rangeStart! && 
            q.question_number <= config.rangeEnd!
          );
        }
        break;
      case 'random': {
        const shuffled = [...questions].sort(() => Math.random() - 0.5);
        const count = Math.min(config.randomCount || 60, questions.length);
        selectedQuestions = shuffled.slice(0, count);
        break;
      }
    }

    // Crear preguntas de sesión
    const sessionQuestions: StudySessionQuestion[] = selectedQuestions.map(q => ({
      questionId: q.question_number,
      answered: false,
      selectedOptions: [],
      timeSpent: 0,
      markedForReview: false,
      skipped: false,
    }));

    const newSession: StudySession = {
      id: generateSessionId(),
      startTime: new Date(),
      config,
      questions: sessionQuestions,
      totalQuestions: selectedQuestions.length,
      correctAnswers: 0,
      status: 'in-progress',
    };

    setCurrentSession(newSession);
    return newSession;
  }, []);

  // Actualizar sesión actual
  const updateCurrentSession = useCallback((updates: Partial<StudySession>) => {
    if (currentSession) {
      const updatedSession = { ...currentSession, ...updates };
      setCurrentSession(updatedSession);
    }
  }, [currentSession]);

  // Actualizar analytics
  const updateAnalytics = useCallback((completedSession: StudySession) => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    setAnalytics(prev => {
      const newAnalytics: StudyAnalytics = prev || {
        totalSessions: 0,
        totalTimeStudied: 0,
        averageScore: 0,
        questionsStats: {},
        dailyProgress: {},
        weakestQuestions: [],
        strongestQuestions: [],
        createdAt: now,
        updatedAt: now,
      };

      // Actualizar estadísticas generales
      const sessionDuration = completedSession.endTime 
        ? (completedSession.endTime.getTime() - completedSession.startTime.getTime()) / (1000 * 60) 
        : 0;
      
      const sessionScore = completedSession.totalQuestions > 0 
        ? (completedSession.correctAnswers / completedSession.totalQuestions) * 100 
        : 0;

      // Actualizar estadísticas por pregunta
      const updatedQuestionStats = { ...newAnalytics.questionsStats };
      
      completedSession.questions.forEach(sq => {
        if (!updatedQuestionStats[sq.questionId]) {
          updatedQuestionStats[sq.questionId] = {
            questionId: sq.questionId,
            timesStudied: 0,
            timesCorrect: 0,
            averageTimeSpent: 0,
            lastStudied: now,
            difficultyScore: 0,
          };
        }

        const stats = updatedQuestionStats[sq.questionId];
        const newTimesStudied = stats.timesStudied + 1;
        const newTimesCorrect = stats.timesCorrect + (sq.isCorrect ? 1 : 0);
        const newAverageTime = ((stats.averageTimeSpent * stats.timesStudied) + sq.timeSpent) / newTimesStudied;

        updatedQuestionStats[sq.questionId] = {
          ...stats,
          timesStudied: newTimesStudied,
          timesCorrect: newTimesCorrect,
          averageTimeSpent: newAverageTime,
          lastStudied: now,
          difficultyScore: 1 - (newTimesCorrect / newTimesStudied),
        };
      });

      // Calcular nuevos promedios
      const newTotalSessions = newAnalytics.totalSessions + 1;
      const newTotalTime = newAnalytics.totalTimeStudied + sessionDuration;
      const newAverageScore = ((newAnalytics.averageScore * newAnalytics.totalSessions) + sessionScore) / newTotalSessions;

      // Actualizar progreso diario
      const updatedDailyProgress = { ...newAnalytics.dailyProgress };
      updatedDailyProgress[today] = (updatedDailyProgress[today] || 0) + 1;

      // Calcular preguntas más débiles y más fuertes
      const questionStatsList = Object.values(updatedQuestionStats);
      const sortedByDifficulty = [...questionStatsList].sort((a, b) => b.difficultyScore - a.difficultyScore);
      
      return {
        ...newAnalytics,
        totalSessions: newTotalSessions,
        totalTimeStudied: newTotalTime,
        averageScore: newAverageScore,
        questionsStats: updatedQuestionStats,
        dailyProgress: updatedDailyProgress,
        weakestQuestions: sortedByDifficulty.slice(0, 10).map(s => s.questionId),
        strongestQuestions: sortedByDifficulty.slice(-10).map(s => s.questionId).reverse(),
        updatedAt: now,
      };
    });
  }, []);

  // Completar sesión
  const completeSession = useCallback((session: StudySession) => {
    const completedSession = {
      ...session,
      endTime: new Date(),
      status: 'completed' as const,
    };

    // Agregar a la lista de sesiones
    setSessions(prev => [...prev, completedSession]);
    
    // Actualizar analytics
    updateAnalytics(completedSession);
    
    // Limpiar sesión actual
    setCurrentSession(null);

    return completedSession;
  }, [updateAnalytics]);

  // Abandonar sesión actual
  const abandonSession = useCallback(() => {
    if (currentSession) {
      const abandonedSession = {
        ...currentSession,
        endTime: new Date(),
        status: 'abandoned' as const,
      };
      setSessions(prev => [...prev, abandonedSession]);
      setCurrentSession(null);
    }
  }, [currentSession]);

  // Limpiar todos los datos de estudio
  const clearAllStudyData = useCallback(() => {
    setSessions([]);
    setAnalytics(null);
    setCurrentSession(null);
    localStorage.removeItem(STUDY_SESSIONS_KEY);
    localStorage.removeItem(STUDY_ANALYTICS_KEY);
    localStorage.removeItem(CURRENT_SESSION_KEY);
  }, []);

  return {
    // Estado
    sessions,
    analytics,
    currentSession,
    isLoaded,

    // Acciones
    createStudySession,
    updateCurrentSession,
    completeSession,
    abandonSession,
    updateAnalytics,
    clearAllStudyData,

    // Utilidades
    generateSessionId,
  };
};
