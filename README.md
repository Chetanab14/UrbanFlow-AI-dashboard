# UrbanFlow AI – Smart Traffic Management System

**UrbanFlow AI** is a professional, responsive enterprise web application built for municipal traffic control admin officers. It enables officers to monitor real-time CCTV optical camera feeds, analyze congestion bottlenecks, view vehicle number-plate (ANPR) detections, manage intersection signal timings, generate official municipal audit reports, and dispatch emergency green wave corridors for emergency vehicles.

---

## 🚦 System Architecture & Tech Stack

- **Core**: React 19 with Vite
- **Routing**: React Router DOM (`v7`)
- **Icons**: Lucide React
- **Analytics & Visualizations**: Recharts (`v3`)
- **Styling**: Standard CSS3 with CSS custom properties (variables), Flexbox, and CSS Grid
- **Demonstration Data**: Realistic data tailored to Shirpur, Maharashtra junctions (Subhash Chowk, Nimzari Naka, R.C. Patel Campus, NH-52 Bypass)
- **Local Persistence**: Browser `localStorage` for alert statuses, signal changes, and officer preferences

---

## 🎨 Enterprise Design System

The interface adheres to an enterprise traffic control centre palette:

| Element | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Navy** | `#17243A` | Primary branding, modals, text headers |
| **Sidebar** | `#142238` | Fixed collapsible navigation sidebar |
| **Primary Blue** | `#3478F6` | Active states, primary action buttons, links |
| **Teal** | `#1596A5` | Secondary actions, accent badges |
| **Workspace Background** | `#F5F7FA` | Clean, high-legibility canvas |
| **Card Surface** | `#FFFFFF` | Structured panels with restrained elevation |
| **Success** | `#16A34A` | Online statuses, green phases, verified records |
| **Warning** | `#F59E0B` | Moderate congestion, yellow transitions, warnings |
| **Critical Alerts** | `#DC2626` | Emergency green wave, offline links, red phases |

**Typography**: Inter (primary) & Roboto Mono (telemetry, license plates, timestamps).

---

## 🧭 Navigation & Core Modules

The application features exactly six navigation items plus the authentication portal:

1. **Dashboard (`/`)**:
   - 4 Demonstration KPI cards: Active Cameras (12/16), Vehicles Detected (1,284), Congestion Level (Moderate), Active Alerts (03).
   - Interactive **Traffic Intersection Schematic**: 4-way intersection (North, South, East, West lanes) with animated glowing signal indicators (Red/Yellow/Green), countdown timers, vehicle queue lengths, and lane congestion badges.
   - **Signal Phase Manager**: Modal dialog to toggle between Adaptive AI Control, Fixed Cycles, Manual Override, or trigger Emergency Green Corridor.
   - **Camera Preview Card** & quick emergency triage widget.
   - **Recent Vehicle Detections (ANPR) Table**: Displays vehicle types, Indian license plate badges (e.g., `MH 18 BG 4421`), speeds, lanes, timestamps, and confidence scores.

2. **Live Cameras (`/cameras`)**:
   - Monitoring grid across all 16 CCTV endpoints.
   - Filters for **All (16)**, **Online (12)**, **Offline (4)**, and **Alerts**.
   - Search by camera ID, name, junction, or license plate.
   - **CameraDetailModal**: High-resolution simulated video stream canvas, simulated vehicle bounding boxes (YOLOv8 style), PTZ controls (Pan/Tilt/Zoom), telemetry (bitrate, packet loss, sensor temp), and instant snapshot evidence capture.

3. **Analytics (`/analytics`)**:
   - Interactive charts built with **Recharts**:
     - Traffic Volume & Flow Rate Over Time (Area Chart)
     - Vehicle Classification Breakdown (Donut Chart)
     - Traffic Count by Lane (Bar Chart)
     - Congestion Index by Junction (Horizontal Bar Chart)
     - Signal Waiting Delay Comparison (Fixed Timer vs AI Adaptive)
   - Dynamic date-range and junction filters that update charts in real-time.

4. **Report (`/reports`)**:
   - Supports all 7 standard report types: *Daily Traffic Report, Weekly Traffic Report, Monthly Traffic Report, Congestion Report, Camera Uptime Report, Signal Performance Report, Emergency Incident Report*.
   - Searchable, sortable report table.
   - **Report Preview Modal** with executive summary, tables, and officer digital signature.
   - **Real CSV Export**: Generates and downloads real `.csv` files dynamically in browser memory.
   - **Printable Document**: Generates clean, formatted printable documents with browser print trigger.
   - **Generate Report Modal**: Allows creating new customized audit reports into the table.

5. **Alert & Emergency (`/alerts`)**:
   - Incident response console with severity filters (*Critical, Warning, Informational*) and status filters (*Active, Acknowledged, Resolved*).
   - Demonstrates scenarios: Ambulance approaching (Green Corridor request), severe gridlock at Subhash Chowk, camera fiber loss, stalled mini-truck on NH-52.
   - Actions: **Acknowledge**, **Assign Field Officer** (modal with duty roster), **View Camera**, **Trigger Green Corridor**, and **Mark Resolved** with confirmation dialog and resolution notes.
   - Changes persist to browser `localStorage`.

6. **Setting (`/settings`)**:
   - Comprehensive configuration suite across 7 tabs:
     1. *Admin Profile*: Name, badge, station, contact details.
     2. *Camera Configuration*: Stream resolution caps, framerates, ANPR sensitivity thresholds, and telemetry overlays.
     3. *Junction & Lanes*: Speed limits and approach configurations for Shirpur sectors.
     4. *Signal Timing & Rules*: NTCIP parameters (min/max green, yellow change 4s, all-red clearance 2s, emergency green wave 45s).
     5. *Alert Preferences*: Audio chimes, automated popups, queue threshold triggers.
     6. *Notification Dispatch*: CCTNS SMS gateway and browser push notification permissions.
     7. *System Health & Edge AI*: Roadside edge AI inference latency (22ms), CPU load, storage buffer, and fiber telemetry.

7. **Login Portal (`/login`)**:
   - UrbanFlow AI logo with radar icon.
   - Email and password fields with show/hide password toggle.
   - "Remember me" option and password assistance modal.
   - "Auto-fill Officer Demo Credentials" button for instant testing.
   - Form validation and direct login into the console.

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (version 18+ or 20+ recommended)
- npm

### Installation & Development
1. Clone or open the workspace folder:
   ```bash
   cd "urbanflow ai dashboard"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite local development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:5173/
   ```

### Production Build
To create an optimized production bundle:
```bash
npm run build
```
To preview the production build locally:
```bash
npm run preview
```

---

## 🔐 Demonstration Credentials

- **Officer Email**: `officer.patil@urbanflow.gov.in`
- **Password**: `Traffic@2026`
- *Or click "Auto-fill Officer Demo Credentials" on the login screen.*

---

## ⚠️ Hardware & Production Integration Disclaimer

- **Simulated Video Stream Footage**: Web browsers cannot natively decode raw RTSP/UDP CCTV video feeds directly. In a live municipality deployment, a streaming gateway (such as MediaMTX, go2rtc, or WebRTC HLS streamer) is required to transcode raw video feeds.
- **Simulated Signal Interventions**: The signal timing controls, emergency green wave, and camera PTZ adjustments in this frontend application update demonstration state and browser `localStorage`. Real-world traffic signal alteration requires an authenticated SCADA/NTCIP physical controller gateway with fail-safe hardware conflict monitors.
