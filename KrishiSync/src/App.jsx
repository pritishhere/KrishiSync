import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Leaf, Sprout, Tractor, Banknote, Smartphone, MapPin, Microscope, CloudRain, MessageSquare } from 'lucide-react';
import './App.css';

// Config & Context
import { API_BASE_URL } from './services/apiConfig';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';

// Member 1 Pages
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import ScannerPage from './pages/Scanner';
import MandiPage from './pages/Mandi';
import AgriPoolPage from './pages/Agripool';
import BotGuidePage from './pages/Botguide';

// Member 2 Components
import './i18n';
import LanguageSwitcher from './Components/LanguageSwitcher';
import VoiceSearch from './Components/VoiceSearch';
import MandiCalculator from './Components/MandiCalculator';
import MandiMapLocator from './Components/MandiMapLocator';

// Member 4 Components
import SmartIrrigation from './Components/SmartIrrigation';
import DiseaseScanner from './Components/DiseaseScanner';
import PhoneOtpAuth from './Components/PhoneOtpAuth';
import TwilioBotSimulator from './Components/TwilioBotSimulator';

// Animated Vector Doodles
import FarmerCowAnimatedDoodle from './Components/doodles/FarmerCowAnimatedDoodle';
import MandiCartDoodle from './Components/doodles/MandiCartDoodle';
import CropScanDoodle from './Components/doodles/CropScanDoodle';

