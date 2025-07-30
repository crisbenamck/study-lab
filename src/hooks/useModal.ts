import { useState, useCallback } from 'react';

export interface ModalConfig {
  title?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  showCloseButton?: boolean;
}

export interface UseModalResult {
  isOpen: boolean;
  modalConfig: ModalConfig;
  showModal: (config?: ModalConfig) => void;
  hideModal: () => void;
}

export const useModal = (): UseModalResult => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig>({});

  const showModal = useCallback((config: ModalConfig = {}) => {
    setModalConfig(config);
    setIsOpen(true);
  }, []);

  const hideModal = useCallback(() => {
    setIsOpen(false);
    setModalConfig({});
  }, []);

  return {
    isOpen,
    modalConfig,
    showModal,
    hideModal
  };
};
