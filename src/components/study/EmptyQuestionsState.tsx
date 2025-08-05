import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import { PlusIcon, UploadIcon } from '../../icons';

const EmptyQuestionsState: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="py-16">
      <div className="text-center max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center">
            <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--space-lg)' }}>
            No hay preguntas disponibles
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
            Necesitas crear algunas preguntas antes de poder estudiar.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => navigate('/create')}
            variant="primary"
            size="lg"
            icon={<PlusIcon />}
            iconPosition="left"
          >
            Crear Preguntas
          </Button>
          <Button
            onClick={() => navigate('/import')}
            variant="secondary"
            buttonType="outline"
            size="lg"
            icon={<UploadIcon />}
            iconPosition="left"
          >
            Importar PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmptyQuestionsState;
