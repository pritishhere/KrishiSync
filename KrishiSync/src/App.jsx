import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Leaf, Sprout, Tractor, Banknote, Smartphone, MapPin, Microscope, CloudRain, MessageSquare } from 'lucide-react';
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
import MandiMapLocator from './Components/MandiMapLocator';

// Member 4 Components
import SmartIrrigation from './Components/SmartIrrigation';
import DiseaseScanner from './Components/DiseaseScanner';
import PhoneOtpAuth from './Components/PhoneOtpAuth';
import TwilioBotSimulator from './Components/TwilioBotSimulator';

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
    <main id="home" className="p-4 sm:p-8 lg:p-10 space-y-10 min-h-screen text-gray-900 overflow-x-hidden">
      
      <section className="relative rounded-lg p-0 bg-[#2d5a27] overflow-hidden border border-[#e2dcd0] shadow-xl">
        {/* Blurred Farmer Background */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center blur-sm scale-110 opacity-90"
          style={{ backgroundImage: "url('https://t4.ftcdn.net/jpg/05/95/55/89/360_F_595558921_z1JnF4ieH75XlWoDPuh1Os97QkPnb4dx.jpg')" }}
        />
        {/* Dark Overlay for Readability */}
        <div className="absolute inset-0 z-0 bg-green-950/75" />
        
        <div className="relative z-10 p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-white">
          <div className="lg:col-span-8 space-y-6 text-left">
            

            {/* HUGE POPPING KRISHISYNC TITLE */}
            <div className="space-y-2">
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-none text-white">
                Krishi<span className="text-[#e8e0d5]">Sync</span>
              </h1>
              <p className="text-lg sm:text-2xl font-bold text-emerald-100 tracking-tight">
                {t('title') || 'Smart Agriculture Intelligence for Every Farmer'}
              </p>
            </div>

            <p className="text-base sm:text-lg text-emerald-50 max-w-xl leading-relaxed font-medium">
              Access real-time Mandi price intelligence, Plant.id AI leaf diagnostics, evapotranspiration water advisories, and 2G SMS connectivity.
            </p>

            {/* Integrated Voice & Text Search Drawer */}
            <VoiceSearch />

            {/* Live Stats Bar */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#e8e0d5]/20">
              <div>
                <span className="text-xl sm:text-3xl font-black text-white block">10,000+</span>
                <span className="text-xs text-emerald-200 font-bold uppercase tracking-wider">Active Farmers</span>
              </div>
              <div>
                <span className="text-xl sm:text-3xl font-black text-white block">54 Mandis</span>
                <span className="text-xs text-emerald-200 font-bold uppercase tracking-wider">Live Rates</span>
              </div>
              <div>
                <span className="text-xl sm:text-3xl font-black text-white block">98.4%</span>
                <span className="text-xs text-emerald-200 font-bold uppercase tracking-wider">AI Accuracy</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES & SMART TOOLS GRID */}
      <section className="space-y-8">
        
        {/* Category A: Market & Financial Tools */}
        <div className="space-y-4">
          <div className="border-b border-[#e2dcd0] pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight m-0 flex items-center gap-2.5">
                <span className="p-1.5 bg-[#e8e0d5] rounded-lg border border-[#e2dcd0] text-[#5c4033]">
                  <Banknote className="w-5 h-5" />
                </span>
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
            <div id="calculator" className="h-full bg-white rounded-lg border border-[#e2dcd0] p-6 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between border-b border-[#e2dcd0] pb-3">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 bg-[#f9f8f6] text-[#2d5a27] border border-[#e2dcd0] rounded-md text-lg">
                    <Banknote className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900 m-0">Profit Estimator</h3>
                    <span className="text-xs font-black text-[#5c4033] uppercase tracking-widest">Financial Tool</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <MandiCalculator mandiName="Kolkata Central Mandi" cropPricePerKg={30} distanceInKm={25} />
              </div>
            </div>

            {/* Card 3: Farmer Mobile OTP Auth */}
            <div className="h-full bg-white rounded-lg border border-[#e2dcd0] p-6 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between border-b border-[#e2dcd0] pb-3">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 bg-[#f9f8f6] text-[#5c4033] border border-[#e2dcd0] rounded-md text-lg">
                    <Smartphone className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900 m-0">Farmer Mobile Auth</h3>
                    <span className="text-xs font-black text-[#5c4033] uppercase tracking-widest">SMS OTP Session</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <PhoneOtpAuth />
              </div>
            </div>
          </div>

          {/* Full-width row: GPS Mandi Locator */}
          <div id="mandi" className="bg-white rounded-lg border border-[#e2dcd0] p-6 flex flex-col space-y-4 w-full">
            <div className="flex items-center justify-between border-b border-[#e2dcd0] pb-3">
              <div className="flex items-center gap-3">
                <span className="p-2.5 bg-[#f9f8f6] text-[#2d5a27] border border-[#e2dcd0] rounded-md text-lg">
                  <MapPin className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-gray-900 m-0">GPS Mandi Locator</h3>
                  <span className="text-xs font-black text-[#5c4033] uppercase tracking-widest">Geolocation Market</span>
                </div>
              </div>
            </div>
            <MandiMapLocator />
          </div>

        </div>

        {/* Category B: AI Agronomy & Offline Advisory */}
        <div className="space-y-4 pt-4">
          <div className="border-b border-[#e2dcd0] pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight m-0 flex items-center gap-2.5">
                <span className="p-1.5 bg-[#e8e0d5] rounded-lg border border-[#e2dcd0] text-[#5c4033]">
                  <Microscope className="w-5 h-5" />
                </span>
                <span>AI Agronomy & Offline Advisory</span>
              </h2>
              <p className="text-base text-gray-600 m-0 mt-1 font-medium">
                Diagnose crop diseases, optimize water usage, and test 2G feature phone SMS keywords.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {/* Card 4: AI Crop Disease Scanner */}
            <div className="bg-white rounded-lg border border-[#e2dcd0] p-6 flex flex-col space-y-4">
              <div className="flex items-center justify-between border-b border-[#e2dcd0] pb-3">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 bg-[#f9f8f6] text-[#2d5a27] border border-[#e2dcd0] rounded-md text-lg">
                    <Microscope className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900 m-0">Plant.id AI Scanner</h3>
                    <span className="text-xs font-black text-[#5c4033] uppercase tracking-widest">Leaf Diagnostics</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <DiseaseScanner />
              </div>
            </div>

            {/* Card 5: Smart Irrigation Engine */}
            <div className="bg-white rounded-lg border border-[#e2dcd0] p-6 flex flex-col space-y-4">
              <div className="flex items-center justify-between border-b border-[#e2dcd0] pb-3">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 bg-[#f9f8f6] text-[#0ea5e9] border border-[#e2dcd0] rounded-md text-lg">
                    <CloudRain className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-extrabold text-[#2d5a27] m-0">Smart Irrigation Engine</h3>
                    <span className="text-xs font-black text-[#0ea5e9] uppercase tracking-widest">Weather Rules</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <SmartIrrigation />
              </div>
            </div>

            {/* Card 6: Feature Phone SMS / IVR Advisory */}
            <div id="advisory" className="bg-white rounded-lg border border-[#e2dcd0] p-6 flex flex-col space-y-4">
              <div className="flex items-center justify-between border-b border-[#e2dcd0] pb-3">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 bg-[#f9f8f6] text-[#5c4033] border border-[#e2dcd0] rounded-md text-lg">
                    <MessageSquare className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900 m-0">2G SMS & WhatsApp Bot</h3>
                    <span className="text-xs font-black text-[#5c4033] uppercase tracking-widest">Offline Simulator</span>
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

