import React from 'react';
import QuestionForm from '../components/QuestionForm';
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
    <div className="container space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Crear Nueva Pregunta
        </h1>
        <p className="text-gray-600">
          Diseña preguntas efectivas para tus exámenes con opciones múltiples, explicaciones y referencias educativas
        </p>
      </div>
      
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
