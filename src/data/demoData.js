// UrbanFlow AI - Realistic Indian Traffic Data for Shirpur, Maharashtra

export const LOCATIONS = [
  { id: 'subhash-chowk', name: 'Subhash Chowk Junction', zone: 'Central Market Zone', cameras: 1, congestion: 'Moderate', speedLimit: 40 },
  { id: 'nimzari-naka', name: 'Nimzari Naka Crossing', zone: 'West Checkpoint & Highway', cameras: 1, congestion: 'Heavy', speedLimit: 50 },
  { id: 'rc-patel-chowk', name: 'R.C. Patel Campus Chowk', zone: 'Educational Sector', cameras: 1, congestion: 'Normal', speedLimit: 30 },
  { id: 'highway-junction', name: 'Mumbai-Agra Highway (NH 52)', zone: 'National Bypass', cameras: 1, congestion: 'Moderate', speedLimit: 60 },
];

export const DEMO_OFFICERS = [
  { id: 'OFF-101', name: 'Officer Vikram Patil', badge: 'UF-MH18-402', role: 'Traffic Control Supervisor', shift: 'Morning Shift', email: 'v.patil@urbanflow.gov.in', phone: '+91 98230 44102' },
  { id: 'OFF-102', name: 'Officer Sunita Sharma', badge: 'UF-MH18-405', role: 'Console Operator', shift: 'Afternoon Shift', email: 's.sharma@urbanflow.gov.in', phone: '+91 98221 55219' },
  { id: 'OFF-103', name: 'Officer Rajesh Jadhav', badge: 'UF-MH18-410', role: 'Emergency Response Lead', shift: 'Night Shift', email: 'r.jadhav@urbanflow.gov.in', phone: '+91 97640 11984' },
];

// Exactly 4 Live CCTV Cameras for Indian Traffic
export const INITIAL_CAMERAS = [
  {
    id: 'CAM-01',
    name: 'CAM 01 - Subhash Chowk Central',
    junction: 'Subhash Chowk Junction',
    junctionId: 'subhash-chowk',
    direction: 'City Market Approach',
    trafficType: 'Auto-Rickshaws, Scooters & Sedans',
    status: 'online',
    fps: 25,
    resolution: '1920x1080 (1080p)',
    ipAddress: '192.168.18.101',
    rtspUrl: 'rtsp://admin:pass@192.168.18.101:554/live/ch0',
    vehicleCount: 28,
    avgSpeed: '28 km/h',
    anprActive: true,
    lastPlate: 'MH 18 BG 4421',
    hasAlert: false,
    latency: '24 ms',
    bitrate: '4.2 Mbps',
    vehiclesInFeed: [
      { type: 'Auto-Rickshaw', model: 'Bajaj Compact RE', color: '#10B981', plate: 'MH 18 V 2210', speed: '24 km/h' },
      { type: 'Two-Wheeler', model: 'Hero Splendor Plus', color: '#38BDF8', plate: 'MH 18 AX 9102', speed: '32 km/h' },
      { type: 'Car', model: 'Maruti Suzuki Swift', color: '#F43F5E', plate: 'MH 18 BG 4421', speed: '28 km/h' }
    ]
  },
  {
    id: 'CAM-02',
    name: 'CAM 02 - Nimzari Naka Checkpoint',
    junction: 'Nimzari Naka Crossing',
    junctionId: 'nimzari-naka',
    direction: 'Industrial Highway Gateway',
    trafficType: 'Heavy Commercial Trucks & Emergency',
    status: 'online',
    fps: 30,
    resolution: '1920x1080 (1080p)',
    ipAddress: '192.168.18.102',
    rtspUrl: 'rtsp://admin:pass@192.168.18.102:554/live/ch0',
    vehicleCount: 42,
    avgSpeed: '22 km/h',
    anprActive: true,
    lastPlate: 'MH 15 EF 9044',
    hasAlert: true,
    alertText: 'Priority: Ambulance 108 Approaching Inbound',
    latency: '28 ms',
    bitrate: '4.8 Mbps',
    vehiclesInFeed: [
      { type: 'Ambulance 108', model: 'Force Traveller Emergency', color: '#EF4444', plate: 'MH 15 EF 9044', speed: '48 km/h', priority: true },
      { type: 'Heavy Truck', model: 'Tata 1613 Multi-Axle', color: '#F59E0B', plate: 'MH 19 CE 3301', speed: '18 km/h' },
      { type: 'Pickup', model: 'Mahindra Bolero Maxi', color: '#FFFFFF', plate: 'MH 18 K 5519', speed: '26 km/h' }
    ]
  },
  {
    id: 'CAM-03',
    name: 'CAM 03 - R.C. Patel Campus Crossing',
    junction: 'R.C. Patel Campus Chowk',
    junctionId: 'rc-patel-chowk',
    direction: 'College Road East-West',
    trafficType: 'Two-Wheelers & Student Transit',
    status: 'online',
    fps: 25,
    resolution: '1920x1080 (1080p)',
    ipAddress: '192.168.18.103',
    rtspUrl: 'rtsp://admin:pass@192.168.18.103:554/live/ch0',
    vehicleCount: 16,
    avgSpeed: '32 km/h',
    anprActive: true,
    lastPlate: 'MH 18 BF 1243',
    hasAlert: false,
    latency: '22 ms',
    bitrate: '3.9 Mbps',
    vehiclesInFeed: [
      { type: 'Scooter', model: 'Honda Activa 6G', color: '#6366F1', plate: 'MH 18 BF 1243', speed: '29 km/h' },
      { type: 'Motorcycle', model: 'Bajaj Pulsar 150', color: '#3B82F6', plate: 'MH 18 M 8820', speed: '36 km/h' },
      { type: 'Car', model: 'Hyundai i20', color: '#E2E8F0', plate: 'MH 18 T 0092', speed: '31 km/h' }
    ]
  },
  {
    id: 'CAM-04',
    name: 'CAM 04 - Mumbai-Agra NH-52 Bypass',
    junction: 'Mumbai-Agra Highway (NH 52)',
    junctionId: 'highway-junction',
    direction: 'National Highway Corridor',
    trafficType: 'Intercity State Transport Buses & Freight',
    status: 'online',
    fps: 30,
    resolution: '1920x1080 (1080p)',
    ipAddress: '192.168.18.104',
    rtspUrl: 'rtsp://admin:pass@192.168.18.104:554/live/ch0',
    vehicleCount: 36,
    avgSpeed: '58 km/h',
    anprActive: true,
    lastPlate: 'MH 18 CQ 7719',
    hasAlert: false,
    latency: '31 ms',
    bitrate: '5.2 Mbps',
    vehiclesInFeed: [
      { type: 'Intercity Bus', model: 'MSRTC Shivshahi AC', color: '#8B5CF6', plate: 'MH 18 CQ 7719', speed: '55 km/h' },
      { type: 'Long Haul Truck', model: 'Ashok Leyland 4018', color: '#EC4899', plate: 'GJ 05 BC 6670', speed: '48 km/h' },
      { type: 'SUV', model: 'Mahindra Scorpio-N', color: '#0F172A', plate: 'DL 01 AA 2024', speed: '64 km/h' }
    ]
  }
];

