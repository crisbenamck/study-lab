import React from 'react';
import type { StudyScope } from '../../types/StudySession';

interface QuestionScopeSelectorProps {
  scope: StudyScope;
  onScopeChange: (scope: StudyScope) => void;
  questionsCount: number;
  rangeStart: string;
  rangeEnd: string;
  randomCount: string;
  rangeError: string;
  onRangeStartChange: (value: string) => void;
  onRangeEndChange: (value: string) => void;
  onRandomCountChange: (value: string) => void;
}

const QuestionScopeSelector: React.FC<QuestionScopeSelectorProps> = ({
  scope,
  onScopeChange,
  questionsCount,
  rangeStart,
  rangeEnd,
  randomCount,
  rangeError,
  onRangeStartChange,
  onRangeEndChange,
  onRandomCountChange,
}) => {
  return (
    <div className="mb-10 pb-8 border-b border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        Preguntas a Estudiar
      </h2>
      
      <div className="grid md:grid-cols-3 gap-4">
        {/* Todas las preguntas */}
        <button
          onClick={() => onScopeChange('all')}
          className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
            scope === 'all'
              ? 'border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="text-center">
            <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-sm)' }}>
              Todas las preguntas
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              {questionsCount} pregunta{questionsCount !== 1 ? 's' : ''} disponible{questionsCount !== 1 ? 's' : ''}
            </p>
          </div>
        </button>

        {/* Rango específico */}
        <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
          scope === 'range'
            ? 'border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200'
            : 'border-gray-200'
        }`}>
          <button
            onClick={() => onScopeChange('range')}
            className="w-full text-left mb-3"
          >
            <div className="flex items-start gap-2">
              <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)' }}>
                Rango específico
              </h3>
              <svg className="w-4 h-4 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)' }}>
              Ingresa el rango de preguntas a estudiar
            </p>
          </button>
          
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Desde"
              value={rangeStart}
              onChange={(e) => onRangeStartChange(e.target.value)}
              disabled={scope !== 'range'}
              className="flex-1 p-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-100 disabled:text-gray-500"
              min="1"
            />
            <span className="text-gray-500 text-sm">a</span>
            <input
              type="number"
              placeholder="Hasta"
              value={rangeEnd}
              onChange={(e) => onRangeEndChange(e.target.value)}
              disabled={scope !== 'range'}
              className="flex-1 p-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-100 disabled:text-gray-500"
              min="1"
            />
          </div>
          {rangeError && (
            <p className="text-red-600 text-xs mt-2">{rangeError}</p>
          )}
        </div>

        {/* Preguntas aleatorias */}
        <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
          scope === 'random'
            ? 'border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200'
            : 'border-gray-200'
        }`}>
          <button
            onClick={() => onScopeChange('random')}
            className="w-full text-left mb-3"
          >
            <div className="flex items-start gap-2">
              <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)' }}>
                Preguntas aleatorias
              </h3>
              <svg className="w-4 h-4 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)' }}>
              Selecciona cuántas preguntas aleatorias quieres estudiar
            </p>
          </button>
          
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Cantidad"
              value={randomCount}
              onChange={(e) => onRandomCountChange(e.target.value)}
              disabled={scope !== 'random'}
              className="flex-1 p-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-100 disabled:text-gray-500"
              min="1"
              max={questionsCount}
            />
            <span className="text-gray-500 text-xs">(máx. {questionsCount})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionScopeSelector;
