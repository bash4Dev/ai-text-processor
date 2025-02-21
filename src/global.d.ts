declare global {
    interface DownloadProgressEvent extends Event {
        loaded: number;
        total: number;
      }
      
    interface LanguageDetectionResult {
      detectedLanguage: string;
      confidence: number;
    }
  
    interface LanguageDetector {
      capabilities: () => Promise<'no' | 'readily' | 'after-download'>;
      create: (options?: { monitor?: (m: EventTarget) => void }) => Promise<{
        ready: Promise<void>;
        detect: (text: string) => Promise<LanguageDetectionResult[]>;
      }>;
    }
  
    interface SummarizerCapabilities {
      available: 'no' | 'readily' | 'after-download';
    }
  
    interface Summarizer {
      ready: Promise<void>;
      summarize: (text: string, options?: { context?: string }) => Promise<string>;
    }
  
    interface TranslatorCapabilities {
      languagePairAvailable: (sourceLanguage: string, targetLanguage: string) => 'no' | 'readily' | 'after-download';
    }
  
    interface Translator {
      ready: Promise<void>;
      translate: (text: string) => Promise<string>;
    }
  
    interface AI {
      languageDetector: LanguageDetector;
      summarizer: {
        capabilities: () => Promise<SummarizerCapabilities>;
        create: (options?: {
          type?: 'key-points' | 'tl;dr' | 'teaser' | 'headline';
          format?: 'plain-text' | 'markdown';
          length?: 'short' | 'medium' | 'long';
          monitor?: (m: EventTarget) => void;
        }) => Promise<Summarizer>;
      };
      translator: {
        capabilities: () => Promise<TranslatorCapabilities>;
        create: (options: {
          sourceLanguage: string;
          targetLanguage: string;
          monitor?: (m: EventTarget) => void;
        }) => Promise<Translator>;
      };
    }
  
    interface Window {
      ai: AI;
    }
  }
  
  export {};