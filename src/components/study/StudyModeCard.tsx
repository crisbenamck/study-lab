import React from 'react';

interface StudyModeCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
}

const StudyModeCard: React.FC<StudyModeCardProps> = ({
  title,
  description,
  icon,
  isSelected,
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      className={`p-6 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-md theme-transition ${
        isSelected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400 shadow-lg ring-2 ring-blue-200 dark:ring-blue-800'
          : 'border-primary hover:border-secondary dark:border-slate-600 dark:hover:border-slate-500 bg-background dark:bg-slate-800/50'
      }`}
    >
      <div className="flex items-top gap-3">
        <div className={`w-12 h-12 min-w-12 min-h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
          isSelected 
            ? 'bg-blue-100 text-blue-600 dark:bg-blue-800/50 dark:text-blue-300' 
            : 'bg-muted text-secondary dark:bg-slate-700 dark:text-slate-300'
        }`}>
          <div className="w-6 h-6">
            {icon}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 text-primary dark:text-slate-200">
            {title}
          </h3>
          <p className="text-secondary dark:text-slate-400 text-sm">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
};

export default StudyModeCard;
