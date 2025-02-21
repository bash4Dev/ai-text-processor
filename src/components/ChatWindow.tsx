import React from 'react';
import { Message as MessageType } from '../types';
import Message from './Message';

interface ChatWindowProps {
  messages: MessageType[];
  onSummarize: (id: number) => void;
  onTranslate: (id: number) => void;
  onTranslationLanguageChange: (id: number, lang: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  onSummarize,
  onTranslate,
  onTranslationLanguageChange,
}) => {
  return (
    <div className="output-area" role="log" aria-live="polite">
      {messages.map((message) => (
        <Message
          key={message.id}
          message={message}
          onSummarize={onSummarize}
          onTranslate={onTranslate}
          onTranslationLanguageChange={onTranslationLanguageChange}
        />
      ))}
    </div>
  );
};

export default ChatWindow;