import React, { useState } from 'react';
import ChatWindow from './components/ChatWindow';
import InputArea from './components/InputArea';
import { Message } from './types';
import './App.css';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');

  const handleSend = async () => {
    if (!inputText.trim()) {
      alert('Input text cannot be empty');
      return;
    }

    const newMessage: Message = {
      id: Date.now(),
      text: inputText,
      isLoadingDetection: true,
      selectedTranslationLanguage: 'en',
    };

    // Immediately add the message
    setMessages((prev) => [...prev, newMessage]);
    setInputText('');

    // Language Detector API logic
    if (!('ai' in window && 'languageDetector' in window.ai)) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id
            ? { ...msg, error: 'Language Detector API not supported', isLoadingDetection: false }
            : msg
        )
      );
      return;
    }

    try {
      const capabilities = await window.ai.languageDetector.capabilities();
      let detector;
      if (capabilities === 'no') {
        throw new Error('Language Detector not usable.');
      } else if (capabilities === 'readily') {
        detector = await window.ai.languageDetector.create();
      } else {
        detector = await window.ai.languageDetector.create({
          monitor: (m: any) => {
            m.addEventListener('downloadprogress', (e: any) => {
              console.log(`Language model: Downloaded ${e.loaded} of ${e.total} bytes.`);
            });
          },
        });
        await detector.ready;
      }
      const results = await detector.detect(newMessage.text);
      const topLanguage = results[0].detectedLanguage;
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id
            ? { ...msg, detectedLanguage: topLanguage, isLoadingDetection: false }
            : msg
        )
      );
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id
            ? { ...msg, error: 'Language detection failed', isLoadingDetection: false }
            : msg
        )
      );
    }
  };

  // APIs
  const handleSummarize = async (id: number) => {
    const message = messages.find((m) => m.id === id);
    if (!message) return;
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, isLoadingSummarize: true } : msg))
    );

    if (!('ai' in window && 'summarizer' in window.ai)) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === id
            ? { ...msg, error: 'Summarizer API not supported', isLoadingSummarize: false }
            : msg
        )
      );
      return;
    }

    try {
      const summarizerCapabilities = await window.ai.summarizer.capabilities();
      let summarizer;
      if (summarizerCapabilities.available === 'no') {
        throw new Error('Summarizer API not usable.');
      } else if (summarizerCapabilities.available === 'readily') {
        summarizer = await window.ai.summarizer.create({
          type: 'key-points',
          format: 'plain-text',
          length: 'medium',
        });
      } else {
        summarizer = await window.ai.summarizer.create({
          type: 'key-points',
          format: 'plain-text',
          length: 'medium',
          monitor: (m: any) => {
            m.addEventListener('downloadprogress', (e: any) => {
              console.log(`Summarizer: Downloaded ${e.loaded} of ${e.total} bytes.`);
            });
          },
        });
        await summarizer.ready;
      }
      const summary = await summarizer.summarize(message.text, {
        context: 'Summarizing user input',
      });
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, summary, isLoadingSummarize: false } : msg))
      );
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === id ? { ...msg, error: 'Summarization failed', isLoadingSummarize: false } : msg
        )
      );
    }
  };

  const handleTranslate = async (id: number) => {
    const message = messages.find((m) => m.id === id);
    if (!message) return;
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, isLoadingTranslate: true } : msg))
    );

    if (!('ai' in window && 'translator' in window.ai)) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === id ? { ...msg, error: 'Translator API not supported', isLoadingTranslate: false } : msg
        )
      );
      return;
    }

    try {
      const sourceLanguage = message.detectedLanguage || 'English';
      const targetLanguage = message.selectedTranslationLanguage;
      const translatorCapabilities = await window.ai.translator.capabilities();
      const availability = translatorCapabilities.languagePairAvailable(sourceLanguage, targetLanguage);
      let translator;
      if (availability === 'no') {
        throw new Error('Translation not available for this language pair.');
      } else if (availability === 'readily') {
        translator = await window.ai.translator.create({
          sourceLanguage,
          targetLanguage,
        });
      } else {
        translator = await window.ai.translator.create({
          sourceLanguage,
          targetLanguage,
          monitor: (m: any) => {
            m.addEventListener('downloadprogress', (e: any) => {
              console.log(`Translator: Downloaded ${e.loaded} of ${e.total} bytes.`);
            });
          },
        });
        await translator.ready;
      }
      const translation = await translator.translate(message.text);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === id ? { ...msg, translation, isLoadingTranslate: false } : msg
        )
      );
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === id ? { ...msg, error: 'Translation failed', isLoadingTranslate: false } : msg
        )
      );
    }
  };

  const handleTranslationLanguageChange = (id: number, lang: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, selectedTranslationLanguage: lang } : msg))
    );
  };

  return (
    <div className="app-container">
      <ChatWindow
        messages={messages}
        onSummarize={handleSummarize}
        onTranslate={handleTranslate}
        onTranslationLanguageChange={handleTranslationLanguageChange}
      />
      <InputArea inputText={inputText} setInputText={setInputText} handleSend={handleSend} />
    </div>
  );
};

export default App;
