import React from 'react';
import QuestionManager from '../components/viewQuestions/QuestionManager';
import PageHeader from '../components/common/PageHeader';
import type { Question } from '../types/Question';

interface ViewQuestionsPageProps {
  questions: Question[];
  onRemoveQuestion: (questionNumber: number) => void;
  onUpdateQuestion: (questionNumber: number, updatedQuestion: Omit<Question, 'question_number'>) => void;
  onClearAll: () => void;
  showAlert: (message: string, options?: { title?: string; type?: 'info' | 'success' | 'warning' | 'error'; buttonText?: string; }) => void;
  showConfirmModal: (message: string, onConfirm: () => void, options?: { title?: string; confirmText?: string; cancelText?: string; }) => void;
}

const ViewQuestionsPage: React.FC<ViewQuestionsPageProps> = ({
  questions,
  onRemoveQuestion,
  onUpdateQuestion,
  onClearAll,
  showAlert,
  showConfirmModal
}) => {
  return (
  <div className="container space-y-6 py-8">
      <PageHeader
        title="Gestión de Preguntas"
        description="Organiza y gestiona tu biblioteca de preguntas de manera eficiente. Edita, elimina y descarga tu contenido cuando lo necesites."
      />
      <QuestionManager
        questions={questions}
        onRemoveQuestion={onRemoveQuestion}
        onUpdateQuestion={onUpdateQuestion}
        onClearAll={onClearAll}
        showAlert={showAlert}
        showConfirmModal={showConfirmModal}
      />
    </div>
  );
};

export default ViewQuestionsPage;
