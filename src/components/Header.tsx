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
      className="header fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out" 
      style={{ 
        backgroundColor: '#1e3a8a',
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)'
      }}
    >
      <div className="container py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-3">
              <img 
                src="/icons/study-lab-azul-nocturno-optimized.svg" 
                alt="Study Lab" 
                className="w-8 h-8"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#ffffff' }}>
                Study Lab
              </h1>
              <p className="text-sm" style={{ color: '#cbd5e1' }}>
                {questions.length} pregunta{questions.length !== 1 ? 's' : ''} guardada{questions.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          <nav className="flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative py-2 px-4 text-sm font-medium transition-all duration-200"
                  style={{
                    color: isActive ? '#ffffff' : '#cbd5e1',
                    textDecoration: 'none',
                    borderBottom: isActive ? '2px solid #3b82f6' : '2px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#ffffff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#cbd5e1';
                    }
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Header;
