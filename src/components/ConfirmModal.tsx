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
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
            style={{
              backgroundColor: '#6b7280',
              color: '#ffffff',
              border: '1px solid #6b7280',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#4b5563';
              e.currentTarget.style.borderColor = '#4b5563';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(107, 114, 128, 0.3)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#6b7280';
              e.currentTarget.style.borderColor = '#6b7280';
              e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {cancelText}
          </button>
          
          <button
            onClick={handleConfirm}
            onKeyDown={(e) => handleKeyDown(e, 'confirm')}
            autoFocus
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-300"
            style={{
              backgroundColor: '#ef4444',
              color: '#ffffff',
              border: '1px solid #ef4444',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#dc2626';
              e.currentTarget.style.borderColor = '#dc2626';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ef4444';
              e.currentTarget.style.borderColor = '#ef4444';
              e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
