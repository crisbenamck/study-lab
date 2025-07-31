export interface AppState {
  geminiApiKey: string;
  saveGeminiApiKey: (key: string) => void;
  selectedFile: File | null;
  updateSelectedFile: (file: File | null, pages?: number) => void;
  totalPages: number;
  setTotalPages: (pages: number) => void;
  pageToProcess: number;
  setPageToProcess: (page: number) => void;
  isLoaded: boolean;
}