export const INITIAL_INTERSECTION_STATE = {
  junctionId: 'subhash-chowk',
  junctionName: 'Subhash Chowk Junction (Shirpur)',
  activeGreenLane: 'north', // 'north' | 'south' | 'east' | 'west'
  nextGreenLane: 'east',
  priorityVehicleLane: 'west', // Ambulance or VIP corridor
  hasPriorityActive: false,
  countdownSeconds: 18,
  lanes: {
    north: {
      id: 'north',
      name: 'North Approach',
      road: 'Main Station Road',
      vehicles: 24,
      isGreen: true,
      hasPriority: false,
      speed: '32 km/h'
    },
    south: {
      id: 'south',
      name: 'South Approach',
      road: 'Old City Chowk Road',
      vehicles: 14,
      isGreen: false,
      hasPriority: false,
      speed: '28 km/h'
    },
    east: {
      id: 'east',
      name: 'East Approach',
      road: 'Main Bazaar Road',
      vehicles: 38,
      isGreen: false,
      hasPriority: false,
      speed: '14 km/h'
    },
    west: {
      id: 'west',
      name: 'West Approach',
      road: 'Cinema Hall / Hospital Link',
      vehicles: 19,
      isGreen: false,
      hasPriority: true,
      priorityReason: '108 Ambulance Approaching',
      speed: '36 km/h'
    }
  }
};

export const INITIAL_ALERTS = [
  {
    id: 'ALT-2026-01',
    type: 'Priority Vehicle (Ambulance 108 Approaching)',
    severity: 'critical',
    junction: 'Subhash Chowk (West Approach)',
    lane: 'West Approach',
    timestamp: 'Just now',
    assignedOfficer: 'Officer Vikram Patil',
    status: 'active',
    description: 'Ambulance 108 on West Approach requesting emergency green wave corridor towards Cottage Hospital.',
    cameraSnapshot: 'CAM-02'
  },
  {
    id: 'ALT-2026-02',
    type: 'High Vehicle Density in East Approach',
    severity: 'warning',
    junction: 'Main Bazaar Road',
    lane: 'East Approach',
    timestamp: '8 mins ago',
    assignedOfficer: 'Officer Sunita Sharma',
    status: 'acknowledged',
    description: 'Vehicle count at East Approach reached 38 vehicles. Suggesting green split extension.',
    cameraSnapshot: 'CAM-01'
  }
];

