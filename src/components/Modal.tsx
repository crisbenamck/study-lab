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
    <div 
      className="fixed inset-0 z-[999999] flex items-end justify-center"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999999,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center'
      }}
    >
      {/* Backdrop - Capa gris transparente que bloquea toda la página */}
      <div 
        className="absolute inset-0 transition-opacity duration-200"
        onClick={showCloseButton ? onClose : undefined}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999998
        }}
      />
      
      {/* Modal */}
      <div 
        className="relative bg-white rounded-lg shadow-2xl w-full max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200"
        style={{ 
          zIndex: 999999,
          marginLeft: '3rem',
          marginRight: '3rem',
          marginBottom: '2rem',
          maxWidth: '600px'
        }}
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
                className="flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                aria-label="Cerrar modal"
                style={{
                  backgroundColor: '#f3f4f6',
                  color: '#6b7280',
                  border: '1px solid #d1d5db',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e5e7eb';
                  e.currentTarget.style.borderColor = '#9ca3af';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(107, 114, 128, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
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
