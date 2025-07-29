import { saveAs } from 'file-saver';
import type { Question } from '../types/Question';

export const downloadQuestionsAsJSON = (questions: Question[]) => {
  // Formatear las preguntas con el ID en formato 0001, 0002, etc.
  const formattedQuestions = questions.map(question => ({
    ...question,
    question_number: question.question_number.toString().padStart(4, '0')
  }));

  const jsonString = JSON.stringify(formattedQuestions, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
  
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `questions-${timestamp}.json`;
  
  saveAs(blob, filename);
};

export const formatQuestionNumber = (num: number): string => {
  return num.toString().padStart(4, '0');
};
