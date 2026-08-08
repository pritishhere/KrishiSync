import { useState, useEffect } from 'react'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [health, setHealth] = useState('Checking...')

  useEffect(() => {
    fetch('http://localhost:5000/api/health')
      .then((res) => res.json())
      .then((data) => setHealth(data.message))
      .catch(() => setHealth('Backend offline'))
  }, [])

  return (
    <main className="app-shell">
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
