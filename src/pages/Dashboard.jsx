import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import TrafficIntersection from '../components/TrafficIntersection';
import StatusBadge from '../components/StatusBadge';
import CameraDetailModal from '../components/CameraDetailModal';
import ANPRViolations from '../components/ANPRViolations';
import {
  Video,
  Car,
  Activity,
  TrafficCone,
  Eye
} from 'lucide-react';
import {
  INITIAL_CAMERAS,
  INITIAL_INTERSECTION_STATE
} from '../data/demoData';

export default function Dashboard() {
  const navigate = useNavigate();
  const { selectedLocation, alerts } = useOutletContext();
  const [selectedCameraForModal, setSelectedCameraForModal] = useState(null);

  const primaryCamera = INITIAL_CAMERAS.find(c => c.junctionId === selectedLocation) || INITIAL_CAMERAS[0];

  // Green lane info from intersection state
  const greenLaneKey = INITIAL_INTERSECTION_STATE.activeGreenLane;
  const greenLane = INITIAL_INTERSECTION_STATE.lanes[greenLaneKey];
  const greenLaneName = greenLaneKey
    ? greenLaneKey.charAt(0).toUpperCase() + greenLaneKey.slice(1)
    : 'N/A';
  const greenLaneVehicles = greenLane?.vehicles ?? 0;
  const greenLaneRoad = greenLane?.road || '';


  return (
    <div>
      {/* Page Title & Subtitle */}
      <div className="page-header-row">
        <div className="page-intro">
          <h1 className="text-h1">Traffic Control Dashboard</h1>
          <p className="text-body" style={{ fontSize: 12 }}>
            Real-time Indian traffic monitoring, ANPR telemetry, and signal phase control
          </p>
        </div>

        <div className="page-actions-group">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => navigate('/analytics')}
          >
            <Activity size={14} />
            <span>View Full Analytics</span>
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => navigate('/cameras')}
          >
            <Video size={14} />
            <span>4 Live Cameras Feed</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards (Compact, Light Theme, Small Font) */}
      <div className="stat-cards-grid" style={{ marginBottom: 16 }}>
        <StatCard
          title="Active Cameras"
          value="4/4"
          subtext="100% Indian traffic grid"
          icon={Video}
          variant="primary"
          progress={100}
          demoLabel="Demo Live"
        />

        <StatCard
          title="Vehicles Detected"
          value="1,284"
          subtext="Peak hour detection rate"
          icon={Car}
          variant="teal"
          trend={{ direction: 'up', label: '+18.4%' }}
          progress={68}
          demoLabel="Demo Live"
        />

        <StatCard
          title="Congestion Level"
          value="Moderate"
          subtext="Corridor avg: 28 km/h"
          icon={Activity}
          variant="warning"
          progress={42}
          demoLabel="Demo Live"
        />

        <StatCard
          title="Green Signal Lane"
          value={greenLaneName}
          subtext={`${greenLaneVehicles} vehicles · ${greenLaneRoad}`}
          icon={TrafficCone}
          variant="teal"
          trend={{ direction: 'up', label: 'Active Green' }}
          demoLabel="Demo Live"
        />
      </div>

      {/* Main Two-Column Layout */}
      <div className="dashboard-grid-layout" style={{ marginBottom: 16 }}>
        {/* Main Area: Simple & Interactive Traffic Intersection Box */}
        <div>
          <TrafficIntersection
            selectedJunction={selectedLocation}
            initialData={INITIAL_INTERSECTION_STATE}
            onOpenLiveCameras={() => navigate('/cameras')}
          />
        </div>

        {/* Secondary Area: Live Camera Preview & Quick Action */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Live Camera Feed Card */}
          <div className="dashboard-card" style={{ padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-primary)' }}>
                  LIVE INDIAN TRAFFIC CCTV
                </span>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-navy)' }}>
                  {primaryCamera.name}
                </h3>
              </div>
              <StatusBadge status={primaryCamera.status} />
            </div>

            {/* Video Canvas */}
            <div className="camera-stream-viewport" style={{ borderRadius: 'var(--radius-sm)', height: 160 }}>
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, #0F172A, #1E293B)'
                }}
              />
              <div className="stream-grid-overlay" />
              <div className="stream-hud-header" style={{ fontSize: 9 }}>
                <div className="rec-indicator" style={{ padding: '1px 4px', fontSize: 9 }}>
                  <span className="rec-dot" />
                  <span>REC</span>
                </div>
                <span>1080p • 25 FPS</span>
              </div>
              
              {/* Simulated Auto Rickshaw / Indian Traffic Box */}
              <div
                className="ai-bounding-box"
                style={{ top: '48%', left: '30%', width: '58px', height: '38px', borderColor: '#10B981', background: 'rgba(16, 185, 129, 0.15)' }}
              >
                <span className="ai-box-label" style={{ fontSize: 8, background: '#10B981' }}>Auto RE 99%</span>
              </div>
              
              <div className="stream-hud-footer" style={{ fontSize: 9, padding: '2px 6px' }}>
                <span>{primaryCamera.id}</span>
                <span style={{ color: '#FCD34D' }}>MH 18 BG 4421</span>
              </div>
            </div>

            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11 }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Type: <strong>{primaryCamera.trafficType.split(',')[0]}</strong></span>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setSelectedCameraForModal(primaryCamera)}
                style={{ fontSize: 11 }}
              >
                <Eye size={12} />
                <span>Open Feed</span>
              </button>
            </div>
          </div>

          {/* Quick Alerts Banner */}
          <div className="dashboard-card" style={{ padding: '12px 14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-navy)' }}>
                Active Emergency Dispatch
              </h3>
              <span className="badge-demo">Real-time</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {alerts.slice(0, 2).map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => navigate('/alerts')}
                  style={{
                    padding: '6px 8px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: alert.severity === 'critical' ? 'var(--color-critical-light)' : '#F8FAFC',
                    border: alert.severity === 'critical' ? '1px solid #FECACA' : '1px solid var(--color-border)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: alert.severity === 'critical' ? 'var(--color-critical)' : 'var(--color-navy)' }}>
                      {alert.type}
                    </span>
                    <StatusBadge status={alert.severity} showDot={false} />
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                    {alert.junction} • {alert.timestamp}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>



      {/* ANPR Rule Violations Section */}
      <ANPRViolations />

      {/* Camera modal if opened from preview */}
      {selectedCameraForModal && (
        <CameraDetailModal
          isOpen={Boolean(selectedCameraForModal)}
          onClose={() => setSelectedCameraForModal(null)}
          camera={selectedCameraForModal}
        />
      )}
    </div>
  );
}
