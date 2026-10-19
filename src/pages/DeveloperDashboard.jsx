import React, { useState, useEffect } from 'react';
import {
  Terminal, BarChart3, Cpu, Zap, Thermometer, Activity,
  CheckCircle2, AlertTriangle, XCircle, RefreshCw, Wifi,
  WifiOff, Server, Gauge, BrainCircuit, ClipboardList, ChevronDown
} from 'lucide-react';

/* ─── Demo data generators ──────────────────────────────── */
const INITIAL_LOGS = [
  { id: 1, ts: '13:24:01', level: 'INFO', component: 'ANPR-Engine', msg: 'Model v2.4.1 loaded successfully. Inference ready.' },
  { id: 2, ts: '13:24:03', level: 'INFO', component: 'ESP32-CAM-01', msg: 'Heartbeat received. RSSI: -52 dBm.' },
  { id: 3, ts: '13:24:05', level: 'WARN', component: 'Jetson-Nano', msg: 'GPU memory usage at 78%. Monitor closely.' },
  { id: 4, ts: '13:24:07', level: 'INFO', component: 'Power-Supply', msg: 'Voltage nominal: 12.1V. Current: 3.4A.' },
  { id: 5, ts: '13:24:09', level: 'INFO', component: 'ANPR-Engine', msg: 'Plate detected: MH 18 BG 4421. Confidence: 98.4%.' },
  { id: 6, ts: '13:24:11', level: 'ERROR', component: 'ESP32-CAM-03', msg: 'Connection timeout. Attempting reconnect (1/3).' },
  { id: 7, ts: '13:24:14', level: 'INFO', component: 'ESP32-CAM-03', msg: 'Reconnected successfully after 3s.' },
  { id: 8, ts: '13:24:17', level: 'INFO', component: 'ANPR-Engine', msg: 'Violation flagged: Over speed. Plate: DL 01 AA 2024.' },
  { id: 9, ts: '13:24:20', level: 'WARN', component: 'Temperature', msg: 'Jetson core temp: 72°C. Threshold: 80°C.' },
  { id: 10, ts: '13:24:23', level: 'INFO', component: 'Signal-Ctrl', msg: 'Phase switch: North → East. Vehicles cleared: 24.' },
  { id: 11, ts: '13:24:26', level: 'INFO', component: 'ANPR-Engine', msg: 'Batch inference: 12 frames in 41ms (avg 3.4ms/frame).' },
  { id: 12, ts: '13:24:29', level: 'INFO', component: 'ESP32-CAM-02', msg: 'Frame rate stable at 25 fps. Exposure auto-adjusted.' },
  { id: 13, ts: '13:24:32', level: 'WARN', component: 'Power-Supply', msg: 'Input voltage dipped to 11.7V. Surge protector active.' },
  { id: 14, ts: '13:24:35', level: 'INFO', component: 'Jetson-Nano', msg: 'CUDA kernel launched. 512 CUDA cores active.' },
  { id: 15, ts: '13:24:38', level: 'INFO', component: 'System', msg: 'Health check OK. All subsystems nominal.' },
];

const ESP32_DEVICES = [
  { id: 'ESP32-CAM-01', location: 'Subhash Chowk – North', status: 'Online', rssi: -52, fps: 25, uptime: '6d 14h', firmware: 'v3.1.2' },
  { id: 'ESP32-CAM-02', location: 'Nimzari Naka – East', status: 'Online', rssi: -61, fps: 24, uptime: '6d 14h', firmware: 'v3.1.2' },
  { id: 'ESP32-CAM-03', location: 'R.C. Patel – West', status: 'Online', rssi: -74, fps: 22, uptime: '0d 00h', firmware: 'v3.0.8' },
  { id: 'ESP32-CAM-04', location: 'NH-52 Bypass – South', status: 'Warning', rssi: -81, fps: 18, uptime: '2d 03h', firmware: 'v3.1.2' },
];

