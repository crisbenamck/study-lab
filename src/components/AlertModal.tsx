import React from 'react';
import Modal from './Modal';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  buttonText?: string;
}

const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  buttonText = 'Entendido'
}) => {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      type={type}
      showCloseButton={false}
    >
      <div className="space-y-4">
        <div className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
          {message}
        </div>
        
        <div className="flex justify-center pt-2">
          <button
            onClick={onClose}
            onKeyDown={handleKeyDown}
            autoFocus
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
            style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: '1px solid #2563eb',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1d4ed8';
              e.currentTarget.style.borderColor = '#1d4ed8';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb';
              e.currentTarget.style.borderColor = '#2563eb';
              e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AlertModal;
