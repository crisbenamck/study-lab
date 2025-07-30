import { useState, useCallback } from 'react';

export interface AlertOptions {
  title?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  buttonText?: string;
}

export interface UseAlertResult {
  isAlertOpen: boolean;
  alertMessage: string;
  alertOptions: AlertOptions;
  showAlert: (message: string, options?: AlertOptions) => void;
  hideAlert: () => void;
}

export const useAlert = (): UseAlertResult => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertOptions, setAlertOptions] = useState<AlertOptions>({});

  const showAlert = useCallback((message: string, options: AlertOptions = {}) => {
    setAlertMessage(message);
    setAlertOptions(options);
    setIsAlertOpen(true);
  }, []);

  const hideAlert = useCallback(() => {
    setIsAlertOpen(false);
    setAlertMessage('');
    setAlertOptions({});
  }, []);

  return {
    isAlertOpen,
    alertMessage,
    alertOptions,
    showAlert,
    hideAlert
  };
};
