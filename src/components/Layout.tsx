import React from 'react';
import HeaderImproved from './HeaderImproved';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  showHeader?: boolean;
  fullWidth?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  className = '',
  containerClassName = '',
  showHeader = true,
  fullWidth = false
}) => {
  return (
    <div className={`surface-base min-h-screen theme-transition ${className}`}>
      {showHeader && <HeaderImproved />}
      
      <main className={fullWidth ? '' : 'content-container'}>
        <div className={containerClassName}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
