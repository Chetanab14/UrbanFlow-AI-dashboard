import React, { useState } from 'react';
import StatusBadge from './StatusBadge';
import CameraDetailModal from './CameraDetailModal';
import { Eye, Radio, Play, Pause } from 'lucide-react';

export default function CameraCard({ camera, onSelect }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const handleOpenModal = () => {
    if (onSelect) {
      onSelect(camera);
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div className="camera-card" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
        {/* Card Header (Light Theme) */}
        <div style={{
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--color-border)',
          backgroundColor: '#FAFAFA'
        }}>
          <div>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>
              {camera.id}
            </span>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-navy)' }}>
              {camera.name}
            </div>
          </div>
          <StatusBadge status={camera.status} />
        </div>

        {/* Simulated Indian Traffic Live Video Canvas */}
        <div style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 9',
          backgroundColor: '#0F172A',
          overflow: 'hidden',
          userSelect: 'none'
        }}>
          {/* Road Surface & Lane Dividers */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)',
          }}>
            {/* Perspective Road */}
            <div style={{
              position: 'absolute',
              top: '15%',
              bottom: 0,
              left: '15%',
              right: '15%',
              background: '#1E293B',
              clipPath: 'polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%)',
              borderTop: '2px solid #334155'
            }}>
              {/* Broken White Lane Line */}
              <div style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: '49%',
                width: 3,
                borderLeft: '2px dashed rgba(255, 255, 255, 0.45)'
              }} />
            </div>
          </div>

          {/* Animated Indian Traffic Vehicles */}
          {isPlaying && (
            <>
              {/* Vehicle 1: Auto-Rickshaw (Yellow & Green Hood) */}
              <div style={{
                position: 'absolute',
                bottom: '22%',
                left: '26%',
                width: 54,
                height: 38,
                borderRadius: 4,
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '1.5px solid #10B981',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                animation: 'pulse-dot 2.5s infinite',
                pointerEvents: 'none'
              }}>
                <span style={{
                  position: 'absolute',
                  top: -15,
                  left: -2,
                  backgroundColor: '#10B981',
                  color: '#000',
                  fontSize: 8,
                  fontWeight: 700,
                  padding: '1px 3px',
                  borderRadius: 2,
                  whiteSpace: 'nowrap'
                }}>
                  Auto-Rickshaw 99%
                </span>
                <span style={{ fontSize: 9, color: '#FCD34D', fontWeight: 700 }}>RE 3W</span>
              </div>

              {/* Vehicle 2: Two-Wheeler Motorcycle */}
              <div style={{
                position: 'absolute',
                bottom: '36%',
                right: '34%',
                width: 36,
                height: 28,
                borderRadius: 3,
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                border: '1.5px solid #38BDF8',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                pointerEvents: 'none'
              }}>
                <span style={{
                  position: 'absolute',
                  top: -14,
                  left: -2,
                  backgroundColor: '#38BDF8',
                  color: '#000',
                  fontSize: 8,
                  fontWeight: 700,
                  padding: '1px 3px',
                  borderRadius: 2,
                  whiteSpace: 'nowrap'
                }}>
                  Bike 97%
                </span>
                <span style={{ fontSize: 8, color: '#FFFFFF', fontWeight: 600 }}>100cc</span>
              </div>

              {/* Vehicle 3: Emergency Vehicle or Car (if CAM-02 has Ambulance) */}
              {camera.hasAlert ? (
                <div style={{
                  position: 'absolute',
                  bottom: '12%',
                  right: '20%',
                  width: 72,
                  height: 48,
                  borderRadius: 4,
                  backgroundColor: 'rgba(239, 68, 68, 0.25)',
                  border: '2px solid #EF4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'pulse-dot 1s infinite',
                  pointerEvents: 'none'
                }}>
                  <span style={{
                    position: 'absolute',
                    top: -16,
                    left: -2,
                    backgroundColor: '#EF4444',
                    color: '#FFF',
                    fontSize: 8,
                    fontWeight: 700,
                    padding: '1px 4px',
                    borderRadius: 2,
                    whiteSpace: 'nowrap'
                  }}>
                    PRIORITY: Ambulance 108
                  </span>
                  <span style={{ fontSize: 9, color: '#FFF', fontWeight: 700 }}>EMERGENCY</span>
                </div>
              ) : (
                <div style={{
                  position: 'absolute',
                  bottom: '12%',
                  left: '38%',
                  width: 66,
                  height: 44,
                  borderRadius: 4,
                  backgroundColor: 'rgba(244, 63, 94, 0.15)',
                  border: '1.5px solid #F43F5E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none'
                }}>
                  <span style={{
                    position: 'absolute',
                    top: -15,
                    left: -2,
                    backgroundColor: '#F43F5E',
                    color: '#FFF',
                    fontSize: 8,
                    fontWeight: 700,
                    padding: '1px 3px',
                    borderRadius: 2
                  }}>
                    Car (Sedan) 98%
                  </span>
                  <span style={{ fontSize: 9, color: '#FFF', fontWeight: 600 }}>Swift</span>
                </div>
              )}
            </>
          )}

          {/* Grid Scanning Overlay */}
          <div className="stream-grid-overlay" />

          {/* HUD Overlay Top */}
          <div style={{
            position: 'absolute',
            top: 6,
            left: 8,
            right: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 9,
            color: '#FFFFFF',
            fontFamily: 'var(--font-mono)',
            zIndex: 10
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.6)', padding: '1px 5px', borderRadius: 2 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#EF4444', animation: 'pulse-dot 1s infinite' }} />
              <span style={{ fontWeight: 700, color: '#EF4444' }}>LIVE</span>
              <span>{camera.id}</span>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.6)', padding: '1px 5px', borderRadius: 2 }}>
              {camera.fps} FPS • 1080p
            </div>
          </div>

          {/* HUD Overlay Bottom */}
          <div style={{
            position: 'absolute',
            bottom: 6,
            left: 8,
            right: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 9,
            color: '#E2E8F0',
            background: 'rgba(15, 23, 42, 0.75)',
            padding: '2px 6px',
            borderRadius: 3,
            zIndex: 10
          }}>
            <span>Flow: {camera.trafficType.split(',')[0]}</span>
            <span style={{ color: '#FCD34D' }}>ANPR: {camera.lastPlate}</span>
          </div>
        </div>

        {/* Card Body - Small Font & Light Theme */}
        <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11 }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>Junction:</span>
            <span style={{ fontWeight: 600, color: 'var(--color-navy)' }}>{camera.junction.replace(' Junction', '')}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11 }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>Detected Plate:</span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              fontWeight: 700,
              background: '#FEF3C7',
              border: '1px solid #FCD34D',
              color: '#78350F',
              padding: '1px 5px',
              borderRadius: 3
            }}>
              IND {camera.lastPlate}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--color-text-secondary)' }}>
            <span>Count: <strong>{camera.vehicleCount} vehicles</strong></span>
            <span>Speed: <strong>{camera.avgSpeed}</strong></span>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div style={{
          padding: '6px 12px',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FAFAFA'
        }}>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setIsPlaying(!isPlaying)}
            style={{ fontSize: 10, padding: '2px 6px' }}
          >
            {isPlaying ? <Pause size={11} /> : <Play size={11} />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleOpenModal}
            style={{ fontSize: 11, padding: '3px 8px' }}
          >
            <Eye size={12} />
            <span>Open Feed</span>
          </button>
        </div>
      </div>

      {!onSelect && (
        <CameraDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          camera={camera}
        />
      )}
    </>
  );
}
