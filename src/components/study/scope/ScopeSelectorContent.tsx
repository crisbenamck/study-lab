import React, { useState } from 'react';
import Button from '../../common/Button';
import RangeScopeCard from './RangeScopeCard';
import RandomScopeCard from './RandomScopeCard';
import type { StudyScope } from '../../../types/StudySession';

interface ScopeSelectorContentProps {
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

const ScopeSelectorContent: React.FC<ScopeSelectorContentProps> = ({
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

  return (
    <>
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between">
          <p className="text-blue-800 text-sm">
            <strong>Por defecto:</strong> Si no seleccionas ninguna opción específica, el test iniciará con todas las preguntas disponibles ({questionsCount} pregunta{questionsCount !== 1 ? 's' : ''}).
          </p>
          {(scope === 'range' || scope === 'random') && (
            <Button
              onClick={() => onScopeChange(null)}
              variant="primary"
              size="sm"
              className="ml-4"
            >
              Usar todas las preguntas
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {/* Rango específico */}
        <RangeScopeCard
          isSelected={scope === 'range'}
          isFocused={focusedInput === 'rangeStart' || focusedInput === 'rangeEnd'}
          onScopeChange={() => onScopeChange('range')}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          rangeError={rangeError}
          onRangeStartChange={onRangeStartChange}
          onRangeEndChange={onRangeEndChange}
          onFocusStart={() => {
            if (scope !== 'range') onScopeChange('range');
            setFocusedInput('rangeStart');
          }}
          onFocusEnd={() => {
            if (scope !== 'range') onScopeChange('range');
            setFocusedInput('rangeEnd');
          }}
          onBlur={() => setFocusedInput(null)}
        />

        {/* Preguntas aleatorias */}
        <RandomScopeCard
          isSelected={scope === 'random'}
          isFocused={focusedInput === 'randomCount'}
          onScopeChange={() => onScopeChange('random')}
          randomCount={randomCount}
          questionsCount={questionsCount}
          onRandomCountChange={onRandomCountChange}
          onFocus={() => {
            if (scope !== 'random') onScopeChange('random');
            setFocusedInput('randomCount');
          }}
          onBlur={() => setFocusedInput(null)}
        />
      </div>
    </>
  );
};

export default ScopeSelectorContent;
