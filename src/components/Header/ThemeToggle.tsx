import React, { useState } from 'react';
import SunIcon from '../../icons/SunIcon';
import MoonIcon from '../../icons/MoonIcon';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const [isDark, setIsDark] = useState(false);

  const handleToggle = () => {
    setIsDark(!isDark);
    // TODO: Implementar lógica de theme toggle para toda la SPA
    console.log('Theme toggle clicked:', !isDark ? 'dark' : 'light');
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        relative p-2 rounded-lg transition-all duration-200 
        hover:bg-gray-100 hover:scale-105 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        group ${className}
      `}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      <div className="relative w-5 h-5">
        {/* Sun Icon */}
        <SunIcon 
          className={`
            absolute inset-0 w-5 h-5 transition-all duration-300 text-amber-500
            ${isDark 
              ? 'opacity-0 rotate-90 scale-75' 
              : 'opacity-100 rotate-0 scale-100'
            }
          `}
        />
        
        {/* Moon Icon */}
        <MoonIcon 
          className={`
            absolute inset-0 w-5 h-5 transition-all duration-300 text-slate-600
            ${isDark 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-90 scale-75'
            }
          `}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;
