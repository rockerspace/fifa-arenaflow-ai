/**
 * Simulated REST and Server-Sent Events (SSE) API Service Layer
 * Simulates GCP Cloud Run endpoints interacting with Cloud Spanner & Bigtable
 */

let mockTickets = [
  {
    id: 101,
    type: 'Infrastructure Repair',
    location: 'Gate A - Scanner 3',
    description: 'NFC ticket reader failing to register digital wallet tickets.',
    severity: 'Medium',
    status: 'Active',
    aiInstructions: 'Notify IT support hub and dispatch technician A1 with a replacement reader.'
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
];

let mockMatches = [
  { id: 'S401', home: 'Patriots', away: 'Cowboys', time: '13:00', status: 'Pre-Match', gateLoad: '98%', teamArrived: true, refereeChecked: true },
  { id: 'C402', home: 'Mumbai Indians', away: 'Melbourne Stars', time: '18:30', status: 'Scheduled', gateLoad: '85%', teamArrived: false, refereeChecked: false }
];

let sustainabilityIndex = 74;
let foodRedirectedCount = 380;
let foodLogging = [];

const ticketListeners = new Set();
const telemetryListeners = new Set();

function notifyTicketListeners() {
  ticketListeners.forEach(cb => cb([...mockTickets]));
}

function notifyTelemetryListeners() {
  const data = {
    sustainabilityIndex,
    foodRedirectedCount,
    foodLogging
  };
  telemetryListeners.forEach(cb => cb(data));
}

// Simulated API Endpoints
export const apiSim = {
  // REST simulated endpoints
  getTickets: () => new Promise(res => setTimeout(() => res([...mockTickets]), 150)),
  
  createTicket: (newTicket) => new Promise(res => {
    setTimeout(() => {
      const ticketObj = {
        id: Date.now(),
        status: 'Active',
        aiInstructions: `AI Auto-Dispatch: Alert closest volunteer in zone ${newTicket.location}. Assist protocol initiated.`,
        ...newTicket
      };
      mockTickets = [...mockTickets, ticketObj];
      notifyTicketListeners();
      res(ticketObj);
    }, 200);
  }),

  resolveTicket: (id) => new Promise(res => {
    setTimeout(() => {
      mockTickets = mockTickets.filter(t => t.id !== id);
      notifyTicketListeners();
      res({ success: true });
    }, 150);
  }),

  getMatches: () => new Promise(res => setTimeout(() => res([...mockMatches]), 150)),

  toggleMatch: (matchId, field) => new Promise(res => {
    setTimeout(() => {
      mockMatches = mockMatches.map(m => 
        m.id === matchId ? { ...m, [field]: !m[field] } : m
      );
      res(mockMatches);
    }, 100);
  }),

  getSustainabilityMetrics: () => new Promise(res => {
    res({ sustainabilityIndex, foodRedirectedCount, foodLogging });
  }),

  routeSurplusFood: () => new Promise(res => {
    setTimeout(() => {
      const amount = 120;
      foodRedirectedCount += amount;
      sustainabilityIndex = Math.min(sustainabilityIndex + 3, 99);
      const timestamp = new Date().toLocaleTimeString();
      foodLogging = [
        `[${timestamp}] 📦 AI Surplus Match: Redirected ${amount} hot dogs & sliders from Zone 1 concession to Newark Community Shelter. Sustainability Index updated.`,
        ...foodLogging
      ];
      notifyTelemetryListeners();
      res({ sustainabilityIndex, foodRedirectedCount, foodLogging });
    }, 100);
  }),

  // SSE/Websocket simulation subscriptions
  subscribeToTickets: (callback) => {
    ticketListeners.add(callback);
    callback([...mockTickets]);
    return () => ticketListeners.delete(callback);
  },

  subscribeToTelemetry: (callback) => {
    telemetryListeners.add(callback);
    callback({ sustainabilityIndex, foodRedirectedCount, foodLogging });
    return () => telemetryListeners.delete(callback);
  }
};
