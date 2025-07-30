import React, { useState } from 'react';
import type { Question, QuestionFormData } from '../types/Question';
import { formatQuestionNumber } from '../utils/downloadUtils';
import QuestionForm from './QuestionForm';

interface QuestionManagerProps {
  questions: Question[];
  onRemoveQuestion: (questionNumber: number) => void;
  onUpdateQuestion: (questionNumber: number, updatedQuestion: Omit<Question, 'question_number'>) => void;
}

const QuestionManager: React.FC<QuestionManagerProps> = ({ 
  questions, 
  onRemoveQuestion, 
  onUpdateQuestion 
}) => {
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
  };

  const handleCancelEdit = () => {
    setEditingQuestion(null);
  };

  const handleSaveEdit = (formData: QuestionFormData) => {
    if (!editingQuestion) return;

    // Convertir las opciones del formulario al formato correcto
    const optionsWithLetters = formData.options.map((option, index) => ({
      option_letter: String.fromCharCode(65 + index), // A, B, C, D...
      option_text: option.option_text,
      is_correct: option.is_correct
    }));

    onUpdateQuestion(editingQuestion.question_number, {
      question_text: formData.question_text,
      options: optionsWithLetters,
      requires_multiple_answers: formData.requires_multiple_answers,
      explanation: formData.explanation,
      link: formData.link
    });

    setEditingQuestion(null);
  };

  // Convertir Question a QuestionFormData para el formulario de edición
  const questionToFormData = (question: Question): QuestionFormData => {
    return {
      question_text: question.question_text,
      options: question.options.map(option => ({
        option_text: option.option_text,
        is_correct: option.is_correct
      })),
      requires_multiple_answers: question.requires_multiple_answers,
      explanation: question.explanation,
      link: question.link
    };
  };

  if (questions.length === 0) {
    return (
      <div className="question-card container">
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4 text-2xl">📄</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay preguntas guardadas</h3>
          <p className="text-gray-600">Crea preguntas manualmente o importa desde un PDF</p>
        </div>
      </div>
    );
  }

  // Si estamos editando una pregunta, mostrar el formulario
  if (editingQuestion) {
    return (
      <div className="container space-y-6">
        <div className="question-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Editando Pregunta #{formatQuestionNumber(editingQuestion.question_number)}
            </h2>
            <button
              onClick={handleCancelEdit}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              ← Volver a la lista
            </button>
          </div>
          
          <QuestionForm
            onSubmit={handleSaveEdit}
            nextQuestionNumber={editingQuestion.question_number}
            showInitialNumberField={false}
            initialData={questionToFormData(editingQuestion)}
            isEditing={true}
            onCancel={handleCancelEdit}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Preguntas Guardadas ({questions.length})
        </h2>
      </div>

      {questions.map((question, index) => (
        <div key={`${question.question_number}-${index}`} className="question-card">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Pregunta #{formatQuestionNumber(question.question_number)}
            </h3>
            <div className="flex items-center space-x-2">
              {question.requires_multiple_answers && (
                <span className="badge badge-blue">
                  Múltiples respuestas
                </span>
              )}
              <button
                onClick={() => handleEditQuestion(question)}
                className="edit-btn text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded-md border border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                title="Editar pregunta"
              >
                ✏️ Editar
              </button>
              <button
                onClick={() => onRemoveQuestion(question.question_number)}
                className="delete-btn text-red-600 hover:text-red-800"
                title="Eliminar pregunta"
              >
                🗑️
              </button>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-gray-900 leading-relaxed">{question.question_text}</p>
          </div>

          <div className="space-y-2 mb-4">
            {question.options.map((option, optionIndex) => (
              <div
                key={`${question.question_number}-${option.option_letter}-${optionIndex}`}
                className={`option-item ${option.is_correct ? 'correct' : ''}`}
              >
                <div className="option-letter">
                  {option.option_letter}
                </div>
                <span className="flex-1 text-gray-900">{option.option_text}</span>
                <div className="ml-2">
                  {option.is_correct ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-gray-400">✗</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Explicación:</h4>
            <p className="text-gray-600 text-sm leading-relaxed">{question.explanation}</p>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-2">🔗 Fuente:</span>
              <a
                href={question.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 truncate"
              >
                {question.link}
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestionManager;
