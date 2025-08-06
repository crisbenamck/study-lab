import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { Question } from '../../types/Question';

interface DropdownItem {
  path: string;
  label: string;
}

interface QuestionManagerDropdownProps {
  items: DropdownItem[];
  questions: Question[];
}

const QuestionManagerDropdown: React.FC<QuestionManagerDropdownProps> = ({ 
  items, 
  questions 
}) => {
  const location = useLocation();
  const isActive = items.some(item => location.pathname === item.path);

  return (
    <div className="relative group">
      <div className="relative">
        <div
          className={`relative py-2 text-sm font-medium transition-all duration-200 cursor-pointer flex items-center group-hover:text-blue-600 ${
            isActive ? 'text-blue-600' : 'text-gray-700'
          }`}
        >
          Gestor de Preguntas
          
          {/* Badge entre el texto y el ícono */}
          {questions.length > 0 && (
            <div className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold ml-2 min-w-[20px]">
              {questions.length}
            </div>
          )}
          
          <svg 
            className="w-4 h-4 ml-2 transform transition-transform group-hover:rotate-180" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        {/* Underline indicator for active state */}
        <span 
          className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-200 ${
            isActive 
              ? 'w-full' 
              : 'w-0 group-hover:w-full'
          }`}
        />
      </div>

      {/* Dropdown Menu */}
      <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
        <div className="py-2">
          {items.map((item) => {
            const isItemActive = location.pathname === item.path;
            const isQuestionsPage = item.path === '/questions';
            
            return (
              <div key={item.path} className="relative">
                <Link
                  to={item.path}
                  className={`block px-4 py-3 text-sm transition-colors relative focus:outline-none focus:ring-0 ${
                    isItemActive 
                      ? 'bg-blue-50 text-blue-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                  
                  {/* Badge individual para Ver Preguntas en el dropdown */}
                  {isQuestionsPage && questions.length > 0 && (
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-medium px-1 min-w-[24px]">
                      {questions.length}
                    </span>
                  )}
                </Link>
                
                {/* Active indicator */}
                {isItemActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuestionManagerDropdown;
