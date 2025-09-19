import React from 'react';
import type { ReactNode } from 'react';

interface EmptyLibraryActionCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  buttonText: string;
  buttonIcon?: ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

/**
 * Card for main actions in EmptyLibraryActions (used in empty library states).
 */
const EmptyLibraryActionCard: React.FC<EmptyLibraryActionCardProps> = ({
  icon,
  title,
  description,
  buttonText,
  buttonIcon,
  onClick,
  variant = 'primary',
}) => (
  <div className="bg-card rounded-xl shadow-sm border border-primary p-8 flex flex-col items-center text-center">
    <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-4 bg-blue-500">
      {icon}
    </div>
    <h4 className="text-xl font-bold text-primary mb-2">{title}</h4>
    <p className="text-secondary mb-6">{description}</p>
    <button
      aria-label={buttonText}
      className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-white ${variant === 'primary' ? 'bg-blue-700 hover:bg-blue-800' : 'bg-gray-500 hover:bg-gray-600'} transition-colors`}
      onClick={onClick}
    >
      {buttonIcon}
      {buttonText}
    </button>
  </div>
);

export default EmptyLibraryActionCard;
