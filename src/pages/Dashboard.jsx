import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Shield, AlertTriangle, Users, Leaf, Battery, Map, Send, PlusCircle, Trash, CheckCircle, Activity, Calendar, Award } from 'lucide-react';
import { parseMarkdown } from '../utils/markdown.jsx';
import { apiSim } from '../utils/apiSim.js';

export default function Dashboard({ tickets, setTickets, currentScenario, handleScenarioChange, matches = [], setMatches }) {
  const [ticketType, setTicketType] = useState('Crowd Issue');
  const [ticketLoc, setTicketLoc] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');
  const [sustainabilityIndex, setSustainabilityIndex] = useState(74);
  const [foodRedirectedCount, setFoodRedirectedCount] = useState(380);
  const [foodLogging, setFoodLogging] = useState([]);

  // Subscribe to real-time sustainability telemetry stream from apiSim Pub/Sub
  useEffect(() => {
    const unsubscribe = apiSim.subscribeToTelemetry((metrics) => {
      setSustainabilityIndex(metrics.sustainabilityIndex);
      setFoodRedirectedCount(metrics.foodRedirectedCount);
      setFoodLogging(metrics.foodLogging);
    });
    return unsubscribe;
  }, []);
  
  // Interactive Map State
  const [selectedSector, setSelectedSector] = useState('North');
  
  // Smart Utility Grid State
  const [powerSaving, setPowerSaving] = useState(78);
  const [waterSaved, setWaterSaved] = useState(15200);

  const cameras = useMemo(() => [
    { id: 'cam-01', name: 'Gate A (Main Entrance)', status: currentScenario === 'transit_jam' ? 'critical' : 'normal', crowd: currentScenario === 'transit_jam' ? 95 : 45, wait: currentScenario === 'transit_jam' ? '28 mins' : '4 mins' },
    { id: 'cam-02', name: 'Gate B (East Entrance)', status: 'normal', crowd: 35, wait: '3 mins' },
    { id: 'cam-03', name: 'Concourse Zone 1 (Food Hub)', status: currentScenario === 'halftime' ? 'warning' : 'normal', crowd: currentScenario === 'halftime' ? 88 : 50, wait: currentScenario === 'halftime' ? '12 mins' : '2 mins' },
    { id: 'cam-04', name: 'South Transit Link (Bus/Rail)', status: currentScenario === 'transit_jam' ? 'critical' : 'normal', crowd: currentScenario === 'transit_jam' ? 92 : 30, wait: currentScenario === 'transit_jam' ? '45 mins' : '5 mins' },
  ], [currentScenario]);

  const getAIAdvisory = useMemo(() => {
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
  }, [currentScenario, tickets]);

  const sectors = useMemo(() => {
    const isEvac = currentScenario === 'evac';
    const isTransit = currentScenario === 'transit_jam';
    const isHalftime = currentScenario === 'halftime';

    return {
      North: { name: 'North Stand', sector: '101', gate: 'Gate A', status: isEvac ? 'Danger' : isTransit ? 'Warning' : 'Safe', crowd: isEvac ? 100 : isTransit ? 95 : 45, concessions: 'Hot Dog Express & Hydration', color: isEvac ? 'var(--status-danger)' : isTransit ? 'var(--status-warning)' : 'var(--primary-green)' },
      East: { name: 'East Stand', sector: '104', gate: 'Gate B', status: isEvac ? 'Danger' : isHalftime ? 'Warning' : 'Safe', crowd: isEvac ? 100 : isHalftime ? 88 : 35, concessions: 'Eco-Vegan Hub & Smoothies', color: isEvac ? 'var(--status-danger)' : isHalftime ? 'var(--status-warning)' : 'var(--primary-green)' },
      South: { name: 'South Stand', sector: '107', gate: 'Gate C', status: isEvac ? 'Danger' : isTransit ? 'Danger' : 'Safe', crowd: isEvac ? 100 : isTransit ? 92 : 30, concessions: 'Burger Grill & Souvenirs', color: isEvac ? 'var(--status-danger)' : isTransit ? 'var(--status-danger)' : 'var(--primary-green)' },
      West: { name: 'West Stand', sector: '110', gate: 'Gate D', status: isEvac ? 'Danger' : 'Safe', crowd: isEvac ? 100 : 25, concessions: 'Taco Station & Nachos', color: isEvac ? 'var(--status-danger)' : 'var(--primary-green)' }
    };
  }, [currentScenario]);

  const handleCreateTicket = useCallback((e) => {
    e.preventDefault();
    if (!ticketLoc || !ticketDesc) {
      alert("Please fill in location and description.");
      return;
    }

    apiSim.createTicket({
      type: ticketType,
      location: ticketLoc,
      description: ticketDesc,
      severity: ticketType === 'Emergency Support' ? 'High' : 'Medium'
    });
    setTicketLoc('');
    setTicketDesc('');
  }, [ticketType, ticketLoc, ticketDesc]);

  const handleResolveTicket = useCallback((id) => {
    apiSim.resolveTicket(id);
  }, []);

  const handleFoodRedirection = useCallback(() => {
    apiSim.routeSurplusFood();
  }, []);

  const handleMapSectorClick = useCallback((sectorKey) => {
    setSelectedSector(sectorKey);
    setTicketLoc(`Sector ${sectors[sectorKey].sector} (${sectors[sectorKey].name})`);
  }, [sectors]);

  const toggleMatchCheckbox = useCallback((matchId, field) => {
    apiSim.toggleMatch(matchId, field).then(updated => setMatches(updated));
  }, [setMatches]);

  return (
    <section aria-labelledby="dashboard-heading">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
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
            style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem', background: '#0e1b35', border: '1px solid var(--panel-border)', color: '#fff', borderRadius: '4px' }}
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
        <div className="glass-panel stat-card" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="stat-icon theme-blue" aria-hidden="true" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0, 229, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--electric-blue)' }}>
            <Users size={20} />
          </div>
          <div className="stat-info" style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="stat-value" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>82,450</span>
            <span className="stat-label" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Stated Attendance (95% Cap)</span>
          </div>
        </div>

        <div className="glass-panel stat-card" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="stat-icon theme-green" aria-hidden="true" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0, 230, 118, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-green)' }}>
            <CheckCircle size={20} />
          </div>
          <div className="stat-info" style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="stat-value" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: currentScenario === 'evac' ? 'var(--status-danger)' : 'var(--primary-green)' }}>
              {currentScenario === 'evac' ? 'Critical' : currentScenario === 'transit_jam' ? '92%' : '98%'}
            </span>
            <span className="stat-label" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Crowd Safety Index</span>
          </div>
        </div>

        <div className="glass-panel stat-card" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="stat-icon theme-magenta" aria-hidden="true" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255, 0, 127, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-magenta)' }}>
            <AlertTriangle size={20} />
          </div>
          <div className="stat-info" style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="stat-value" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{tickets.length}</span>
            <span className="stat-label" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Active Stadium Tickets</span>
          </div>
        </div>

        <div className="glass-panel stat-card" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="stat-icon theme-gold" aria-hidden="true" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255, 215, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
            <Leaf size={20} />
          </div>
          <div className="stat-info" style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="stat-value" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{sustainabilityIndex}%</span>
            <span className="stat-label" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Sustainability Score</span>
          </div>
        </div>
      </div>

      {/* Main Panel Content */}
      <div className="ops-grid">
        {/* Left Side: Telemetry, Stadium Map, Match coordinator */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* AI Advisor Panel */}
          <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--gold)', background: 'rgba(255, 215, 0, 0.03)' }} role="region" aria-label="GenAI Operations Advisory">
            <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Shield size={20} style={{ color: 'var(--gold)' }} />
              GenAI Operations Advisory
            </h3>
            <div style={{ fontSize: '0.9rem', lineHeight: '1.5', color: '#fff' }}>
              {parseMarkdown(getAIAdvisory)}
            </div>
          </div>

          {/* NEW: Interactive SVG Stadium Heatmap */}
          <div className="glass-panel" style={{ padding: '1.5rem' }} role="region" aria-label="Interactive Stadium Map & Sector Analytics">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Map size={18} style={{ color: 'var(--electric-blue)' }} />
              Interactive Smart Stadium Heatmap
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Select a stand to view real-time sector loads and auto-populate incident locations.
            </p>

            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {/* Stadium Map SVG */}
              <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center' }}>
                <svg viewBox="0 0 400 300" style={{ width: '100%', height: 'auto', maxHeight: '240px', background: 'rgba(0,0,0,0.15)', borderRadius: '12px', border: '1px solid var(--panel-border)' }}>
                  {/* Central Pitch */}
                  <rect x="130" y="90" width="140" height="120" rx="6" fill="rgba(0, 230, 118, 0.05)" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                  <line x1="200" y1="90" x2="200" y2="210" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                  <circle cx="200" cy="150" r="25" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />

                  {/* Sectors */}
                  {/* North Stand */}
                  <g onClick={() => handleMapSectorClick('North')} style={{ cursor: 'pointer' }} role="group" aria-label="Select North Stand">
                    <path 
                      d="M100 20 L300 20 L300 65 L100 65 Z" 
                      fill={sectors.North.color} 
                      opacity={selectedSector === 'North' ? 0.35 : 0.15} 
                      stroke={sectors.North.color} 
                      strokeWidth={selectedSector === 'North' ? 3 : 1.5}
                      style={{ transition: 'all 0.2s' }}
                    />
                    <text x="200" y="45" fill="#fff" fontSize="11" textAnchor="middle" fontWeight="bold">North (Gate A)</text>
                  </g>

                  {/* East Stand */}
                  <g onClick={() => handleMapSectorClick('East')} style={{ cursor: 'pointer' }} role="group" aria-label="Select East Stand">
                    <path 
                      d="M315 80 L380 80 L380 220 L315 220 Z" 
                      fill={sectors.East.color} 
                      opacity={selectedSector === 'East' ? 0.35 : 0.15} 
                      stroke={sectors.East.color} 
                      strokeWidth={selectedSector === 'East' ? 3 : 1.5}
                      style={{ transition: 'all 0.2s' }}
                    />
                    <text x="347" y="155" fill="#fff" fontSize="11" textAnchor="middle" fontWeight="bold" transform="rotate(90 347 155)">East (Gate B)</text>
                  </g>

                  {/* South Stand */}
                  <g onClick={() => handleMapSectorClick('South')} style={{ cursor: 'pointer' }} role="group" aria-label="Select South Stand">
                    <path 
                      d="M100 235 L300 235 L300 280 L100 280 Z" 
                      fill={sectors.South.color} 
                      opacity={selectedSector === 'South' ? 0.35 : 0.15} 
                      stroke={sectors.South.color} 
                      strokeWidth={selectedSector === 'South' ? 3 : 1.5}
                      style={{ transition: 'all 0.2s' }}
                    />
                    <text x="200" y="260" fill="#fff" fontSize="11" textAnchor="middle" fontWeight="bold">South (Gate C - Rail)</text>
                  </g>

                  {/* West Stand */}
                  <g onClick={() => handleMapSectorClick('West')} style={{ cursor: 'pointer' }} role="group" aria-label="Select West Stand">
                    <path 
                      d="M20 80 L85 80 L85 220 L20 220 Z" 
                      fill={sectors.West.color} 
                      opacity={selectedSector === 'West' ? 0.35 : 0.15} 
                      stroke={sectors.West.color} 
                      strokeWidth={selectedSector === 'West' ? 3 : 1.5}
                      style={{ transition: 'all 0.2s' }}
                    />
                    <text x="52" y="155" fill="#fff" fontSize="11" textAnchor="middle" fontWeight="bold" transform="rotate(-90 52 155)">West (Gate D)</text>
                  </g>
                </svg>
              </div>

              {/* Sector Telemetry Details */}
              <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', justifycontent: 'center' }}>
                <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)' }}>
                  <h4 style={{ color: 'var(--gold)', fontSize: '0.95rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Activity size={14} />
                    {sectors[selectedSector].name} Telemetry
                  </h4>
                  <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div>📍 Sector Code: <strong>{sectors[selectedSector].sector}</strong></div>
                    <div>🚪 Designated Entrance: <strong>{sectors[selectedSector].gate}</strong></div>
                    <div>🔥 Crowd Load: <strong style={{ color: sectors[selectedSector].color }}>{sectors[selectedSector].crowd}%</strong></div>
                    <div>🟢 Operations Status: <span style={{ color: sectors[selectedSector].color, fontWeight: 'bold' }}>{sectors[selectedSector].status}</span></div>
                    <div>🍔 Local Concession: <strong style={{ fontSize: '0.75rem' }}>{sectors[selectedSector].concessions}</strong></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* NEW: Match Schedule & Tournament Coordinator */}
          <div className="glass-panel" style={{ padding: '1.5rem' }} role="region" aria-label="Tournament Operations Board">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} style={{ color: 'var(--gold)' }} />
              Tournament Ops & Match Coordinator
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Manage game arrivals checklist, official referee synchronization, and check active capacity.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {matches.map(match => (
                <div key={match.id} className="glass-panel" style={{ padding: '0.85rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: {match.id} | Kickoff: {match.time}</span>
                    <span style={{ fontSize: '0.75rem', background: 'rgba(0, 229, 255, 0.1)', color: 'var(--electric-blue)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                      {match.status}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <strong style={{ fontSize: '1rem' }}>{match.home} vs {match.away}</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--gold)' }}>Gate Load Cap: {match.gateLoad}</span>
                  </div>

                  {/* Operational checklist */}
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.75rem', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '6px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={match.teamArrived} 
                        onChange={() => toggleMatchCheckbox(match.id, 'teamArrived')} 
                        aria-label={`${match.home} vs ${match.away} Team Bus Arrived`}
                      />
                      Team Bus Arrived
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={match.refereeChecked} 
                        onChange={() => toggleMatchCheckbox(match.id, 'refereeChecked')} 
                        aria-label={`${match.home} vs ${match.away} Referees Checked`}
                      />
                      Referees Checked
                    </label>
                  </div>
                </div>
              ))}
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

          {/* Eco / Sustainability Redirection & Utility Telemetry */}
          <div className="glass-panel" style={{ padding: '1.5rem' }} role="region" aria-label="Sustainability Sync">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Leaf size={18} style={{ color: 'var(--primary-green)' }} />
              Sustainability Sync: Food Surplus Program
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              GenAI matches surplus stadium food with shelter demands in real time to prevent waste.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
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

            {/* NEW: Smart Utility Grid Analytics */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
              <div className="glass-panel" style={{ flex: '1 1 150px', padding: '0.75rem', background: 'rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--gold)', marginBottom: '0.25rem' }}>
                  <Battery size={14} />
                  Smart LED Grid
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 'bold' }}>{powerSaving}% Optimization</div>
              </div>
              <div className="glass-panel" style={{ flex: '1 1 150px', padding: '0.75rem', background: 'rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--electric-blue)', marginBottom: '0.25rem' }}>
                  <Award size={14} />
                  Greywater Saved
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 'bold' }}>{waterSaved.toLocaleString()} L</div>
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
                  style={{ background: '#0e1b35', border: '1px solid var(--panel-border)', color: '#fff' }}
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
