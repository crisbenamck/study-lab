import React from 'react';
import Tooltip from '../components/common/Tooltip';

interface InfoIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'filled';
  tooltip?: string;
}

const InfoIcon: React.FC<InfoIconProps> = ({ 
  className = '', 
  size = 'md',
  variant = 'outline',
  tooltip
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5', 
    lg: 'w-6 h-6'
  };

  const baseClasses = `${sizeClasses[size]} ${className}`;

  const iconElement = variant === 'filled' ? (
    <svg 
      className={baseClasses} 
      fill="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        fillRule="evenodd" 
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" 
        clipRule="evenodd" 
      />
    </svg>
  ) : (
    <svg 
      className={baseClasses} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
      />
    </svg>
  );

  if (tooltip) {
    return (
      <Tooltip content={tooltip}>
        {iconElement}
      </Tooltip>
    );
  }

  return iconElement;
};

export default InfoIcon;
