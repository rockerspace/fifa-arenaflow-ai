import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Activity, Landmark, Users, TrendingUp, Cpu, Server, Zap, ShieldAlert } from 'lucide-react';

export default function FounderHub() {
  // Real-time API & Billing States
  const [totalApiRequests, setTotalApiRequests] = useState(1420580);
  const [activeVenues, setActiveVenues] = useState(6);
  const [mrr, setMrr] = useState(128000); // Monthly Recurring Revenue ($)
  
  // Traffic stimulation state
  const [trafficMode, setTrafficMode] = useState('normal'); 
  const [systemLoad, setSystemLoad] = useState(24); // % CPU/Memory
  const [reliability, setReliability] = useState(99.99); // %
  
  // Keep track of recent API requests per tick for the visual bar chart
  const [chartData, setChartData] = useState([12, 18, 15, 22, 28, 20, 24, 30, 26, 35]);

  // Tick interval to simulate real-time metrics
  useEffect(() => {
    const interval = setInterval(() => {
      let increment = 0;
      let newLoad = 20;
      let targetReliability = 99.99;

      if (trafficMode === 'normal') {
        increment = Math.floor(Math.random() * 15) + 5;
        newLoad = Math.floor(Math.random() * 10) + 15;
      } else if (trafficMode === 'match_day') {
        increment = Math.floor(Math.random() * 120) + 80;
        newLoad = Math.floor(Math.random() * 20) + 65;
      } else if (trafficMode === 'ddos') {
        increment = Math.floor(Math.random() * 800) + 600;
        newLoad = Math.floor(Math.random() * 15) + 85;
        targetReliability = 94.2 + (Math.random() * 2.5);
      }

      setTotalApiRequests(prev => prev + increment);
      setSystemLoad(newLoad);
      setReliability(targetReliability);

      // Shift and push to the live chart data
      setChartData(prev => {
        const next = [...prev.slice(1), increment];
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [trafficMode]);

  // SaaS Billing Calculators
  const arr = useMemo(() => mrr * 12, [mrr]);
  const ltv = useMemo(() => activeVenues * 85000, [activeVenues]);

  // Handlers to simulate contract bookings
  const handleSignNewVenue = useCallback(() => {
    setActiveVenues(prev => prev + 1);
    setMrr(prev => prev + 12000);
  }, []);

  return (
    <section aria-labelledby="founder-hub-heading">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 id="founder-hub-heading" style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem' }}>Founder SaaS Analytics</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Real-time subscription logs, global API gateways, and system health status</p>
        </div>
        
        {/* Sign contract quick simulator */}
        <button 
          onClick={handleSignNewVenue}
          className="btn-primary"
          style={{ background: 'linear-gradient(135deg, var(--gold) 0%, #ffc107 100%)', color: '#070b19' }}
        >
          ✍️ Book New Venue Contract (+$12k MRR)
        </button>
      </div>

      {/* Top Founder Stats Cards */}
      <div className="dashboard-panel-grid" role="region" aria-label="SaaS Financials Grid">
        <div className="glass-panel stat-card" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255, 215, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
            <TrendingUp size={20} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>${mrr.toLocaleString()}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Monthly Recurring Revenue (MRR)</span>
          </div>
        </div>

        <div className="glass-panel stat-card" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0, 230, 118, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-green)' }}>
            <Landmark size={20} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>${arr.toLocaleString()}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Annual Run Rate (ARR)</span>
          </div>
        </div>

        <div className="glass-panel stat-card" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0, 229, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--electric-blue)' }}>
            <Users size={20} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{activeVenues}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Active Subscribed Stadiums</span>
          </div>
        </div>

        <div className="glass-panel stat-card" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255, 0, 127, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-magenta)' }}>
            <Zap size={20} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>${ltv.toLocaleString()}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Customer Lifetime Value (LTV)</span>
          </div>
        </div>
      </div>

      <div className="ops-grid">
        {/* Left Side: Real-Time Ingress Telemetry & Graph */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="glass-panel" style={{ padding: '1.5rem' }} role="region" aria-label="API Ingress Stream">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={18} style={{ color: 'var(--electric-blue)' }} />
              Live API Gateway Ingress (Vertex AI & Pub/Sub streams)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Displays requests processed by Apigee and routed to the queue telemetry models.
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Accumulated Global Calls:</span>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--electric-blue)' }}>
                  {totalApiRequests.toLocaleString()}
                </div>
              </div>

              {/* Traffic Stimulator Selection */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => setTrafficMode('normal')}
                  className={`btn-secondary ${trafficMode === 'normal' ? 'active' : ''}`}
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', borderColor: trafficMode === 'normal' ? 'var(--primary-green)' : '' }}
                >
                  Normal
                </button>
                <button 
                  onClick={() => setTrafficMode('match_day')}
                  className={`btn-secondary ${trafficMode === 'match_day' ? 'active' : ''}`}
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', borderColor: trafficMode === 'match_day' ? 'var(--gold)' : '' }}
                >
                  Match Day Spike
                </button>
                <button 
                  onClick={() => setTrafficMode('ddos')}
                  className={`btn-secondary ${trafficMode === 'ddos' ? 'active' : ''}`}
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', borderColor: trafficMode === 'ddos' ? 'var(--status-danger)' : '' }}
                >
                  DDoS Test
                </button>
              </div>
            </div>

            {/* Live Chart Visualizer */}
            <div style={{ height: '140px', display: 'flex', alignItems: 'flex-end', gap: '6px', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.08)' }} aria-hidden="true">
              {chartData.map((val, idx) => {
                // Scale value relative to highest peak (for DDoS mode)
                const max = Math.max(...chartData, 1);
                const pct = (val / max) * 100;
                return (
                  <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ 
                      width: '100%', 
                      height: `${pct}%`, 
                      background: trafficMode === 'ddos' ? 'var(--status-danger)' : trafficMode === 'match_day' ? 'var(--gold)' : 'var(--electric-blue)', 
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.3s ease, background 0.3s ease'
                    }}></div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              <span>-10 seconds ago</span>
              <span>Real-Time Stream Active</span>
            </div>
          </div>
        </div>

        {/* Right Side: System Diagnostics & SLA Telemetry */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="glass-panel" style={{ padding: '1.5rem' }} role="region" aria-label="GCP Infrastructure Status">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Server size={18} style={{ color: 'var(--gold)' }} />
              GCP Infrastructure Health
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                  <span>Cloud Run CPU Utilization</span>
                  <strong style={{ color: systemLoad > 80 ? 'var(--status-danger)' : 'var(--text-primary)' }}>{systemLoad}%</strong>
                </div>
                <div className="progress-bar-container" style={{ height: '8px' }}>
                  <div 
                    className="progress-bar" 
                    style={{ 
                      width: `${systemLoad}%`, 
                      background: systemLoad > 80 ? 'var(--status-danger)' : 'var(--electric-blue)' 
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                  <span>SLA Service Reliability</span>
                  <strong style={{ color: reliability < 98 ? 'var(--status-danger)' : 'var(--primary-green)' }}>{reliability.toFixed(2)}%</strong>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Active Spanner clusters: Multi-region active sync optimal.
                </div>
              </div>

              {trafficMode === 'ddos' && (
                <div className="glass-panel" style={{ padding: '0.75rem', background: 'rgba(255,23,68,0.05)', borderColor: 'rgba(255,23,68,0.2)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <ShieldAlert size={18} style={{ color: 'var(--status-danger)' }} />
                  <div style={{ fontSize: '0.75rem', color: '#ff1744' }}>
                    <strong>🚨 APIGEE ALERT:</strong> High volume traffic spike detected. Rate limiting active. Scaling Cloud Run instances.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
