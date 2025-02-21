import React from 'react';
import { Message as MessageType } from '../types';

interface MessageProps {
  message: MessageType;
  onSummarize: (id: number) => void;
  onTranslate: (id: number) => void;
  onTranslationLanguageChange: (id: number, lang: string) => void;
}

const languageOptions = [
  { label: 'English', value: 'en' },
  { label: 'Spanish', value: 'es' },
  { label: 'Russian', value: 'ru' },
  { label: 'French', value: 'fr' },
];

const langMap: Record<string, string> = {
  en: 'English',
  es: 'Spanish',
  ru: 'Russian',
  fr: 'French',
};

const Message: React.FC<MessageProps> = ({
  message,
  onSummarize,
  onTranslate,
  onTranslationLanguageChange,
}) => {
  return (
    <div className="message">
      <div className="message-text">{message.text}</div>
      <div className="message-meta">
        {message.isLoadingDetection ? (
          <span>Detecting language...</span>
        ) : message.detectedLanguage ? (
          <span>Detected Lang: {langMap[message.detectedLanguage] || message.detectedLanguage}</span>
        ) : null}
      </div>

      <div className="message-actions">
        {message.detectedLanguage === 'en' && message.text.length > 150 && (
          <button
            onClick={() => onSummarize(message.id)}
            aria-label="Summarize text"
            disabled={message.isLoadingSummarize}
          >
            {message.isLoadingSummarize ? 'Summarizing...' : 'Summarize'}
          </button>
        )}
        <div className="translation-group">
          <select
            value={message.selectedTranslationLanguage}
            onChange={(e) =>
              onTranslationLanguageChange(message.id, e.target.value)
            }
            aria-label="Select target language for translation"
          >
            {languageOptions.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => onTranslate(message.id)}
            aria-label="Translate text"
            disabled={message.isLoadingTranslate}
          >
            {message.isLoadingTranslate ? 'Translating...' : 'Translate'}
          </button>
        </div>
      </div>

      {message.summary && (
        <div className="message-result">
          <strong>Summary:</strong> {message.summary}
        </div>
      )}

      {message.translation && (
        <div className="message-result">
          <strong>Translation:</strong> {message.translation}
        </div>
      )}

      {message.error && (
        <div className="error-message" role="alert">
          {message.error}
        </div>
      )}
    </div>
  );
};

export default Message;