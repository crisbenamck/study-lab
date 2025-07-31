import React from 'react';
import type { Question } from '../types/Question';

interface HeaderProps {
  questions: Question[];
}

const Header: React.FC<HeaderProps> = ({ questions }) => {
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
        </div>
      </div>
    </div>
  );
};

export default Header;
