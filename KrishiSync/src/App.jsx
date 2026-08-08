import { useState, useEffect } from 'react'
import heroImg from './assets/hero.png'
import './App.css'

// Importing Member 2 (Aritra) Components
import './Utils/i18n'
import LanguageSwitcher from './Components/LanguageSwitcher'
import VoiceSearch from './Components/VoiceSearch'
import MandiCalculator from './Components/MandiCalculator'
import LocationTracker from './Components/LocationTracker'

function App() {
  const [health, setHealth] = useState('Checking...')
  const [speechText, setSpeechText] = useState('')

  useEffect(() => {
    fetch('http://localhost:5000/api/health')
      .then((res) => res.json())
      .then((data) => setHealth(data.message))
      .catch(() => setHealth('Backend offline'))
  }, [])

  return (
    <main className="app-shell">
      {/* Hero Section */}
      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">Hackathon-ready MERN app</p>
          <h1>KrishiSync</h1>
          <p className="subtitle">
            A modern full-stack platform built for fast demos, clean UI, and a reliable backend.
          </p>
          <div className="hero-actions">
            <a className="primary-btn" href="https://github.com/pritishhere/KrishiSync" target="_blank" rel="noreferrer">
              View on GitHub
            </a>
            <span className="status-pill">Backend: {health}</span>
          </div>
        </div>
        <img src={heroImg} className="hero-image" alt="KrishiSync illustration" />
      </section>

      {/* CODE BUILT BY ARITRA (MEMBER 2: DATA & MAPS INTEGRATOR) */}
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
          🌾 Smart Integrations Module
        </h2>

        {/* 1. Language Toggle */}
        <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '8px' }}>Multilingual Switcher</h3>
          <LanguageSwitcher />
        </div>

        {/* 2. Voice Search */}
        <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '8px' }}>Voice Search (Web Speech API)</h3>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input 
              type="text" 
              value={speechText} 
              onChange={(e) => setSpeechText(e.target.value)} 
              placeholder="Spoken search term will appear here..."
              style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#ffffff', color: '#000000' }}
            />
            <VoiceSearch onSpeechResult={(text) => setSpeechText(text)} />
          </div>
        </div>

        {/* 3. Location Tracker */}
        <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '8px' }}>GPS Mandi Finder</h3>
          <LocationTracker onLocationFound={(loc) => console.log("Current Coordinates:", loc)} />
        </div>

        {/* 4. Mandi Net Profit Calculator */}
        <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '8px' }}>Net Profit Routing Calculator</h3>
          <MandiCalculator mandiName="Kolkata Central Mandi" cropPricePerKg={30} distanceInKm={25} />
        </div>
      </section>

      {/* Feature Grid */}
      <section className="feature-grid">
        <article>
          <h2>React + Vite</h2>
          <p>Fast frontend development with a polished landing page.</p>
        </article>
        <article>
          <h2>Express + MongoDB</h2>
          <p>API-ready backend connected for future features and data models.</p>
        </article>
        <article>
          <h2>Ready to demo</h2>
          <p>Everything is wired so you can show the stack end to end tomorrow.</p>
        </article>
      </section>
    </main>
  )
}

export default App