import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function VoiceSearch({ onSpeechResult }) {
  const [isListening, setIsListening] = useState(false);
  const [statusText, setStatusText] = useState('');
  const { i18n } = useTranslation();

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Please open this app in Google Chrome or Microsoft Edge for Voice Search!");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      const currentLang = i18n.language || 'hi';
      recognition.lang = currentLang.startsWith('en') ? 'en-IN' : currentLang.startsWith('bn') ? 'bn-IN' : 'hi-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setStatusText('🎙️ Listening... Speak into mic.');
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          alert("Microphone permission blocked! Please allow microphone access in your browser address bar.");
          setStatusText('⚠️ Mic access blocked');
        } else if (event.error === 'no-speech') {
          setStatusText('⚠️ No speech detected. Try again.');
        } else {
          setStatusText(`⚠️ Voice error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setStatusText(`✅ "${transcript}"`);
        if (onSpeechResult) {
          onSpeechResult(transcript);
        }
      };

      recognition.start();
    } catch (err) {
      console.error('Failed to start SpeechRecognition:', err);
      setIsListening(false);
      setStatusText('⚠️ Voice engine launch error');
    }
  };

  return (
    <div className="flex flex-col items-start gap-1 w-full sm:w-auto">
      <button 
        type="button"
        onClick={startListening}
        className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 border ${
          isListening 
            ? 'bg-red-600 hover:bg-red-700 border-red-700 animate-pulse' 
            : 'bg-[#166534] hover:bg-green-800 border-green-800'
        }`}
      >
        <span>{isListening ? '🎙️ Listening...' : '🎤 Voice Search'}</span>
      </button>

      {statusText && (
        <p className="text-[10px] sm:text-xs font-semibold text-gray-600 mt-0.5">
          {statusText}
        </p>
      )}
    </div>
  );
}