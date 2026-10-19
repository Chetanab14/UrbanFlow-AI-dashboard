import React, { useState, useMemo } from 'react';
import { AlertTriangle, X, ShieldX, Gauge, TrafficCone, Camera, Clock,
         CheckCircle2, Image, Filter, RotateCcw, CalendarDays } from 'lucide-react';
import { ANPR_VIOLATIONS } from '../data/demoData';

/* ─── helpers ───────────────────────────────────────────── */
// Parse "18 Oct 2026" → "2026-10-18" (ISO) for comparison
function parseDate(str) {
  const months = { Jan:'01',Feb:'02',Mar:'03',Apr:'04',May:'05',Jun:'06',
                   Jul:'07',Aug:'08',Sep:'09',Oct:'10',Nov:'11',Dec:'12' };
  const parts = str.split(' ');
  if (parts.length !== 3) return '';
  return `${parts[2]}-${months[parts[1]]}-${parts[0].padStart(2,'0')}`;
}

/* ─── Violation type config ─────────────────────────────── */
const VIOLATION_META = {
  SPEED: { color: '#EF4444', bg: '#FEF2F2', border: '#FECACA', icon: Gauge },
  RED_LIGHT: { color: '#F97316', bg: '#FFF7ED', border: '#FED7AA', icon: TrafficCone },
};

/* ─── Indian plate badge ─────────────────────────────────── */
function PlateBadge({ plate }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: '#FFFBEB', border: '1.5px solid #FCD34D',
      color: '#78350F', padding: '2px 7px', borderRadius: 4,
      fontFamily: 'var(--font-mono)', fontWeight: 700,
      fontSize: 11, letterSpacing: '0.05em',
      whiteSpace: 'nowrap'
    }}>
      <span style={{
        width: 10, height: 7, borderRadius: 1, flexShrink: 0,
        background: 'linear-gradient(#FF9933 33%, #FFFFFF 33%, #FFFFFF 66%, #128807 66%)',
        boxShadow: '0 0 1px rgba(0,0,0,0.4)'
      }} />
      <span style={{ opacity: 0.55, fontSize: 9 }}>IND</span>
      <span>{plate}</span>
    </span>
  );
}

/* ─── Status chip ────────────────────────────────────────── */
function StatusChip({ status }) {
  const issued = status === 'Challan Issued';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 7px', borderRadius: 3, fontSize: 10, fontWeight: 700,
      textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap',
      background: issued ? '#DCFCE7' : '#FEF3C7',
      color: issued ? '#15803D' : '#92400E',
      border: `1px solid ${issued ? '#86EFAC' : '#FDE68A'}`
    }}>
      {issued ? <CheckCircle2 size={9} /> : <Clock size={9} />}
      {status}
    </span>
  );
}

