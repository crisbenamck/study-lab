import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

/**
 * ProgressBar component for displaying progress as a percentage and bar.
 * Usage: <ProgressBar current={2} total={10} />
 */
const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, className = '' }) => {
  const percentage = total > 0 ? Math.round(((current + 1) / total) * 100) : 0;
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between text-xs mb-1 progress-bar-text">
        <span>Pregunta {current + 1} de {total}</span>
        <span>{percentage}%</span>
      </div>
      <div className="w-full rounded-full h-2 theme-transition progress-bar-bg">
        <div
          className="h-2 rounded-full transition-all duration-300 progress-bar-fill"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