// ANPR Rule Violations – vehicles that broke traffic rules
export const ANPR_VIOLATIONS = [
  {
    id: 'VIO-2026-01',
    plate: 'MH 18 BG 4421',
    vehicleModel: 'Maruti Swift (Red)',
    vehicleType: 'Car',
    violationType: 'Over Speed',
    violationCode: 'SPEED',
    detectedSpeed: '68 km/h',
    speedLimit: '40 km/h',
    junction: 'Subhash Chowk Junction',
    camera: 'CAM-01',
    lane: 'North Approach',
    time: '17:18:42',
    date: '18 Oct 2026',
    confidence: 98.4,
    status: 'Challan Issued',
    officer: 'Officer Vikram Patil',
    fine: '₹2,000',
    image: '/anpr_violation_speeding.png'
  },
  {
    id: 'VIO-2026-02',
    plate: 'MH 18 K 5519',
    vehicleModel: 'Mahindra Bolero (White)',
    vehicleType: 'Pickup',
    violationType: 'Red Light Jump',
    violationCode: 'RED_LIGHT',
    detectedSpeed: '38 km/h',
    speedLimit: '50 km/h',
    junction: 'Nimzari Naka Crossing',
    camera: 'CAM-02',
    lane: 'Industrial Highway Gateway',
    time: '17:14:09',
    date: '18 Oct 2026',
    confidence: 96.7,
    status: 'Under Review',
    officer: 'Officer Sunita Sharma',
    fine: '₹1,000',
    image: '/anpr_violation_redlight.png'
  },
  {
    id: 'VIO-2026-03',
    plate: 'DL 01 AA 2024',
    vehicleModel: 'Mahindra Scorpio-N (Black)',
    vehicleType: 'SUV',
    violationType: 'Over Speed (Highway)',
    violationCode: 'SPEED',
    detectedSpeed: '82 km/h',
    speedLimit: '60 km/h',
    junction: 'Mumbai-Agra NH-52 Bypass',
    camera: 'CAM-04',
    lane: 'National Highway Corridor',
    time: '17:10:55',
    date: '18 Oct 2026',
    confidence: 99.1,
    status: 'Challan Issued',
    officer: 'Officer Rajesh Jadhav',
    fine: '₹4,000',
    image: '/anpr_violation_overspeed.png'
  }
];

export const RECENT_DETECTIONS = [
  {
    id: 'DET-101',
    plate: 'MH 18 BG 4421',
    type: 'Car (Maruti Swift)',
    junction: 'Subhash Chowk',
    lane: 'North Approach',
    time: '17:18:42',
    confidence: 98.4,
    speed: '28 km/h',
    status: 'Valid'
  },
  {
    id: 'DET-102',
    plate: 'MH 18 V 2210',
    type: 'Auto-Rickshaw (Bajaj RE)',
    junction: 'Subhash Chowk',
    lane: 'North Approach',
    time: '17:18:15',
    confidence: 99.2,
    speed: '24 km/h',
    status: 'Valid'
  },
  {
    id: 'DET-103',
    plate: 'MH 15 EF 9044',
    type: 'Ambulance 108 (Force)',
    junction: 'Nimzari Naka',
    lane: 'West Approach',
    time: '17:17:50',
    confidence: 99.8,
    speed: '48 km/h',
    status: 'Priority'
  },
  {
    id: 'DET-104',
    plate: 'MH 18 AX 9102',
    type: 'Two-Wheeler (Hero Splendor)',
    junction: 'Subhash Chowk',
    lane: 'South Approach',
    time: '17:17:10',
    confidence: 97.6,
    speed: '32 km/h',
    status: 'Valid'
  },
  {
    id: 'DET-105',
    plate: 'MH 18 CQ 7719',
    type: 'Bus (MSRTC Shivshahi)',
    junction: 'NH-52 Bypass',
    lane: 'East Approach',
    time: '17:16:34',
    confidence: 98.9,
    speed: '55 km/h',
    status: 'Valid'
  }
];

