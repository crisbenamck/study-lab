import React from 'react';
import Button from './common/Button';

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  buttonIcon: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

const ActionCard: React.FC<ActionCardProps> = ({
  icon,
  title,
  description,
  buttonText,
  buttonIcon,
  onClick,
  variant = 'primary'
}) => {
  return (
    <div className="group">
      <div className="bg-white rounded-3xl border-2 border-gray-100 p-10 hover:border-blue-200 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
        {/* Icono centrado */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 flex items-center justify-center bg-blue-50 rounded-2xl group-hover:bg-blue-100 transition-colors duration-300">
            {icon}
          </div>
        </div>
        
        {/* Contenido */}
        <div className="text-center space-y-6">
          <h3 className="text-xl font-bold text-gray-900 leading-tight">
            {title}
          </h3>
          
          <p className="text-gray-600 text-sm leading-relaxed max-w-xs mx-auto">
            {description}
          </p>
          
          {/* Botón */}
          <div className="pt-4">
            <Button 
              variant={variant}
              size="lg"
              onClick={onClick}
              className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {buttonIcon}
              {buttonText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionCard;
