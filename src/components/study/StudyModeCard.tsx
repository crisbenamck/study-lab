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
      className={`study-mode-card p-6 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-md theme-transition ${
        isSelected
          ? 'selected ring-2'
          : ''
      }`}
    >
      <div className="flex items-top gap-3">
        <div className="icon-container w-12 h-12 min-w-12 min-h-12 rounded-lg flex items-center justify-center flex-shrink-0">
          <div className="w-6 h-6">
            {icon}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">
            {title}
          </h3>
          <p className="text-sm">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
};

export default StudyModeCard;
