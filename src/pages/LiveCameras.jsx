import React, { useState } from 'react';
import CameraCard from '../components/CameraCard';
import CameraDetailModal from '../components/CameraDetailModal';
import ANPRViolations from '../components/ANPRViolations';
import { Video, ShieldCheck, Camera, Radio, CheckCircle2, RotateCw } from 'lucide-react';
import { INITIAL_CAMERAS } from '../data/demoData';

export default function LiveCameras() {
  const [selectedCameraForModal, setSelectedCameraForModal] = useState(null);
  const [alertFilter, setAlertFilter] = useState(false);
  const [snapshotAllNotice, setSnapshotAllNotice] = useState(false);

  // Exactly 4 live cameras
  const displayCameras = alertFilter
    ? INITIAL_CAMERAS.filter(c => c.hasAlert)
    : INITIAL_CAMERAS;

  const handleCaptureAll = () => {
    setSnapshotAllNotice(true);
    setTimeout(() => setSnapshotAllNotice(false), 2500);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header-row">
        <div className="page-intro">
          <h1 className="text-h1">Indian Traffic Live Camera Network (4 Channels)</h1>
          <p className="text-body" style={{ fontSize: 12 }}>
            Simulated optical ANPR surveillance feeds across Shirpur, Maharashtra municipal sectors
          </p>
        </div>

        <div className="page-actions-group">
          <button
            type="button"
            className={`btn btn-sm ${alertFilter ? 'btn-danger' : 'btn-secondary'}`}
            onClick={() => setAlertFilter(!alertFilter)}
          >
            <span>{alertFilter ? 'Showing Alerts Only' : 'Filter Emergency Feeds'}</span>
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleCaptureAll}
          >
            <Camera size={13} />
            <span>Multi-Camera ANPR Snapshot</span>
          </button>
        </div>
      </div>

      {snapshotAllNotice && (
        <div style={{
          backgroundColor: '#DCFCE7',
          border: '1px solid #86EFAC',
          color: '#166534',
          padding: '8px 12px',
          borderRadius: 'var(--radius-sm)',
          fontSize: 12,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginBottom: 12
        }}>
          <CheckCircle2 size={14} />
          <span>Synchronized 4-Channel ANPR Snapshots captured and archived!</span>
        </div>
      )}

      {/* Indian Traffic Information Bar */}
      <div style={{
        backgroundColor: '#EFF6FF',
        border: '1px solid #BFDBFE',
        borderRadius: 'var(--radius-md)',
        padding: '8px 12px',
        marginBottom: 16,
        fontSize: 11,
        color: '#1E40AF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 6
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Radio size={14} />
          <span>
            <strong>4 Dedicated Indian Traffic Optical Streams:</strong> Auto-rickshaws, two-wheelers, commercial Tata trucks, and 108 emergency corridors with optical ANPR OCR.
          </span>
        </div>
        <span className="badge-demo">4 Channels Active (1080p • 25 FPS)</span>
      </div>

      {/* 4 Camera Grid (Clean 2x2 Layout on Desktop) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 14
      }}>
        {displayCameras.map((camera) => (
          <CameraCard
            key={camera.id}
            camera={camera}
            onSelect={(cam) => setSelectedCameraForModal(cam)}
          />
        ))}
      </div>

      {/* ANPR Rule Violations – vehicles that broke traffic rules */}
      <ANPRViolations />

      {/* Camera Inspector Modal */}
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
