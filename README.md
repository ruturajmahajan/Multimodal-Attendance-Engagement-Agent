# Multimodal Attendance & Engagement Agent (MAEA)

> An AI-powered, privacy-preserving classroom intelligence dashboard integrating computer vision, audio signal processing, and agent-based reasoning for automated attendance tracking, real-time engagement analytics, and pedagogical suggestions.

---

## 🌟 Key Features

1. **Multimodal Behavioral Signal Fusion**
   - Head Pose tracking (forward-facing ratio)
   - Micro-movement and physical restlessness analysis
   - Inactivity detection with configurable idle thresholds
   - Acoustic signal processing (Q&A interactions, ambient speech ratio)

2. **Automated Attendance Verification**
   - Simulated camera feed with live facial detection bounding boxes
   - Status categorization: Present, Late, Absent with timestamp tracking
   - Real-time attendance rate calculation and roster search/filter

3. **Context-Aware AI Teaching Suggestions**
   - Heuristic agent analyzing live session engagement metrics
   - Prioritized recommendations (Critical, High, Medium, Low) for pacing, interaction, and classroom management
   - Interactive action logging (Apply/Dismiss workflow)

4. **Classroom Engagement Heatmap**
   - Segment-by-segment attention intensity matrix across individual learners
   - Color-coded engagement bands with hover details

5. **Student Analytics & Profiles**
   - Detailed per-student engagement breakdown, risk detection, and historical performance
   - Interactive profile modals with individualized AI teaching guidance

6. **Session Logs & Exportable Reports**
   - Chronological event timeline recording system, attendance, AI, and alert actions
   - CSV export capability for attendance records

7. **Theme & Aesthetics**
   - Modern light theme engineered for educational software standards
   - High visual contrast typography with Space Grotesk, Inter, and JetBrains Mono fonts

---

## 🛠️ Technology Stack

- **Frontend Core**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Charting Engine**: [Chart.js 4.4.0](https://www.chartjs.org/) (Line, Bar, Doughnut, Radar, Stacked charts)
- **Typography**: Google Fonts (Inter, Space Grotesk, JetBrains Mono)
- **Architecture**: Zero-build static web application (standalone, works offline directly in modern web browsers)

---

## 🚀 Quick Start

1. Clone this repository:
   ```bash
   git clone https://github.com/ruturajmahajan/Multimodal-Attendance-Engagement-Agent.git
   ```
2. Open `index.html` in any modern web browser:
   - Double-click `index.html`, or
   - Use a local dev server (e.g., Live Server in VS Code, `npx serve .`, or python `python -m http.server 8000`)

---

## 📁 Project Structure

```text
├── index.html       # Single-page application shell with 7 dashboard views
├── style.css        # Design system, CSS variables, light theme styles & micro-animations
├── app.js           # Core state management, session simulation engine, UI interactions
├── charts.js        # Chart.js instances (trend, donut, radar, timeline, interval, distributions)
├── data.js          # Roster dataset, multimodal signal baselines, and suggestions repository
└── README.md        # Project documentation
```

---

## 🔒 Privacy & Ethical Deployment

Designed with offline-first principles:
- Feature extraction & signal analysis run locally without third-party cloud streaming.
- Preserves learner biometric privacy and complies with educational data guidelines.