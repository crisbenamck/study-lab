import React from 'react';
import type { Question } from '../../types/Question';
import { useScrollDirection } from '../../hooks/useScrollDirection';
import Logo from './Logo';
import Navigation from './Navigation';
import QuestionManagerDropdown from './QuestionManagerDropdown';

interface HeaderProps {
  questions: Question[];
}

const Header: React.FC<HeaderProps> = ({ questions }) => {
  const { isVisible } = useScrollDirection();

  const questionManagerItems = [
    { path: '/create', label: 'Crear Preguntas' },
    { path: '/questions', label: 'Ver Preguntas' },
    { path: '/import', label: 'Importar PDF' }
  ];

  const navItems = [
    { path: '/', label: 'Inicio' },
    { path: '/study', label: 'Estudiar' },
    { path: '/test', label: 'Test API' }
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
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
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
