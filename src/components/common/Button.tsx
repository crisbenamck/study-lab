import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';
export type ButtonType = 'solid' | 'outline' | 'ghost';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  buttonType?: ButtonType;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  fullWidth?: boolean;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  buttonType = 'solid',
  icon,
  iconPosition = 'left',
  isLoading = false,
  fullWidth = false,
  rounded = 'lg',
  className = '',
  disabled,
  type = 'button',
  ...props
}) => {
  // Size configurations - maintaining exact same sizes as original
  const sizeConfig = {
    sm: {
      padding: 'px-3 py-1.5',
      fontSize: 'text-sm',
      gap: 'gap-1.5',
      iconSize: 'w-4 h-4'
    },
    md: {
      padding: 'px-4 py-2',
      fontSize: 'text-sm',
      gap: 'gap-2',
      iconSize: 'w-4 h-4'
    },
    lg: {
      padding: 'px-6 py-3',
      fontSize: 'text-base',
      gap: 'gap-2.5',
      iconSize: 'w-5 h-5'
    },
    xl: {
      padding: 'px-8 py-4',
      fontSize: 'text-lg',
      gap: 'gap-3',
      iconSize: 'w-6 h-6'
    }
  };

  // Rounded configurations - maintaining exact same as original
  const roundedConfig = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full'
  };

  const currentSize = sizeConfig[size];
  const currentRounded = roundedConfig[rounded];

  // Get button style classes based on variant and type
  const getButtonClasses = () => {
    const baseClasses = [
      'inline-flex',
      'items-center',
      'justify-center',
      'font-semibold',
      'transition-all',
      'duration-200',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2',
      'theme-transition',
      currentSize.padding,
      currentSize.fontSize,
      currentSize.gap,
      currentRounded,
      fullWidth ? 'w-full' : '',
      disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    ];

    // Add focus ring classes
    if (variant === 'primary') {
      baseClasses.push('focus:ring-blue-300');
    } else if (variant === 'secondary') {
      baseClasses.push('focus:ring-gray-300');
    } else if (variant === 'danger') {
      baseClasses.push('focus:ring-red-300');
    } else if (variant === 'success') {
      baseClasses.push('focus:ring-green-300');
    } else if (variant === 'warning') {
      baseClasses.push('focus:ring-yellow-300');
    } else if (variant === 'info') {
      baseClasses.push('focus:ring-blue-300');
    }

    // Add variant and type specific classes
    if (variant === 'primary') {
      if (buttonType === 'solid') {
        baseClasses.push('btn-primary-solid');
      } else if (buttonType === 'outline') {
        baseClasses.push('btn-primary-outline');
      } else if (buttonType === 'ghost') {
        baseClasses.push('btn-primary-ghost');
      }
    } else if (variant === 'secondary') {
      if (buttonType === 'solid') {
        baseClasses.push('btn-secondary-solid');
      } else if (buttonType === 'outline') {
        baseClasses.push('border-2 border-gray-500 text-gray-500 bg-transparent hover:bg-gray-500 hover:text-white');
      } else if (buttonType === 'ghost') {
        baseClasses.push('btn-secondary-ghost');
      }
    } else {
      // For other variants (danger, success, warning, info), use the gradient approach
      if (buttonType === 'solid') {
        const variantClasses = {
          danger: 'bg-gradient-error text-inverse hover:bg-red-700 shadow-theme-md hover:shadow-theme-lg hover:-translate-y-0.5',
          success: 'bg-gradient-success text-inverse hover:bg-green-700 shadow-theme-md hover:shadow-theme-lg hover:-translate-y-0.5',
          warning: 'bg-gradient-warning text-inverse hover:bg-yellow-700 shadow-theme-md hover:shadow-theme-lg hover:-translate-y-0.5',
          info: 'bg-gradient-info text-inverse hover:bg-sky-700 shadow-theme-md hover:shadow-theme-lg hover:-translate-y-0.5'
        };
        baseClasses.push(variantClasses[variant]);
      } else if (buttonType === 'outline') {
        const outlineClasses = {
          danger: 'bg-transparent border-2 border-red-600 text-theme-error hover:bg-theme-error hover:text-inverse',
          success: 'bg-transparent border-2 border-green-600 text-theme-success hover:bg-theme-success hover:text-inverse',
          warning: 'bg-transparent border-2 border-yellow-600 text-theme-warning hover:bg-theme-warning hover:text-inverse',
          info: 'bg-transparent border-2 border-sky-600 text-theme-info hover:bg-theme-info hover:text-inverse'
        };
        baseClasses.push(outlineClasses[variant]);
      } else if (buttonType === 'ghost') {
        const ghostClasses = {
          danger: 'bg-transparent text-theme-error hover:bg-theme-error',
          success: 'bg-transparent text-theme-success hover:bg-theme-success',
          warning: 'bg-transparent text-theme-warning hover:bg-theme-warning',
          info: 'bg-transparent text-theme-info hover:bg-theme-info'
        };
        baseClasses.push(ghostClasses[variant]);
      }
    }

    if (className) {
      baseClasses.push(className);
    }

    return baseClasses.filter(Boolean).join(' ');
  };

  // Loading spinner component - maintaining exact same as original
  const LoadingSpinner = () => (
    <svg
      className={`animate-spin ${currentSize.iconSize}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  // Icon rendering function - maintaining exact same as original
  const renderIcon = () => {
    if (isLoading) return <LoadingSpinner />;
    if (!icon) return null;
    
    // Si el icono es un string (emoji), lo renderizamos directamente
    if (typeof icon === 'string') {
      return <span className="text-current">{icon}</span>;
    }
    
    // Para elementos React, simplemente los envolvemos en un div con el tamaño apropiado
    return (
      <div className={currentSize.iconSize}>
        {icon}
      </div>
    );
  };

  return (
    <button
      type={type}
      className={getButtonClasses()}
      disabled={disabled || isLoading}
      {...props}
    >
      {iconPosition === 'left' && renderIcon()}
      {isLoading ? 'Cargando...' : children}
      {iconPosition === 'right' && !isLoading && renderIcon()}
    </button>
  );
};

export default Button;