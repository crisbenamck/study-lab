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
  // Base classes for all buttons
  const baseClasses = `
    inline-flex items-center justify-center font-medium transition-all duration-200 
    focus:outline-none focus:ring-2 focus:ring-offset-2 theme-transition
    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
  `;

  // Size configurations
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
    xl: 'px-8 py-4 text-lg gap-3'
  };

  // Rounded configurations
  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full'
  };

  // Width configuration
  const widthClass = fullWidth ? 'w-full' : '';

  // Variant and type combinations
  const getVariantClasses = () => {
    const variants = {
      primary: {
        solid: 'bg-gradient-primary text-inverse hover:bg-blue-700 focus:ring-blue-300 shadow-theme-md hover:shadow-theme-lg hover:-translate-y-0.5',
        outline: 'bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-inverse focus:ring-blue-300',
        ghost: 'bg-transparent text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 focus:ring-blue-300'
      },
      secondary: {
        solid: 'bg-secondary text-primary border border-primary hover:bg-tertiary focus:ring-gray-300 shadow-theme-sm hover:shadow-theme-md hover:-translate-y-0.5',
        outline: 'bg-transparent border-2 border-secondary text-secondary hover:bg-secondary hover:text-primary focus:ring-gray-300',
        ghost: 'bg-transparent text-secondary hover:bg-secondary focus:ring-gray-300'
      },
      danger: {
        solid: 'bg-gradient-error text-inverse hover:bg-red-700 focus:ring-red-300 shadow-theme-md hover:shadow-theme-lg hover:-translate-y-0.5',
        outline: 'bg-transparent border-2 border-red-600 text-theme-error hover:bg-theme-error hover:text-inverse focus:ring-red-300',
        ghost: 'bg-transparent text-theme-error hover:bg-theme-error focus:ring-red-300'
      },
      success: {
        solid: 'bg-gradient-success text-inverse hover:bg-green-700 focus:ring-green-300 shadow-theme-md hover:shadow-theme-lg hover:-translate-y-0.5',
        outline: 'bg-transparent border-2 border-green-600 text-theme-success hover:bg-theme-success hover:text-inverse focus:ring-green-300',
        ghost: 'bg-transparent text-theme-success hover:bg-theme-success focus:ring-green-300'
      },
      warning: {
        solid: 'bg-gradient-warning text-inverse hover:bg-yellow-700 focus:ring-yellow-300 shadow-theme-md hover:shadow-theme-lg hover:-translate-y-0.5',
        outline: 'bg-transparent border-2 border-yellow-600 text-theme-warning hover:bg-theme-warning hover:text-inverse focus:ring-yellow-300',
        ghost: 'bg-transparent text-theme-warning hover:bg-theme-warning focus:ring-yellow-300'
      },
      info: {
        solid: 'bg-gradient-info text-inverse hover:bg-sky-700 focus:ring-sky-300 shadow-theme-md hover:shadow-theme-lg hover:-translate-y-0.5',
        outline: 'bg-transparent border-2 border-sky-600 text-theme-info hover:bg-theme-info hover:text-inverse focus:ring-sky-300',
        ghost: 'bg-transparent text-theme-info hover:bg-theme-info focus:ring-sky-300'
      }
    };

    return variants[variant][buttonType];
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
  );

  // Combine all classes
  const combinedClasses = [
    baseClasses,
    sizeClasses[size],
    roundedClasses[rounded],
    getVariantClasses(),
    widthClass,
    className
  ].filter(Boolean).join(' ');

  // Icon and content rendering
  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          <LoadingSpinner />
          <span>Cargando...</span>
        </>
      );
    }

    if (icon && children) {
      return iconPosition === 'left' ? (
        <>
          {icon}
          <span>{children}</span>
        </>
      ) : (
        <>
          <span>{children}</span>
          {icon}
        </>
      );
    }

    if (icon && !children) {
      return icon;
    }

    return <span>{children}</span>;
  };

  return (
    <button
      type={type}
      className={combinedClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {renderContent()}
    </button>
  );
};

export default Button;