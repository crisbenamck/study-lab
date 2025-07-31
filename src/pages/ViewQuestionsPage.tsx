import React from 'react';
import QuestionManager from '../components/QuestionManager';
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
    <div className="container space-y-6">
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
