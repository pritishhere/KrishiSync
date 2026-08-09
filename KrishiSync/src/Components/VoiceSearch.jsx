import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { voiceService } from '../services/voiceService';
import { Mic, AlertTriangle, CheckCircle, Zap, Sprout } from 'lucide-react';

export default function VoiceSearch() {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [statusText, setStatusText] = useState('');
  
  const { t, i18n } = useTranslation();

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
        setStatusText('Listening... Speak into mic.');
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setStatusText('Mic access blocked');
          alert("Microphone permission blocked! Please allow microphone access in your browser address bar.");
        } else if (event.error === 'no-speech') {
          setStatusText('No speech detected.');
        } else {
          setStatusText(`Voice error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setStatusText(`Heard: "${transcript}"`);
        setQuery(transcript);
        // Automatically ask AI once transcribed
        handleAskAI(transcript);
      };

      recognition.start();
    } catch (err) {
      console.error('Failed to start SpeechRecognition:', err);
      setIsListening(false);
      setStatusText('Voice engine launch error');
    }
  };

  const handleAskAI = async (textToSearch = query) => {
    if (!textToSearch.trim()) return;
    
    setIsLoading(true);
    setAiResponse(null);
    setStatusText('');

    try {
      const currentLang = i18n.language || 'hi';
      const data = await voiceService.askAgronomist(textToSearch, currentLang);
      setAiResponse(data);
    } catch (error) {
      console.error(error);
      setAiResponse({ answer: 'KrishiSync Advisor: We encountered an error connecting to the AI system. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20 space-y-3 w-full">
      <div className="text-sm font-bold text-white uppercase tracking-wider flex items-center justify-between">
        <span className="flex items-center gap-2"><Mic className="w-4 h-4" /> {t('voice_title') || 'Voice & Text AI Agronomist Query'}</span>
        <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-md border border-white/30">{t('ask_anything') || 'Ask Anything'}</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
          placeholder={t('voice_search_placeholder') || "Ask about wheat rust, tomato prices, or water schedule..."}
          className="flex-1 px-4 py-3 rounded-md bg-white text-gray-900 text-sm font-semibold border border-white/60 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2d5a27]"
        />
        <div className="flex gap-2">
          {/* Voice Search Button */}
          <button 
            type="button"
            onClick={startListening}
            title={t('voice_search_title') || "Use Voice Search"}
            className={`w-full sm:w-auto px-4 py-2.5 rounded-md font-bold text-sm transition-all flex items-center justify-center gap-2 border ${
              isListening 
                ? 'bg-red-50 text-red-600 hover:bg-red-100 border-red-200 animate-pulse' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>{isListening ? (t('listening') || 'Listening...') : (t('voice_search') || 'Voice Search')}</span>
          </button>
          
          {/* Ask AI Button */}
          <button
            type="button"
            onClick={() => handleAskAI()}
            disabled={isLoading || isListening}
            className="px-6 py-3 bg-[#e8e0d5] hover:bg-[#d6cec3] text-[#2d5a27] font-black text-sm rounded-md transition-all active:scale-95 whitespace-nowrap disabled:opacity-70 border border-[#2d5a27]/10"
          >
            Ask AI
          </button>
        </div>
      </div>

      {(statusText || isLoading) && (
        <p className={`text-xs font-semibold m-0 flex items-center gap-1 ${isLoading ? 'text-white animate-pulse' : 'text-emerald-100'}`}>
          {isLoading && <Zap className="w-3 h-3" />}
          {isLoading ? 'Querying Krishi-AI Agronomist Engine...' : statusText}
        </p>
      )}

      {/* Dynamic Results Card */}
      {aiResponse && (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-md p-4 mt-4 text-white shadow-sm animate-in fade-in flex flex-col items-center justify-center text-center">
          <div className="w-full flex items-center justify-between mb-2 border-b border-white/20 pb-2">
             <span className="font-extrabold flex items-center gap-2">
               <Sprout className="w-5 h-5" /> AI Agronomist Answer:
             </span>
             {aiResponse.answeredBy && (
                <span className="text-[9px] uppercase tracking-widest text-emerald-100 font-bold border border-emerald-100/30 px-2 py-0.5 rounded-md">
                  {aiResponse.answeredBy}
                </span>
             )}
          </div>
          <p className="m-0 font-medium leading-relaxed text-sm text-white whitespace-pre-line max-w-2xl mt-2">
            {aiResponse.answer}
          </p>
        </div>
      )}
    </div>
  );
}