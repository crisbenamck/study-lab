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

  const isQuestionManagerActive = questionManagerItems.some(item => location.pathname === item.path);

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out shadow-lg bg-gradient-to-r from-blue-50 via-white to-blue-50 border-b border-blue-100 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-4">
              <img 
                src="/icons/study-lab-azul-nocturno-optimized.svg" 
                alt="Study Lab" 
                className="w-16 h-16 drop-shadow-md"
              />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-slate-800 drop-shadow-sm">
                Study Lab
              </h1>
            </div>
          </div>
          
          <nav className="flex items-center gap-6">
            {/* Enlaces de navegación normales */}
            {navItems.map((item) => {
              // Para el menú "Estudiar", verificar si la ruta actual comienza con "/study"
              const isActive = item.path === '/study' 
                ? location.pathname.startsWith('/study')
                : location.pathname === item.path;
              
              return (
                <div key={item.path} className="relative inline-block">
                  <Link
                    to={item.path}
                    className={`py-2 px-4 text-sm font-medium rounded-md inline-block transition-all duration-200 ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                </div>
              );
            })}

            {/* Dropdown de Gestor de Preguntas */}
            <div className="relative group">
              <div className="relative inline-block">
                <div
                  className={`py-2 px-4 text-sm font-medium rounded-md cursor-pointer transition-all duration-200 flex items-center ${
                    isQuestionManagerActive 
                      ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  Gestor de Preguntas
                  <svg 
                    className="w-4 h-4 ml-1 transform transition-transform group-hover:rotate-180" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
                {/* Badge de notificación para Ver Preguntas */}
                {questions.length > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg">
                    {questions.length}
                  </div>
                )}
              </div>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {questionManagerItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const isQuestionsPage = item.path === '/questions';
                  
                  return (
                    <div key={item.path} className="relative">
                      <Link
                        to={item.path}
                        className={`block px-4 py-3 text-sm hover:bg-gray-50 transition-colors first:rounded-t-md last:rounded-b-md ${
                          isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                        }`}
                      >
                        {item.label}
                      </Link>
                      {/* Badge individual para Ver Preguntas en el dropdown */}
                      {isQuestionsPage && questions.length > 0 && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                          {questions.length}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Header;
