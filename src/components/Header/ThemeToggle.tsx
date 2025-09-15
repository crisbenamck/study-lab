import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import SunIcon from '../../icons/SunIcon';
import MoonIcon from '../../icons/MoonIcon';

interface ThemeToggleProps {
  className?: string;
  variant?: 'icon' | 'button';
  showLabel?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '', 
  variant = 'icon',
  showLabel = false 
}) => {
  const { isDark, toggleTheme } = useTheme();

  const handleToggle = () => {
    toggleTheme();
  };

  const baseClasses = `
    relative inline-flex items-center gap-2 p-2 rounded-lg transition-all duration-200 
    bg-secondary hover:bg-tertiary hover:scale-105 
    border border-primary
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    group theme-transition
  `;

  const buttonClasses = variant === 'button' 
    ? 'px-3 py-2 text-sm font-medium'
    : '';

  return (
    <button
      onClick={handleToggle}
      className={`${baseClasses} ${buttonClasses} ${className}`}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      <div className="relative w-5 h-5">
        {/* Sun Icon */}
        <SunIcon 
          className={`
            absolute inset-0 w-5 h-5 transition-all duration-300
            ${isDark 
              ? 'opacity-0 rotate-90 scale-75 text-amber-400' 
              : 'opacity-100 rotate-0 scale-100 text-amber-500'
            }
          `}
        />
        
        {/* Moon Icon */}
        <MoonIcon 
          className={`
            absolute inset-0 w-5 h-5 transition-all duration-300
            ${isDark 
              ? 'opacity-100 rotate-0 scale-100 text-muted-foreground' 
              : 'opacity-0 -rotate-90 scale-75 text-muted-foreground'
            }
          `}
        />
      </div>
      
      {showLabel && (
        <span className="text-primary text-sm font-medium">
          {isDark ? 'Modo claro' : 'Modo oscuro'}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
