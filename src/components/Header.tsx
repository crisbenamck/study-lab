import React from 'react';
import type { Question } from '../types/Question';
import Logo from './Header/Logo';
import Navigation from './Header/Navigation';
import QuestionManagerDropdown from './Header/QuestionManagerDropdown';

interface HeaderProps {
  questions: Question[];
}

const Header: React.FC<HeaderProps> = ({ questions }) => {

  const questionManagerItems = [
    { path: '/create', label: 'Crear Preguntas' },
    { path: '/questions', label: 'Ver Preguntas' },
    { path: '/import', label: 'Importar PDF' }
  ];

  const navItems = [
    { path: '/', label: 'Inicio' },
    { path: '/study', label: 'Estudiar' }
  ];

  const testApiItem = { path: '/api-test', label: 'Test API' };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Glass effect background */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-md border-b border-gray-200/50" />
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Logo />
          
          <div className="flex items-center gap-12">
            <Navigation items={navItems} />
            <QuestionManagerDropdown 
              items={questionManagerItems} 
              questions={questions} 
            />
            <Navigation items={[testApiItem]} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
