
import React, { useEffect } from 'react';
import { InfoIcon, CheckIcon, WarningIcon, ErrorIcon } from '../icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  type?: 'info' | 'success' | 'warning' | 'error';
  showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  type = 'info',
  showCloseButton = true
}) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showCloseButton) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, showCloseButton]);

  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckIcon className="w-6 h-6 text-theme-success" />,
          borderColor: 'border-theme-success',
          iconColor: 'text-theme-success',
          bgColor: 'bg-theme-success'
        };
      case 'warning':
        return {
          icon: <WarningIcon className="w-6 h-6 text-theme-warning" />,
          borderColor: 'border-theme-warning', 
          iconColor: 'text-theme-warning',
          bgColor: 'bg-theme-warning'
        };
      case 'error':
        return {
          icon: <ErrorIcon className="w-6 h-6 text-theme-error" />,
          borderColor: 'border-theme-error',
          iconColor: 'text-theme-error', 
          bgColor: 'bg-theme-error'
        };
      default:
        return {
          icon: <InfoIcon className="w-6 h-6 text-theme-info" />,
          borderColor: 'border-theme-info',
          iconColor: 'text-theme-info',
          bgColor: 'bg-theme-info'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 z-[999999] flex items-end justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 overlay transition-opacity duration-200 z-[999998]"
        onClick={showCloseButton ? onClose : undefined}
      />
      
      {/* Modal */}
      <div className="relative bg-elevated rounded-lg shadow-theme-xl w-full max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200 z-[999999] mx-12 mb-8 max-w-2xl theme-transition">
        {/* Header */}
        {(title || showCloseButton) && (
          <div className={`flex items-center justify-between p-4 border-b border-primary ${styles.bgColor} ${styles.borderColor} border-t-4`}>
            <div className="flex items-center space-x-2">
              <span className="text-2xl flex items-center">{styles.icon}</span>
              {title && (
                <h3 className="text-lg font-semibold text-primary">{title}</h3>
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:border-focus bg-secondary hover:bg-tertiary border border-primary shadow-theme-sm hover:shadow-theme-md hover:-translate-y-0.5 text-secondary"
                aria-label="Cerrar modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)] bg-elevated">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
