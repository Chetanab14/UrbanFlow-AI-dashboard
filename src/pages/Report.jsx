import React, { useState } from 'react';
import { Download, Printer, Calendar, ChevronLeft, ChevronRight, CheckCircle2, FileText } from 'lucide-react';

/* ─── Monthly data ───────────────────────────────────────── */
const MONTHLY_REPORTS = [
  {
    id: 'RPT-2026-OCT', month: 'October 2026', period: '01 Oct – 31 Oct 2026', status: 'In Progress',
    junctions: [
      { name: 'Subhash Chowk Junction',   peakVol: '1,284', avgSpeed: '28.4', congestion: '42% (Moderate)',  signal: 'Adaptive AI Split',        incidents: 12, violations: 68 },
      { name: 'Nimzari Naka Crossing',     peakVol: '1,410', avgSpeed: '22.1', congestion: '68% (Congested)', signal: 'Adaptive AI Split',        incidents: 21, violations: 89 },
      { name: 'R.C. Patel Campus Chowk',  peakVol: '740',   avgSpeed: '32.6', congestion: '18% (Normal)',    signal: 'Fixed 45s Cycle',          incidents: 4,  violations: 14 },
      { name: 'Mumbai-Agra NH-52 Bypass', peakVol: '1,890', avgSpeed: '54.2', congestion: '35% (Moderate)',  signal: 'Coordinated Green Wave',    incidents: 8,  violations: 43 },
    ],
    totalVehicles: '38,520', avgSpeed: '31.2', totalViolations: '214', uptime: '99.1%', peakHour: '08:30–09:15',
  },
  {
    id: 'RPT-2026-SEP', month: 'September 2026', period: '01 Sep – 30 Sep 2026', status: 'Ready',
    junctions: [
      { name: 'Subhash Chowk Junction',   peakVol: '1,190', avgSpeed: '29.8', congestion: '38% (Moderate)',  signal: 'Adaptive AI Split',        incidents: 10, violations: 61 },
      { name: 'Nimzari Naka Crossing',     peakVol: '1,380', avgSpeed: '23.5', congestion: '61% (Congested)', signal: 'Adaptive AI Split',        incidents: 18, violations: 78 },
      { name: 'R.C. Patel Campus Chowk',  peakVol: '690',   avgSpeed: '33.2', congestion: '14% (Normal)',    signal: 'Fixed 45s Cycle',          incidents: 3,  violations: 10 },
      { name: 'Mumbai-Agra NH-52 Bypass', peakVol: '1,740', avgSpeed: '56.0', congestion: '30% (Normal)',    signal: 'Coordinated Green Wave',    incidents: 6,  violations: 48 },
    ],
    totalVehicles: '34,280', avgSpeed: '32.8', totalViolations: '197', uptime: '98.8%', peakHour: '08:15–09:00',
  },
  {
    id: 'RPT-2026-AUG', month: 'August 2026', period: '01 Aug – 31 Aug 2026', status: 'Ready',
    junctions: [
      { name: 'Subhash Chowk Junction',   peakVol: '1,120', avgSpeed: '27.4', congestion: '44% (Moderate)',  signal: 'Adaptive AI Split',        incidents: 13, violations: 72 },
      { name: 'Nimzari Naka Crossing',     peakVol: '1,310', avgSpeed: '21.8', congestion: '72% (Congested)', signal: 'Adaptive AI Split',        incidents: 24, violations: 91 },
      { name: 'R.C. Patel Campus Chowk',  peakVol: '620',   avgSpeed: '31.0', congestion: '16% (Normal)',    signal: 'Fixed 45s Cycle',          incidents: 4,  violations: 11 },
      { name: 'Mumbai-Agra NH-52 Bypass', peakVol: '1,660', avgSpeed: '52.4', congestion: '38% (Moderate)',  signal: 'Coordinated Green Wave',    incidents: 9,  violations: 32 },
    ],
    totalVehicles: '32,100', avgSpeed: '30.5', totalViolations: '206', uptime: '98.7%', peakHour: '08:45–09:30',
  },
];

