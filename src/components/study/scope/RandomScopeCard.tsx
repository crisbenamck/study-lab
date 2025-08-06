import React from 'react';
import { RefreshIcon } from '../../../icons';
import ScopeCard from './ScopeCard';

interface RandomScopeCardProps {
  isSelected: boolean;
  isFocused: boolean;
  onScopeChange: () => void;
  randomCount: string;
  questionsCount: number;
  onRandomCountChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
}

const RandomScopeCard: React.FC<RandomScopeCardProps> = ({
  isSelected,
  isFocused,
  onScopeChange,
  randomCount,
  questionsCount,
  onRandomCountChange,
  onFocus,
  onBlur,
}) => {
  return (
    <ScopeCard
      isSelected={isSelected}
      isFocused={isFocused}
      onClick={onScopeChange}
      icon={<RefreshIcon className="w-6 h-6" />}
      title="Preguntas aleatorias"
      description="Selecciona cuántas preguntas aleatorias quieres estudiar"
    >
      <input
        type="number"
        placeholder="Cantidad"
        value={randomCount}
        onChange={(e) => onRandomCountChange(e.target.value)}
        onClick={onScopeChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className="flex-1 min-w-0 p-2 border border-gray-300 rounded-lg text-sm bg-white"
        min="1"
        max={questionsCount}
      />
      <span className="text-gray-500 text-sm flex-shrink-0">(máx. {questionsCount})</span>
    </ScopeCard>
  );
};

export default RandomScopeCard;
