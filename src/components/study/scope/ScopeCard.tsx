import React from 'react';
import type { ReactNode } from 'react';
import { InfoIcon } from '../../../icons';

interface ScopeCardProps {
  isSelected: boolean;
  isFocused: boolean;
  onClick: () => void;
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}

const ScopeCard: React.FC<ScopeCardProps> = ({
  isSelected,
  isFocused,
  onClick,
  icon,
  title,
  description,
  children,
}) => {
  return (
    <button
      onClick={onClick}
      className={`p-6 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-md flex flex-col min-h-[140px] ${
        isSelected || isFocused
          ? 'border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200'
          : 'border-gray-200'
      }`}
    >
      {/* Sección superior: Icono y textos */}
      <div className="flex-1 mb-4">
        <div className="grid grid-cols-[auto_1fr] gap-3">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
            isSelected || isFocused
              ? 'bg-blue-100 text-blue-600' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {icon}
          </div>
          <div>
            <div className="flex items-start gap-2">
              <h3 className="text-base font-semibold">
                {title}
              </h3>
              <InfoIcon className="text-blue-500 mt-0.5" size="sm" />
            </div>
            <p className="text-gray-600 text-xs">
              {description}
            </p>
          </div>
        </div>
      </div>
      
      {/* Sección inferior: Inputs alineados con los textos */}
      <div onClick={(e) => e.stopPropagation()}>
        <div className="grid grid-cols-[auto_1fr] gap-3">
          <div className="w-12"></div>
          <div className="flex items-center gap-2 min-w-0">
            {children}
          </div>
        </div>
      </div>
    </button>
  );
};

export default ScopeCard;
