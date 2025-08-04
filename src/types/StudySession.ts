export interface StudySessionConfig {
  mode: 'flashcards' | 'test';
  scope: 'all' | 'range' | 'random';
  rangeStart?: number;
  rangeEnd?: number;
  randomCount?: number;
  showAnswersMode: 'immediate' | 'end';
  timeLimit?: number; // en minutos
}

export interface StudySessionQuestion {
  questionId: number; // question_number de la pregunta original
  answered: boolean;
  selectedOptions: string[]; // option_letters seleccionadas
  isCorrect?: boolean;
  timeSpent: number; // en segundos
  markedForReview: boolean;
  skipped: boolean;
}

export interface StudySession {
  id: string; // UUID
  startTime: Date;
  endTime?: Date;
  config: StudySessionConfig;
  questions: StudySessionQuestion[];
  totalQuestions: number;
  correctAnswers: number;
  status: 'in-progress' | 'completed' | 'abandoned';
}

export type StudyMode = 'flashcards' | 'test';
export type StudyScope = 'all' | 'range' | 'random';
export type ShowAnswersMode = 'immediate' | 'end';
export type SessionStatus = 'in-progress' | 'completed' | 'abandoned';
