import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  path: string;
  label: string;
}

interface NavigationProps {
  items: NavItem[];
}

const Navigation: React.FC<NavigationProps> = ({ items }) => {
  const location = useLocation();

  return (
    <nav className="flex items-center gap-8">
      {items.map((item) => {
        // Para el menú "Estudiar", verificar si la ruta actual comienza con "/study-lab/study"
        const isActive = item.path === '/study-lab/study' 
          ? location.pathname.startsWith('/study-lab/study')
          : location.pathname === item.path;
        
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`relative py-2 text-sm font-medium transition-all duration-200 group focus:outline-none focus:ring-0 ${
              isActive 
                ? 'text-primary' 
                : 'text-foreground hover:text-primary'
            }`}
          >
            {item.label}
            
            {/* Underline indicator for active state */}
            <span 
              className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-200 ${
                isActive 
                  ? 'w-full' 
                  : 'w-0 group-hover:w-full'
              }`}
            />
          </Link>
        );
      })}
    </nav>
  );
};

export default Navigation;
