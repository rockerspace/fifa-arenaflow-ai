import React, { useState } from 'react';
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import FanPortal from './pages/FanPortal.jsx';
import { Shield, Users, Globe2, Compass, AlertCircle } from 'lucide-react';

export default function App() {
  const [view, setView] = useState('home');
  const [currentScenario, setCurrentScenario] = useState('none');
  
  // Shared state for incident tickets
  const [tickets, setTickets] = useState([
    {
      id: 101,
      type: 'Infrastructure Repair',
      location: 'Gate A - Scanner 3',
      description: 'NFC ticket reader failing to register digital wallet tickets.',
      severity: 'Medium',
      status: 'Active',
      aiInstructions: 'Notify IT support hub and dispatch technician A1 with an replacement reader.'
    },
    {
      id: 102,
      type: 'Crowd Issue',
      location: 'Section 104 Concourse',
      description: 'Slow queue building near the primary security corridor.',
      severity: 'Medium',
      status: 'Active',
      aiInstructions: 'Instruct stewards in Section 104 to direct incoming fans to Gate B.'
    }
  ]);

  const addIncidentTicket = (newTicket) => {
    const ticketObj = {
      id: Date.now(),
      status: 'Active',
      aiInstructions: `AI Auto-Dispatch: Alert closest volunteer in zone ${newTicket.location}. Assist protocol initiated.`,
      ...newTicket
    };
    setTickets((prev) => [...prev, ticketObj]);
  };

  const handleScenarioChange = (scenarioName) => {
    setCurrentScenario(scenarioName);
    
    // Auto-create tickets based on selected scenario
    if (scenarioName === 'transit_jam') {
      addIncidentTicket({
        type: 'Crowd Issue',
        location: 'South Transit Link Terminal',
        description: '🚨 Transit Delay Alert: Crowds exceeding capacity limits due to rail delay.',
        severity: 'High'
      });
    } else if (scenarioName === 'evac') {
      addIncidentTicket({
        type: 'Emergency Support',
        location: 'All Sectors / General Stadium',
        description: '⚡ Weather evacuation warning initiated. Safe exit routes routing activated.',
        severity: 'High'
      });
    }
  };

  return (
    <div className="app-container">
      {/* Global Scenario Emergency Warning Bar */}
      {currentScenario !== 'none' && (
        <div style={{
          background: currentScenario === 'evac' ? 'var(--status-danger)' : 'var(--status-warning)',
          color: '#070b19',
          fontWeight: 'bold',
          padding: '0.6rem 2rem',
          textAlign: 'center',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          zIndex: 101
        }}>
          <AlertCircle size={16} />
          <span>
            {currentScenario === 'evac' && "⚠️ CRITICAL ALERT: Stadium Evacuation Mode Active. Proceed to nearest exit gates."}
            {currentScenario === 'transit_jam' && "⚠️ TRANSIT DELAY: Rail delays at South Link. Shuttle routing modified."}
            {currentScenario === 'halftime' && "⚡ HALFTIME LOAD: High concession demand detected. Flow control enabled."}
          </span>
        </div>
      )}

      {/* Main Navbar */}
      <header className="header">
        <div className="logo-container" onClick={() => setView('home')} style={{ cursor: 'pointer' }}>
          <span className="logo-text">
            ArenaFlow AI <span className="logo-badge">FIFA 2026</span>
          </span>
        </div>

        <nav className="nav-links">
          <button 
            className={`nav-button ${view === 'home' ? 'active' : ''}`}
            onClick={() => setView('home')}
          >
            Home
          </button>
          <button 
            className={`nav-button ${view === 'fan' ? 'active' : ''}`}
            onClick={() => setView('fan')}
          >
            <Globe2 size={16} />
            Fan Portal
          </button>
          <button 
            className={`nav-button ${view === 'ops' ? 'active' : ''}`}
            onClick={() => setView('ops')}
          >
            <Shield size={16} />
            Ops Dashboard
          </button>
        </nav>
      </header>

      {/* Page Selector */}
      <main className="main-content">
        {view === 'home' && <Home setView={setView} />}
        
        {view === 'fan' && (
          <FanPortal 
            addIncidentTicket={addIncidentTicket} 
            currentScenario={currentScenario}
          />
        )}
        
        {view === 'ops' && (
          <Dashboard 
            tickets={tickets} 
            setTickets={setTickets}
            currentScenario={currentScenario}
            handleScenarioChange={handleScenarioChange}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 FIFA World Cup™ Stadium Operations Sandbox. Powered by Gemini Generative AI.</p>
        <p style={{ marginTop: '0.25rem', fontSize: '0.75rem' }}>Designed for fans, organizers, and volunteers at Host City Venue.</p>
      </footer>
    </div>
  );
}
