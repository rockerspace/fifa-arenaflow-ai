import React, { useState, useEffect, useCallback } from 'react';
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import FanPortal from './pages/FanPortal.jsx';
import FounderHub from './pages/FounderHub.jsx';
import { Shield, Users, Globe2, Compass, AlertCircle, Activity, Lock, LogIn, LogOut } from 'lucide-react';
import { apiSim } from './utils/apiSim.js';
import { determineRole, hasPermission, AUTH_ROLES } from './utils/auth.js';

export default function App() {
  const [view, setView] = useState('home');
  const [currentScenario, setCurrentScenario] = useState('none');
  
  // Real-Time subscription state mirroring Firebase/PubSub updates
  const [tickets, setTickets] = useState([]);
  
  // Authentication & Session States
  const [currentUser, setCurrentUser] = useState({ username: 'Public Fan', role: AUTH_ROLES.FAN });
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authUsername, setAuthUsername] = useState('');

  // Subscribe to incident tickets stream from apiSim database
  useEffect(() => {
    const unsubscribe = apiSim.subscribeToTickets((updatedTickets) => {
      setTickets(updatedTickets);
    });
    return unsubscribe;
  }, []);

  // Shared state for tournament matches
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    apiSim.getMatches().then(m => setMatches(m));
  }, []);

  const addIncidentTicket = useCallback((newTicket) => {
    apiSim.createTicket(newTicket);
  }, []);

  const handleScenarioChange = useCallback((scenarioName) => {
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
  }, [addIncidentTicket]);

  // Auth Handlers
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!authUsername.trim()) return;

    const role = determineRole(authUsername);
    setCurrentUser({
      username: authUsername,
      role: role
    });
    setIsAuthOpen(false);
    setAuthUsername('');
    // Redirect to home if current view is not allowed
    if (!hasPermission(role, view)) {
      setView('home');
    }
  };

  const handleLogout = () => {
    setCurrentUser({ username: 'Public Fan', role: AUTH_ROLES.FAN });
    setView('home');
  };

  const handleNavClick = (targetView) => {
    setView(targetView);
  };

  // Determine if view is blocked by IAM policies
  const isViewBlocked = !hasPermission(currentUser.role, view);

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
            {currentScenario === 'evac' && "⚠️ CRITICAL Evacuation Mode Active. Proceed to nearest exit gates."}
            {currentScenario === 'transit_jam' && "⚠️ TRANSIT DELAY: Rail delays at South Link. Shuttle routing modified."}
            {currentScenario === 'halftime' && "⚡ HALFTIME LOAD: High concession demand detected. Flow control enabled."}
          </span>
        </div>
      )}

      {/* Main Navbar */}
      <header className="header">
        <div className="logo-container" onClick={() => setView('home')} style={{ cursor: 'pointer' }}>
          <span className="logo-text">
            ArenaFlow AI <span className="logo-badge">All-Sport</span>
          </span>
        </div>

        <nav className="nav-links" style={{ alignItems: 'center' }}>
          <button 
            className={`nav-button ${view === 'home' ? 'active' : ''}`}
            onClick={() => handleNavClick('home')}
          >
            Home
          </button>
          <button 
            className={`nav-button ${view === 'fan' ? 'active' : ''}`}
            onClick={() => handleNavClick('fan')}
          >
            <Globe2 size={16} />
            Fan Portal
          </button>
          <button 
            className={`nav-button ${view === 'ops' ? 'active' : ''}`}
            onClick={() => handleNavClick('ops')}
          >
            <Shield size={16} />
            Ops Dashboard
          </button>
          <button 
            className={`nav-button ${view === 'founder' ? 'active' : ''}`}
            onClick={() => handleNavClick('founder')}
          >
            <Activity size={16} />
            Founder Hub
          </button>

          {/* IAM User Session Panel */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1rem', borderLeft: '1px solid var(--panel-border)', paddingLeft: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              👤 {currentUser.username} (<strong style={{ color: 'var(--gold)' }}>{currentUser.role.toUpperCase()}</strong>)
            </span>
            {currentUser.role === AUTH_ROLES.FAN ? (
              <button onClick={() => setIsAuthOpen(true)} aria-label="Sign In" style={{ background: 'transparent', border: 'none', color: 'var(--electric-blue)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
                <LogIn size={14} /> Login
              </button>
            ) : (
              <button onClick={handleLogout} aria-label="Sign Out" style={{ background: 'transparent', border: 'none', color: 'var(--status-danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
                <LogOut size={14} /> Logout
              </button>
            )}
          </div>
        </nav>
      </header>

      {/* Auth Modal Overlay */}
      {isAuthOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ padding: '2rem', width: '380px', background: '#0e1b35' }}>
            <h3 style={{ marginBottom: '0.5rem', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lock size={18} style={{ color: 'var(--gold)' }} />
              Google Identity Login
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Sign in securely via Google Account Simulator.
            </p>

            {/* Quick Sign In Chooser */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>QUICK SELECT ACCOUNT:</span>
              <button 
                type="button"
                onClick={() => {
                  setCurrentUser({ username: 'narendra@arenaflow.ai', role: AUTH_ROLES.FOUNDER });
                  setIsAuthOpen(false);
                  if (view === 'ops' || view === 'founder') setView(view);
                }}
                className="btn-secondary"
                style={{ justifyContent: 'flex-start', padding: '0.5rem', fontSize: '0.75rem', width: '100%' }}
              >
                👤 narendra@arenaflow.ai (Founder Admin)
              </button>
              <button 
                type="button"
                onClick={() => {
                  setCurrentUser({ username: 'coordinator@stadiumops.com', role: AUTH_ROLES.OPS });
                  setIsAuthOpen(false);
                  if (view === 'ops') setView(view);
                  else if (view === 'founder') setView('home');
                }}
                className="btn-secondary"
                style={{ justifyContent: 'flex-start', padding: '0.5rem', fontSize: '0.75rem', width: '100%' }}
              >
                👤 coordinator@stadiumops.com (Ops Steward)
              </button>
              <button 
                type="button"
                onClick={() => {
                  setCurrentUser({ username: 'fan.guest@gmail.com', role: AUTH_ROLES.FAN });
                  setIsAuthOpen(false);
                  setView('home');
                }}
                className="btn-secondary"
                style={{ justifyContent: 'flex-start', padding: '0.5rem', fontSize: '0.75rem', width: '100%' }}
              >
                👤 fan.guest@gmail.com (Public Fan)
              </button>
            </div>

            <div style={{ textAlign: 'center', margin: '0.5rem 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>— OR ENTER EMAIL —</div>

            <form onSubmit={handleLoginSubmit}>
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label htmlFor="auth-email-input" className="form-label">Google Email Address</label>
                <input 
                  id="auth-email-input"
                  type="email" 
                  className="form-input" 
                  placeholder="name@stadiumops.com" 
                  value={authUsername}
                  onChange={(e) => setAuthUsername(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setIsAuthOpen(false)} className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem' }}>Login</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Page Content & Role Validation Blocks */}
      <main className="main-content">
        {isViewBlocked ? (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', maxWidth: '500px', margin: '4rem auto', borderLeft: '4px solid var(--status-danger)' }}>
            <Lock size={48} style={{ color: 'var(--status-danger)', marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Access Denied (IAM Guard)</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
              You do not have permissions to access the <strong>{view.toUpperCase()}</strong> panel.<br/>
              This view is restricted to <strong>{view === 'ops' ? 'OPS & FOUNDER' : 'FOUNDER'}</strong> roles.
            </p>
            <button className="btn-primary" onClick={() => setIsAuthOpen(true)}>
              Login with Restricted Credentials
            </button>
          </div>
        ) : (
          <>
            {view === 'home' && <Home setView={handleNavClick} />}
            
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
                matches={matches}
                setMatches={setMatches}
              />
            )}
            
            {view === 'founder' && <FounderHub />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 Universal Stadium Operations Sandbox. Powered by Gemini Generative AI.</p>
        <p style={{ marginTop: '0.25rem', fontSize: '0.75rem' }}>Designed for fans, organizers, and volunteers across all major sports arenas.</p>
      </footer>
    </div>
  );
}
