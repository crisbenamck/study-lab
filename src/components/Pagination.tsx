import React, { useState } from 'react';
import Button from './Button';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon
} from './icons';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  questionsPerPage: number;
  totalQuestions: number;
  onPageChange: (page: number) => void;
  onQuestionsPerPageChange: (perPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  questionsPerPage,
  totalQuestions,
  onPageChange,
  onQuestionsPerPageChange
}) => {
  const [pageInputValue, setPageInputValue] = useState('');

  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = Math.min(startIndex + questionsPerPage, totalQuestions);

  // Función para manejar input directo de página
  const handlePageInputSubmit = () => {
    const page = parseInt(pageInputValue);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      setPageInputValue('');
    }
  };

  // Función para generar números de página visibles (máximo 5)
  const getVisiblePageNumbers = () => {
    const delta = 2; // Mostrar 2 páginas a cada lado de la actual
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);
    
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  // Si solo hay una página, no mostrar paginación
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-8 pt-8 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        {/* Información de página y selector de elementos por página */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="text-sm text-gray-600">
            Mostrando <span className="font-medium">{startIndex + 1}</span> a{' '}
            <span className="font-medium">{endIndex}</span> de{' '}
            <span className="font-medium">{totalQuestions}</span> preguntas
          </div>
          
          {/* Selector de elementos por página */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Mostrar:</span>
            <select
              value={questionsPerPage}
              onChange={(e) => onQuestionsPerPageChange(Number(e.target.value))}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-600">por página</span>
          </div>
        </div>
        
        {/* Controles de paginación */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Navegación básica */}
          <div className="flex items-center gap-2">
            {/* Ir al inicio */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              title="Primera página"
            >
              <ChevronDoubleLeftIcon className="w-4 h-4" />
            </Button>
            
            {/* Página anterior */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </Button>
            
            {/* Números de página (máximo 5 visibles) */}
            <div className="flex items-center gap-1 mx-2">
              {getVisiblePageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === page
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            {/* Página siguiente */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRightIcon className="w-4 h-4" />
            </Button>
            
            {/* Ir al final */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              title="Última página"
            >
              <ChevronDoubleRightIcon className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Input directo de página */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Ir a:</span>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={pageInputValue}
              onChange={(e) => setPageInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handlePageInputSubmit()}
              placeholder="Página"
              className="w-20 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Button
              variant="primary"
              size="sm"
              onClick={handlePageInputSubmit}
              disabled={!pageInputValue || parseInt(pageInputValue) < 1 || parseInt(pageInputValue) > totalPages}
            >
              Ir
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
