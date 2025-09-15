import React from 'react';
import type { Question } from '../types/Question';
import Logo from './Header/Logo';
import Navigation from './Header/Navigation';
import QuestionManagerDropdown from './Header/QuestionManagerDropdown';
import ThemeToggle from './Header/ThemeToggle';

interface HeaderProps {
  questions: Question[];
}

const Header: React.FC<HeaderProps> = ({ questions }) => {

  const questionManagerItems = [
    { path: '/study-lab/create', label: 'Crear Preguntas' },
    { path: '/study-lab/questions', label: 'Ver Preguntas' },
    { path: '/study-lab/import', label: 'Importar PDF' }
  ];

  const navItems = [
    { path: '/study-lab/', label: 'Inicio' },
    { path: '/study-lab/study', label: 'Estudiar' }
  ];

  const testApiItem = { path: '/study-lab/gemini-api-test', label: 'Gemini Test API' };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Glass effect background */}
      <div className="absolute inset-0 backdrop-theme border-b border-primary theme-transition" />
      
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
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
