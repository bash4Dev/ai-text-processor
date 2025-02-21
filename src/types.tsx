export interface Message {
    id: number;
    text: string;
    detectedLanguage?: string;
    summary?: string;
    translation?: string;
    isLoadingDetection?: boolean;
    isLoadingSummarize?: boolean;
    isLoadingTranslate?: boolean;
    error?: string;
    selectedTranslationLanguage: string;
  }