import React from 'react';
import Button from '../common/Button';
import type { ReactNode } from 'react';
import ProgressBar from './ProgressBar';

interface ActivityHeaderProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  progressCurrent?: number;
  progressTotal?: number;
  timeLeft?: number | null;
  onExit: () => void;
  showProgressBar?: boolean;
  showTimer?: boolean;
}

const formatTime = (seconds: number) => {
  if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) return '';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * ActivityHeader: Common header for exam and flashcards modes.
 * Usage: <ActivityHeader ...props />
 */
const ActivityHeader: React.FC<ActivityHeaderProps> = ({
  icon,
  title,
  subtitle,
  progressCurrent,
  progressTotal,
  timeLeft,
  onExit,
  showProgressBar = false,
  showTimer = false,
}) => (
  <div className="w-full mb-8">
    <div className="bg-white border-b top-0 z-10">
      <div className="max-w-4xl mx-auto py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-start w-full">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-100 text-blue-600 mr-3 mt-1">
              {icon}
            </div>
            <div className="flex flex-col w-full">
              <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
              {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-4 ml-4">
            {showTimer && typeof timeLeft === 'number' && !isNaN(timeLeft) && timeLeft >= 0 && formatTime(timeLeft) !== '' && (
              <div className={`text-base font-mono ${timeLeft < 300 ? 'text-red-600' : 'text-gray-700'}`}>
                ⏰ {formatTime(timeLeft)}
              </div>
            )}
            <Button
              onClick={onExit}
              variant="danger"
              buttonType="outline"
              size="sm"
              aria-label="Exit activity"
            >
              Salir
            </Button>
          </div>
        </div>
      </div>
    </div>
    {showProgressBar && typeof progressCurrent === 'number' && typeof progressTotal === 'number' && (
      <div className="w-full bg-white">
        <div className="max-w-4xl mx-auto pt-2 pb-0">
          <ProgressBar current={progressCurrent} total={progressTotal} />
        </div>
      </div>
    )}
  </div>
);

export default ActivityHeader;
