import React from 'react';
import QuestionForm from '../components/common/QuestionForm';
import PageHeader from '../components/common/PageHeader';
import type { QuestionFormData } from '../types/Question';

interface CreateQuestionPageProps {
  onSubmit: (formData: QuestionFormData) => void;
  nextQuestionNumber: number;
  // Removed unused props
}

const CreateQuestionPage: React.FC<CreateQuestionPageProps> = ({
  onSubmit,
  nextQuestionNumber,
  // Removed unused props
}) => {
  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        <PageHeader
          title="Crear Nueva Pregunta"
          description="Diseña preguntas efectivas para tus exámenes con opciones múltiples, explicaciones y referencias educativas"
        />
        <QuestionForm
          onSubmit={onSubmit}
          nextQuestionNumber={nextQuestionNumber}
        />
      </div>
    </div>
  );
};

export default CreateQuestionPage;
