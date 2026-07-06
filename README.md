# FIFA World Cup 2026 - ArenaFlow AI 🏟️

> **GenAI-Enabled Stadium Operations & Fan Experience Orchestration Platform**

ArenaFlow AI is a high-fidelity, real-time command dashboard and fan companion portal designed to resolve critical pain points in stadium management, crowd navigation, safety protocols, multilingual support, and event sustainability for the FIFA World Cup 2026.

## 🚀 Live Links

- **GitHub Repository**: [https://github.com/rockerspace/fifa-arenaflow-ai](https://github.com/rockerspace/fifa-arenaflow-ai)
- **Live Deployed App**: [https://fifa-arenaflow-ai.vercel.app](https://fifa-arenaflow-ai.vercel.app)

---

## 🏆 Key Features

### 1. Ops Command Center (Stadium Operations)
* **Computer Vision Queue Sensor & Telemetry**: Simulated real-time sensor streams mapping security gates, transit links, and concessions. AI detects crowd bottleneck risks and recommends flow adjustments.
* **GenAI Operations Advisor**: Context-aware operations advice updated dynamically based on stadium state or active incidents (e.g., halftime concessions load balancing, transit shuttle routing).
* **Sustainability Sync (Food Surplus Program)**: GenAI matches surplus concession inventory with local community shelters, logging carbon offsets and boosting the stadium's sustainability score.
* **AI Incident & Volunteer Ticket Coordinator**: Logs incident reports, uses LLM classification to assign priority, drafts volunteer-facing instructions, and tracks resolutions.

### 2. Fan Companion Portal (FanAssist)
* **Multilingual AI Concierge**: Chat bot supporting real-time translation (English, Spanish, French, Portuguese, German, Hindi, Japanese). Powered by simulated speech synthesis (Text-to-Speech) for hands-free listening.
* **Seat to Gate Pathfinder**: Custom seat locator. Enter your ticket section to receive custom entry-gate recommendations, local concession tips, and nearest facilities.
* **Accessibility Helpdesk**: Dedicated assistance features. Fans can toggle high-contrast accessibility tools, request physical wheelchair escorts (instantly filing an ops ticket), or locate designated sensory rooms.

### 3. Integrated Sandbox Simulator
* Let's you toggle different live event phases to see how the system adapts:
  * **Normal State**: Clean diagnostics.
  * **Halftime Rush**: Activates concession load warnings and redirects fans.
  * **Transit Delay**: Activates South Rail queue jam emergency measures.
  * **Emergency Evacuation**: Activates urgent multilingual evacuation protocols.

---

## 🛠️ Tech Stack

* **Frontend**: React 18 + Vite 5
* **Icons & UI**: Lucide React
* **Animations**: Framer Motion
* **Styling**: Vanilla CSS (Tailored HSL dark theme with glassmorphism)
* **Deployments**: Vercel
* **Integration**: GitHub CLI (`gh`)

---

## 💻 Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/rockerspace/fifa-arenaflow-ai.git
   cd fifa-arenaflow-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Build the application for production:
   ```bash
   npm run build
   ```
