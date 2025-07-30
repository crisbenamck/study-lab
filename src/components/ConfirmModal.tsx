import React from 'react';
import Modal from './Modal';

interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'warning'
}) => {
  const handleConfirm = () => {
    onConfirm();
    onCancel(); // Cerrar modal después de confirmar
  };

  const handleKeyDown = (event: React.KeyboardEvent, action: 'confirm' | 'cancel') => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (action === 'confirm') {
        handleConfirm();
      } else {
        onCancel();
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      type={type}
      showCloseButton={false}
    >
      <div className="space-y-6">
        <div className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
          {message}
        </div>
        
        <div className="flex justify-center space-x-3 pt-2">
          <button
            onClick={onCancel}
            onKeyDown={(e) => handleKeyDown(e, 'cancel')}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
          >
            {cancelText}
          </button>
          
          <button
            onClick={handleConfirm}
            onKeyDown={(e) => handleKeyDown(e, 'confirm')}
            autoFocus
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
