import { useState, useCallback } from 'react';

export interface ConfirmOptions {
  title?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}

export interface UseConfirmResult {
  isConfirmOpen: boolean;
  confirmMessage: string;
  confirmOptions: ConfirmOptions;
  confirmCallback: (() => void) | null;
  showConfirm: (message: string, onConfirm: () => void, options?: ConfirmOptions) => void;
  hideConfirm: () => void;
}

export const useConfirm = (): UseConfirmResult => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmOptions, setConfirmOptions] = useState<ConfirmOptions>({});
  const [confirmCallback, setConfirmCallback] = useState<(() => void) | null>(null);

  const showConfirm = useCallback((message: string, onConfirm: () => void, options: ConfirmOptions = {}) => {
    setConfirmMessage(message);
    setConfirmOptions(options);
    setConfirmCallback(() => onConfirm);
    setIsConfirmOpen(true);
  }, []);

  const hideConfirm = useCallback(() => {
    setIsConfirmOpen(false);
    setConfirmMessage('');
    setConfirmOptions({});
    setConfirmCallback(null);
  }, []);

  return {
    isConfirmOpen,
    confirmMessage,
    confirmOptions,
    confirmCallback,
    showConfirm,
    hideConfirm
  };
};
