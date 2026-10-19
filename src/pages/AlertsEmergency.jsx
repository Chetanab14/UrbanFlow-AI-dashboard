import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import CameraDetailModal from '../components/CameraDetailModal';
import {
  AlertTriangle,
  Siren,
  ShieldAlert,
  Clock,
  UserCheck,
  CheckCircle2,
  Video,
  Eye,
  Check,
  ArrowRight,
  Filter,
  Search,
  MessageSquare,
  AlertCircle,
  Activity
} from 'lucide-react';
import { DEMO_OFFICERS, INITIAL_CAMERAS } from '../data/demoData';

export default function AlertsEmergency() {
  const navigate = useNavigate();
  const { alerts, setAlerts } = useOutletContext();

  const [severityFilter, setSeverityFilter] = useState('all'); // 'all' | 'critical' | 'warning' | 'informational'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'acknowledged' | 'resolved'
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedAlertForDetail, setSelectedAlertForDetail] = useState(null);
  const [assignOfficerModalAlert, setAssignOfficerModalAlert] = useState(null);
  const [resolveConfirmAlert, setResolveConfirmAlert] = useState(null);
  const [selectedCameraForModal, setSelectedCameraForModal] = useState(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [selectedOfficerId, setSelectedOfficerId] = useState('OFF-101');
  const [actionSuccessNotice, setActionSuccessNotice] = useState(null);

  // Filter alerts
  const filteredAlerts = alerts.filter(alert => {
    if (severityFilter !== 'all' && alert.severity !== severityFilter) return false;
    if (statusFilter !== 'all' && alert.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchType = alert.type.toLowerCase().includes(q);
      const matchJunction = alert.junction.toLowerCase().includes(q);
      const matchDesc = alert.description.toLowerCase().includes(q);
      const matchId = alert.id.toLowerCase().includes(q);
      if (!matchType && !matchJunction && !matchDesc && !matchId) return false;
    }
    return true;
  });

  const notifySuccess = (msg) => {
    setActionSuccessNotice(msg);
    setTimeout(() => setActionSuccessNotice(null), 3500);
  };

  // Action: Acknowledge Alert
  const handleAcknowledge = (alertId) => {
    const updated = alerts.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          status: 'acknowledged',
          timeline: [
            ...a.timeline,
            { time: new Date().toLocaleTimeString(), text: 'Acknowledged by Admin Officer Vikram Patil' }
          ]
        };
      }
      return a;
    });
    setAlerts(updated);
    if (selectedAlertForDetail?.id === alertId) {
      setSelectedAlertForDetail(updated.find(a => a.id === alertId));
    }
    notifySuccess(`Alert ${alertId} has been acknowledged.`);
  };

  // Action: Assign Officer
  const handleAssignOfficer = () => {
    if (!assignOfficerModalAlert) return;
    const officerObj = DEMO_OFFICERS.find(o => o.id === selectedOfficerId) || DEMO_OFFICERS[0];
    const alertId = assignOfficerModalAlert.id;

    const updated = alerts.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          assignedOfficer: officerObj.name,
          timeline: [
            ...a.timeline,
            { time: new Date().toLocaleTimeString(), text: `Dispatched to ${officerObj.name} (${officerObj.role})` }
          ]
        };
      }
      return a;
    });
    setAlerts(updated);
    if (selectedAlertForDetail?.id === alertId) {
      setSelectedAlertForDetail(updated.find(a => a.id === alertId));
    }
    setAssignOfficerModalAlert(null);
    notifySuccess(`Dispatched ${officerObj.name} to handle incident ${alertId}.`);
  };

  // Action: Mark Resolved
  const handleResolveAlert = () => {
    if (!resolveConfirmAlert) return;
    const alertId = resolveConfirmAlert.id;

    const updated = alerts.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          status: 'resolved',
          timeline: [
            ...a.timeline,
            { time: new Date().toLocaleTimeString(), text: `Marked Resolved: ${resolutionNote || 'Condition normalized'}` }
          ]
        };
      }
      return a;
    });
    setAlerts(updated);
    if (selectedAlertForDetail?.id === alertId) {
      setSelectedAlertForDetail(updated.find(a => a.id === alertId));
    }
    setResolveConfirmAlert(null);
    setResolutionNote('');
    notifySuccess(`Incident ${alertId} marked as RESOLVED and archived.`);
  };

  // Action: Trigger Green Wave Corridor
  const handleTriggerGreenCorridor = (alert) => {
    const updated = alerts.map(a => {
      if (a.id === alert.id) {
        return {
          ...a,
          status: 'acknowledged',
          timeline: [
            ...a.timeline,
            { time: new Date().toLocaleTimeString(), text: 'EMERGENCY: Priority Green Wave activated for 45 seconds' }
          ]
        };
      }
      return a;
    });
    setAlerts(updated);
    if (selectedAlertForDetail?.id === alert.id) {
      setSelectedAlertForDetail(updated.find(a => a.id === alert.id));
    }
    notifySuccess(`EMERGENCY: Priority Green Wave Corridor triggered at ${alert.junction}!`);
  };

  const handleOpenCameraForAlert = (cameraSnapshotId) => {
    const cam = INITIAL_CAMERAS.find(c => c.id === cameraSnapshotId) || INITIAL_CAMERAS[0];
    setSelectedCameraForModal(cam);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header-row">
        <div className="page-intro">
          <h1 className="text-h1">Traffic Alert & Emergency Dispatch</h1>
          <p className="text-body">
            Active incident triage, ambulance green corridors, and field officer dispatch coordination
          </p>
        </div>

        <div className="page-actions-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FFFFFF', padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: 12 }}>
            <Siren size={15} color="var(--color-critical)" />
            <span>Emergency Protocol: <strong>Active Priority Mode</strong></span>
          </div>
        </div>
      </div>

      {/* Safety Notice & Demo Disclaimer */}
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
            <strong>Simulated Emergency Data:</strong> All incidents and ambulance routes are synthetic demonstration data for controller workflow testing. Real-world emergency overrides require certified emergency telecom dispatch verification.
          </span>
        </div>
        <span className="badge-demo">Simulated Emergency Dispatch</span>
      </div>

      {actionSuccessNotice && (
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
          <span>{actionSuccessNotice}</span>
        </div>
      )}

      {/* Filters & Search Bar */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '12px 16px',
        marginBottom: 'var(--space-xl)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        boxShadow: 'var(--shadow-sm)'
      }}>
        {/* Severity Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Severities' },
            { id: 'critical', label: 'Critical' },
            { id: 'warning', label: 'Warning' },
            { id: 'informational', label: 'Informational' }
          ].map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setSeverityFilter(f.id)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: 13,
                fontWeight: 600,
                border: severityFilter === f.id ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                backgroundColor: severityFilter === f.id ? 'var(--color-primary-light)' : '#FFFFFF',
                color: severityFilter === f.id ? 'var(--color-primary)' : 'var(--color-text-main)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Status Filters & Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <select
            className="form-select"
            style={{ width: 'auto', padding: '6px 10px', fontSize: 13 }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by incident status"
          >
            <option value="all">All Incident Statuses</option>
            <option value="active">Active Only</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="resolved">Resolved</option>
          </select>

          <div className="table-search-box" style={{ minWidth: 220 }}>
            <Search size={15} color="var(--color-text-secondary)" />
            <input
              type="text"
              placeholder="Search alert ID or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search alerts"
            />
          </div>
        </div>
      </div>

      {/* Incident Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              style={{
                backgroundColor: '#FFFFFF',
                border: alert.severity === 'critical' ? '1px solid #FCA5A5' : '1px solid var(--color-border)',
                borderLeft: `5px solid ${
                  alert.severity === 'critical' ? 'var(--color-critical)' :
                  alert.severity === 'warning' ? 'var(--color-warning)' : 'var(--color-info)'
                }`,
                borderRadius: 'var(--radius-lg)',
                padding: '16px 20px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: 12
              }}
            >
              {/* Card Top Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <StatusBadge status={alert.severity} />
                  <span className="text-mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary)' }}>
                    {alert.id}
                  </span>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-navy)' }}>
                    {alert.type}
                  </h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={13} /> {alert.timestamp}
                  </span>
                  <StatusBadge status={alert.status} />
                </div>
              </div>

              {/* Description */}
              <p style={{ fontSize: 13, color: 'var(--color-text-main)', lineHeight: 1.4 }}>
                {alert.description}
              </p>

              {/* Meta row: Junction, Lane, Officer */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
                backgroundColor: '#F8FAFC',
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: 12
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div>Junction: <strong style={{ color: 'var(--color-navy)' }}>{alert.junction}</strong></div>
                  <div>Lane: <strong style={{ color: 'var(--color-navy)' }}>{alert.lane}</strong></div>
                  <div>Assigned Officer: <strong style={{ color: 'var(--color-navy)' }}>{alert.assignedOfficer}</strong></div>
                </div>

                {alert.suggestedAction && (
                  <div style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: 11 }}>
                    Suggested: {alert.suggestedAction}
                  </div>
                )}
              </div>

              {/* Actions Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, paddingTop: 4 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setSelectedAlertForDetail(alert)}
                  >
                    <Eye size={13} />
                    <span>View Detail & Timeline</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleOpenCameraForAlert(alert.cameraSnapshot)}
                  >
                    <Video size={13} />
                    <span>View Camera ({alert.cameraSnapshot})</span>
                  </button>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  {alert.type.includes('Emergency') && alert.status !== 'resolved' && (
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleTriggerGreenCorridor(alert)}
                    >
                      <Siren size={13} />
                      <span>Trigger Green Corridor</span>
                    </button>
                  )}

                  {alert.status === 'active' && (
                    <button
                      type="button"
                      className="btn btn-teal btn-sm"
                      onClick={() => handleAcknowledge(alert.id)}
                    >
                      <Check size={13} />
                      <span>Acknowledge</span>
                    </button>
                  )}

                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setAssignOfficerModalAlert(alert)}
                  >
                    <UserCheck size={13} />
                    <span>Assign Officer</span>
                  </button>

                  {alert.status !== 'resolved' && (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => setResolveConfirmAlert(alert)}
                    >
                      <CheckCircle2 size={13} />
                      <span>Mark Resolved</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '48px 24px',
            textAlign: 'center',
            color: 'var(--color-text-secondary)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12
          }}>
            <CheckCircle2 size={40} color="var(--color-success)" />
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-navy)' }}>
              No incidents matching your filter criteria
            </h3>
            <p style={{ fontSize: 13 }}>
              All monitored traffic sectors are currently reporting nominal status.
            </p>
          </div>
        )}
      </div>

      {/* Incident Detail & Timeline Modal */}
      {selectedAlertForDetail && (
        <Modal
          isOpen={Boolean(selectedAlertForDetail)}
          onClose={() => setSelectedAlertForDetail(null)}
          title={`Incident Dossier • ${selectedAlertForDetail.id}`}
          size="lg"
          footer={
            <>
              {selectedAlertForDetail.status === 'active' && (
                <button
                  type="button"
                  className="btn btn-teal"
                  onClick={() => handleAcknowledge(selectedAlertForDetail.id)}
                >
                  <Check size={14} /> Acknowledge Alert
                </button>
              )}
              {selectedAlertForDetail.status !== 'resolved' && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setResolveConfirmAlert(selectedAlertForDetail);
                    setSelectedAlertForDetail(null);
                  }}
                >
                  <CheckCircle2 size={14} /> Mark Resolved
                </button>
              )}
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedAlertForDetail(null)}
              >
                Close Dossier
              </button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F8FAFC', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <div>
                <span className="badge badge-critical">{selectedAlertForDetail.severity}</span>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-navy)', marginTop: 4 }}>
                  {selectedAlertForDetail.type}
                </h3>
              </div>
              <StatusBadge status={selectedAlertForDetail.status} />
            </div>

            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-navy)', marginBottom: 4 }}>
                Incident Description & Context
              </h4>
              <p style={{ fontSize: 13, color: 'var(--color-text-main)', lineHeight: 1.5 }}>
                {selectedAlertForDetail.description}
              </p>
            </div>

            {/* Timeline */}
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-navy)', marginBottom: 10 }}>
                Chronological Incident Timeline
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, borderLeft: '2px solid var(--color-border)', paddingLeft: 16, marginLeft: 6 }}>
                {selectedAlertForDetail.timeline?.map((step, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <span style={{
                      position: 'absolute',
                      left: -22,
                      top: 4,
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-primary)',
                      border: '2px solid #FFFFFF'
                    }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>
                      {step.time}
                    </span>
                    <p style={{ fontSize: 12, color: 'var(--color-text-main)', marginTop: 2 }}>
                      {step.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Camera Snapshot preview */}
            <div style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-navy)' }}>
                  Optical Sensor: {selectedAlertForDetail.cameraSnapshot}
                </span>
                <span style={{ fontSize: 11, color: 'var(--color-text-secondary)', display: 'block' }}>
                  {selectedAlertForDetail.junction} • {selectedAlertForDetail.lane}
                </span>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleOpenCameraForAlert(selectedAlertForDetail.cameraSnapshot)}
              >
                <Video size={14} /> Open Live Feed
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Assign Officer Modal */}
      {assignOfficerModalAlert && (
        <Modal
          isOpen={Boolean(assignOfficerModalAlert)}
          onClose={() => setAssignOfficerModalAlert(null)}
          title={`Assign Field Officer • ${assignOfficerModalAlert.id}`}
          size="md"
          footer={
            <>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setAssignOfficerModalAlert(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAssignOfficer}
              >
                Dispatch Officer
              </button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p style={{ fontSize: 13, color: 'var(--color-text-main)' }}>
              Select an available traffic police officer or emergency supervisor for dispatch to <strong>{assignOfficerModalAlert.junction}</strong>.
            </p>

            <div className="form-group">
              <label className="form-label">Available Officers on Duty</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {DEMO_OFFICERS.map((officer) => (
                  <div
                    key={officer.id}
                    onClick={() => setSelectedOfficerId(officer.id)}
                    style={{
                      border: selectedOfficerId === officer.id ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                      backgroundColor: selectedOfficerId === officer.id ? 'var(--color-primary-light)' : '#FFFFFF',
                      borderRadius: 'var(--radius-md)',
                      padding: '10px 14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-navy)' }}>
                        {officer.name}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
                        {officer.badge} • {officer.role}
                      </div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-teal)' }}>
                      {officer.shift.split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Mark Resolved Confirmation Dialog Modal */}
      {resolveConfirmAlert && (
        <Modal
          isOpen={Boolean(resolveConfirmAlert)}
          onClose={() => setResolveConfirmAlert(null)}
          title="Confirm Incident Resolution"
          size="md"
          footer={
            <>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setResolveConfirmAlert(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleResolveAlert}
              >
                Confirm & Archive Incident
              </button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: 'var(--radius-md)',
              padding: 12,
              display: 'flex',
              gap: 10,
              fontSize: 13,
              color: '#1E40AF'
            }}>
              <AlertCircle size={20} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                You are marking <strong>{resolveConfirmAlert.id} ({resolveConfirmAlert.type})</strong> as resolved.
                This will normalize signal timers and archive this incident in the shift audit log.
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Resolution Summary & Action Notes</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="e.g. Ambulance cleared junction successfully; signal returned to adaptive AI phase."
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Camera Modal if requested from alert */}
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