export default function Report() {
  const [idx, setIdx] = useState(0);
  const [toast, setToast] = useState('');
  const r = MONTHLY_REPORTS[idx];

  /* CSV export */
  const handleCSV = () => {
    const rows = [
      ['UrbanFlow AI – Monthly Traffic Report'],
      ['Report ID', r.id, 'Period', r.period],
      ['Total Vehicles', r.totalVehicles, 'Avg Speed', `${r.avgSpeed} km/h`,
       'Violations', r.totalViolations, 'Uptime', r.uptime],
      [],
      ['Junction', 'Peak Volume (veh/hr)', 'Avg Speed (km/h)', 'Congestion', 'Signal Mode', 'Incidents', 'Violations'],
      ...r.junctions.map(j => [j.name, j.peakVol, j.avgSpeed, j.congestion, j.signal, j.incidents, j.violations]),
    ];
    const csv = 'data:text/csv;charset=utf-8,' + rows.map(row => row.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = encodeURI(csv);
    a.download = `${r.id}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setToast(`Downloaded ${r.id}.csv`);
    setTimeout(() => setToast(''), 3000);
  };

  /* Print */
  const handlePrint = () => {
    const w = window.open('', '_blank');
    if (!w) { alert('Allow popups to print.'); return; }
    w.document.write(`<!DOCTYPE html><html><head><title>${r.id}</title>
    <style>
      body{font-family:sans-serif;padding:32px;color:#1e293b}
      h1{font-size:20px;color:#1e3a8a;margin:0}
      p{font-size:12px;color:#64748b;margin:4px 0 16px}
      table{width:100%;border-collapse:collapse;font-size:12px;margin-top:12px}
      th{background:#f1f5f9;padding:8px 10px;text-align:left;border:1px solid #cbd5e1;font-weight:700}
      td{padding:8px 10px;border:1px solid #e2e8f0}
      .sum{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin:16px 0}
      .kpi{border:1px solid #e2e8f0;border-radius:6px;padding:8px 12px}
      .kpi .val{font-size:18px;font-weight:800;color:#1e3a8a}
      .kpi .lbl{font-size:10px;color:#64748b;text-transform:uppercase}
      footer{margin-top:32px;border-top:1px solid #e2e8f0;padding-top:10px;font-size:10px;color:#94a3b8}
    </style></head><body>
    <h1>UrbanFlow AI – Monthly Traffic Report</h1>
    <p>${r.month} &nbsp;|&nbsp; ${r.period} &nbsp;|&nbsp; Ref: ${r.id} &nbsp;|&nbsp; Status: ${r.status}</p>
    <div class="sum">
      <div class="kpi"><div class="lbl">Total Vehicles</div><div class="val">${r.totalVehicles}</div></div>
      <div class="kpi"><div class="lbl">Avg Speed</div><div class="val">${r.avgSpeed} km/h</div></div>
      <div class="kpi"><div class="lbl">Violations</div><div class="val">${r.totalViolations}</div></div>
      <div class="kpi"><div class="lbl">System Uptime</div><div class="val">${r.uptime}</div></div>
      <div class="kpi"><div class="lbl">Peak Hour</div><div class="val" style="font-size:14px">${r.peakHour}</div></div>
    </div>
    <table><thead><tr>
      <th>#</th><th>Junction / Sector</th><th>Peak Volume</th><th>Avg Speed</th>
      <th>Congestion</th><th>Signal Mode</th><th>Incidents</th><th>Violations</th>
    </tr></thead><tbody>
    ${r.junctions.map((j, i) => `<tr>
      <td>${i + 1}</td><td>${j.name}</td><td>${j.peakVol} veh/hr</td><td>${j.avgSpeed} km/h</td>
      <td>${j.congestion}</td><td>${j.signal}</td><td>${j.incidents}</td><td>${j.violations}</td>
    </tr>`).join('')}
    </tbody></table>
    <footer>Certified by Traffic Control Center Shirpur • NTCIP Compliant • UrbanFlow AI Console</footer>
    <script>window.print();</script></body></html>`);
    w.document.close();
  };

  const statusStyle = r.status === 'Ready'
    ? { background: '#DCFCE7', color: '#15803D', border: '1px solid #86EFAC' }
    : { background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A' };

  return (
    <div>
      {/* Page header */}
      <div className="page-header-row">
        <div className="page-intro">
          <h1 className="text-h1">Monthly Traffic Report</h1>
          <p className="text-body" style={{ fontSize: 12 }}>
            Official monthly traffic summary — Shirpur Municipal Traffic Police
          </p>
        </div>
        <div className="page-actions-group">
          <button className="btn btn-secondary btn-sm" onClick={handleCSV}>
            <Download size={13} /> Export CSV
          </button>
          <button className="btn btn-primary btn-sm" onClick={handlePrint}>
            <Printer size={13} /> Print
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          background: '#DCFCE7', border: '1px solid #86EFAC', color: '#166534',
          padding: '8px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12
        }}>
          <CheckCircle2 size={13} /> {toast}
        </div>
      )}

      {/* Month selector bar */}
      <div style={{
        background: '#fff', border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)', padding: '10px 14px',
        display: 'flex', alignItems: 'center', gap: 10,
        marginBottom: 14, flexWrap: 'wrap'
      }}>
        <Calendar size={14} color="var(--color-primary)" />
        <button className="btn btn-secondary btn-sm" style={{ padding: '3px 8px' }}
          disabled={idx === 0} onClick={() => setIdx(i => i - 1)}>
          <ChevronLeft size={13} />
        </button>
        <select className="form-select" style={{ fontSize: 12, padding: '4px 10px', width: 200 }}
          value={idx} onChange={e => setIdx(Number(e.target.value))}>
          {MONTHLY_REPORTS.map((m, i) => (
            <option key={m.id} value={i}>{m.month}</option>
          ))}
        </select>
        <button className="btn btn-secondary btn-sm" style={{ padding: '3px 8px' }}
          disabled={idx === MONTHLY_REPORTS.length - 1} onClick={() => setIdx(i => i + 1)}>
          <ChevronRight size={13} />
        </button>
        <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{r.period}</span>
        <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, ...statusStyle }}>
          {r.status}
        </span>
        <span style={{ fontSize: 10, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>{r.id}</span>
      </div>

      {/* Summary KPI row */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: 10, marginBottom: 14
      }}>
        {[
          { label: 'Total Vehicles',  value: r.totalVehicles,           color: '#2563EB' },
          { label: 'Average Speed',   value: `${r.avgSpeed} km/h`,      color: '#0EA5E9' },
          { label: 'Total Violations',value: r.totalViolations,         color: '#EF4444' },
          { label: 'System Uptime',   value: r.uptime,                  color: '#10B981' },
          { label: 'Peak Hour',       value: r.peakHour,                color: '#8B5CF6' },
        ].map(k => (
          <div key={k.label} style={{
            background: '#fff', border: '1px solid var(--color-border)',
            borderTop: `3px solid ${k.color}`, borderRadius: 'var(--radius-md)',
            padding: '10px 12px'
          }}>
            <div style={{ fontSize: 10, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>
              {k.label}
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-navy)' }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Main junction table */}
      <div className="data-table-container">
        <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <FileText size={14} color="var(--color-primary)" />
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-navy)' }}>
            Junction Performance — {r.month}
          </div>
        </div>
        <div className="table-responsive-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Junction / Sector</th>
                <th>Peak Volume</th>
                <th>Avg Speed (km/h)</th>
                <th>Congestion</th>
                <th>Signal Mode</th>
                <th style={{ textAlign: 'center' }}>Incidents</th>
                <th style={{ textAlign: 'center' }}>Violations</th>
              </tr>
            </thead>
            <tbody>
              {r.junctions.map((j, i) => {
                const isCongested = j.congestion.includes('Congested');
                const isNormal    = j.congestion.includes('Normal');
                const congColor   = isCongested ? '#EF4444' : isNormal ? '#10B981' : '#F59E0B';
                return (
                  <tr key={i}>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: 11 }}>{i + 1}</td>
                    <td style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: 12 }}>{j.name}</td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 12, color: 'var(--color-navy)' }}>
                        {j.peakVol}
                      </span>
                      <span style={{ fontSize: 10, color: 'var(--color-text-muted)', marginLeft: 3 }}>veh/hr</span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{j.avgSpeed}</td>
                    <td>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4,
                        background: `${congColor}18`, color: congColor,
                        border: `1px solid ${congColor}44`
                      }}>
                        {j.congestion}
                      </span>
                    </td>
                    <td style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{j.signal}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: 24, height: 24, borderRadius: '50%', fontSize: 11, fontWeight: 700,
                        background: j.incidents > 15 ? '#FEF2F2' : '#F0FDF4',
                        color: j.incidents > 15 ? '#EF4444' : '#15803D'
                      }}>
                        {j.incidents}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: 28, height: 24, borderRadius: 4, fontSize: 11, fontWeight: 700,
                        background: '#FEF2F2', color: '#EF4444'
                      }}>
                        {j.violations}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {/* Totals row */}
            <tfoot>
              <tr style={{ background: '#F8FAFC', fontWeight: 700 }}>
                <td colSpan={6} style={{ fontSize: 11, color: 'var(--color-navy)', paddingLeft: 14 }}>
                  Monthly Totals
                </td>
                <td style={{ textAlign: 'center', fontSize: 12, color: 'var(--color-navy)' }}>
                  {r.junctions.reduce((s, j) => s + j.incidents, 0)}
                </td>
                <td style={{ textAlign: 'center', fontSize: 12, color: '#EF4444' }}>
                  {r.junctions.reduce((s, j) => s + j.violations, 0)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
