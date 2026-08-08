import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import heroImg from './assets/hero.png';
import './App.css';

// Context & Layout
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';

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

  useEffect(() => {
    fetch('http://localhost:5000/api/health')
      .then((res) => res.json())
      .then((data) => setHealth(data.message))
      .catch(() => setHealth('Backend offline'));
  }, []);

  return (
    <main className="app-shell">
      {/* Hero Section */}
      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">{t('eyebrow')}</p>
          <h1>{t('title')}</h1>
          <p className="subtitle">{t('subtitle')}</p>
          <div className="hero-actions">
            <a className="primary-btn" href="https://github.com/pritishhere/KrishiSync" target="_blank" rel="noreferrer">
              {t('view_github')}
            </a>
            <span className="status-pill">Backend: {health}</span>
          </div>
        </div>
        <img src={heroImg} className="hero-image" alt="KrishiSync illustration" />
      </section>

      {/* MEMBER 4 (X-FACTOR & INTELLIGENCE) */}
      <section style={{
        margin: '20px 0',
        padding: '24px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        textAlign: 'left',
        color: '#1a1a1a',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#166534', margin: 0, borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
          {t('xfactor_title')}
        </h2>
        <PhoneOtpAuth />
        <SmartIrrigation />
        <DiseaseScanner />
        <TwilioBotSimulator />
      </section>

      {/* MEMBER 2 (SMART INTEGRATIONS) */}
      <section style={{
        margin: '20px 0',
        padding: '24px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        textAlign: 'left',
        color: '#1a1a1a'
      }}>
        <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#166534', marginBottom: '16px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
          {t('smart_integrations')}
        </h2>
        <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '8px' }}>{t('multilingual_switcher')}</h3>
          <LanguageSwitcher />
        </div>
        <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '8px' }}>{t('voice_search')}</h3>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="text"
              value={speechText}
              onChange={(e) => setSpeechText(e.target.value)}
              placeholder={t('voice_placeholder')}
              style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#ffffff', color: '#000000' }}
            />
            <VoiceSearch onSpeechResult={(text) => setSpeechText(text)} />
          </div>
        </div>
        <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '8px' }}>{t('gps_mandi')}</h3>
          <LocationTracker onLocationFound={(loc) => console.log("Current Coordinates:", loc)} />
        </div>
        <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '8px' }}>{t('profit_calc')}</h3>
          <MandiCalculator mandiName="Kolkata Central Mandi" cropPricePerKg={30} distanceInKm={25} />
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
