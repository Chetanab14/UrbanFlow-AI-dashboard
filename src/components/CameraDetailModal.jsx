
import React, { useState } from 'react';
import Modal from './Modal';
import StatusBadge from './StatusBadge';
import {
  Video,
  Maximize2,
  Camera,
  RotateCw,
  Sliders,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  CheckCircle,
  AlertTriangle,
  Server,
  Cpu
} from 'lucide-react';

export default function CameraDetailModal({
  isOpen,
  onClose,
  camera
}) {
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [snapshotTaken, setSnapshotTaken] = useState(false);
  const [activeTab, setActiveTab] = useState('stream'); // 'stream' | 'anpr' | 'diagnostics'

  if (!camera) return null;

  const isOnline = camera.status === 'online';

  const handlePan = (dx, dy) => {
    setPanOffset(prev => ({
      x: Math.max(-40, Math.min(40, prev.x + dx)),
      y: Math.max(-30, Math.min(30, prev.y + dy))
    }));
  };

  const handleZoom = (dz) => {
    setZoomLevel(prev => Math.max(1.0, Math.min(3.0, +(prev + dz).toFixed(1))));
  };

  const handleCaptureSnapshot = () => {
    setSnapshotTaken(true);
    setTimeout(() => setSnapshotTaken(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${camera.name} (${camera.id})`}
      size="xl"
      footer={
        <>
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)', marginRight: 'auto' }}>
            RTSP Gateway: {camera.rtspUrl}
          </span>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close Inspector
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Architecture Note */}
        <div style={{
          backgroundColor: '#EFF6FF',
          border: '1px solid #BFDBFE',
          borderRadius: 'var(--radius-md)',
          padding: '8px 12px',
          fontSize: 12,
          color: '#1E40AF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Server size={16} />
            <span>
              <strong>Simulated Feed:</strong> Web browsers cannot decode raw RTSP directly. Production deployment requires WebRTC / HLS gateway (e.g. MediaMTX / go2rtc).
            </span>
          </div>
          <span className="badge-demo">Simulated Stream</span>
        </div>

        {/* Modal Top Metadata */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <StatusBadge status={camera.status} />
            <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
              Location: <strong>{camera.junction}</strong> • {camera.direction}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleCaptureSnapshot}
              title="Save ANPR high-resolution evidence snapshot"
            >
              <Camera size={14} />
              <span>Capture Snapshot</span>
            </button>
          </div>
        </div>

        {snapshotTaken && (
          <div style={{
            backgroundColor: '#DCFCE7',
            border: '1px solid #86EFAC',
            color: '#166534',
            padding: '8px 12px',
            borderRadius: 'var(--radius-md)',
            fontSize: 12,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            <CheckCircle size={15} /> Snapshot frame saved to incident logs! (Snapshot_CAM_{camera.id}_{Date.now()}.png)
          </div>
        )}

        {/* Video Canvas Viewport */}
        <div style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 9',
          backgroundColor: '#070C18',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          border: '1px solid #1E293B'
        }}>
          {isOnline ? (
            <>
              {/* Simulated camera feed canvas with zoom & pan */}
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, #0F172A, #1E293B 40%, #0D1B2A 80%)',
                  transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
                  transition: 'transform 0.15s ease-out',
                  position: 'relative'
                }}
              >
                {/* Visual road lanes in simulation */}
                <div style={{
                  position: 'absolute',
                  top: '20%',
                  left: 0,
                  right: 0,
                  height: '60%',
                  background: '#1F2937',
                  borderTop: '2px solid #374151',
                  borderBottom: '2px solid #374151',
                  transform: 'perspective(400px) rotateX(25deg)'
                }}>
                  {/* Road markings */}
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: 0,
                    right: 0,
                    height: 2,
                    borderTop: '2px dashed #9CA3AF'
                  }} />
                </div>

                {/* Simulated Vehicles with AI Bounding Boxes */}
                <div style={{
                  position: 'absolute',
                  top: '38%',
                  left: '28%',
                  width: '90px',
                  height: '60px',
                  border: '2px solid #10B981',
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  borderRadius: 3
                }}>
                  <div style={{
                    position: 'absolute',
                    top: -18,
                    left: -2,
                    background: '#10B981',
                    color: '#000',
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '1px 5px',
                    borderRadius: 2
                  }}>
                    Sedan • 98.6%
                  </div>
                </div>

                <div style={{
                  position: 'absolute',
                  top: '46%',
                  left: '60%',
                  width: '110px',
                  height: '75px',
                  border: '2px solid #38BDF8',
                  backgroundColor: 'rgba(56, 189, 248, 0.12)',
                  borderRadius: 3
                }}>
                  <div style={{
                    position: 'absolute',
                    top: -18,
                    left: -2,
                    background: '#38BDF8',
                    color: '#000',
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '1px 5px',
                    borderRadius: 2
                  }}>
                    SUV • 97.4%
                  </div>
                </div>
              </div>

              {/* Grid overlay */}
              <div className="stream-grid-overlay" />

              {/* HUD Header */}
              <div className="stream-hud-header">
                <div className="rec-indicator">
                  <span className="rec-dot" />
                  <span>LIVE • {camera.id}</span>
                </div>
                <div>{camera.resolution} @ {camera.fps} FPS</div>
                <div>{new Date().toLocaleTimeString()}</div>
              </div>

              {/* HUD Footer */}
              <div className="stream-hud-footer">
                <span>Bitrate: {camera.bitrate}</span>
                <span>Latency: {camera.latency}</span>
                <span>Model: {camera.model}</span>
                <span>Zoom: {zoomLevel}x</span>
              </div>
            </>
          ) : (
            <div className="stream-offline-view" style={{ height: '100%' }}>
              <AlertTriangle size={36} color="var(--color-critical)" />
              <div style={{ fontSize: 16, fontWeight: 700, color: '#E2E8F0' }}>
                CAMERA FEED OFFLINE
              </div>
              <p style={{ maxWidth: 360, color: '#94A3B8' }}>
                Optical link disconnected or field terminal powered off. Ping packet loss 100%. Maintenance ticket queued.
              </p>
            </div>
          )}
        </div>

        {/* Bottom Inspector Control Panels */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: 14 }}>
          {/* PTZ Controls Simulator */}
          <div style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: 12
          }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-navy)', marginBottom: 8 }}>
              Simulated PTZ Control (Pan / Tilt / Zoom)
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '8px 0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handlePan(0, 10)}
                  disabled={!isOnline}
                  title="Tilt Up"
                >
                  <ChevronUp size={16} />
                </button>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => handlePan(10, 0)}
                    disabled={!isOnline}
                    title="Pan Left"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => { setPanOffset({ x: 0, y: 0 }); setZoomLevel(1.0); }}
                    disabled={!isOnline}
                    title="Reset Center"
                  >
                    <RotateCw size={14} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => handlePan(-10, 0)}
                    disabled={!isOnline}
                    title="Pan Right"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handlePan(0, -10)}
                  disabled={!isOnline}
                  title="Tilt Down"
                >
                  <ChevronDown size={16} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginLeft: 16 }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleZoom(0.2)}
                  disabled={!isOnline}
                  title="Zoom In"
                >
                  <Plus size={14} /> Zoom In
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleZoom(-0.2)}
                  disabled={!isOnline}
                  title="Zoom Out"
                >
                  <Minus size={14} /> Zoom Out
                </button>
              </div>
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', textAlign: 'center' }}>
              Pan: ({panOffset.x}, {panOffset.y}) • Zoom: {zoomLevel}x
            </div>
          </div>

          {/* ANPR & Telemetry Stats */}
          <div style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 8
          }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-navy)' }}>
              Optical Telemetry & ANPR Log
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              <div className="telemetry-item">
                <span className="telemetry-label">Last Plate Read</span>
                <span className="telemetry-value text-mono" style={{ color: 'var(--color-primary)' }}>
                  {camera.lastPlate}
                </span>
              </div>
              <div className="telemetry-item">
                <span className="telemetry-label">Vehicle Count</span>
                <span className="telemetry-value">
                  {camera.vehicleCount} in frame
                </span>
              </div>
              <div className="telemetry-item">
                <span className="telemetry-label">Average Speed</span>
                <span className="telemetry-value">
                  {camera.avgSpeed}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              <div className="telemetry-item">
                <span className="telemetry-label">Optical Sensor</span>
                <span className="telemetry-value" style={{ fontSize: 11 }}>
                  Sony STARVIS 4K
                </span>
              </div>
              <div className="telemetry-item">
                <span className="telemetry-label">Sensor Temp</span>
                <span className="telemetry-value">
                  42.5 °C (Nominal)
                </span>
              </div>
              <div className="telemetry-item">
                <span className="telemetry-label">IP Address</span>
                <span className="telemetry-value text-mono" style={{ fontSize: 11 }}>
                  {camera.ipAddress}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
