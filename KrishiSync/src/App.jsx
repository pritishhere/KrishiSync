import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import heroImg from './assets/hero.png';
import './App.css';

// Config & Context
import { API_BASE_URL } from './services/apiConfig';
import { AppProvider } from './context/AppContext';
import Layout from './Components/layout/Layout';

// Member 1 Pages
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import ScannerPage from './pages/Scanner';
import MandiPage from './pages/Mandi';
import AgriPoolPage from './pages/AgriPool';
import BotGuidePage from './pages/BotGuide';

// Member 2 Components
import './Utils/i18n';
import LanguageSwitcher from './Components/LanguageSwitcher';
import VoiceSearch from './Components/VoiceSearch';
import MandiCalculator from './Components/MandiCalculator';
import LocationTracker from './Components/LocationTracker';

// Member 4 Components
import SmartIrrigation from './Components/SmartIrrigation';
import DiseaseScanner from './Components/DiseaseScanner';
import PhoneOtpAuth from './Components/PhoneOtpAuth';
import TwilioBotSimulator from './Components/TwilioBotSimulator';

function MainHome() {
  const { t } = useTranslation();
  const [health, setHealth] = useState('Checking...');
  const [speechText, setSpeechText] = useState('');
  const [voiceResponse, setVoiceResponse] = useState(null);
  const [voiceLoading, setVoiceLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/health`)
      .then((res) => res.json())
      .then((data) => setHealth(data.message || 'Online'))
      .catch(() => setHealth('Standby Mode'));
  }, []);

  const handleVoiceQuery = (queryText) => {
    const textToSend = queryText || speechText;
    if (!textToSend.trim()) return;
    setVoiceLoading(true);
    setVoiceResponse(null);

    fetch(`${API_BASE_URL}/api/voice/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: textToSend, lang: 'hi' })
    })
      .then((res) => res.json())
      .then((data) => {
        setVoiceLoading(false);
        if (data.success) {
          setVoiceResponse(data);
        } else {
          setVoiceResponse({ reply: data.message || 'Error processing query' });
        }
      })
      .catch(() => {
        setVoiceLoading(false);
        setVoiceResponse({
          reply: 'KrishiSync Advisor: To protect your crops, check soil moisture and use our AI Disease Scanner for instant leaf diagnostics.'
        });
      });
  };

  return (
    <main id="home" className="p-4 sm:p-8 lg:p-10 space-y-10 min-h-screen text-gray-900 overflow-x-hidden">
      
      {/* 2. MAIN HERO SECTION BOX - Black border with glowing light emerging throughout borders */}
      <section className="relative rounded-3xl p-0.5 bg-linear-to-r from-emerald-500 via-lime-400 to-teal-400 shadow-[0_0_50px_rgba(74,222,128,0.35)] transition-all duration-500">
        
        {/* Inner Obsidian Black Main Box */}
        <div className="bg-[#020f0a] text-white rounded-[22px] p-6 sm:p-10 lg:p-12 border-2 border-black grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden">
          
          {/* Ambient Glowing Light Orbs Inside Main Box */}
          <div className="absolute -right-24 -top-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-lime-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="lg:col-span-7 space-y-6 text-left relative z-10">
            
            {/* Top Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-950/90 border border-emerald-500/40 rounded-full text-xs font-black uppercase tracking-wider text-emerald-300 backdrop-blur-md shadow-[0_0_15px_rgba(52,211,153,0.2)]">
              <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-ping" />
              <span>{t('eyebrow') || 'AI-POWERED PRECISION AGRICULTURE'}</span>
            </div>

            {/* HUGE POPPING KRISHISYNC TITLE */}
            <div className="space-y-2">
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-none filter drop-shadow-[0_0_20px_rgba(74,222,128,0.4)]">
                <span className="text-white">Krishi</span>
                <span className="text-[#4ade80] drop-shadow-[0_0_35px_rgba(74,222,128,0.9)]">Sync</span>
              </h1>
              <p className="text-lg sm:text-2xl font-bold text-emerald-200 tracking-tight">
                {t('title') || 'Smart Agriculture Intelligence for Every Farmer'}
              </p>
            </div>

            <p className="text-sm sm:text-base text-emerald-100/80 max-w-xl leading-relaxed font-medium">
              Access real-time Mandi price intelligence, Plant.id AI leaf diagnostics, evapotranspiration water advisories, and 2G SMS connectivity.
            </p>

            {/* Integrated Voice & Text Search Drawer */}
            <div className="bg-[#031d10]/80 backdrop-blur-md p-4 rounded-2xl border border-emerald-500/30 shadow-inner space-y-3">
              <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center justify-between">
                <span>🎙️ Voice & Text AI Agronomist Query</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">Ask Anything</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={speechText}
                  onChange={(e) => setSpeechText(e.target.value)}
                  placeholder="Ask about wheat rust, tomato prices, or water schedule..."
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-900/90 text-white text-xs sm:text-sm font-semibold border border-emerald-800/60 placeholder:text-emerald-300/40 focus:outline-none focus:ring-2 focus:ring-[#4ade80] shadow-sm"
                />
                <div className="flex gap-2">
                  <VoiceSearch onSpeechResult={(transcript) => handleVoiceQuery(transcript)} />
                  <button
                    type="button"
                    onClick={() => handleVoiceQuery()}
                    className="px-6 py-3 bg-linear-to-r from-emerald-500 to-lime-400 hover:from-emerald-400 hover:to-lime-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(74,222,128,0.4)] active:scale-95 whitespace-nowrap"
                  >
                    Ask AI
                  </button>
                </div>
              </div>

              {voiceLoading && (
                <p className="text-xs text-emerald-300 animate-pulse font-semibold m-0">
                  ⚡ Querying Krishi-AI Agronomist Engine...
                </p>
              )}

              {voiceResponse && (
                <div className="p-3.5 bg-slate-900/95 text-white rounded-xl text-xs space-y-1.5 shadow-lg border border-emerald-500/40 animate-in fade-in">
                  <span className="font-extrabold text-[#4ade80] block">🌱 KrishiSync Answer:</span>
                  <p className="m-0 font-medium leading-relaxed text-emerald-100">{voiceResponse.reply || voiceResponse.transcript}</p>
                </div>
              )}
            </div>

            {/* Live Stats Bar */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-emerald-900/60">
              <div>
                <span className="text-xl sm:text-3xl font-black text-white block drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">10,000+</span>
                <span className="text-[10px] sm:text-xs text-emerald-400 font-bold uppercase tracking-wider">Active Farmers</span>
              </div>
              <div>
                <span className="text-xl sm:text-3xl font-black text-white block drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">54 Mandis</span>
                <span className="text-[10px] sm:text-xs text-emerald-400 font-bold uppercase tracking-wider">Live Rates</span>
              </div>
              <div>
                <span className="text-xl sm:text-3xl font-black text-white block drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">98.4%</span>
                <span className="text-[10px] sm:text-xs text-emerald-400 font-bold uppercase tracking-wider">AI Accuracy</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center relative z-10">
            <div className="relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-emerald-500 via-lime-400 to-teal-400 rounded-3xl blur-lg opacity-70 group-hover:opacity-100 transition duration-500" />
              <img 
                src={heroImg} 
                className="relative w-full max-w-70 sm:max-w-xs md:max-w-sm rounded-3xl shadow-2xl border-4 border-slate-900 object-cover transform group-hover:scale-[1.02] transition duration-300" 
                alt="KrishiSync farmer illustration" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES & SMART TOOLS GRID */}
      <section className="space-y-8">
        
        {/* Category A: Market & Financial Tools */}
        <div className="space-y-4">
          <div className="border-b border-emerald-800/60 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight m-0 flex items-center gap-2.5">
                <span className="p-1.5 bg-emerald-500/20 rounded-xl border border-emerald-500/40 text-emerald-400">💰</span>
                <span>Market Intelligence & Financial Tools</span>
              </h2>
              <p className="text-xs sm:text-sm text-emerald-200/70 m-0 mt-1 font-medium">
                Calculate net mandi earnings, locate nearby grain markets, and manage farmer accounts.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {/* Card 1: Mandi Net Profit Calculator */}
            <div id="calculator" className="h-full ks-card ks-appear p-6 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 bg-emerald-100 text-[#166534] rounded-2xl text-lg shadow-2xs">💰</span>
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900 m-0">Profit Estimator</h3>
                    <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Financial Tool</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <MandiCalculator mandiName="Kolkata Central Mandi" cropPricePerKg={30} distanceInKm={25} />
              </div>
            </div>

            {/* Card 2: GPS Mandi Locator */}
            <div id="mandi" className="h-full ks-card ks-appear p-6 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 bg-blue-100 text-blue-800 rounded-2xl text-lg shadow-2xs">📍</span>
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900 m-0">GPS Mandi Locator</h3>
                    <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Geolocation Market</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <LocationTracker onLocationFound={(loc) => console.log("Coordinates:", loc)} />
              </div>
            </div>

            {/* Card 3: Farmer Mobile OTP Auth */}
            <div className="h-full ks-card ks-appear p-6 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 bg-indigo-100 text-indigo-800 rounded-2xl text-lg shadow-2xs">📱</span>
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900 m-0">Farmer Mobile Auth</h3>
                    <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">SMS OTP Session</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <PhoneOtpAuth />
              </div>
            </div>
          </div>
        </div>

        {/* Category B: AI Agronomy & Offline Advisory */}
        <div className="space-y-4 pt-4">
          <div className="border-b border-emerald-800/60 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight m-0 flex items-center gap-2.5">
                <span className="p-1.5 bg-amber-500/20 rounded-xl border border-amber-500/40 text-amber-400">🔬</span>
                <span>AI Agronomy & Offline Advisory</span>
              </h2>
              <p className="text-xs sm:text-sm text-emerald-200/70 m-0 mt-1 font-medium">
                Diagnose crop diseases, optimize water usage, and test 2G feature phone SMS keywords.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {/* Card 4: AI Crop Disease Scanner */}
            <div className="h-full ks-card ks-appear p-6 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 bg-amber-100 text-amber-800 rounded-2xl text-lg shadow-2xs">🔬</span>
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900 m-0">Plant.id AI Scanner</h3>
                    <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Leaf Diagnostics</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <DiseaseScanner />
              </div>
            </div>

            {/* Card 5: Smart Irrigation Engine */}
            <div className="h-full ks-card ks-appear p-6 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 bg-teal-100 text-teal-800 rounded-2xl text-lg shadow-2xs">🌧️</span>
                  <div>
                    <h3 className="text-base font-extrabold text-[#166534] m-0">Smart Irrigation Engine</h3>
                    <span className="text-[10px] font-black text-teal-700 uppercase tracking-widest">Weather Rules</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <SmartIrrigation />
              </div>
            </div>

            {/* Card 6: Feature Phone SMS / IVR Advisory */}
            <div id="advisory" className="h-full ks-card ks-appear p-6 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 bg-emerald-100 text-emerald-800 rounded-2xl text-lg shadow-2xs">📟</span>
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900 m-0">2G SMS & WhatsApp Bot</h3>
                    <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Offline Simulator</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <TwilioBotSimulator />
              </div>
            </div>
          </div>
        </div>

      </section>
    </main>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<MainHome />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/scanner" element={<ScannerPage />} />
            <Route path="/mandi" element={<MandiPage />} />
            <Route path="/agri-pool" element={<AgriPoolPage />} />
            <Route path="/bot-guide" element={<BotGuidePage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AppProvider>
  );
}

