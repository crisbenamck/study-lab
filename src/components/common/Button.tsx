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
  // Configuración de variantes
  const variantConfig = {
    primary: {
      solid: {
        background: '#2563eb',
        border: '#2563eb',
        color: '#ffffff',
        hoverBackground: '#1d4ed8',
        hoverBorder: '#1d4ed8',
        hoverColor: '#ffffff',
        focusRing: 'focus:ring-blue-300',
        shadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
      },
      outline: {
        background: 'transparent',
        border: '#2563eb',
        color: '#2563eb',
        hoverBackground: '#2563eb',
        hoverBorder: '#2563eb',
        hoverColor: '#ffffff',
        focusRing: 'focus:ring-blue-300',
        shadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
      },
      ghost: {
        background: 'transparent',
        border: 'transparent',
        color: '#2563eb',
        hoverBackground: '#eff6ff',
        hoverBorder: 'transparent',
        hoverColor: '#2563eb',
        focusRing: 'focus:ring-blue-300',
        shadow: 'none'
      }
    },
    secondary: {
      solid: {
        background: '#6b7280',
        border: '#6b7280',
        color: '#ffffff',
        hoverBackground: '#4b5563',
        hoverBorder: '#4b5563',
        hoverColor: '#ffffff',
        focusRing: 'focus:ring-gray-300',
        shadow: '0 4px 12px rgba(107, 114, 128, 0.3)'
      },
      outline: {
        background: 'transparent',
        border: '#6b7280',
        color: '#6b7280',
        hoverBackground: '#6b7280',
        hoverBorder: '#6b7280',
        hoverColor: '#ffffff',
        focusRing: 'focus:ring-gray-300',
        shadow: '0 4px 12px rgba(107, 114, 128, 0.2)'
      },
      ghost: {
        background: 'transparent',
        border: 'transparent',
        color: '#6b7280',
        hoverBackground: '#f9fafb',
        hoverBorder: 'transparent',
        hoverColor: '#6b7280',
        focusRing: 'focus:ring-gray-300',
        shadow: 'none'
      }
    },
    danger: {
      solid: {
        background: '#ef4444',
        border: '#ef4444',
        color: '#ffffff',
        hoverBackground: '#dc2626',
        hoverBorder: '#dc2626',
        hoverColor: '#ffffff',
        focusRing: 'focus:ring-red-300',
        shadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
      },
      outline: {
        background: 'transparent',
        border: '#ef4444',
        color: '#ef4444',
        hoverBackground: '#ef4444',
        hoverBorder: '#ef4444',
        hoverColor: '#ffffff',
        focusRing: 'focus:ring-red-300',
        shadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
      },
      ghost: {
        background: 'transparent',
        border: 'transparent',
        color: '#ef4444',
        hoverBackground: '#fef2f2',
        hoverBorder: 'transparent',
        hoverColor: '#ef4444',
        focusRing: 'focus:ring-red-300',
        shadow: 'none'
      }
    },
    success: {
      solid: {
        background: '#10b981',
        border: '#10b981',
        color: '#ffffff',
        hoverBackground: '#059669',
        hoverBorder: '#059669',
        hoverColor: '#ffffff',
        focusRing: 'focus:ring-green-300',
        shadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
      },
      outline: {
        background: 'transparent',
        border: '#10b981',
        color: '#10b981',
        hoverBackground: '#10b981',
        hoverBorder: '#10b981',
        hoverColor: '#ffffff',
        focusRing: 'focus:ring-green-300',
        shadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
      },
      ghost: {
        background: 'transparent',
        border: 'transparent',
        color: '#10b981',
        hoverBackground: '#f0fdf4',
        hoverBorder: 'transparent',
        hoverColor: '#10b981',
        focusRing: 'focus:ring-green-300',
        shadow: 'none'
      }
    },
    warning: {
      solid: {
        background: '#f59e0b',
        border: '#f59e0b',
        color: '#ffffff',
        hoverBackground: '#d97706',
        hoverBorder: '#d97706',
        hoverColor: '#ffffff',
        focusRing: 'focus:ring-yellow-300',
        shadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
      },
      outline: {
        background: 'transparent',
        border: '#f59e0b',
        color: '#f59e0b',
        hoverBackground: '#f59e0b',
        hoverBorder: '#f59e0b',
        hoverColor: '#ffffff',
        focusRing: 'focus:ring-yellow-300',
        shadow: '0 4px 12px rgba(245, 158, 11, 0.2)'
      },
      ghost: {
        background: 'transparent',
        border: 'transparent',
        color: '#f59e0b',
        hoverBackground: '#fffbeb',
        hoverBorder: 'transparent',
        hoverColor: '#f59e0b',
        focusRing: 'focus:ring-yellow-300',
        shadow: 'none'
      }
    },
    info: {
      solid: {
        background: '#3b82f6',
        border: '#3b82f6',
        color: '#ffffff',
        hoverBackground: '#2563eb',
        hoverBorder: '#2563eb',
        hoverColor: '#ffffff',
        focusRing: 'focus:ring-blue-300',
        shadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
      },
      outline: {
        background: 'transparent',
        border: '#3b82f6',
        color: '#3b82f6',
        hoverBackground: '#3b82f6',
        hoverBorder: '#3b82f6',
        hoverColor: '#ffffff',
        focusRing: 'focus:ring-blue-300',
        shadow: '0 4px 12px rgba(59, 130, 246, 0.2)'
      },
      ghost: {
        background: 'transparent',
        border: 'transparent',
        color: '#3b82f6',
        hoverBackground: '#eff6ff',
        hoverBorder: 'transparent',
        hoverColor: '#3b82f6',
        focusRing: 'focus:ring-blue-300',
        shadow: 'none'
      }
    }
  };

  // Configuración de tamaños
  const sizeConfig = {
    sm: {
      padding: 'px-3 py-1.5',
      fontSize: 'text-sm',
      iconSize: 'w-4 h-4',
      gap: 'gap-1.5'
    },
    md: {
      padding: 'px-4 py-2',
      fontSize: 'text-sm',
      iconSize: 'w-4 h-4',
      gap: 'gap-2'
    },
    lg: {
      padding: 'px-6 py-3',
      fontSize: 'text-base',
      iconSize: 'w-5 h-5',
      gap: 'gap-2'
    },
    xl: {
      padding: 'px-8 py-4',
      fontSize: 'text-lg',
      iconSize: 'w-6 h-6',
      gap: 'gap-3'
    }
  };

  // Configuración de border-radius
  const roundedConfig = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full'
  };

  const currentVariant = variantConfig[variant][buttonType];
  const currentSize = sizeConfig[size];
  const currentRounded = roundedConfig[rounded];

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
    currentVariant.focusRing,
    currentSize.padding,
    currentSize.fontSize,
    currentSize.gap,
    currentRounded,
    fullWidth ? 'w-full' : '',
    disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    className
  ].filter(Boolean).join(' ');

  const initialStyles = {
    backgroundColor: currentVariant.background,
    color: currentVariant.color,
    border: `1px solid ${currentVariant.border}`,
    boxShadow: buttonType === 'solid' ? '0 1px 3px 0 rgba(0, 0, 0, 0.1)' : 'none'
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;
    
    e.currentTarget.style.backgroundColor = currentVariant.hoverBackground;
    e.currentTarget.style.borderColor = currentVariant.hoverBorder;
    e.currentTarget.style.color = currentVariant.hoverColor || currentVariant.color;
    if (currentVariant.shadow !== 'none' && buttonType === 'solid') {
      e.currentTarget.style.boxShadow = currentVariant.shadow;
      e.currentTarget.style.transform = 'translateY(-1px)';
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;
    
    e.currentTarget.style.backgroundColor = currentVariant.background;
    e.currentTarget.style.borderColor = currentVariant.border;
    e.currentTarget.style.color = currentVariant.color;
    e.currentTarget.style.boxShadow = buttonType === 'solid' ? '0 1px 3px 0 rgba(0, 0, 0, 0.1)' : 'none';
    e.currentTarget.style.transform = 'translateY(0)';
  };

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
      className={baseClasses}
      style={initialStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