/* ─── Image lightbox modal ───────────────────────────────── */
function ImageModal({ violation, onClose }) {
  const meta = VIOLATION_META[violation.violationCode] || VIOLATION_META.SPEED;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(10,15,29,0.85)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20, animation: 'modal-fade-in 130ms ease'
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#0F172A', borderRadius: 10,
          border: '1px solid #1E293B',
          boxShadow: '0 24px 48px rgba(0,0,0,0.6)',
          width: '100%', maxWidth: 660,
          overflow: 'hidden', animation: 'modal-scale-in 140ms ease'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 14px', borderBottom: '1px solid #1E293B', background: '#0A0F1D'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldX size={14} color={meta.color} />
            <span style={{ color: '#F1F5F9', fontWeight: 700, fontSize: 13 }}>
              ANPR Capture — {violation.id}
            </span>
            <span style={{
              background: meta.color, color: '#fff', fontSize: 9, fontWeight: 700,
              padding: '1px 6px', borderRadius: 3, letterSpacing: '0.04em'
            }}>
              {violation.violationType.toUpperCase()}
            </span>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 4, padding: '3px 8px', cursor: 'pointer',
            color: '#F87171', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11
          }}>
            <X size={12} /> Close
          </button>
        </div>

        {/* Image */}
        <div style={{ position: 'relative', background: '#000' }}>
          <img
            src={violation.image}
            alt={`ANPR ${violation.plate}`}
            style={{ width: '100%', display: 'block', maxHeight: 370, objectFit: 'cover' }}
            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
          />
          {/* fallback */}
          <div style={{
            display: 'none', height: 220, background: '#1E293B',
            alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8
          }}>
            <Camera size={32} color="#475569" />
            <span style={{ color: '#64748B', fontSize: 12 }}>ANPR frame not available</span>
          </div>

          {/* HUD overlays */}
          <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', alignItems: 'center', gap: 4,
            background: 'rgba(0,0,0,0.72)', borderRadius: 3, padding: '2px 7px' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444',
              animation: 'pulse-dot 1s infinite', display: 'inline-block' }} />
            <span style={{ color: '#EF4444', fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700 }}>REC</span>
          </div>
          <div style={{ position: 'absolute', top: 8, right: 8,
            background: 'rgba(0,0,0,0.72)', borderRadius: 3, padding: '2px 7px' }}>
            <span style={{ color: meta.color, fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700 }}>
              ⚠ {violation.detectedSpeed} / {violation.speedLimit}
            </span>
          </div>
          <div style={{
            position: 'absolute', bottom: 8, left: 8, right: 8,
            background: 'rgba(0,0,0,0.75)', borderRadius: 4,
            padding: '4px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <PlateBadge plate={violation.plate} />
            <span style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)', fontSize: 9 }}>
              {violation.camera} • {violation.date} {violation.time}
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid #1E293B' }}>
          {[
            { label: 'Detected Speed', value: violation.detectedSpeed, color: meta.color },
            { label: 'Speed Limit',    value: violation.speedLimit,    color: '#94A3B8' },
            { label: 'Junction',       value: violation.junction,      color: '#60A5FA' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ padding: '10px 14px', borderRight: '1px solid #1E293B' }}>
              <div style={{ fontSize: 9, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color, fontFamily: 'var(--font-mono)' }}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────── */
export default function ANPRViolations() {
  const [imageModal, setImageModal] = useState(null);

  /* filter form state (draft – only applied on button click) */
  const [draft, setDraft] = useState({ dateFrom: '', dateTo: '', timeFrom: '', timeTo: '' });
  /* applied filter – what's actually used to filter the table */
  const [applied, setApplied] = useState({ dateFrom: '', dateTo: '', timeFrom: '', timeTo: '' });

  const isFiltered = applied.dateFrom || applied.dateTo || applied.timeFrom || applied.timeTo;

  const handleApply = () => setApplied({ ...draft });
  const handleReset = () => {
    const empty = { dateFrom: '', dateTo: '', timeFrom: '', timeTo: '' };
    setDraft(empty);
    setApplied(empty);
  };

  const filteredData = useMemo(() => {
    return ANPR_VIOLATIONS.filter(v => {
      const vDate = parseDate(v.date); // e.g. "2026-10-18"
      const vTime = v.time.slice(0, 5);  // "HH:MM"
      if (applied.dateFrom && vDate < applied.dateFrom) return false;
      if (applied.dateTo   && vDate > applied.dateTo)   return false;
      if (applied.timeFrom && vTime < applied.timeFrom) return false;
      if (applied.timeTo   && vTime > applied.timeTo)   return false;
      return true;
    });
  }, [applied]);

  return (
    <div style={{ marginTop: 20 }}>
      {/* Section header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 12, flexWrap: 'wrap', gap: 8
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: 'var(--color-critical-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <ShieldX size={15} color="var(--color-critical)" />
          </div>
          <div>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>
              ANPR Rule Violations Detected
            </h2>
            <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', margin: 0 }}>
              Vehicles that violated traffic laws — captured by ANPR cameras
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            background: 'var(--color-critical-light)', color: 'var(--color-critical)',
            border: '1px solid #FECACA', borderRadius: 4,
            padding: '3px 8px', fontSize: 10, fontWeight: 700
          }}>
            <AlertTriangle size={10} />
            {filteredData.length} {isFiltered ? 'Filtered' : 'Violations Today'}
          </span>
          <span className="badge-demo">Live ANPR</span>
        </div>
      </div>

      {/* ── Filter bar ──────────────────────────────────────── */}
      <div style={{
        background: '#FFFFFF', border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)', padding: '10px 14px',
        marginBottom: 12, display: 'flex', alignItems: 'flex-end',
        flexWrap: 'wrap', gap: 12
      }}>
        {/* Date From */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-text-secondary)',
            textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 4 }}>
            <CalendarDays size={10} /> Date From
          </label>
          <input type="date" className="form-input" style={{ fontSize: 11, padding: '4px 8px', width: 140 }}
            value={draft.dateFrom}
            onChange={e => setDraft(p => ({ ...p, dateFrom: e.target.value }))}
          />
        </div>

        {/* Date To */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-text-secondary)',
            textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 4 }}>
            <CalendarDays size={10} /> Date To
          </label>
          <input type="date" className="form-input" style={{ fontSize: 11, padding: '4px 8px', width: 140 }}
            value={draft.dateTo}
            onChange={e => setDraft(p => ({ ...p, dateTo: e.target.value }))}
          />
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 32, background: 'var(--color-border)', alignSelf: 'flex-end', marginBottom: 2 }} />

        {/* Time From */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-text-secondary)',
            textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={10} /> Time From
          </label>
          <input type="time" className="form-input" style={{ fontSize: 11, padding: '4px 8px', width: 110 }}
            value={draft.timeFrom}
            onChange={e => setDraft(p => ({ ...p, timeFrom: e.target.value }))}
          />
        </div>

        {/* Time To */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-text-secondary)',
            textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={10} /> Time To
          </label>
          <input type="time" className="form-input" style={{ fontSize: 11, padding: '4px 8px', width: 110 }}
            value={draft.timeTo}
            onChange={e => setDraft(p => ({ ...p, timeTo: e.target.value }))}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 6, marginLeft: 'auto', alignSelf: 'flex-end' }}>
          {isFiltered && (
            <button type="button" className="btn btn-secondary btn-sm"
              onClick={handleReset}
              style={{ display: 'flex', alignItems: 'center', gap: 5 }}
            >
              <RotateCcw size={12} /> Reset
            </button>
          )}
          <button type="button" className="btn btn-primary btn-sm"
            onClick={handleApply}
            style={{ display: 'flex', alignItems: 'center', gap: 5 }}
          >
            <Filter size={12} /> Apply Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="data-table-container">
        <div className="table-responsive-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>License Plate</th>
                <th>Vehicle</th>
                <th>Violation</th>
                <th>Speed</th>
                <th>Junction / Camera</th>
                <th>Date &amp; Time</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Image</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '24px 0', color: 'var(--color-text-muted)', fontSize: 12 }}>
                    No violations found for the selected date / time range.
                  </td>
                </tr>
              ) : filteredData.map(v => {
                const meta = VIOLATION_META[v.violationCode] || VIOLATION_META.SPEED;
                const Icon = meta.icon;
                return (
                  <tr key={v.id}>
                    {/* ID */}
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-text-muted)' }}>
                        {v.id}
                      </span>
                    </td>

                    {/* Plate */}
                    <td><PlateBadge plate={v.plate} /></td>

                    {/* Vehicle */}
                    <td>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-navy)' }}>{v.vehicleModel}</div>
                      <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{v.vehicleType}</div>
                    </td>

                    {/* Violation */}
                    <td>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        background: meta.bg, color: meta.color,
                        border: `1px solid ${meta.border}`,
                        borderRadius: 4, padding: '2px 7px',
                        fontSize: 10, fontWeight: 700, letterSpacing: '0.03em'
                      }}>
                        <Icon size={10} />
                        {v.violationType}
                      </span>
                    </td>

                    {/* Speed */}
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 12, color: meta.color }}>
                        {v.detectedSpeed}
                      </span>
                      <span style={{ fontSize: 10, color: 'var(--color-text-muted)', marginLeft: 4 }}>
                        / {v.speedLimit}
                      </span>
                    </td>

                    {/* Junction */}
                    <td>
                      <div style={{ fontSize: 12, color: 'var(--color-navy)', fontWeight: 500 }}>{v.junction}</div>
                      <div style={{ fontSize: 10, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>{v.camera} • {v.lane}</div>
                    </td>

                    {/* Date & Time */}
                    <td>
                      <div style={{ fontSize: 12, color: 'var(--color-text-main)' }}>{v.date}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>{v.time}</div>
                    </td>

                    {/* Status */}
                    <td><StatusChip status={v.status} /></td>

                    {/* Image button */}
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => setImageModal(v)}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5,
                          padding: '4px 10px', borderRadius: 4, cursor: 'pointer',
                          fontSize: 11, fontWeight: 600,
                          background: '#EFF6FF', color: '#2563EB',
                          border: '1px solid #BFDBFE',
                          transition: 'all 120ms ease'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#2563EB'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#EFF6FF'; e.currentTarget.style.color = '#2563EB'; }}
                      >
                        <Image size={12} />
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Image modal */}
      {imageModal && (
        <ImageModal violation={imageModal} onClose={() => setImageModal(null)} />
      )}
    </div>
  );
}
