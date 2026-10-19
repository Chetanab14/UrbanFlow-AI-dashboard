import React, { useState } from 'react';
import {
  User,
  Video,
  MapPin,
  Sliders,
  Bell,
  Activity,
  ShieldAlert,
  CheckCircle2,
  Save,
  RotateCcw,
  Cpu,
  HardDrive,
  Wifi,
  Server,
  Layers
} from 'lucide-react';
import { INITIAL_SETTINGS, LOCATIONS } from '../data/demoData';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'camera' | 'junction' | 'signals' | 'alerts' | 'notifications' | 'health'
  
  // Load settings from localStorage or fallback to INITIAL_SETTINGS
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('urbanflow_settings');
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [toastMessage, setToastMessage] = useState(null);
  const [errors, setErrors] = useState({});

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Profile Form State
  const [profileData, setProfileData] = useState(settings.profile);

  // Camera Config State
  const [cameraConfig, setCameraConfig] = useState(settings.cameraConfig);

  // Signal Timing State
  const [signalTiming, setSignalTiming] = useState(settings.signalTiming);

  // Alert Preferences State
  const [alertPreferences, setAlertPreferences] = useState(settings.alertPreferences);

  // Save Handlers
  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!profileData.name.trim()) {
      setErrors({ name: 'Officer Name cannot be blank.' });
      return;
    }
    if (!profileData.email.trim() || !profileData.email.includes('@')) {
      setErrors({ email: 'Please enter a valid government email address.' });
      return;
    }
    setErrors({});
    const updated = { ...settings, profile: profileData };
    setSettings(updated);
    localStorage.setItem('urbanflow_settings', JSON.stringify(updated));
    showToast('Admin Officer Profile preferences saved successfully!');
  };

  const handleSaveCameraConfig = (e) => {
    e.preventDefault();
    const updated = { ...settings, cameraConfig };
    setSettings(updated);
    localStorage.setItem('urbanflow_settings', JSON.stringify(updated));
    showToast('Camera optical configuration parameters saved!');
  };

  const handleSaveSignalTiming = (e) => {
    e.preventDefault();
    if (signalTiming.minGreenTime >= signalTiming.maxGreenTime) {
      setErrors({ minGreen: 'Minimum green time must be less than maximum green time.' });
      return;
    }
    setErrors({});
    const updated = { ...settings, signalTiming };
    setSettings(updated);
    localStorage.setItem('urbanflow_settings', JSON.stringify(updated));
    showToast('NTCIP signal timing cycle rules saved to simulated controller!');
  };

  const handleSaveAlerts = (e) => {
    e.preventDefault();
    const updated = { ...settings, alertPreferences };
    setSettings(updated);
    localStorage.setItem('urbanflow_settings', JSON.stringify(updated));
    showToast('Alert and notification dispatch preferences saved!');
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all parameters to factory defaults?')) {
      setSettings(INITIAL_SETTINGS);
      setProfileData(INITIAL_SETTINGS.profile);
      setCameraConfig(INITIAL_SETTINGS.cameraConfig);
      setSignalTiming(INITIAL_SETTINGS.signalTiming);
      setAlertPreferences(INITIAL_SETTINGS.alertPreferences);
      localStorage.setItem('urbanflow_settings', JSON.stringify(INITIAL_SETTINGS));
      showToast('All settings restored to factory defaults.');
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header-row">
        <div className="page-intro">
          <h1 className="text-h1">System & Telemetry Settings</h1>
          <p className="text-body">
            Configure officer profiles, camera feeds, NTCIP signal thresholds, and edge hardware health
          </p>
        </div>

        <div className="page-actions-group">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleResetDefaults}
          >
            <RotateCcw size={14} />
            <span>Reset to Factory Defaults</span>
          </button>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div style={{
        backgroundColor: '#FFFBEB',
        border: '1px solid #FCD34D',
        borderRadius: 'var(--radius-md)',
        padding: '10px 14px',
        marginBottom: 'var(--space-lg)',
        fontSize: 12,
        color: '#92400E',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 8
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShieldAlert size={16} />
          <span>
            <strong>Simulation Sandbox Notice:</strong> Modifications here update demo settings in your browser's localStorage. Real-world traffic signal alteration requires an authenticated SCADA/NTCIP physical gateway.
          </span>
        </div>
        <span className="badge-demo">Local Storage Saved</span>
      </div>

      {toastMessage && (
        <div style={{
          backgroundColor: '#DCFCE7',
          border: '1px solid #86EFAC',
          color: '#166534',
          padding: '10px 14px',
          borderRadius: 'var(--radius-md)',
          fontSize: 13,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 'var(--space-lg)'
        }}>
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Settings Navigation Tabs */}
      <div className="tabs-navigation">
        {[
          { id: 'profile', label: 'Admin Profile', icon: User },
          { id: 'camera', label: 'Camera Configuration', icon: Video },
          { id: 'junction', label: 'Junction & Lanes', icon: MapPin },
          { id: 'signals', label: 'Signal Timing & Rules', icon: Sliders },
          { id: 'alerts', label: 'Alert Preferences', icon: Bell },
          { id: 'notifications', label: 'Notification Dispatch', icon: Layers },
          { id: 'health', label: 'System Health & Edge AI', icon: Activity },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT SECTIONS */}
      <div className="dashboard-card" style={{ maxWidth: 840 }}>
        {/* 1. Admin Profile Tab */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile}>
            <div className="dashboard-card-header">
              <div className="card-title-group">
                <h3 className="card-title">Officer Credentials & Station Profile</h3>
                <span className="card-subtitle">Manage administrator identity and station assignment</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Officer Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                />
                {errors.name && <span className="form-error-msg">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Badge Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileData.badge}
                  onChange={(e) => setProfileData({ ...profileData, badge: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department / Branch</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileData.department}
                  onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Officer Role</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileData.role}
                  onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Official Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                />
                {errors.email && <span className="form-error-msg">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Duty Phone Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: 8 }}>
              <label className="form-label">Station Post</label>
              <input
                type="text"
                className="form-input"
                value={profileData.station}
                onChange={(e) => setProfileData({ ...profileData, station: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--color-border)' }}>
              <button type="submit" className="btn btn-primary">
                <Save size={15} /> Save Profile Changes
              </button>
            </div>
          </form>
        )}

        {/* 2. Camera Configuration Tab */}
        {activeTab === 'camera' && (
          <form onSubmit={handleSaveCameraConfig}>
            <div className="dashboard-card-header">
              <div className="card-title-group">
                <h3 className="card-title">Optical Sensor & ANPR Settings</h3>
                <span className="card-subtitle">Resolution, framerate caps, and AI vision inference thresholds</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Preferred Stream Quality</label>
                <select
                  className="form-select"
                  value={cameraConfig.streamQuality}
                  onChange={(e) => setCameraConfig({ ...cameraConfig, streamQuality: e.target.value })}
                >
                  <option value="720p">720p (HD - Reduced Bandwidth)</option>
                  <option value="1080p">1080p (Full HD - Recommended)</option>
                  <option value="2K">2K (QHD - High Detail)</option>
                  <option value="4K">4K (Ultra HD - Requires High Fiber Bandwidth)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Max Display Framerate</label>
                <select
                  className="form-select"
                  value={cameraConfig.fpsLimit}
                  onChange={(e) => setCameraConfig({ ...cameraConfig, fpsLimit: Number(e.target.value) })}
                >
                  <option value={15}>15 FPS (Conserves GPU load)</option>
                  <option value={25}>25 FPS (Standard PAL CCTV)</option>
                  <option value={30}>30 FPS (Smooth NTSC)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">ANPR Plate Confidence Threshold (%)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <input
                    type="range"
                    min="70"
                    max="98"
                    value={cameraConfig.anprConfidenceThreshold}
                    onChange={(e) => setCameraConfig({ ...cameraConfig, anprConfidenceThreshold: Number(e.target.value) })}
                    style={{ flex: 1 }}
                  />
                  <span className="text-mono" style={{ width: 44, fontWeight: 700 }}>
                    {cameraConfig.anprConfidenceThreshold}%
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13 }}>
                <input
                  type="checkbox"
                  checked={cameraConfig.autoReconnect}
                  onChange={(e) => setCameraConfig({ ...cameraConfig, autoReconnect: e.target.checked })}
                  style={{ width: 16, height: 16, accentColor: 'var(--color-primary)' }}
                />
                <span>Automatically retry disconnected RTSP optical channels every 15s</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13 }}>
                <input
                  type="checkbox"
                  checked={cameraConfig.detectSpeedViolations}
                  onChange={(e) => setCameraConfig({ ...cameraConfig, detectSpeedViolations: e.target.checked })}
                  style={{ width: 16, height: 16, accentColor: 'var(--color-primary)' }}
                />
                <span>Enable optical doppler speed calculation & flag speed violations</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13 }}>
                <input
                  type="checkbox"
                  checked={cameraConfig.overlayTelemetry}
                  onChange={(e) => setCameraConfig({ ...cameraConfig, overlayTelemetry: e.target.checked })}
                  style={{ width: 16, height: 16, accentColor: 'var(--color-primary)' }}
                />
                <span>Render HUD timestamp, framerate, and bounding boxes over video canvases</span>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--color-border)' }}>
              <button type="submit" className="btn btn-primary">
                <Save size={15} /> Save Camera Config
              </button>
            </div>
          </form>
        )}

        {/* 3. Junction & Lanes Tab */}
        {activeTab === 'junction' && (
          <div>
            <div className="dashboard-card-header">
              <div className="card-title-group">
                <h3 className="card-title">Configured Shirpur Junctions & Sectors</h3>
                <span className="card-subtitle">Manage physical approaches and speed limits</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {LOCATIONS.map(loc => (
                <div
                  key={loc.id}
                  style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 10
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-navy)' }}>
                      {loc.name}
                    </h4>
                    <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
                      Sector Zone: {loc.zone} • {loc.cameras} CCTV Cameras Connected
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ fontSize: 12 }}>
                      Speed Limit: <strong>{loc.speedLimit} km/h</strong>
                    </div>
                    <span className="badge badge-online">Operational</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 20, padding: 12, backgroundColor: '#EFF6FF', borderRadius: 'var(--radius-md)', fontSize: 12, color: '#1E40AF' }}>
              ℹ️ To commission additional intersection hardware in Shirpur, submit a junction geometry proposal to the municipal engineering wing.
            </div>
          </div>
        )}

        {/* 4. Signal Timing Tab */}
        {activeTab === 'signals' && (
          <form onSubmit={handleSaveSignalTiming}>
            <div className="dashboard-card-header">
              <div className="card-title-group">
                <h3 className="card-title">NTCIP Signal Timing Parameters</h3>
                <span className="card-subtitle">Set safety intervals, clearance times, and adaptive bounds</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Signal Control Strategy</label>
                <select
                  className="form-select"
                  value={signalTiming.controlMode}
                  onChange={(e) => setSignalTiming({ ...signalTiming, controlMode: e.target.value })}
                >
                  <option value="adaptive">Adaptive AI Optimization (Recommended)</option>
                  <option value="fixed">Fixed Cycle Timing (Static)</option>
                  <option value="manual">Manual Dispatch Override</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Yellow Change Interval (Seconds)</label>
                <input
                  type="number"
                  min="3"
                  max="6"
                  className="form-input"
                  value={signalTiming.yellowInterval}
                  onChange={(e) => setSignalTiming({ ...signalTiming, yellowInterval: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Minimum Green Split (Seconds)</label>
                <input
                  type="number"
                  min="10"
                  max="30"
                  className="form-input"
                  value={signalTiming.minGreenTime}
                  onChange={(e) => setSignalTiming({ ...signalTiming, minGreenTime: Number(e.target.value) })}
                />
                {errors.minGreen && <span className="form-error-msg">{errors.minGreen}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Maximum Green Extension (Seconds)</label>
                <input
                  type="number"
                  min="45"
                  max="120"
                  className="form-input"
                  value={signalTiming.maxGreenTime}
                  onChange={(e) => setSignalTiming({ ...signalTiming, maxGreenTime: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">All-Red Pedestrian Clearance (Seconds)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  className="form-input"
                  value={signalTiming.allRedClearing}
                  onChange={(e) => setSignalTiming({ ...signalTiming, allRedClearing: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Emergency Green Wave Duration (Seconds)</label>
                <input
                  type="number"
                  min="30"
                  max="90"
                  className="form-input"
                  value={signalTiming.emergencyGreenWaveDuration}
                  onChange={(e) => setSignalTiming({ ...signalTiming, emergencyGreenWaveDuration: Number(e.target.value) })}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--color-border)' }}>
              <button type="submit" className="btn btn-primary">
                <Save size={15} /> Save Timing Rules
              </button>
            </div>
          </form>
        )}

        {/* 5. Alert Preferences Tab */}
        {activeTab === 'alerts' && (
          <form onSubmit={handleSaveAlerts}>
            <div className="dashboard-card-header">
              <div className="card-title-group">
                <h3 className="card-title">Incident Detection & Audio Preferences</h3>
                <span className="card-subtitle">Configure thresholds for automatic alert triggers</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13 }}>
                <input
                  type="checkbox"
                  checked={alertPreferences.audioAlerts}
                  onChange={(e) => setAlertPreferences({ ...alertPreferences, audioAlerts: e.target.checked })}
                  style={{ width: 16, height: 16, accentColor: 'var(--color-primary)' }}
                />
                <span>Play audible chime on Critical priority incidents</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13 }}>
                <input
                  type="checkbox"
                  checked={alertPreferences.criticalModalPopup}
                  onChange={(e) => setAlertPreferences({ ...alertPreferences, criticalModalPopup: e.target.checked })}
                  style={{ width: 16, height: 16, accentColor: 'var(--color-primary)' }}
                />
                <span>Show modal popup automatically when Ambulance Green Corridor is requested</span>
              </label>

              <div className="form-group" style={{ marginTop: 8 }}>
                <label className="form-label">Congestion Queue Threshold (%)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <input
                    type="range"
                    min="50"
                    max="95"
                    value={alertPreferences.congestionThresholdPercent}
                    onChange={(e) => setAlertPreferences({ ...alertPreferences, congestionThresholdPercent: Number(e.target.value) })}
                    style={{ flex: 1 }}
                  />
                  <span className="text-mono" style={{ width: 44, fontWeight: 700 }}>
                    {alertPreferences.congestionThresholdPercent}%
                  </span>
                </div>
                <span className="text-sub">Triggers alert when lane capacity exceeds this value</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--color-border)' }}>
              <button type="submit" className="btn btn-primary">
                <Save size={15} /> Save Alert Preferences
              </button>
            </div>
          </form>
        )}

        {/* 6. Notifications Tab */}
        {activeTab === 'notifications' && (
          <div>
            <div className="dashboard-card-header">
              <div className="card-title-group">
                <h3 className="card-title">Dispatch Broadcast Channels</h3>
                <span className="card-subtitle">Automated notification relays to field patrol personnel</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ padding: 14, backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-navy)' }}>SMS Gateway Integration (CCTNS)</h4>
                    <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                      Automatically sends alert dispatch messages to on-duty field officers
                    </p>
                  </div>
                  <span className="badge badge-online">Connected</span>
                </div>
              </div>

              <div style={{ padding: 14, backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-navy)' }}>Desktop Push Notifications</h4>
                    <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                      Native browser desktop alerts for emergency vehicle arrival
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      if ('Notification' in window) {
                        Notification.requestPermission().then(() => showToast('Browser notification permission updated.'));
                      } else {
                        showToast('Browser notifications not supported in this environment.');
                      }
                    }}
                  >
                    Enable Push
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7. System Health Tab */}
        {activeTab === 'health' && (
          <div>
            <div className="dashboard-card-header">
              <div className="card-title-group">
                <h3 className="card-title">Edge AI Computing & Controller Telemetry</h3>
                <span className="card-subtitle">Hardware vitals from the roadside server racks</span>
              </div>
              <span className="badge badge-online">Operational</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
              <div style={{ padding: 14, backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <Cpu size={24} color="var(--color-primary)" />
                <div>
                  <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>AI Inference Latency</span>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-navy)' }}>22 ms (YOLOv8 Edge)</div>
                </div>
              </div>

              <div style={{ padding: 14, backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <Activity size={24} color="var(--color-teal)" />
                <div>
                  <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>Edge Server CPU Load</span>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-navy)' }}>34% (Nominal)</div>
                </div>
              </div>

              <div style={{ padding: 14, backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <HardDrive size={24} color="var(--color-warning)" />
                <div>
                  <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>ANPR Video Storage Buffer</span>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-navy)' }}>1.4 TB / 4.0 TB (35%)</div>
                </div>
              </div>

              <div style={{ padding: 14, backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <Wifi size={24} color="var(--color-success)" />
                <div>
                  <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>Optical Fiber Telemetry</span>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-navy)' }}>48.2 Mbps (0.01% jitter)</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 16, padding: 12, backgroundColor: '#F1F5F9', borderRadius: 'var(--radius-md)', fontSize: 12, color: 'var(--color-text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
              <span>NTCIP Roadside Master Status: <strong>Online - Hardware Emulation Mode</strong></span>
              <span>Uptime: <strong>19 days, 14 hours</strong></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
