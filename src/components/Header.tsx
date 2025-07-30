import React from 'react';
import type { Question } from '../types/Question';
import { downloadQuestionsAsJSON } from '../utils/downloadUtils';

interface HeaderProps {
  questions: Question[];
  onClearAll: () => void;
  showAlert: (message: string, options?: { title?: string; type?: 'info' | 'success' | 'warning' | 'error'; buttonText?: string; }) => void;
  showConfirm: (message: string, onConfirm: () => void, options?: { title?: string; confirmText?: string; cancelText?: string; }) => void;
}

const Header: React.FC<HeaderProps> = ({ questions, onClearAll, showAlert, showConfirm }) => {
  const handleDownload = () => {
    if (questions.length === 0) {
      showAlert('No hay preguntas para descargar', {
        title: 'Lista vacía',
        type: 'warning'
      });
      return;
    }
    downloadQuestionsAsJSON(questions);
  };

  const handleClearAll = () => {
    if (questions.length === 0) {
      showAlert('No hay preguntas para eliminar', {
        title: 'Lista vacía',
        type: 'warning'
      });
      return;
    }
    
    showConfirm(
      `¿Estás seguro de que quieres eliminar todas las ${questions.length} preguntas? Esta acción no se puede deshacer.`,
      onClearAll,
      {
        title: 'Confirmar eliminación',
        confirmText: 'Sí, eliminar todo',
        cancelText: 'Cancelar'
      }
    );
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
              className={`btn ${questions.length > 0 ? 'btn-primary' : 'btn-disabled'}`}
            >
              ⬇️ Descargar JSON
            </button>

            <button
              onClick={handleClearAll}
              className={`btn ${questions.length > 0 ? 'btn-danger' : 'btn-disabled'}`}
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
