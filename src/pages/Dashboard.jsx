import React, { useState } from 'react';
import { Shield, AlertTriangle, Users, Leaf, Battery, Map, Send, PlusCircle, Trash, CheckCircle } from 'lucide-react';
import { parseMarkdown } from '../utils/markdown.jsx';

export default function Dashboard({ tickets, setTickets, currentScenario, handleScenarioChange }) {
  const [ticketType, setTicketType] = useState('Crowd Issue');
  const [ticketLoc, setTicketLoc] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');
  const [sustainabilityIndex, setSustainabilityIndex] = useState(74);
  const [foodRedirectedCount, setFoodRedirectedCount] = useState(380);
  const [foodLogging, setFoodLogging] = useState([]);

  const cameras = [
    { id: 'cam-01', name: 'Gate A (Main Entrance)', status: currentScenario === 'transit_jam' ? 'critical' : 'normal', crowd: currentScenario === 'transit_jam' ? 95 : 45, wait: currentScenario === 'transit_jam' ? '28 mins' : '4 mins' },
    { id: 'cam-02', name: 'Gate B (East Entrance)', status: 'normal', crowd: 35, wait: '3 mins' },
    { id: 'cam-03', name: 'Concourse Zone 1 (Food Hub)', status: currentScenario === 'halftime' ? 'warning' : 'normal', crowd: currentScenario === 'halftime' ? 88 : 50, wait: currentScenario === 'halftime' ? '12 mins' : '2 mins' },
    { id: 'cam-04', name: 'South Transit Link (Bus/Rail)', status: currentScenario === 'transit_jam' ? 'critical' : 'normal', crowd: currentScenario === 'transit_jam' ? 92 : 30, wait: currentScenario === 'transit_jam' ? '45 mins' : '5 mins' },
  ];

  const getAIAdvisory = () => {
    if (currentScenario === 'halftime') {
      return "⚠️ **GenAI Crowd Forecast**: Halftime rush detected. Concession Zones 1 & 2 are approaching 90% load. Recommendation: Dispatch volunteer squads 4 and 7 to guide overflow to Concessions Zone 3 (currently 30% load). Display promotional eco-discounts on Zone 3 menu boards to balance demand.";
    }
    if (currentScenario === 'transit_jam') {
      return "🚨 **GenAI Transit Dispatch**: Rail delay detected at South Link. 8,000 incoming fans are bottlenecked. Action Plan: 1. Deploy 12 additional shuttle buses from Lot G. 2. Broadcast multilingual digital banner alerts to fans inside the stadium recommending Gate B exiting routes. 3. Extend food kiosk hours by 20 mins to slow exit demand.";
    }
    if (currentScenario === 'evac') {
      return "🔴 **GenAI Emergency Evacuation Plan**: Severe weather warning / evacuation mode active. 1. Directing public address systems to play audio instructions in English, Spanish, and French. 2. Gate D and Gate A locks have been set to emergency-exit mode. 3. Emergency services routed to transit hubs.";
    }
    if (tickets.length > 0) {
      const topTicket = tickets[tickets.length - 1];
      return `🤖 **GenAI Operation Support**: Incident filed: "${topTicket.type}" at ${topTicket.location}. AI Recommendation: Notify volunteer group "${topTicket.severity === 'High' ? 'Emergency Response Unit' : 'General Stewards'}". Immediate response plan generated: "Dispatch closest volunteer in zone ${topTicket.location}. Equip with necessary tools. Send update via radio band 3."`;
    }
    return "💡 **GenAI Diagnostic**: Stadium state is optimal. Gate scanners operating at 98.4% efficiency. Waste collection routes are scheduled in 15 mins. No action needed.";
  };

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!ticketLoc || !ticketDesc) {
      alert("Please fill in location and description.");
      return;
    }

    const newTicket = {
      id: Date.now(),
      type: ticketType,
      location: ticketLoc,
      description: ticketDesc,
      severity: ticketType === 'Emergency Support' ? 'High' : 'Medium',
      status: 'Active',
      aiInstructions: `Volunteer dispatch alert: Proceed to ${ticketLoc}. Resolve: ${ticketDesc}.`
    };

    setTickets([...tickets, newTicket]);
    setTicketLoc('');
    setTicketDesc('');
  };

  const handleResolveTicket = (id) => {
    setTickets(tickets.filter(t => t.id !== id));
  };

  const handleFoodRedirection = () => {
    const amount = 120;
    setFoodRedirectedCount(prev => prev + amount);
    setSustainabilityIndex(prev => Math.min(prev + 3, 99));
    
    const timestamp = new Date().toLocaleTimeString();
    setFoodLogging(prev => [
      `[${timestamp}] 📦 AI Surplus Match: Redirected ${amount} hot dogs & sliders from Zone 1 concession to Newark Community Shelter. Sustainability Index updated.`,
      ...prev
    ]);
  };

  return (
    <section aria-labelledby="dashboard-heading">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 id="dashboard-heading" style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem' }}>Operations Command Center</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Real-time telemetry, AI decision support, and incident dispatch</p>
        </div>
        
        {/* Quick Scenario Selector */}
        <div className="glass-panel" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <label htmlFor="scenario-selector" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Active Sandbox Simulator:</label>
          <select 
            id="scenario-selector"
            className="form-select" 
            value={currentScenario} 
            onChange={(e) => handleScenarioChange(e.target.value)}
            style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
          >
            <option value="none">Normal State</option>
            <option value="halftime">Halftime Rush</option>
            <option value="transit_jam">Transit Delay (South Rail)</option>
            <option value="evac">Emergency Weather Mode</option>
          </select>
        </div>
      </div>

      {/* Top Stats Overview */}
      <div className="dashboard-panel-grid" role="region" aria-label="Key Performance Indicators">
        <div className="glass-panel stat-card">
          <div className="stat-icon theme-blue" aria-hidden="true">
            <Users size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-value">82,450</span>
            <span className="stat-label">Stated Attendance (95% Cap)</span>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon theme-green" aria-hidden="true">
            <CheckCircle size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-value" style={{ color: currentScenario === 'evac' ? 'var(--status-danger)' : 'var(--primary-green)' }}>
              {currentScenario === 'evac' ? 'Critical' : currentScenario === 'transit_jam' ? '92%' : '98%'}
            </span>
            <span className="stat-label">Crowd Safety Index</span>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon theme-magenta" aria-hidden="true">
            <AlertTriangle size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{tickets.length}</span>
            <span className="stat-label">Active Stadium Tickets</span>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon theme-gold" aria-hidden="true">
            <Leaf size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{sustainabilityIndex}%</span>
            <span className="stat-label">Sustainability Score</span>
          </div>
        </div>
      </div>

      {/* Main Panel Content */}
      <div className="ops-grid">
        {/* Left Side: Telemetry and AI Advisor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* AI Advisor Panel */}
          <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--gold)', background: 'rgba(255, 215, 0, 0.03)' }} role="region" aria-label="GenAI Operations Advisory">
            <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Shield size={20} style={{ color: 'var(--gold)' }} />
              GenAI Operations Advisory
            </h3>
            <div style={{ fontSize: '0.9rem', lineHeight: '1.5', color: '#fff' }}>
              {parseMarkdown(getAIAdvisory())}
            </div>
          </div>

          {/* Camera Telemetry Stream Simulation */}
          <div className="glass-panel" style={{ padding: '1.5rem' }} role="region" aria-label="Camera Telemetry Sensors">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Video Analytics & Queue Sensors</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Real-time computer vision queue analysis and sector density mapping.
            </p>

            <div className="camera-grid">
              {cameras.map(cam => (
                <div key={cam.id} className="camera-card">
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: `radial-gradient(circle at center, rgba(14,27,53,0.3) 0%, rgba(5,8,17,0.9) 100%)`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '0.75rem',
                    color: 'rgba(255,255,255,0.15)',
                    fontFamily: 'monospace'
                  }}>
                    <span>[ CAMERA:{cam.id.toUpperCase()} ]</span>
                    <span style={{ fontSize: '0.65rem' }}>DENSITY: {cam.crowd}%</span>
                    <div style={{ width: '80px', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', marginTop: '0.5rem' }}>
                      <div style={{ 
                        width: `${cam.crowd}%`, 
                        height: '100%', 
                        background: cam.crowd > 80 ? 'var(--status-danger)' : cam.crowd > 60 ? 'var(--status-warning)' : 'var(--primary-green)' 
                      }}></div>
                    </div>
                  </div>

                  <div className="camera-overlay">
                    <div className="camera-header">
                      <span className="camera-badge">{cam.name}</span>
                      <div className={`camera-status ${cam.status}`}></div>
                    </div>

                    <div className="camera-ai-verdict">
                      <strong>AI Sensor:</strong> Queue: {cam.wait} ({cam.crowd}% dense)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Eco / Sustainability Redirection */}
          <div className="glass-panel" style={{ padding: '1.5rem' }} role="region" aria-label="Sustainability Sync">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Leaf size={18} style={{ color: 'var(--primary-green)' }} />
              Sustainability Sync: Food Surplus Program
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              GenAI matches surplus stadium food with shelter demands in real time to prevent waste.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Food Saved Today:</span>
                <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--primary-green)' }}>
                  {foodRedirectedCount} Meals
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar" style={{ width: `${sustainabilityIndex}%` }}></div>
                </div>
              </div>

              <div>
                <button className="btn-primary" onClick={handleFoodRedirection} style={{ background: 'linear-gradient(135deg, var(--primary-green) 0%, #00c853 100%)', color: '#070b19' }}>
                  Match & Route Surplus Food
                </button>
              </div>
            </div>

            {foodLogging.length > 0 && (
              <div style={{ 
                marginTop: '1rem', 
                background: 'rgba(0,0,0,0.3)', 
                border: '1px solid var(--panel-border)', 
                borderRadius: '6px', 
                padding: '0.75rem', 
                maxHeight: '120px', 
                overflowY: 'auto',
                fontSize: '0.8rem',
                fontFamily: 'monospace',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem'
              }}>
                {foodLogging.map((log, index) => (
                  <div key={index} style={{ color: 'var(--text-secondary)' }}>{log}</div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Side: Incident Form and Active Tickets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* File New Ticket */}
          <div className="glass-panel" style={{ padding: '1.5rem' }} role="region" aria-label="Incident Intake Form">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PlusCircle size={18} style={{ color: 'var(--electric-blue)' }} />
              Log Incident / Request Help
            </h3>
            
            <form className="incident-form" onSubmit={handleCreateTicket}>
              <div className="form-group">
                <label htmlFor="ticket-category-select" className="form-label">Category</label>
                <select 
                  id="ticket-category-select"
                  className="form-select" 
                  value={ticketType}
                  onChange={(e) => setTicketType(e.target.value)}
                >
                  <option>Crowd Issue</option>
                  <option>Medical Support</option>
                  <option>Sustainability / Waste</option>
                  <option>Infrastructure Repair</option>
                  <option>Accessibility Support</option>
                  <option>Emergency Support</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="ticket-location-input" className="form-label">Location / Gate / Sector</label>
                <input 
                  id="ticket-location-input"
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Sector 104, Row G or Gate D"
                  value={ticketLoc}
                  onChange={(e) => setTicketLoc(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="ticket-description-input" className="form-label">Brief Description</label>
                <textarea 
                  id="ticket-description-input"
                  className="form-textarea" 
                  rows="2" 
                  placeholder="Describe the issue..."
                  value={ticketDesc}
                  onChange={(e) => setTicketDesc(e.target.value)}
                ></textarea>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                File Ticket & Run AI Dispatch
              </button>
            </form>
          </div>

          {/* Active Tickets List */}
          <div className="glass-panel" style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }} role="region" aria-label="Active Incidents List">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>
              Active Incident Tickets ({tickets.length})
            </h3>
            
            {tickets.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                <CheckCircle size={32} style={{ color: 'var(--primary-green)', marginBottom: '0.5rem' }} />
                <span>All clear! No active tickets.</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', maxHeight: '400px' }}>
                {tickets.map(t => (
                  <div 
                    key={t.id} 
                    className="glass-panel" 
                    style={{ 
                      padding: '0.85rem', 
                      background: 'rgba(255,255,255,0.02)', 
                      borderColor: t.severity === 'High' ? 'rgba(255, 23, 68, 0.3)' : 'rgba(255,255,255,0.05)',
                      borderLeft: t.severity === 'High' ? '4px solid var(--status-danger)' : '4px solid var(--status-warning)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{t.type}</span>
                      <span style={{ 
                        fontSize: '0.65rem', 
                        padding: '0.1rem 0.35rem', 
                        borderRadius: '4px',
                        background: t.severity === 'High' ? 'rgba(255,23,68,0.1)' : 'rgba(255,179,0,0.1)',
                        color: t.severity === 'High' ? 'var(--status-danger)' : 'var(--status-warning)',
                        border: `1px solid ${t.severity === 'High' ? 'var(--status-danger)' : 'var(--status-warning)'}`
                      }}>
                        {t.severity}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      📍 {t.location}
                    </div>

                    <p style={{ fontSize: '0.85rem', marginBottom: '0.6rem' }}>
                      {t.description}
                    </p>

                    <div style={{ 
                      fontSize: '0.75rem', 
                      background: 'rgba(0, 0, 0, 0.4)', 
                      padding: '0.5rem', 
                      borderRadius: '4px', 
                      borderLeft: '2px solid var(--electric-blue)',
                      color: 'var(--text-secondary)',
                      marginBottom: '0.5rem'
                    }}>
                      <strong>AI Dispatch Draft:</strong> {t.aiInstructions || `Volunteer alert: Please proceed to ${t.location} to support.`}
                    </div>

                    <button 
                      className="btn-secondary" 
                      onClick={() => handleResolveTicket(t.id)}
                      style={{ padding: '0.35rem 0.6rem', fontSize: '0.7rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                    >
                      <Trash size={12} />
                      Resolve & Close Ticket
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
