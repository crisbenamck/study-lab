import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'study-lab-theme';

export const useTheme = () => {
  // Get initial theme from localStorage or system preference
  const getInitialTheme = useCallback((): Theme => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        return savedTheme;
      }
    } catch (error) {
      console.warn('Error reading theme from localStorage:', error);
    }
    
    // Check system preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      try {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } catch (error) {
        console.warn('Error reading system theme preference:', error);
      }
    }
    
    return 'light';
  }, []);

  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Apply theme to document and save to localStorage
  useEffect(() => {
    try {
      // Apply theme to document
      document.documentElement.setAttribute('data-theme', theme);
      
      // Update body class for compatibility
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // Save to localStorage
      localStorage.setItem(THEME_STORAGE_KEY, theme);
      
      // Update color-scheme for better native styling
      document.documentElement.style.colorScheme = theme;
      
    } catch (error) {
      console.warn('Error applying theme:', error);
    }
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't manually set a theme
      try {
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        if (!savedTheme) {
          setTheme(e.matches ? 'dark' : 'light');
        }
      } catch (error) {
        console.warn('Error handling system theme change:', error);
      }
    };

    try {
      // Modern browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleSystemThemeChange);
        return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
      }
      // Legacy browsers
      else if (mediaQuery.addListener) {
        mediaQuery.addListener(handleSystemThemeChange);
        return () => mediaQuery.removeListener(handleSystemThemeChange);
      }
    } catch (error) {
      console.warn('Error setting up system theme listener:', error);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  }, []);

  const setLightTheme = useCallback(() => {
    setTheme('light');
  }, []);

  const setDarkTheme = useCallback(() => {
    setTheme('dark');
  }, []);

  const resetToSystem = useCallback(() => {
    try {
      localStorage.removeItem(THEME_STORAGE_KEY);
      const systemTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'dark' 
        : 'light';
      setTheme(systemTheme);
    } catch (error) {
      console.warn('Error resetting to system theme:', error);
      setTheme('light');
    }
  }, []);

  return {
    theme,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    resetToSystem,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  };
};
