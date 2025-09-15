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
          ? 'border-primary bg-primary-50 shadow-lg ring-2 ring-primary-200'
          : 'border-gray-light hover:border-gray'
      }`}
    >
      <div className="flex items-top gap-3">
        <div className={`w-12 h-12 min-w-12 min-h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
          isSelected ? 'bg-primary-100 text-primary-600' : 'bg-gray-light text-secondary'
        }`}>
          <div className="w-6 h-6">
            {icon}
          </div>
        </div>
        <div>
          <h3 style={{ 
            fontSize: 'var(--font-size-lg)', 
            fontWeight: 'var(--font-weight-semibold)', 
            marginBottom: 'var(--space-sm)' 
          }}>
            {title}
          </h3>
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: 'var(--font-size-sm)' 
          }}>
            {description}
          </p>
        </div>
      </div>
    </button>
  );
};

export default StudyModeCard;
