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
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AlertModal;
