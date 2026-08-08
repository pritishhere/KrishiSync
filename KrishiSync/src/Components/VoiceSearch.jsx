import React, { useState } from 'react';

export default function VoiceSearch({ onSpeechResult }) {
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Please open this app in Google Chrome for voice search!");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (onSpeechResult) {
        onSpeechResult(transcript);
      }
    };

    recognition.start();
  };

  return (
    <button 
      onClick={startListening}
      style={{
        padding: '10px 20px',
        borderRadius: '20px',
        border: 'none',
        backgroundColor: isListening ? '#ef4444' : '#16a34a',
        color: '#ffffff',
        fontWeight: 'bold',
        cursor: 'pointer'
      }}
    >
      {isListening ? '🎙️ Listening...' : '🎤 Speak'}
    </button>
  );
}