const MODEL_METRICS = {
  name: 'UrbanFlow-ANPR v2.4.1',
  framework: 'YOLOv8n (Custom)',
  inferenceDevice: 'NVIDIA Jetson Nano 4GB',
  avgInferenceMs: 3.4,
  mAP50: 97.2,
  precision: 98.1,
  recall: 96.4,
  f1: 97.2,
  classes: [
    { name: 'License Plate', precision: 98.4, recall: 97.1, mAP50: 97.8 },
    { name: 'Car', precision: 97.8, recall: 96.2, mAP50: 97.0 },
    { name: 'Truck', precision: 96.9, recall: 95.8, mAP50: 96.4 },
    { name: 'Motorcycle', precision: 95.2, recall: 94.6, mAP50: 94.9 },
    { name: 'Bus', precision: 97.1, recall: 96.0, mAP50: 96.6 },
  ],
  lastTrained: '14 Oct 2026',
  dataset: '48,200 annotated frames',
  epochs: 120,
  batchSize: 16,
};

const JETSON = {
  model: 'NVIDIA Jetson Nano 4GB',
  os: 'Ubuntu 20.04 (JetPack 5.1)',
  ip: '192.168.1.101',
  status: 'Online',
  gpuUtil: 71,
  cpuUtil: 48,
  ramUsed: 3.1,
  ramTotal: 4,
  diskUsed: 22,
  diskTotal: 64,
  cudaCores: 128,
  tensorCores: 0,
};

const POWER = {
  inputVo
  ltage: 12.1,
  currentDraw: 3.4,
  wattage: 41.1,
  batteryBackup: 'Online – 4h 12m remaining',
  surgeProtector: 'Active',
  supplyStatus: 'Nominal',
};

const TEMPS = [
  { label: 'Jetson GPU', value: 72, max: 85, unit: '°C' },
  { label: 'Jetson CPU', value: 58, max: 85, unit: '°C' },
  { label: 'ESP32 Board Avg', value: 41, max: 70, unit: '°C' },
  { label: 'Enclosure Ambient', value: 34, max: 55, unit: '°C' },
  { label: 'Power Supply', value: 47, max: 65, unit: '°C' },
];

/* ─── helpers ────────────────────────────────────────────── */
const TABS = [
  { key: 'logs', label: 'System Logs', icon: ClipboardList },
  { key: 'model', label: 'Model Accuracy', icon: BrainCircuit },
  { key: 'status', label: 'Model Status', icon: BarChart3 },
  { key: 'hardware', label: 'Hardware', icon: Cpu },
];

function levelStyle(level) {
  if (level === 'ERROR') return { color: '#EF4444', bg: '#FEF2F2', border: '#FECACA' };
  if (level === 'WARN') return { color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A' };
  return { color: '#10B981', bg: '#F0FDF4', border: '#86EFAC' };
}

function StatusDot({ status }) {
  const color = status === 'Online' ? '#10B981' : status === 'Warning' ? '#F59E0B' : '#EF4444';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} />
      <span style={{ fontSize: 11, fontWeight: 700, color }}>{status}</span>
    </span>
  );
}

function MetricBar({ value, max, color }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const barColor = pct > 85 ? '#EF4444' : pct > 65 ? '#F59E0B' : '#10B981';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 7, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: barColor, borderRadius: 4, transition: 'width 600ms' }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color: barColor, fontFamily: 'var(--font-mono)', minWidth: 34 }}>
        {pct}%
      </span>
    </div>
  );
}

