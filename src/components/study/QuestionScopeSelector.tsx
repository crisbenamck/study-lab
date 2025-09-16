import React, { useState } from 'react';
import Button from '../common/Button';
import { InfoIcon, TargetIcon, RefreshIcon } from '../../icons';
import type { StudyScope } from '../../types/StudySession';

interface QuestionScopeSelectorProps {
  scope: StudyScope | null;
  onScopeChange: (scope: StudyScope | null) => void;
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
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [rangeCardFocused, setRangeCardFocused] = useState(false);
  const [randomCardFocused, setRandomCardFocused] = useState(false);

  // Handlers para el rango específico
  const handleRangeFocusIn = () => {
    setRangeCardFocused(true);
  };

  const handleRangeFocusOut = (e: React.FocusEvent<HTMLButtonElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setRangeCardFocused(false);
    }
  };

  // Handlers para preguntas aleatorias
  const handleRandomFocusIn = () => {
    setRandomCardFocused(true);
  };

  const handleRandomFocusOut = (e: React.FocusEvent<HTMLButtonElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setRandomCardFocused(false);
    }
  };

  const isRangeCardFocused = (focusedInput === 'rangeStart' || focusedInput === 'rangeEnd') || rangeCardFocused;
  const isRandomCardFocused = focusedInput === 'randomCount' || randomCardFocused;

  return (
    <div className="mb-10 pb-8 border-b">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        Preguntas a Estudiar
      </h2>
      
      {/* Información por defecto */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 max-w-none">
          <p className="text-blue-800 text-sm flex-1">
            <strong>Por defecto:</strong> Si no seleccionas ninguna opción específica, la práctica iniciará con todas las preguntas disponibles ({questionsCount} pregunta{questionsCount !== 1 ? 's' : ''}).
          </p>
          {(scope === 'range' || scope === 'random') && (
            <Button
              onClick={() => onScopeChange(null)}
              variant="primary"
              size="sm"
              className="self-start md:ml-4 whitespace-nowrap"
            >
              Usar todas
            </Button>
          )}
        </div>
      </div>
      
      {/* Cards de selección */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Rango específico */}
        <button
          onClick={() => onScopeChange('range')}
          onFocusCapture={handleRangeFocusIn}
          onBlurCapture={handleRangeFocusOut}
          className={`p-6 rounded-xl transition-all duration-200 text-left hover:shadow-md flex flex-col min-h-[140px] focus:outline-2 focus:outline-blue-500 focus:outline-offset-2 ${
            scope === 'range'
              ? 'border-2 border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200'
              : isRangeCardFocused
              ? 'border-2 border-blue-500 bg-blue-50 shadow-lg'
              : 'border border-gray-200'
          }`}
        >
          {/* Sección superior: Icono y textos */}
          <div className="flex-1 mb-4">
            <div className="grid grid-cols-[auto_1fr_auto] gap-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                scope === 'range' || isRangeCardFocused
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                <TargetIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold">
                  Rango específico
                </h3>
                <p className="text-gray-600 text-xs">
                  Ingresa el rango de preguntas a estudiar
                </p>
              </div>
              <div className="flex items-start">
                <InfoIcon 
                  className="text-blue-500" 
                  size="md" 
                  tooltip="Elige preguntas por número (ej: 1-10)"
                />
              </div>
            </div>
          </div>
          
          {/* Sección inferior: Inputs alineados con los textos */}
          <div className="grid grid-cols-[auto_1fr] gap-3">
            <div className="w-12"></div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Desde"
                  value={rangeStart}
                  onChange={(e) => onRangeStartChange(e.target.value)}
                  onClick={(e) => {
                    onScopeChange('range');
                    e.stopPropagation();
                  }}
                  onFocus={() => setFocusedInput('rangeStart')}
                  onBlur={() => setFocusedInput(null)}
                  className="scope-card-input flex-1 min-w-0 p-2 border border-gray-300 rounded-lg text-sm bg-white focus:border-blue-500 focus:outline-none"
                  min="1"
                />
                <span className="text-gray-500 text-sm flex-shrink-0">a</span>
                <input
                  type="number"
                  placeholder="Hasta"
                  value={rangeEnd}
                  onChange={(e) => onRangeEndChange(e.target.value)}
                  onClick={(e) => {
                    onScopeChange('range');
                    e.stopPropagation();
                  }}
                  onFocus={() => setFocusedInput('rangeEnd')}
                  onBlur={() => setFocusedInput(null)}
                  className="scope-card-input flex-1 min-w-0 p-2 border border-gray-300 rounded-lg text-sm bg-white focus:border-blue-500 focus:outline-none"
                  min="1"
                />
              </div>
              {rangeError && (
                <p className="text-red-600 text-xs mt-2">{rangeError}</p>
              )}
            </div>
          </div>
        </button>

        {/* Preguntas aleatorias */}
        <button
          onClick={() => onScopeChange('random')}
          onFocusCapture={handleRandomFocusIn}
          onBlurCapture={handleRandomFocusOut}
          className={`p-6 rounded-xl transition-all duration-200 text-left hover:shadow-md flex flex-col min-h-[140px] focus:outline-2 focus:outline-blue-500 focus:outline-offset-2 ${
            scope === 'random'
              ? 'border-2 border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200'
              : isRandomCardFocused
              ? 'border-2 border-blue-500 bg-blue-50 shadow-lg'
              : 'border border-gray-200'
          }`}
        >
          {/* Sección superior: Icono y textos */}
          <div className="flex-1 mb-4">
            <div className="grid grid-cols-[auto_1fr_auto] gap-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                scope === 'random' || isRandomCardFocused
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                <RefreshIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold">
                  Preguntas aleatorias
                </h3>
                <p className="text-gray-600 text-xs">
                  Selecciona cuántas preguntas aleatorias quieres estudiar
                </p>
              </div>
              <div className="flex items-start">
                <InfoIcon 
                  className="text-blue-500" 
                  size="md" 
                  tooltip="Cantidad fija de preguntas aleatorias"
                />
              </div>
            </div>
          </div>
          
          {/* Sección inferior: Inputs alineados con los textos */}
          <div className="grid grid-cols-[auto_1fr] gap-3">
            <div className="w-12"></div>
            <div className="flex items-center gap-2 min-w-0">
              <input
                type="number"
                placeholder="Cantidad"
                value={randomCount}
                onChange={(e) => onRandomCountChange(e.target.value)}
                onClick={(e) => {
                  onScopeChange('random');
                  e.stopPropagation();
                }}
                onFocus={() => setFocusedInput('randomCount')}
                onBlur={() => setFocusedInput(null)}
                className="scope-card-input flex-1 min-w-0 p-2 border border-gray-300 rounded-lg text-sm bg-white focus:border-blue-500 focus:outline-none"
                min="1"
                max={questionsCount}
              />
              <span className="text-gray-500 text-sm flex-shrink-0">(máx. {questionsCount})</span>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default QuestionScopeSelector;
