import React, { useState } from 'react';
import Modal from './Modal';
import { Sliders, Siren, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function SignalModal({
  isOpen,
  onClose,
  intersectionData,
  onSave
}) {
  const [controlMode, setControlMode] = useState(intersectionData?.mode || 'Adaptive AI Control');
  const [nsGreenTime, setNsGreenTime] = useState(30);
  const [ewGreenTime, setEwGreenTime] = useState(35);
  const [emergencyTargetLane, setEmergencyTargetLane] = useState('north');
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleApplyChanges = (e) => {
    e.preventDefault();
    onSave({
      mode: emergencyActive ? 'Emergency Green Corridor' : controlMode,
      nsGreenTime,
      ewGreenTime,
      emergencyTargetLane: emergencyActive ? emergencyTargetLane : null
    });
    setSavedMessage(true);
    setTimeout(() => {
      setSavedMessage(false);
      onClose();
    }, 900);
  };

  const handleTriggerEmergencyWave = () => {
    setEmergencyActive(true);
    setControlMode('Emergency Green Corridor');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Traffic Signal Phase & Cycle Manager"
      size="lg"
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={handleApplyChanges}>
            Apply Signal Configuration
          </button>
        </>
      }
    >
      <form onSubmit={handleApplyChanges} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Safety & Protocol Banner */}
        <div style={{
          backgroundColor: '#FFFBEB',
          border: '1px solid #FCD34D',
          borderRadius: 'var(--radius-md)',
          padding: '10px 14px',
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
          fontSize: 12,
          color: '#92400E'
        }}>
          <ShieldAlert size={18} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <strong>NTCIP Traffic Signal Protocol:</strong> Changes will be synchronized to the simulated roadside master controller at Subhash Chowk. Yellow transition intervals (4s) and all-red pedestrian clearance periods (2s) are strictly enforced.
          </div>
        </div>

        {savedMessage && (
          <div style={{
            backgroundColor: '#DCFCE7',
            border: '1px solid #86EFAC',
            color: '#166534',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 13,
            fontWeight: 600
          }}>
            <CheckCircle2 size={16} /> Signal timing parameters successfully applied to controller!
          </div>
        )}

        {/* Mode Selector */}
        <div className="form-group">
          <label className="form-label">Signal Operating Mode</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {[
              { id: 'Adaptive AI Control', desc: 'Dynamically optimizes green times based on live ANPR queue length' },
              { id: 'Fixed Timer', desc: 'Pre-programmed cyclical split timings regardless of queue' },
              { id: 'Manual Override', desc: 'Operator directly commands phase transitions' }
            ].map(m => (
              <div
                key={m.id}
                onClick={() => {
                  setControlMode(m.id);
                  setEmergencyActive(false);
                }}
                style={{
                  border: controlMode === m.id && !emergencyActive ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                  backgroundColor: controlMode === m.id && !emergencyActive ? 'var(--color-primary-light)' : '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 12px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-navy)' }}>{m.id}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 4 }}>{m.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Green Split Timings */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">North-South Corridor Green Split (Seconds)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <input
                type="range"
                min="15"
                max="75"
                value={nsGreenTime}
                onChange={(e) => setNsGreenTime(Number(e.target.value))}
                style={{ flex: 1 }}
              />
              <span className="text-mono" style={{ fontSize: 16, fontWeight: 700, width: 44, textAlign: 'right' }}>
                {nsGreenTime}s
              </span>
            </div>
            <span className="text-sub">Covers Main Station Rd & Old City Approach</span>
          </div>

          <div className="form-group">
            <label className="form-label">East-West Corridor Green Split (Seconds)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <input
                type="range"
                min="15"
                max="75"
                value={ewGreenTime}
                onChange={(e) => setEwGreenTime(Number(e.target.value))}
                style={{ flex: 1 }}
              />
              <span className="text-mono" style={{ fontSize: 16, fontWeight: 700, width: 44, textAlign: 'right' }}>
                {ewGreenTime}s
              </span>
            </div>
            <span className="text-sub">Covers East Main Bazaar & West Cinema Rd</span>
          </div>
        </div>

        {/* Emergency Green Corridor Trigger Section */}
        <div style={{
          backgroundColor: emergencyActive ? '#FEE2E2' : '#F8FAFC',
          border: emergencyActive ? '2px solid var(--color-critical)' : '1px dashed var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: 14
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Siren size={18} color={emergencyActive ? 'var(--color-critical)' : 'var(--color-navy)'} />
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-navy)' }}>
                Emergency Green Wave Corridor (Priority EV Clearance)
              </span>
            </div>
            {emergencyActive ? (
              <span className="badge badge-critical">Active Emergency</span>
            ) : (
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={handleTriggerEmergencyWave}
              >
                Trigger Green Wave
              </button>
            )}
          </div>

          <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 10 }}>
            Instantly forces uninterrupted Green signals on the chosen approach to allow unhindered transit for ambulances or fire response vehicles.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 600 }}>Priority Inbound Approach:</span>
            <select
              className="form-select"
              style={{ width: 'auto', padding: '4px 10px', fontSize: 12 }}
              value={emergencyTargetLane}
              onChange={(e) => setEmergencyTargetLane(e.target.value)}
            >
              <option value="north">North Approach (Main Station Rd)</option>
              <option value="south">South Approach (Old City Rd)</option>
              <option value="east">East Approach (Main Bazaar)</option>
              <option value="west">West Approach (Cinema Rd)</option>
            </select>
          </div>
        </div>
      </form>
    </Modal>
  );
}