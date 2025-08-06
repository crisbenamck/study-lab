import React from 'react';
import { TargetIcon } from '../../../icons';
import ScopeCard from './ScopeCard';

interface RangeScopeCardProps {
  isSelected: boolean;
  isFocused: boolean;
  onScopeChange: () => void;
  rangeStart: string;
  rangeEnd: string;
  rangeError: string;
  onRangeStartChange: (value: string) => void;
  onRangeEndChange: (value: string) => void;
  onFocusStart: () => void;
  onFocusEnd: () => void;
  onBlur: () => void;
}

const RangeScopeCard: React.FC<RangeScopeCardProps> = ({
  isSelected,
  isFocused,
  onScopeChange,
  rangeStart,
  rangeEnd,
  rangeError,
  onRangeStartChange,
  onRangeEndChange,
  onFocusStart,
  onFocusEnd,
  onBlur,
}) => {
  return (
    <ScopeCard
      isSelected={isSelected}
      isFocused={isFocused}
      onClick={onScopeChange}
      icon={<TargetIcon className="w-6 h-6" />}
      title="Rango específico"
      description="Ingresa el rango de preguntas a estudiar"
    >
      <input
        type="number"
        placeholder="Desde"
        value={rangeStart}
        onChange={(e) => onRangeStartChange(e.target.value)}
        onClick={onScopeChange}
        onFocus={onFocusStart}
        onBlur={onBlur}
        className="flex-1 min-w-0 p-2 border border-gray-300 rounded-lg text-sm bg-white"
        min="1"
      />
      <span className="text-gray-500 text-sm flex-shrink-0">a</span>
      <input
        type="number"
        placeholder="Hasta"
        value={rangeEnd}
        onChange={(e) => onRangeEndChange(e.target.value)}
        onClick={onScopeChange}
        onFocus={onFocusEnd}
        onBlur={onBlur}
        className="flex-1 min-w-0 p-2 border border-gray-300 rounded-lg text-sm bg-white"
        min="1"
      />
      {rangeError && (
        <p className="text-red-600 text-xs mt-2">{rangeError}</p>
      )}
    </ScopeCard>
  );
};

export default RangeScopeCard;
