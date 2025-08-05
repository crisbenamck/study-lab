import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  fullWidth?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  className = '',
  containerClassName = '',
  fullWidth = false
}) => {
  return (
    <div className={`surface-base min-h-screen theme-transition ${className}`}>      
      <main className={fullWidth ? '' : 'content-container'}>
        <div className={containerClassName}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
