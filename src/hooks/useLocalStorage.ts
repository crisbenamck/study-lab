import { useState, useEffect } from 'react';
import type { Question } from '../types/Question';

const STORAGE_KEY = 'question-generator-questions';
const INITIAL_NUMBER_KEY = 'question-generator-initial-number';

export const useLocalStorage = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [initialQuestionNumber, setInitialQuestionNumber] = useState(1);

  // Cargar preguntas del localStorage al inicializar
  useEffect(() => {
    try {
      const storedQuestions = localStorage.getItem(STORAGE_KEY);
      if (storedQuestions) {
        const parsedQuestions = JSON.parse(storedQuestions);
        setQuestions(parsedQuestions);
      }
      
      // Cargar número inicial configurado
      const storedInitialNumber = localStorage.getItem(INITIAL_NUMBER_KEY);
      if (storedInitialNumber) {
        setInitialQuestionNumber(parseInt(storedInitialNumber, 10));
      }
    } catch (error) {
      console.error('Error al cargar preguntas del localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Guardar en localStorage cada vez que cambian las preguntas
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
      } catch (error) {
        console.error('Error al guardar preguntas en localStorage:', error);
      }
    }
  }, [questions, isLoaded]);

  const addQuestion = (newQuestion: Omit<Question, 'question_number'>) => {
    let nextNumber: number;
    
    if (questions.length === 0) {
      // Si es la primera pregunta, usar el número inicial configurado
      nextNumber = initialQuestionNumber;
    } else {
      // Si ya hay preguntas, usar el siguiente número secuencial
      nextNumber = Math.max(...questions.map(q => q.question_number)) + 1;
    }

    const questionWithNumber: Question = {
      ...newQuestion,
      question_number: nextNumber,
    };

    setQuestions(prev => [...prev, questionWithNumber]);
  };

  const addQuestionsWithNumbers = (questionsWithNumbers: Question[]) => {
    setQuestions(prev => [...prev, ...questionsWithNumbers]);
  };

  const removeQuestion = (questionNumber: number) => {
    setQuestions(prev => prev.filter(q => q.question_number !== questionNumber));
  };

  const clearAllQuestions = () => {
    setQuestions([]);
  };

  const getNextQuestionNumber = () => {
    if (questions.length === 0) {
      return initialQuestionNumber;
    }
    return Math.max(...questions.map(q => q.question_number)) + 1;
  };

  const setCustomInitialNumber = (number: number) => {
    setInitialQuestionNumber(number);
    localStorage.setItem(INITIAL_NUMBER_KEY, number.toString());
  };

  return {
    questions,
    addQuestion,
    addQuestionsWithNumbers,
    removeQuestion,
    clearAllQuestions,
    getNextQuestionNumber,
    setCustomInitialNumber,
    initialQuestionNumber,
    isLoaded,
  };
};