/* ─── Tab panes ──────────────────────────────────────────── */
function LogsTab({ logs }) {
  const [filter, setFilter] = useState('ALL');
  const filtered = filter === 'ALL' ? logs : logs.filter(l => l.level === filter);
  return (
    <div>
      {/* filter */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        {['ALL', 'INFO', 'WARN', 'ERROR'].map(f => {
          const active = filter === f;
          const color = f === 'ERROR' ? '#EF4444' : f === 'WARN' ? '#F59E0B' : f === 'INFO' ? '#10B981' : 'var(--color-primary)';
          return (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '3px 12px', borderRadius: 4, fontSize: 11, fontWeight: 700,
              cursor: 'pointer', border: `1px solid ${active ? color : 'var(--color-border)'}`,
              background: active ? `${color}18` : '#fff', color: active ? color : 'var(--color-text-secondary)',
            }}>{f}</button>
          );
        })}
        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--color-text-muted)', alignSelf: 'center' }}>
          {filtered.length} entries
        </span>
      </div>

      <div className="data-table-container">
        <div className="table-responsive-wrapper">
          <table className="custom-table" style={{ fontSize: 11 }}>
            <thead>
              <tr>
                <th style={{ width: 80 }}>Time</th>
                <th style={{ width: 70 }}>Level</th>
                <th style={{ width: 120 }}>Component</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(log => {
                const s = levelStyle(log.level);
                return (
                  <tr key={log.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>{log.ts}</td>
                    <td>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 3,
                        background: s.bg, color: s.color, border: `1px solid ${s.border}`
                      }}>
                        {log.level}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-primary)', fontSize: 10 }}>{log.component}</td>
                    <td style={{ color: 'var(--color-text-main)' }}>{log.msg}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ModelAccuracyTab() {
  const m = MODEL_METRICS;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Overall metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px,1fr))', gap: 10 }}>
        {[
          { label: 'mAP@50', value: `${m.mAP50}%`, color: '#2563EB' },
          { label: 'Precision', value: `${m.precision}%`, color: '#10B981' },
          { label: 'Recall', value: `${m.recall}%`, color: '#0EA5E9' },
          { label: 'F1 Score', value: `${m.f1}%`, color: '#8B5CF6' },
          { label: 'Avg Inference', value: `${m.avgInferenceMs} ms`, color: '#F59E0B' },
        ].map(k => (
          <div key={k.label} style={{
            background: '#fff', border: '1px solid var(--color-border)',
            borderTop: `3px solid ${k.color}`, borderRadius: 8, padding: '10px 12px'
          }}>
            <div style={{ fontSize: 9, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-navy)' }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Per-class breakdown */}
      <div className="data-table-container">
        <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--color-border)', fontSize: 13, fontWeight: 700, color: 'var(--color-navy)' }}>
          Per-Class Metrics
        </div>
        <div className="table-responsive-wrapper">
          <table className="custom-table" style={{ fontSize: 12 }}>
            <thead>
              <tr><th>Class</th><th>Precision (%)</th><th>Recall (%)</th><th>mAP@50 (%)</th><th>Performance</th></tr>
            </thead>
            <tbody>
              {m.classes.map(c => (
                <tr key={c.name}>
                  <td style={{ fontWeight: 600, color: 'var(--color-navy)' }}>{c.name}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: '#10B981', fontWeight: 700 }}>{c.precision}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: '#0EA5E9', fontWeight: 700 }}>{c.recall}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: '#2563EB', fontWeight: 700 }}>{c.mAP50}</td>
                  <td style={{ width: 160 }}><MetricBar value={c.mAP50} max={100} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Training info */}
      <div className="dashboard-card" style={{ padding: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-navy)', marginBottom: 10 }}>Training Configuration</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px,1fr))', gap: 8, fontSize: 11 }}>
          {[
            ['Model', m.name],
            ['Framework', m.framework],
            ['Device', m.inferenceDevice],
            ['Last Trained', m.lastTrained],
            ['Dataset', m.dataset],
            ['Epochs', m.epochs],
            ['Batch Size', m.batchSize],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 9, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{k}</span>
              <span style={{ fontWeight: 600, color: 'var(--color-navy)' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ModelStatusTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Status cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: 10 }}>
        {[
          { label: 'Model Status', value: 'Running', color: '#10B981', icon: CheckCircle2 },
          { label: 'Inference Engine', value: 'TensorRT 8', color: '#2563EB', icon: Cpu },
          { label: 'Uptime', value: '6d 14h 22m', color: '#8B5CF6', icon: Activity },
          { label: 'Frames Processed', value: '1,842,300', color: '#F59E0B', icon: BarChart3 },
        ].map(k => {
          const Icon = k.icon;
          return (
            <div key={k.label} style={{
              background: '#fff', border: '1px solid var(--color-border)',
              borderRadius: 8, padding: '12px 14px',
              display: 'flex', alignItems: 'center', gap: 12
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: `${k.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} color={k.color} />
              </div>
              <div>
                <div style={{ fontSize: 10, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{k.label}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-navy)' }}>{k.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Jetson resource usage */}
      <div className="dashboard-card" style={{ padding: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-navy)', marginBottom: 12 }}>
          Jetson Nano — Resource Utilisation
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: 'GPU Utilisation', value: JETSON.gpuUtil, max: 100, unit: '%' },
            { label: 'CPU Utilisation', value: JETSON.cpuUtil, max: 100, unit: '%' },
            { label: 'RAM', value: JETSON.ramUsed * 25, max: 100, unit: `${JETSON.ramUsed}GB / ${JETSON.ramTotal}GB` },
            { label: 'Disk', value: Math.round(JETSON.diskUsed / JETSON.diskTotal * 100), max: 100, unit: `${JETSON.diskUsed}GB / ${JETSON.diskTotal}GB` },
          ].map(r => (
            <div key={r.label} style={{ display: 'grid', gridTemplateColumns: '150px 1fr 100px', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 11, color: 'var(--color-text-secondary)', fontWeight: 600 }}>{r.label}</span>
              <MetricBar value={r.value} max={r.max} />
              <span style={{ fontSize: 10, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>{r.unit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Inference pipeline */}
      <div className="data-table-container">
        <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--color-border)', fontSize: 13, fontWeight: 700, color: 'var(--color-navy)' }}>
          Inference Pipeline Stages
        </div>
        <div className="table-responsive-wrapper">
          <table className="custom-table" style={{ fontSize: 12 }}>
            <thead><tr><th>Stage</th><th>Status</th><th>Avg Time (ms)</th><th>Throughput (fps)</th></tr></thead>
            <tbody>
              {[
                ['Frame Capture (ESP32)', 'Active', '1.2', '25.0'],
                ['Pre-processing', 'Active', '0.6', '25.0'],
                ['YOLO Detection', 'Active', '3.4', '23.8'],
                ['Plate OCR', 'Active', '1.8', '23.8'],
                ['Rule Evaluation', 'Active', '0.3', '23.8'],
                ['Result Dispatch', 'Active', '0.2', '23.8'],
              ].map(([stage, status, time, fps]) => (
                <tr key={stage}>
                  <td style={{ fontWeight: 600, color: 'var(--color-navy)' }}>{stage}</td>
                  <td><StatusDot status={status} /></td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: '#10B981', fontWeight: 700 }}>{time}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: '##2563EB' }}>{fps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function HardwareTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* ESP32 devices */}
      <div className="data-table-container">
        <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Wifi size={14} color="var(--color-primary)" />
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-navy)' }}>ESP32-CAM Modules</div>
        </div>
        <div className="table-responsive-wrapper">
          <table className="custom-table" style={{ fontSize: 12 }}>
            <thead>
              <tr><th>Device ID</th><th>Location</th><th>Status</th><th>RSSI (dBm)</th><th>FPS</th><th>Uptime</th><th>Firmware</th></tr>
            </thead>
            <tbody>
              {ESP32_DEVICES.map(d => (
                <tr key={d.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-primary)', fontSize: 11 }}>{d.id}</td>
                  <td style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{d.location}</td>
                  <td><StatusDot status={d.status} /></td>
                  <td style={{
                    fontFamily: 'var(--font-mono)', fontSize: 11,
                    color: d.rssi > -70 ? '#10B981' : d.rssi > -80 ? '#F59E0B' : '#EF4444', fontWeight: 700
                  }}>
                    {d.rssi}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{d.fps}</td>
                  <td style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{d.uptime}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-text-muted)' }}>{d.firmware}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Jetson + Power + Temp row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>

        {/* Jetson */}
        <div className="dashboard-card" style={{ padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
            <Server size={14} color="#8B5CF6" />
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-navy)' }}>Jetson Nano</div>
            <StatusDot status={JETSON.status} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11 }}>
            {[
              ['Model', JETSON.model],
              ['OS', JETSON.os],
              ['IP Address', JETSON.ip],
              ['CUDA Cores', JETSON.cudaCores],
              ['GPU Util', `${JETSON.gpuUtil}%`],
              ['CPU Util', `${JETSON.cpuUtil}%`],
              ['RAM', `${JETSON.ramUsed}/${JETSON.ramTotal} GB`],
              ['Disk', `${JETSON.diskUsed}/${JETSON.diskTotal} GB`],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: 4 }}>
                <span style={{ color: 'var(--color-text-muted)' }}>{k}</span>
                <span style={{ fontWeight: 600, color: 'var(--color-navy)', fontFamily: k === 'IP Address' ? 'var(--font-mono)' : 'inherit', fontSize: k === 'IP Address' ? 10 : 11 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Power Supply */}
        <div className="dashboard-card" style={{ padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
            <Zap size={14} color="#F59E0B" />
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-navy)' }}>Power Supply</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11 }}>
            {[
              ['Status', POWER.supplyStatus],
              ['Input Voltage', `${POWER.inputVoltage} V`],
              ['Current Draw', `${POWER.currentDraw} A`],
              ['Power', `${POWER.wattage} W`],
              ['Surge Protect', POWER.surgeProtector],
              ['Battery Backup', POWER.batteryBackup],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: 4, flexWrap: 'wrap', gap: 2 }}>
                <span style={{ color: 'var(--color-text-muted)' }}>{k}</span>
                <span style={{ fontWeight: 600, color: v === 'Nominal' || v === 'Active' ? '#10B981' : 'var(--color-navy)', fontFamily: 'var(--font-mono)', fontSize: 10 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Temperature */}
        <div className="dashboard-card" style={{ padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
            <Thermometer size={14} color="#EF4444" />
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-navy)' }}>Temperature</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {TEMPS.map(t => {
              const pct = Math.round((t.value / t.max) * 100);
              const color = pct > 85 ? '#EF4444' : pct > 65 ? '#F59E0B' : '#10B981';
              return (
                <div key={t.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3, fontSize: 11 }}>
                    <span style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>{t.label}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color }}>
                      {t.value}{t.unit} <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>/ {t.max}{t.unit}</span>
                    </span>
                  </div>
                  <div style={{ height: 6, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 4, transition: 'width 600ms' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

/* ─── Main developer dashboard ───────────────────────────── */
export default function DeveloperDashboard() {
  const [activeTab, setActiveTab] = useState('logs');
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [refreshing, setRefreshing] = useState(false);

  const auth = JSON.parse(localStorage.getItem('urbanflow_auth') || '{}');

  /* Simulate log refresh */
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      const now = new Date();
      const ts = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      setLogs(prev => [
        { id: prev.length + 1, ts, level: 'INFO', component: 'System', msg: 'Manual refresh triggered by developer.' },
        ...prev,
      ]);
      setRefreshing(false);
    }, 700);
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header-row">
        <div className="page-intro">
          <h1 className="text-h1">Developer Console</h1>
          <p className="text-body" style={{ fontSize: 12 }}>
            System diagnostics, model telemetry &amp; hardware monitoring
            &nbsp;•&nbsp;
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-primary)' }}>{auth.email}</span>
          </p>
        </div>
        <div className="page-actions-group">
          <button className="btn btn-secondary btn-sm" onClick={handleRefresh} disabled={refreshing}
            style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <RefreshCw size={13} style={{ animation: refreshing ? 'spin 0.7s linear infinite' : 'none' }} />
            Refresh
          </button>
        </div>
      </div>

      {/* Quick status strip */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 8,
        background: '#fff', border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)', padding: '8px 14px',
        marginBottom: 16, fontSize: 11
      }}>
        {[
          { label: 'ANPR Model', value: 'v2.4.1 Running', color: '#10B981' },
          { label: 'Jetson Nano', value: 'Online', color: '#10B981' },
          { label: 'ESP32 Cams', value: '3/4 Online', color: '#F59E0B' },
          { label: 'GPU Temp', value: '72°C', color: '#F59E0B' },
          { label: 'Power', value: 'Nominal 12.1V', color: '#10B981' },
          { label: 'Uptime', value: '6d 14h', color: '#10B981' },
        ].map(s => (
          <div key={s.label} style={{
            display: 'flex', alignItems: 'center', gap: 5, paddingRight: 14,
            borderRight: '1px solid var(--color-border)'
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: s.color }} />
            <span style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>{s.label}:</span>
            <span style={{ color: s.color, fontWeight: 700 }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid var(--color-border)', marginBottom: 16, gap: 0 }}>
        {TABS.map(t => {
          const Icon = t.icon;
          const active = activeTab === t.key;
          return (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '9px 18px', cursor: 'pointer',
                background: 'none', border: 'none',
                borderBottom: active ? '2px solid var(--color-primary)' : '2px solid transparent',
                marginBottom: -2,
                fontSize: 12, fontWeight: active ? 700 : 500,
                color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                transition: 'all 120ms ease',
              }}>
              <Icon size={14} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === 'logs' && <LogsTab logs={logs} />}
      {activeTab === 'model' && <ModelAccuracyTab />}
      {activeTab === 'status' && <ModelStatusTab />}
      {activeTab === 'hardware' && <HardwareTab />}
    </div>
  );
}
