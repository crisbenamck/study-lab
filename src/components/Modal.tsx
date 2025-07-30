import React, { useEffect } from 'react';

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
          icon: '✅',
          borderColor: 'border-green-500',
          iconColor: 'text-green-500',
          bgColor: 'bg-green-50'
        };
      case 'warning':
        return {
          icon: '⚠️',
          borderColor: 'border-yellow-500',
          iconColor: 'text-yellow-500',
          bgColor: 'bg-yellow-50'
        };
      case 'error':
        return {
          icon: '❌',
          borderColor: 'border-red-500',
          iconColor: 'text-red-500',
          bgColor: 'bg-red-50'
        };
      default:
        return {
          icon: 'ℹ️',
          borderColor: 'border-blue-500',
          iconColor: 'text-blue-500',
          bgColor: 'bg-blue-50'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center">
      {/* Backdrop - Capa gris transparente que bloquea toda la página */}
      <div 
        className="absolute inset-0 transition-opacity duration-200"
        onClick={showCloseButton ? onClose : undefined}
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999998
        }}
      />
      
      {/* Modal */}
      <div 
        className="relative bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200"
        style={{ zIndex: 999999 }}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className={`flex items-center justify-between p-4 border-b ${styles.bgColor} ${styles.borderColor} border-t-4`}>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{styles.icon}</span>
              {title && (
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
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
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
