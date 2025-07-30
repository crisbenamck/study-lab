import { useState, useEffect } from 'react';

// Simple encryption/decryption functions for API key
const ENCRYPTION_KEY = 'question-generator-key';

const simpleEncrypt = (text: string): string => {
  return btoa(text.split('').map((char, i) => 
    String.fromCharCode(char.charCodeAt(0) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length))
  ).join(''));
};

const simpleDecrypt = (encryptedText: string): string => {
  try {
    return atob(encryptedText).split('').map((char, i) => 
      String.fromCharCode(char.charCodeAt(0) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length))
    ).join('');
  } catch {
    return '';
  }
};

export const useAppState = () => {
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pageToProcess, setPageToProcess] = useState<number>(1);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load encrypted API key from localStorage on mount
  useEffect(() => {
    try {
      const encryptedKey = localStorage.getItem('gemini-api-key-encrypted');
      if (encryptedKey) {
        const decryptedKey = simpleDecrypt(encryptedKey);
        setGeminiApiKey(decryptedKey);
      } else {
        // Fallback to environment variable
        setGeminiApiKey(import.meta.env.VITE_GEMINI_API_KEY || '');
      }
    } catch (error) {
      console.error('Error loading API key:', error);
      setGeminiApiKey(import.meta.env.VITE_GEMINI_API_KEY || '');
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveGeminiApiKey = (key: string) => {
    setGeminiApiKey(key);
    try {
      if (key.trim()) {
        const encrypted = simpleEncrypt(key);
        localStorage.setItem('gemini-api-key-encrypted', encrypted);
      } else {
        localStorage.removeItem('gemini-api-key-encrypted');
      }
    } catch (error) {
      console.error('Error saving API key:', error);
    }
  };

  const updateSelectedFile = (file: File | null, pages?: number) => {
    setSelectedFile(file);
    if (pages) {
      setTotalPages(pages);
    }
    setPageToProcess(1);
  };

  return {
    geminiApiKey,
    saveGeminiApiKey,
    selectedFile,
    updateSelectedFile,
    totalPages,
    setTotalPages,
    pageToProcess,
    setPageToProcess,
    isLoaded
  };
};
