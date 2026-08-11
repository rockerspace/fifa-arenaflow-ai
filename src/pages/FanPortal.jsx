import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Globe2, Send, MapPin, Accessibility, Compass, Volume2, ShieldAlert, Check } from 'lucide-react';
import { parseMarkdown } from '../utils/markdown.jsx';
import { validateInput } from '../utils/guardrails.js';
import { calculateDijkstraPath } from '../utils/pathfinder.js';

export default function FanPortal({ addIncidentTicket, currentScenario }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: '¡Welcome to the Universal Arena Companion! 🏟️ I am your GenAI Assistant. Ask me anything about tickets, seat routes, stadium rules, transport, concessions, or accessibility in any language.'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [language, setLanguage] = useState('English');
  const [seatSection, setSeatSection] = useState('');
  const [seatRow, setSeatRow] = useState('');
  const [isWheelchairRequested, setIsWheelchairRequested] = useState(false);
  const [ttsActive, setTtsActive] = useState(null);
  
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const suggestions = useMemo(() => [
    "How do I get to Section 112?",
    "Can I bring a power bank?",
    "Where is the nearest sensory room?",
    "What are the shuttle schedules?",
    "Sustainability: How do I recycle my cup?"
  ], []);

  const generateAIResponse = useCallback((query) => {
    const q = query.toLowerCase();
    
    if (currentScenario === 'evac') {
      return "⚠️ **IMPORTANT SAFETY ALERT**: An evacuation order is currently active for stadium sectors due to weather/safety protocols. Please proceed calmly to your designated Gate Exit. Security and volunteers are stationed along all pathways to assist. Do not return to your seats.";
    }

    if (q.includes('section') || q.includes('seat') || q.includes('gate') || q.includes('find')) {
      return "📍 **Navigation Guide**: To reach Section 112/118, you should enter through **Gate B (East Entrance)**. This entrance has dedicated ramp access. Once inside, follow the gold flags to the lower concourse. The estimated walk from Gate B is 4 minutes, and you will pass concession hub 3 (famous for eco-friendly vegan wraps!).";
    }
    if (q.includes('power bank') || q.includes('allow') || q.includes('water') || q.includes('bag')) {
      return "🎒 **Stadium Security Policy**: 1. Small power banks (under 10,000mAh) are allowed. 2. Clear bags only (max size 12\"x6\"x12\"). 3. Clear, empty plastic water bottles up to 500ml are allowed. You can refill them for free at the hydration stations at Sections 104, 118, and 224.";
    }
    if (q.includes('sensory') || q.includes('accessibility') || q.includes('wheelchair') || q.includes('deaf') || q.includes('blind')) {
      return "♿ **Accessibility & Inclusion Services**: The stadium provides designated Sensory Rooms at Level 1 (near Section 121) for fans with sensory needs. Noise-cancelling headphones can be borrowed at Guest Services. If you need physical assistance or a wheelchair escort, you can toggle the 'Request Accessibility Assistance' panel below.";
    }
    if (q.includes('shuttle') || q.includes('transit') || q.includes('bus') || q.includes('subway') || q.includes('train')) {
      return "🚌 **Transportation Info**: Shuttle buses to the central Subway Station run every 4 minutes from Lot G. Walk out of Gate D and turn right. Shuttles are fully electric and equipped with low-floor access for wheelchairs. Standard public transit is free today with your official match ticket!";
    }
    if (q.includes('recycle') || q.includes('sustainability') || q.includes('cup') || q.includes('green') || q.includes('waste')) {
      return "♻️ **Green Stadium Initiative**: We use a circular cup return system. Please deposit your reusable souvenir cup at any Green Return bin (located next to every concession counter). For every cup returned, our partner donor contributes ₹10 to regional reforestation programs. Let's make this the most sustainable sports venue ever!";
    }

    return "🤖 **GenAI Response**: Thank you for your inquiry. Our operations show normal flows at all major gates. If you need specific directions, let me know your Ticket Section number, or ask about concessions, accessibility, or transit. (Tip: Try clicking one of the quick suggestions below!)";
  }, [currentScenario]);

  const handleSendMessage = useCallback((textToSend) => {
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Real-Time AI Input Guardrail Validation
    const validation = validateInput(textToSend);
    if (!validation.isValid) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            text: validation.message
          }
        ]);
      }, 500);
      return;
    }

    setTimeout(() => {
      const responseText = generateAIResponse(textToSend);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: responseText
        }
      ]);
    }, 850);
  }, [generateAIResponse]);

  const triggerTTS = useCallback((msgId, text) => {
    if ('speechSynthesis' in window) {
      if (ttsActive === msgId) {
        window.speechSynthesis.cancel();
        setTtsActive(null);
      } else {
        window.speechSynthesis.cancel();
        const cleanText = text.replace(/[*#_⚠️♿📍🎒🚌♻️]/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.onend = () => setTtsActive(null);
        window.speechSynthesis.speak(utterance);
        setTtsActive(msgId);
      }
    } else {
      alert("Text-to-speech is not supported on this browser.");
    }
  }, [ttsActive]);

  const handleWheelchairRequest = useCallback(() => {
    setIsWheelchairRequested(true);
    addIncidentTicket({
      type: 'Accessibility Support',
      location: `Section ${seatSection || 'Main Entrance'}`,
      description: 'Fan requested a physical wheelchair escort helper to their seat via the Fan Portal.',
      severity: 'Medium'
    });
    
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: 'bot',
        text: '♿ **Accessibility Request Logged**: We have alerted the volunteer team. A venue helper with a wheelchair is being routed to your location. Please stay near the entrance/concourse maps.'
      }
    ]);
  }, [addIncidentTicket, seatSection]);

  const handleMapSectorClick = useCallback((sectionNum) => {
    setSeatSection(sectionNum);
  }, []);

  // Compute active gate based on section entered/clicked using Dijkstra pathfinder
  const seatRoutingInfo = useMemo(() => {
    if (!seatSection) return null;
    const sec = parseInt(seatSection, 10);
    if (isNaN(sec)) {
      return { gate: 'Gate A', gateCoords: { x: 200, y: 20 }, targetCoords: { x: 200, y: 40 }, distance: 4 };
    }
    
    // Map numerical stand section to graph node stands
    let startNode = '110';
    let targetCoords = { x: 55, y: 150 };
    if (sec >= 101 && sec <= 103) {
      startNode = '101';
      targetCoords = { x: 200, y: 40 };
    } else if (sec >= 104 && sec <= 106) {
      startNode = '104';
      targetCoords = { x: 345, y: 150 };
    } else if (sec >= 107 && sec <= 109) {
      startNode = '107';
      targetCoords = { x: 200, y: 255 };
    }

    // Run dynamic Dijkstra graph calculation
    const routingResult = calculateDijkstraPath(startNode, currentScenario);
    
    // Map calculated optimal gate to coordinates
    let gateCoords = { x: 20, y: 150 }; // Gate D default
    if (routingResult.gate === 'Gate A') {
      gateCoords = { x: 200, y: 20 };
    } else if (routingResult.gate === 'Gate B') {
      gateCoords = { x: 380, y: 150 };
    } else if (routingResult.gate === 'Gate C') {
      gateCoords = { x: 200, y: 280 };
    }

    return {
      gate: routingResult.gate,
      gateCoords,
      targetCoords,
      distance: routingResult.distance
    };
  }, [seatSection, currentScenario]);

  return (
    <section aria-labelledby="fan-portal-heading">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 id="fan-portal-heading" style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem' }}>Fan Companion Hub</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Get directions, check rules, and chat with AI in your language</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Globe2 size={18} style={{ color: 'var(--gold)' }} />
          <label htmlFor="language-selector" className="sr-only" style={{ display: 'none' }}>Select Language</label>
          <select 
            id="language-selector"
            className="form-select" 
            aria-label="Select Chat Language"
            value={language} 
            onChange={(e) => {
              setLanguage(e.target.value);
              setMessages(prev => [
                ...prev,
                {
                  id: Date.now(),
                  sender: 'bot',
                  text: `🌐 Language switched to **${e.target.value}**. (Simulation active: AI translation module loaded).`
                }
              ]);
            }}
            style={{ width: '130px', padding: '0.4rem', background: '#0e1b35', border: '1px solid var(--panel-border)', color: '#fff', borderRadius: '4px' }}
          >
            <option>English</option>
            <option>Español</option>
            <option>Français</option>
            <option>Português</option>
            <option>Deutsch</option>
            <option>日本語</option>
            <option>Hindi</option>
          </select>
        </div>
      </div>

      <div className="ops-grid">
        {/* Left Side: AI Concierge Chatbot */}
        <div className="glass-panel chat-window" role="log" aria-label="AI Concierge Chat History">
          <div className="chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="camera-status" aria-hidden="true"></div>
              <strong style={{ fontFamily: 'var(--font-heading)' }}>GenAI Assistant ({language})</strong>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary-green)' }}>Active Sync with Venue Operations</span>
          </div>

          <div className="chat-messages">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`chat-bubble ${msg.sender}`}
                style={{ position: 'relative' }}
              >
                <div>
                  {parseMarkdown(msg.text)}
                </div>
                
                {msg.sender === 'bot' && (
                  <button 
                    onClick={() => triggerTTS(msg.id, msg.text)}
                    aria-label={`Read aloud: ${msg.text}`}
                    style={{ 
                      background: 'transparent', 
                      border: 'none', 
                      color: ttsActive === msg.id ? 'var(--gold)' : 'var(--text-muted)', 
                      cursor: 'pointer',
                      display: 'block',
                      marginTop: '0.5rem',
                      fontSize: '0.75rem'
                    }}
                  >
                    <Volume2 size={14} style={{ display: 'inline', marginRight: '0.2rem', verticalAlign: 'middle' }} />
                    {ttsActive === msg.id ? 'Mute' : 'Listen'}
                  </button>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="chat-suggestions" aria-label="Suggested Queries">
            {suggestions.map((sug, idx) => (
              <button 
                key={idx} 
                className="suggestion-pill"
                onClick={() => handleSendMessage(sug)}
                aria-label={`Ask: ${sug}`}
              >
                {sug}
              </button>
            ))}
          </div>

          <div className="chat-input-area">
            <input 
              type="text" 
              className="chat-input"
              aria-label="Type your message"
              placeholder="Ask about gates, food, bags, transport..." 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
            />
            <button 
              className="chat-submit-btn" 
              onClick={() => handleSendMessage(inputText)}
              aria-label="Send Message"
            >
              <Send size={18} />
            </button>
          </div>
        </div>

        {/* Right Side: Navigation & Accessibility Escort Widgets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Seat & Gate Locator */}
          <div className="glass-panel" style={{ padding: '1.5rem' }} role="region" aria-label="Seat and Gate Locator">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Compass size={18} style={{ color: 'var(--gold)' }} />
              Seat & Gate Finder
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Enter or tap a sector on the map below to calculate your route.
            </p>

            {/* Interactive Fan Map */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <svg viewBox="0 0 400 300" style={{ width: '100%', height: 'auto', maxHeight: '180px', background: 'rgba(0,0,0,0.15)', borderRadius: '12px', border: '1px solid var(--panel-border)' }}>
                {/* Central Pitch */}
                <rect x="130" y="90" width="140" height="120" rx="6" fill="rgba(255, 255, 255, 0.02)" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                <circle cx="200" cy="150" r="25" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />

                {/* Stands */}
                <g onClick={() => handleMapSectorClick('101')} style={{ cursor: 'pointer' }} role="group" aria-label="Sec 101 - North Stand">
                  <rect x="100" y="20" width="200" height="40" rx="4" fill={seatSection === '101' ? 'var(--gold)' : 'rgba(0, 229, 255, 0.15)'} stroke="var(--electric-blue)" />
                  <text x="200" y="45" fill="#fff" fontSize="10" textAnchor="middle">Sec 101 - North Stand</text>
                </g>

                <g onClick={() => handleMapSectorClick('104')} style={{ cursor: 'pointer' }} role="group" aria-label="Sec 104 - East Stand">
                  <rect x="315" y="80" width="65" height="140" rx="4" fill={seatSection === '104' ? 'var(--gold)' : 'rgba(0, 229, 255, 0.15)'} stroke="var(--electric-blue)" />
                  <text x="347" y="150" fill="#fff" fontSize="10" textAnchor="middle" transform="rotate(90 347 150)">Sec 104 - East Stand</text>
                </g>

                <g onClick={() => handleMapSectorClick('107')} style={{ cursor: 'pointer' }} role="group" aria-label="Sec 107 - South Stand">
                  <rect x="100" y="240" width="200" height="40" rx="4" fill={seatSection === '107' ? 'var(--gold)' : 'rgba(0, 229, 255, 0.15)'} stroke="var(--electric-blue)" />
                  <text x="200" y="265" fill="#fff" fontSize="10" textAnchor="middle">Sec 107 - South Stand</text>
                </g>

                <g onClick={() => handleMapSectorClick('110')} style={{ cursor: 'pointer' }} role="group" aria-label="Sec 110 - West Stand">
                  <rect x="20" y="80" width="65" height="140" rx="4" fill={seatSection === '110' ? 'var(--gold)' : 'rgba(0, 229, 255, 0.15)'} stroke="var(--electric-blue)" />
                  <text x="52" y="150" fill="#fff" fontSize="10" textAnchor="middle" transform="rotate(-90 52 150)">Sec 110 - West Stand</text>
                </g>

                {/* Draw Dotted Pathfinder line if section matches */}
                {seatRoutingInfo && (
                  <line 
                    x1={seatRoutingInfo.gateCoords.x} 
                    y1={seatRoutingInfo.gateCoords.y} 
                    x2={seatRoutingInfo.targetCoords.x} 
                    y2={seatRoutingInfo.targetCoords.y} 
                    stroke="var(--gold)" 
                    strokeWidth="3" 
                    strokeDasharray="4,4" 
                  />
                )}
              </svg>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label htmlFor="seat-section-input" className="form-label">Section</label>
                <input 
                  id="seat-section-input"
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. 112"
                  value={seatSection}
                  onChange={(e) => setSeatSection(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label htmlFor="seat-row-input" className="form-label">Row</label>
                <input 
                  id="seat-row-input"
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. K"
                  value={seatRow}
                  onChange={(e) => setSeatRow(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <button 
              className="btn-primary" 
              style={{ width: '100%' }}
              onClick={() => {
                if (!seatSection) {
                  alert("Please enter at least your Section number.");
                  return;
                }
                handleSendMessage(`How do I get to Section ${seatSection}, Row ${seatRow}?`);
              }}
            >
              Calculate Route
            </button>
            
            {seatSection && seatRoutingInfo && (
              <div className="glass-panel" style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(0, 229, 255, 0.05)', borderColor: 'rgba(0, 229, 255, 0.2)' }}>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--electric-blue)', marginBottom: '0.25rem' }}>📍 Verified Path Info:</h4>
                <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div>• Recommended entrance: <strong>{seatRoutingInfo.gate}</strong></div>
                  <div>• Nearest Restroom: <strong>Row 15 Concourse</strong></div>
                  <div>• Hydration point: <strong>Section 118</strong></div>
                </div>
              </div>
            )}
          </div>

          {/* Accessibility Special Assistance */}
          <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-magenta)' }} role="region" aria-label="Accessibility Helpdesk">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
              <Accessibility size={18} style={{ color: 'var(--accent-magenta)' }} />
              Accessibility Assistance
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Request physical support, wheelchair escorts, or locate sensory rooms.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button 
                className="btn-secondary" 
                style={{ 
                  width: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  borderColor: isWheelchairRequested ? 'var(--primary-green)' : 'rgba(255,255,255,0.08)'
                }}
                disabled={isWheelchairRequested}
                onClick={handleWheelchairRequest}
                aria-label={isWheelchairRequested ? "Wheelchair assistance already requested" : "Request a wheelchair escort helper"}
              >
                {isWheelchairRequested ? (
                  <>
                    <Check size={16} style={{ color: 'var(--primary-green)' }} />
                    <span style={{ color: 'var(--primary-green)' }}>Wheelchair Escort Requested</span>
                  </>
                ) : (
                  <>
                    <Accessibility size={16} />
                    Request Wheelchair Escort
                  </>
                )}
              </button>

              <button 
                className="btn-secondary" 
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                onClick={() => handleSendMessage("Where is the nearest sensory room?")}
                aria-label="Locate stadium sensory rooms"
              >
                <MapPin size={16} />
                Locate Sensory Room
              </button>

              <button 
                className="btn-secondary" 
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(255, 23, 68, 0.4)', color: '#ff1744' }}
                onClick={() => {
                  const urgent = window.confirm("Do you need immediate medical or security support? This will page the emergency command team.");
                  if (urgent) {
                    addIncidentTicket({
                      type: 'Emergency Support',
                      location: `Section ${seatSection || 'Concourse'}`,
                      description: '🚨 Panic assistance alert triggered by fan in Fan Portal.',
                      severity: 'High'
                    });
                    setMessages(prev => [
                      ...prev,
                      {
                        id: Date.now(),
                        sender: 'bot',
                        text: '⚠️ **EMERGENCY INCIDENT LOGGED**: The Medical and Safety teams have been paged. Operations dispatch is tracking your signal. Please remain where you are.'
                      }
                    ]);
                  }
                }}
                aria-label="Request immediate emergency assistance"
              >
                <ShieldAlert size={16} />
                Request Emergency Assist
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
