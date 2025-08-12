import React from 'react';
import QuestionForm from '../components/common/QuestionForm';
import PageHeader from '../components/common/PageHeader';
import type { QuestionFormData } from '../types/Question';

interface CreateQuestionPageProps {
  onSubmit: (formData: QuestionFormData) => void;
  nextQuestionNumber: number;
  onSetInitialNumber: (number: number) => void;
  showInitialNumberField: boolean;
}

const CreateQuestionPage: React.FC<CreateQuestionPageProps> = ({
  onSubmit,
  nextQuestionNumber,
  onSetInitialNumber,
  showInitialNumberField
}) => {
  return (
    <div className="container space-y-6 py-16">
      <PageHeader
        title="Crear Nueva Pregunta"
        description="Diseña preguntas efectivas para tus exámenes con opciones múltiples, explicaciones y referencias educativas"
      />
      
      <QuestionForm
        onSubmit={onSubmit}
        nextQuestionNumber={nextQuestionNumber}
        onSetInitialNumber={onSetInitialNumber}
        showInitialNumberField={showInitialNumberField}
      />
    </div>
  );
};

export default CreateQuestionPage;
