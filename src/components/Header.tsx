import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { Question } from '../types/Question';
import { useScrollDirection } from '../hooks/useScrollDirection';

interface HeaderProps {
  questions: Question[];
}

const Header: React.FC<HeaderProps> = ({ questions }) => {
  const location = useLocation();
  const { isVisible } = useScrollDirection();

  const navItems = [
    { path: '/', label: 'Crear Preguntas' },
    { path: '/questions', label: 'Ver Preguntas' },
    { path: '/import', label: 'Importar PDF' },
    { path: '/test', label: 'Test API' }
  ];

  return (
    <div 
      className={`header fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out shadow-lg header-gradient ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="container py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-16">
              <img 
                src="/icons/study-lab-azul-nocturno-optimized.svg" 
                alt="Study Lab" 
                className="w-20 h-20 drop-shadow-md"
              />
            </div>
            <div style={{ marginLeft: '16px' }}>
              <h1 className="text-3xl font-bold text-slate-800" style={{ 
                textShadow: '0 1px 2px rgba(255, 255, 255, 0.3)'
              }}>
                Study Lab
              </h1>
            </div>
          </div>
          
          <nav className="flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const isQuestionsPage = item.path === '/questions';
              
              return (
                <div key={item.path} className="relative inline-block">
                  <Link
                    to={item.path}
                    className={`nav-link py-2 px-4 text-sm font-medium rounded-md inline-block ${
                      isActive ? 'nav-link-active' : 'nav-link-inactive'
                    }`}
                  >
                    {item.label}
                  </Link>
                  {isQuestionsPage && questions.length > 0 && (
                    <div className="badge-notification">
                      {questions.length}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Header;