function MainHome() {
  const { t } = useTranslation();
  const [health, setHealth] = useState('Checking...');
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/health`)
      .then((res) => res.json())
      .then((data) => setHealth(data.message || 'Online'))
      .catch(() => setHealth('Standby Mode'));
  }, []);

  return (
    <main id="home" className="p-4 sm:p-8 lg:p-10 space-y-12 min-h-screen text-gray-900 overflow-x-hidden bg-linear-to-b from-[#f8faf6] via-[#f0f7ef] to-[#f8faf6]">
      
      {/* 🌾 HERO SECTION WITH ANIMATED FARMER & COW DOODLE */}
      <section className="relative rounded-3xl p-0 bg-linear-to-br from-[#1b4318] via-[#2d5a27] to-[#0f2a10] overflow-hidden border-2 border-emerald-500/30 shadow-2xl">
        {/* Ambient Radial Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-10 left-10 w-80 h-80 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 p-6 sm:p-10 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-white">
          
          {/* Left Column: Title & Search */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-400/40 text-emerald-300 text-xs sm:text-sm font-extrabold tracking-wide shadow-inner backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              🌾 {t('eyebrow') || 'AI-Powered Indian Farming Ecosystem'}
            </span>

            {/* HUGE SHIMMER TITLE */}
            <div className="space-y-3">
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-none text-white drop-shadow-md font-heading">
                Krishi<span className="text-shimmer">Sync</span>
              </h1>
              <p className="text-lg sm:text-2xl font-bold text-emerald-100 tracking-tight font-heading">
                {t('subtitle') || 'Smart Agriculture Intelligence for Every Farmer'}
              </p>
            </div>

            <p className="text-base sm:text-lg text-emerald-100/90 max-w-xl leading-relaxed font-medium">
              {t('hero_desc') || 'Access real-time Mandi price intelligence, Plant.id AI leaf diagnostics, evapotranspiration water advisories, and 2G SMS connectivity.'}
            </p>

            {/* Integrated Voice & Text Search Drawer */}
            <div className="pt-2">
              <VoiceSearch />
            </div>

            {/* Live Stats Bar */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-emerald-400/20">
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-center">
                <span className="text-xl sm:text-3xl font-black text-amber-300 block">10,000+</span>
                <span className="text-[11px] text-emerald-100 font-bold uppercase tracking-wider">{t('active_farmers') || 'Active Farmers'}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-center">
                <span className="text-xl sm:text-3xl font-black text-emerald-300 block">54 Mandis</span>
                <span className="text-[11px] text-emerald-100 font-bold uppercase tracking-wider">{t('live_mandis') || 'Live Rates'}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-center">
                <span className="text-xl sm:text-3xl font-black text-cyan-300 block">98.4%</span>
                <span className="text-[11px] text-emerald-100 font-bold uppercase tracking-wider">{t('ai_accuracy') || 'AI Accuracy'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Authentic Happy Indian Farmer Photo Card */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative w-full max-w-md bg-white/15 backdrop-blur-2xl p-3 sm:p-4 rounded-3xl border-2 border-emerald-400/40 shadow-2xl hover:scale-102 transition-all duration-500 group">
              
              {/* Badge Overlay */}
              <div className="flex items-center justify-between mb-3 px-2">
                <span className="text-xs font-black uppercase tracking-widest text-amber-300 flex items-center gap-1.5 font-heading">
                  🌾 {t('farmer_pride') || 'Indian Farmer Pride'}
                </span>
                <span className="text-[10px] bg-emerald-500/40 text-emerald-100 px-3 py-1 rounded-full font-black border border-emerald-400/40 tracking-wider">
                  {t('verified_partner') || 'VERIFIED KRISHI PARTNER'}
                </span>
              </div>
              
              {/* User Uploaded Farmer Photo */}
              <div className="relative overflow-hidden rounded-2xl border border-white/20 shadow-lg bg-emerald-950">
                <img
                  src="/assets/happy_farmer_victory.png"
                  alt="Smiling Indian Farmer in Green Agriculture Field"
                  className="w-full h-72 sm:h-80 object-cover object-center scale-100 group-hover:scale-103 transition-transform duration-700 rounded-2xl"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                
                {/* Floating Victory Tag */}
                <div className="absolute bottom-3 left-3 bg-emerald-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/40 text-amber-300 text-xs font-extrabold flex items-center gap-1.5 shadow-md">
                  <span>✌️ Jai Jawan, Jai Kisan</span>
                </div>
              </div>

              {/* Bottom Caption */}
              <div className="mt-3 bg-black/30 backdrop-blur-md p-3 rounded-2xl border border-white/15 text-center">
                <p className="text-xs text-emerald-100 font-extrabold flex items-center justify-center gap-2 m-0">
                  <span>🌾 {t('empowering_caption') || 'Empowering 10,000+ Indian Farmers with Smart AI Intelligence'}</span>
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. CORE FEATURES & SMART TOOLS GRID */}
      <section className="space-y-10">
        
        {/* Category A: Market & Financial Tools */}
        <div className="space-y-5">
          <div className="border-b border-[#e2dcd0] pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight m-0 flex items-center gap-3">
                <MandiCartDoodle className="w-10 h-10" />
                <span>Market Intelligence & Financial Tools</span>
              </h2>
              <p className="text-base text-gray-600 m-0 mt-1 font-medium">
                Calculate net mandi earnings, locate nearby grain markets, and manage farmer accounts.
              </p>
            </div>
          </div>

          {/* Top row: 2-col — Profit Estimator + Farmer Mobile Auth */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Card 1: Mandi Net Profit Calculator */}
            <div id="calculator" className="h-full glass-panel rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-emerald-500/20">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 bg-emerald-100 text-[#2d5a27] rounded-xl text-lg shadow-xs">
                    <Banknote className="w-6 h-6" />
                  </span>
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900 m-0">Profit Estimator</h3>
                    <span className="text-xs font-black text-[#5c4033] uppercase tracking-widest">Financial Tool</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black tracking-wider animate-pulse border border-emerald-300">⚡ ELECTRIC AI</span>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <MandiCalculator mandiName="Kolkata Central Mandi" cropPricePerKg={30} distanceInKm={25} />
              </div>
            </div>

            {/* Card 3: Farmer Mobile OTP Auth */}
            <div className="h-full glass-panel rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-purple-500/20">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 bg-purple-100 text-purple-700 rounded-xl text-lg shadow-xs">
                    <Smartphone className="w-6 h-6" />
                  </span>
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900 m-0">Farmer Mobile Auth</h3>
                    <span className="text-xs font-black text-purple-700 uppercase tracking-widest">SMS OTP Session</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 text-[10px] font-black tracking-wider animate-pulse border border-purple-300">⚡ ELECTRIC AI</span>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <PhoneOtpAuth />
              </div>
            </div>
          </div>

          {/* Full-width row: GPS Mandi Locator */}
          <div id="mandi" className="glass-panel rounded-2xl p-6 flex flex-col space-y-4 w-full shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-500/20">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-3">
                <span className="p-2.5 bg-blue-100 text-blue-700 rounded-xl text-lg shadow-xs">
                  <MapPin className="w-6 h-6" />
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-gray-900 m-0">GPS Mandi Locator</h3>
                  <span className="text-xs font-black text-blue-700 uppercase tracking-widest">Geolocation Market</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black tracking-wider animate-pulse border border-blue-300">📍 LIVE MAP</span>
            </div>
            <MandiMapLocator />
          </div>

        </div>

        {/* Category B: AI Agronomy & Offline Advisory */}
        <div className="space-y-5 pt-4">
          <div className="border-b border-[#e2dcd0] pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight m-0 flex items-center gap-3">
                <CropScanDoodle className="w-10 h-10" />
                <span>AI Agronomy & Offline Advisory</span>
              </h2>
              <p className="text-base text-gray-600 m-0 mt-1 font-medium">
                Diagnose crop diseases, optimize water usage, and test 2G feature phone SMS keywords.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {/* Card 4: AI Crop Disease Scanner */}
            <div className="glass-panel rounded-2xl p-6 flex flex-col space-y-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-500/20">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 bg-amber-100 text-amber-800 rounded-xl text-lg shadow-xs">
                    <Microscope className="w-6 h-6" />
                  </span>
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900 m-0">Plant.id AI Scanner</h3>
                    <span className="text-xs font-black text-amber-700 uppercase tracking-widest">Leaf Diagnostics</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black tracking-wider animate-pulse border border-amber-300">⚡ ELECTRIC AI</span>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <DiseaseScanner />
              </div>
            </div>

            {/* Card 5: Smart Irrigation Engine */}
            <div className="glass-panel rounded-2xl p-6 flex flex-col space-y-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-cyan-500/20">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 bg-cyan-100 text-cyan-800 rounded-xl text-lg shadow-xs">
                    <CloudRain className="w-6 h-6" />
                  </span>
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900 m-0">Smart Irrigation Engine</h3>
                    <span className="text-xs font-black text-cyan-700 uppercase tracking-widest">Weather Rules</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-cyan-100 text-cyan-800 text-[10px] font-black tracking-wider animate-pulse border border-cyan-300">⚡ ELECTRIC AI</span>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <SmartIrrigation />
              </div>
            </div>

            {/* Card 6: Feature Phone SMS / IVR Advisory */}
            <div id="advisory" className="glass-panel rounded-2xl p-6 flex flex-col space-y-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-500/20">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 bg-emerald-100 text-[#2d5a27] rounded-xl text-lg shadow-xs">
                    <MessageSquare className="w-6 h-6" />
                  </span>
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900 m-0">2G SMS & WhatsApp Bot</h3>
                    <span className="text-xs font-black text-[#5c4033] uppercase tracking-widest">Offline Simulator</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black tracking-wider animate-pulse border border-emerald-300">⚡ ELECTRIC AI</span>
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

