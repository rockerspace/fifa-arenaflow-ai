import React, { useState, useRef, useEffect } from 'react';
import { Globe2, Send, MapPin, Accessibility, Compass, Volume2, ShieldAlert, Check } from 'lucide-react';

export default function FanPortal({ addIncidentTicket, currentScenario }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: '¡Welcome to the FIFA World Cup 2026 Arena Companion! ⚽ I am your GenAI Assistant. Ask me anything about tickets, seat routes, stadium rules, transport, concessions, or accessibility in any language.'
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

  // Suggestions for the chatbot
  const suggestions = [
    "How do I get to Section 112?",
    "Can I bring a power bank?",
    "Where is the nearest sensory room?",
    "What are the shuttle schedules?",
    "Sustainability: How do I recycle my cup?"
  ];

  // Mock Gemini GenAI response engine based on keywords
  const generateAIResponse = (query) => {
    const q = query.toLowerCase();
    
    // Check if a crisis/scenario is currently active to modify the AI behavior
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
      return "🚌 **Transportation Info**: Shuttle buses to the central Subway Station run every 4 minutes from Lot G. Walk out of Gate D and turn right. Shuttles are fully electric and equipped with low-floor access for wheelchairs. Standard public transit is free today with your FIFA digital match ticket!";
    }
    if (q.includes('recycle') || q.includes('sustainability') || q.includes('cup') || q.includes('green') || q.includes('waste')) {
      return "♻️ **Green Stadium Initiative**: We use a circular cup return system. Please deposit your reusable souvenir cup at any Green Return bin (located next to every concession counter). For every cup returned, our partner donor contributes ₹10 to regional reforestation programs. Let's make this the most sustainable World Cup ever!";
    }

    return "🤖 **GenAI Response**: Thank you for your inquiry. Our operations show normal flows at all major gates. If you need specific directions, let me know your Ticket Section number, or ask about concessions, accessibility, or transit. (Tip: Try clicking one of the quick suggestions below!)";
  };

  const handleSendMessage = (textToSend) => {
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Simulate AI thinking and reply
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
  };

  const triggerTTS = (msgId, text) => {
    if ('speechSynthesis' in window) {
      if (ttsActive === msgId) {
        window.speechSynthesis.cancel();
        setTtsActive(null);
      } else {
        window.speechSynthesis.cancel();
        // Remove markdown symbols for cleaner speech
        const cleanText = text.replace(/[*#_⚠️♿📍🎒🚌♻️]/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.onend = () => setTtsActive(null);
        window.speechSynthesis.speak(utterance);
        setTtsActive(msgId);
      }
    } else {
      alert("Text-to-speech is not supported on this browser.");
    }
  };

  const handleWheelchairRequest = () => {
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
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem' }}>Fan Companion Hub</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Get directions, check rules, and chat with AI in your language</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Globe2 size={18} style={{ color: 'var(--gold)' }} />
          <select 
            className="form-select" 
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
            style={{ width: '130px', padding: '0.4rem' }}
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
        <div className="glass-panel chat-window">
          <div className="chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="camera-status"></div>
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
                {/* Render simple markdown bold markers */}
                <div dangerouslySetInnerHTML={{ 
                  __html: msg.text
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                }} />
                
                {msg.sender === 'bot' && (
                  <button 
                    onClick={() => triggerTTS(msg.id, msg.text)}
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

          <div className="chat-suggestions">
            {suggestions.map((sug, idx) => (
              <button 
                key={idx} 
                className="suggestion-pill"
                onClick={() => handleSendMessage(sug)}
              >
                {sug}
              </button>
            ))}
          </div>

          <div className="chat-input-area">
            <input 
              type="text" 
              className="chat-input"
              placeholder="Ask about gates, food, bags, transport..." 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
            />
            <button className="chat-submit-btn" onClick={() => handleSendMessage(inputText)}>
              <Send size={18} />
            </button>
          </div>
        </div>

        {/* Right Side: Navigation & Accessibility Escort Widgets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Seat & Gate Locator */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Compass size={18} style={{ color: 'var(--gold)' }} />
              Seat & Gate Finder
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Enter your ticket info to fetch direct routes and facilities.
            </p>
            
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label className="form-label">Section</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. 112"
                  value={seatSection}
                  onChange={(e) => setSeatSection(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="form-label">Row</label>
                <input 
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
            
            {seatSection && (
              <div className="glass-panel" style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(0, 229, 255, 0.05)', borderColor: 'rgba(0, 229, 255, 0.2)' }}>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--electric-blue)', marginBottom: '0.25rem' }}>📍 Verified Path Info:</h4>
                <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div>• Recommended entrance: <strong>Gate B</strong></div>
                  <div>• Nearest Restroom: <strong>Row 15 Concourse</strong></div>
                  <div>• Hydration point: <strong>Section 118</strong></div>
                </div>
              </div>
            )}
          </div>

          {/* Accessibility Special Assistance */}
          <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-magenta)' }}>
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
              >
                <ShieldAlert size={16} />
                Request Emergency Assist
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
