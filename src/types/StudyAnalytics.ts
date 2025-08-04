export interface QuestionStats {
  questionId: number;
  timesStudied: number;
  timesCorrect: number;
  averageTimeSpent: number;
  lastStudied: Date;
  difficultyScore: number; // 0-1, basado en % de aciertos
}

export interface StudyAnalytics {
  totalSessions: number;
  totalTimeStudied: number; // en minutos
  averageScore: number;
  questionsStats: Record<number, QuestionStats>;
  dailyProgress: Record<string, number>; // fecha -> sesiones completadas
  weakestQuestions: number[]; // question_numbers ordenados por dificultad
  strongestQuestions: number[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DailyProgress {
  date: string;
  sessionsCompleted: number;
  totalTimeStudied: number;
  averageScore: number;
  questionsStudied: number;
}
