import React from 'react';
import { Shield, Users, Globe2, Leaf, Zap, Accessibility, ArrowRight } from 'lucide-react';

export default function Home({ setView }) {
  return (
    <div className="hero-section">
      <div className="logo-badge" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
        🏟️ MULTI-SPORT SMART ARENA SANDBOX
      </div>
      
      <h1 className="hero-title">
        Next-Generation Stadium Operations & Fan Intelligence
      </h1>
      
      <p className="hero-description">
        ArenaFlow AI leverages real-time Generative AI to orchestrate stadium safety, optimize transport hubs, route crowds, coordinate sustainability targets, and provide instant multilingual concierge services for fans, staff, and volunteers across all sporting events.
      </p>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '4rem' }}>
        <button onClick={() => setView('fan')} className="btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
          <Globe2 size={20} />
          Launch Fan Portal
          <ArrowRight size={16} />
        </button>
        <button onClick={() => setView('ops')} className="btn-secondary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
          <Shield size={20} style={{ marginRight: '0.5rem', display: 'inline' }} />
          Enter Operations Command Center
        </button>
      </div>

      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '1rem' }}>
        Core Intelligent Capabilities
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Empowering major sports arenas and stadiums with real-time operational decision support
      </p>

      <div className="hero-features">
        <div className="glass-panel hero-feature-card">
          <div className="stat-icon theme-blue" style={{ marginBottom: '1rem' }}>
            <Users size={24} />
          </div>
          <h3>GenAI Crowd Dynamics</h3>
          <p>
            Simulates video feed analytics across gates, concessions, and ticket entrances. GenAI detects congestion patterns and suggests redirection tactics in real time.
          </p>
        </div>

        <div className="glass-panel hero-feature-card">
          <div className="stat-icon theme-green" style={{ marginBottom: '1rem' }}>
            <Globe2 size={24} />
          </div>
          <h3>Multilingual Concierge</h3>
          <p>
            Supports translation and natural language chat in multiple global languages, resolving complex directions, venue rules, transit options, and accessibility options instantly.
          </p>
        </div>

        <div className="glass-panel hero-feature-card">
          <div className="stat-icon theme-magenta" style={{ marginBottom: '1rem' }}>
            <Shield size={24} />
          </div>
          <h3>AI Incident Management</h3>
          <p>
            Instantly categories incoming stadium incidents, drafts customized instructions for volunteers, and coordinates emergency services using structured LLM intelligence.
          </p>
        </div>

        <div className="glass-panel hero-feature-card">
          <div className="stat-icon theme-gold" style={{ marginBottom: '1rem' }}>
            <Leaf size={24} />
          </div>
          <h3>Eco & Sustainability Sync</h3>
          <p>
            Monitors real-time recycling rates, energy loads, and food surplus. Generative suggestions guide waste mitigation and coordinate donation pickups.
          </p>
        </div>
      </div>
    </div>
  );
}