export const HOURLY_TRAFFIC_VOLUME = [
  { hour: '08:00', vehicles: 480 },
  { hour: '10:00', vehicles: 890 },
  { hour: '12:00', vehicles: 760 },
  { hour: '14:00', vehicles: 840 },
  { hour: '16:00', vehicles: 1120 },
  { hour: '17:00', vehicles: 1284 },
  { hour: '18:00', vehicles: 1390 },
  { hour: '20:00', vehicles: 920 },
];

export const VEHICLE_DISTRIBUTION = [
  { name: 'Two-Wheelers (Bikes/Scooters)', count: 542, value: 42, color: '#2563EB' },
  { name: 'Auto-Rickshaws (3-Wheelers)', count: 245, value: 19, color: '#0D9488' },
  { name: 'Cars & Taxis', count: 284, value: 22, color: '#D97706' },
  { name: 'Commercial Trucks & Buses', count: 184, value: 14, color: '#7C3AED' },
  { name: 'Priority Emergency (108)', count: 29, value: 3, color: '#DC2626' },
];

export const LANE_TRAFFIC_COUNT = [
  { lane: 'North Approach', vehicles: 342, queue: '24m', avgWait: '28s' },
  { lane: 'South Approach', vehicles: 268, queue: '14m', avgWait: '22s' },
  { lane: 'East Main Bazaar', vehicles: 456, queue: '38m', avgWait: '42s' },
  { lane: 'West Approach', vehicles: 218, queue: '19m', avgWait: '20s' },
];

export const JUNCTION_CONGESTION_INDEX = [
  { junction: 'Subhash Chowk', index: 58, status: 'Moderate', volume: 1284 },
  { junction: 'Nimzari Naka', index: 68, status: 'Heavy', volume: 1410 },
  { junction: 'R.C. Patel Campus', index: 32, status: 'Normal', volume: 740 },
  { junction: 'NH-52 Bypass', index: 48, status: 'Moderate', volume: 1890 },
];

export const WAITING_TIME_COMPARISON = [
  { junction: 'Subhash Chowk', currentWait: 38, aiOptimized: 26, fixedOld: 55 },
  { junction: 'Nimzari Naka', currentWait: 46, aiOptimized: 30, fixedOld: 68 },
  { junction: 'R.C. Patel Campus', currentWait: 18, aiOptimized: 14, fixedOld: 32 },
  { junction: 'NH-52 Bypass', currentWait: 28, aiOptimized: 20, fixedOld: 44 },
];

export const INITIAL_REPORTS = [
  {
    id: 'RPT-2026-01',
    name: 'Daily Traffic Flow & Signal Timing Report',
    type: 'Daily Traffic Report',
    date: '17 Oct 2026',
    location: 'Shirpur 4-Sector Network',
    status: 'Ready',
    author: 'Officer Vikram Patil',
    summary: 'Daily traffic volume logged 14,284 vehicles. Adaptive signal timing reduced queue delay by 24%.'
  },
  {
    id: 'RPT-2026-02',
    name: 'Emergency Priority Green Wave Transit Audit',
    type: 'Emergency Incident Report',
    date: '16 Oct 2026',
    location: 'Hospital Corridor Axis',
    status: 'Ready',
    author: 'Officer Rajesh Jadhav',
    summary: 'Ambulance 108 green wave triggered 4 times with zero transit bottlenecks.'
  },
  {
    id: 'RPT-2026-03',
    name: 'Weekly Corridor Speed & Congestion Report',
    type: 'Weekly Traffic Report',
    date: '15 Oct 2026',
    location: 'Subhash Chowk & Market Sector',
    status: 'Ready',
    author: 'Officer Sunita Sharma',
    summary: 'Average corridor travel speed reached 28 km/h during evening peaks.'
  }
];

export const INITIAL_SETTINGS = {
  profile: {
    name: 'Officer Vikram Patil',
    badge: 'UF-MH18-402',
    department: 'Shirpur Traffic Police Branch',
    role: 'Traffic Control Supervisor',
    email: 'v.patil@urbanflow.gov.in',
    phone: '+91 98230 44102',
    station: 'Subhash Chowk Control Station 1'
  },
  cameraConfig: {
    streamQuality: '1080p',
    fpsLimit: 25,
    anprConfidenceThreshold: 85,
    overlayTelemetry: true
  },
  signalTiming: {
    controlMode: 'adaptive',
    minGreenTime: 15,
    maxGreenTime: 60,
    yellowInterval: 4,
    emergencyGreenWaveDuration: 30
  },
  alertPreferences: {
    audioAlerts: true,
    criticalModalPopup: true,
    congestionThresholdPercent: 80
  }
};
