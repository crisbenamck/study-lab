import React from 'react';
import type { Question } from '../types/Question';
import { downloadQuestionsAsJSON } from '../utils/downloadUtils';

interface HeaderProps {
  questions: Question[];
  onClearAll: () => void;
}

const Header: React.FC<HeaderProps> = ({ questions, onClearAll }) => {
  const handleDownload = () => {
    if (questions.length === 0) {
      alert('No hay preguntas para descargar');
      return;
    }
    downloadQuestionsAsJSON(questions);
  };

  const handleClearAll = () => {
    if (questions.length === 0) {
      alert('No hay preguntas para eliminar');
      return;
    }
    
    const confirmed = window.confirm(
      `¿Estás seguro de que quieres eliminar todas las ${questions.length} preguntas? Esta acción no se puede deshacer.`
    );
    
    if (confirmed) {
      onClearAll();
    }
  };

  return (
    <div className="header">
      <div className="container py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-3">📝</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Generador de Preguntas
              </h1>
              <p className="text-sm text-gray-600">
                {questions.length} pregunta{questions.length !== 1 ? 's' : ''} guardada{questions.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleDownload}
              disabled={questions.length === 0}
              className={`btn ${questions.length > 0 ? 'btn-primary' : ''}`}
            >
              ⬇️ Descargar JSON
            </button>

            <button
              onClick={handleClearAll}
              disabled={questions.length === 0}
              className={`btn ${questions.length > 0 ? 'btn-danger' : ''}`}
            >
              🗑️ Limpiar Todo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
