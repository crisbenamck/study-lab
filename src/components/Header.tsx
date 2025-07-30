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

    const questionCount = questions.length;
    const questionText = questionCount === 1 ? 'pregunta' : 'preguntas';
    
    showConfirm(
      `¿Estás seguro de que quieres descargar ${questionCount} ${questionText} en formato JSON?`,
      () => downloadQuestionsAsJSON(questions),
      {
        title: 'Descargar Preguntas',
        confirmText: 'Sí, Descargar',
        cancelText: 'Cancelar'
      }
    );
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
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
              disabled={questions.length === 0}
              style={{
                backgroundColor: questions.length > 0 ? '#2563eb' : '#e5e7eb',
                color: questions.length > 0 ? '#ffffff' : '#9ca3af',
                border: `1px solid ${questions.length > 0 ? '#2563eb' : '#e5e7eb'}`,
                boxShadow: questions.length > 0 ? '0 1px 3px 0 rgba(0, 0, 0, 0.1)' : 'none',
                cursor: questions.length > 0 ? 'pointer' : 'not-allowed'
              }}
              onMouseEnter={(e) => {
                if (questions.length > 0) {
                  e.currentTarget.style.backgroundColor = '#1d4ed8';
                  e.currentTarget.style.borderColor = '#1d4ed8';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (questions.length > 0) {
                  e.currentTarget.style.backgroundColor = '#2563eb';
                  e.currentTarget.style.borderColor = '#2563eb';
                  e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              ⬇️ Descargar JSON
            </button>

            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-300"
              disabled={questions.length === 0}
              style={{
                backgroundColor: questions.length > 0 ? '#ef4444' : '#e5e7eb',
                color: questions.length > 0 ? '#ffffff' : '#9ca3af',
                border: `1px solid ${questions.length > 0 ? '#ef4444' : '#e5e7eb'}`,
                boxShadow: questions.length > 0 ? '0 1px 3px 0 rgba(0, 0, 0, 0.1)' : 'none',
                cursor: questions.length > 0 ? 'pointer' : 'not-allowed'
              }}
              onMouseEnter={(e) => {
                if (questions.length > 0) {
                  e.currentTarget.style.backgroundColor = '#dc2626';
                  e.currentTarget.style.borderColor = '#dc2626';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (questions.length > 0) {
                  e.currentTarget.style.backgroundColor = '#ef4444';
                  e.currentTarget.style.borderColor = '#ef4444';
                  e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              🗑️ Borrar todas las preguntas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
