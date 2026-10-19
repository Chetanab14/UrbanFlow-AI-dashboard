import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import StatCard from '../components/StatCard';
import {
  BarChart3,
  Calendar,
  Filter,
  TrendingUp,
  Clock,
  Car,
  Activity,
  Download,
  AlertCircle
} from 'lucide-react';
import {
  HOURLY_TRAFFIC_VOLUME,
  VEHICLE_DISTRIBUTION,
  LANE_TRAFFIC_COUNT,
  JUNCTION_CONGESTION_INDEX,
  WAITING_TIME_COMPARISON,
  LOCATIONS
} from '../data/demoData';

export default function Analytics() {
  const [dateRange, setDateRange] = useState('today'); // 'today' | 'yesterday' | '7days' | '30days'
  const [selectedJunction, setSelectedJunction] = useState('all');

  // Filter multiplier simulation to update charts dynamically
  const multiplier = useMemo(() => {
    let factor = 1.0;
    if (dateRange === 'yesterday') factor = 0.92;
    if (dateRange === '7days') factor = 6.8;
    if (dateRange === '30days') factor = 28.5;

    if (selectedJunction === 'subhash-chowk') factor *= 0.32;
    else if (selectedJunction === 'nimzari-naka') factor *= 0.36;
    else if (selectedJunction === 'rc-patel-chowk') factor *= 0.16;
    else if (selectedJunction === 'highway-junction') factor *= 0.44;

    return factor;
  }, [dateRange, selectedJunction]);

  // Dynamically scaled hourly traffic
  const chartHourlyVolume = useMemo(() => {
    return HOURLY_TRAFFIC_VOLUME.map(item => ({
      ...item,
      vehicles: Math.round(item.vehicles * (selectedJunction !== 'all' ? multiplier * 2.8 : 1.0))
    }));
  }, [multiplier, selectedJunction]);

  // Dynamically scaled vehicle distribution
  const chartDistribution = useMemo(() => {
    return VEHICLE_DISTRIBUTION.map(v => ({
      ...v,
      count: Math.round(v.count * (dateRange === '7days' ? 7 : dateRange === '30days' ? 29 : 1))
    }));
  }, [dateRange]);

  const totalVehiclesCount = useMemo(() => {
    const base = 14284;
    return (base * (dateRange === '7days' ? 6.7 : dateRange === '30days' ? 27.8 : dateRange === 'yesterday' ? 0.94 : 1)).toLocaleString();
  }, [dateRange]);

  return (
    <div>
      {/* Page Header */}
      <div className="page-header-row">
        <div className="page-intro">
          <h1 className="text-h1">Traffic Analytics & Flow Intelligence</h1>
          <p className="text-body">
            Comprehensive flow metrics, vehicle classification, waiting times, and bottleneck analysis
          </p>
        </div>

        {/* Global Filter Bar */}
        <div className="page-actions-group">
          {/* Date Range Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FFFFFF', padding: '6px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            <Calendar size={15} color="var(--color-primary)" />
            <select
              className="form-select"
              style={{ border: 'none', padding: 0, fontSize: 13, fontWeight: 600, background: 'transparent' }}
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              aria-label="Filter analytics by date range"
            >
              <option value="today">Today (17 Oct 2026)</option>
              <option value="yesterday">Yesterday (16 Oct)</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
            </select>
          </div>

          {/* Junction Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FFFFFF', padding: '6px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            <Filter size={15} color="var(--color-teal)" />
            <select
              className="form-select"
              style={{ border: 'none', padding: 0, fontSize: 13, fontWeight: 600, background: 'transparent' }}
              value={selectedJunction}
              onChange={(e) => setSelectedJunction(e.target.value)}
              aria-label="Filter analytics by junction"
            >
              <option value="all">All Shirpur Junctions</option>
              {LOCATIONS.map(loc => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Top 4 Analytical KPI Metric Cards */}
      <div className="stat-cards-grid">
        <StatCard
          title="Total Vehicles Analyzed"
          value={totalVehiclesCount}
          subtext="Processed by 16 ANPR nodes"
          icon={Car}
          variant="primary"
          trend={{ direction: 'up', label: '+14.2% volume' }}
          progress={78}
          demoLabel="Aggregated Demo"
        />

        <StatCard
          title="Average Waiting Time"
          value="38 Seconds"
          subtext="-19s faster than fixed timer"
          icon={Clock}
          variant="teal"
          trend={{ direction: 'down', label: '-26% delay' }}
          progress={42}
          demoLabel="Aggregated Demo"
        />

        <StatCard
          title="Peak Traffic Window"
          value="17:30 - 19:15"
          subtext="Evening commute rush"
          icon={TrendingUp}
          variant="warning"
          progress={85}
          demoLabel="Aggregated Demo"
        />

        <StatCard
          title="Congestion Index"
          value="58% Moderate"
          subtext="18% reduction via AI splits"
          icon={Activity}
          variant="critical"
          progress={58}
          demoLabel="Aggregated Demo"
        />
      </div>

      {/* Main Charts Grid: Volume Over Time & Vehicle Classification */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: 'var(--space-xl)', marginBottom: 'var(--space-xl)' }}>
        {/* Hourly Traffic Volume Area Chart */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <div className="card-title-group">
              <h3 className="card-title">Traffic Volume & Flow Rate Over Time</h3>
              <span className="card-subtitle">Hourly detected vehicles across active optical sensors (Vehicles / Hour)</span>
            </div>
            <span className="badge-demo">Area Flow Analysis</span>
          </div>

          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartHourlyVolume} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    boxShadow: 'var(--shadow-md)',
                    fontSize: '12px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="vehicles"
                  name="Vehicles Detected"
                  stroke="var(--color-primary)"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#volumeGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vehicle Classification Donut Chart */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <div className="card-title-group">
              <h3 className="card-title">Vehicle Distribution by Category</h3>
              <span className="card-subtitle">AI model classification split</span>
            </div>
            <span className="badge-demo">ANPR Vision</span>
          </div>

          <div style={{ width: '100%', height: 210 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {chartDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name, item) => [`${val} (${item.payload.value}%)`, item.payload.name]}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom legend */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 11, marginTop: 10 }}>
            {chartDistribution.map((item) => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: item.color, flexShrink: 0 }} />
                <span style={{ color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.name}>
                  {item.name.split(' ')[0]}: <strong>{item.value}%</strong>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Charts: Lane Flow & Junction Congestion & Waiting Time */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-xl)' }}>
        {/* Lane Flow Count */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <div className="card-title-group">
              <h3 className="card-title" style={{ fontSize: 15 }}>Traffic Count by Lane</h3>
              <span className="card-subtitle">Peak vehicle queue distribution</span>
            </div>
          </div>
          <div style={{ width: '100%', height: 230 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={LANE_TRAFFIC_COUNT} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="lane" tick={{ fontSize: 10, fill: '#64748B' }} tickFormatter={(val) => val.split(' ')[0]} />
                <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="vehicles" name="Vehicles" fill="var(--color-teal)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Congestion by Junction */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <div className="card-title-group">
              <h3 className="card-title" style={{ fontSize: 15 }}>Congestion Index by Junction</h3>
              <span className="card-subtitle">Scale 0 (Free Flow) to 100 (Gridlock)</span>
            </div>
          </div>
          <div style={{ width: '100%', height: 230 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={JUNCTION_CONGESTION_INDEX}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis dataKey="junction" type="category" tick={{ fontSize: 10, fill: '#64748B' }} width={80} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="index" name="Congestion Index" fill="var(--color-warning)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Signal Waiting Time Comparison */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <div className="card-title-group">
              <h3 className="card-title" style={{ fontSize: 15 }}>Signal Waiting Delay Comparison</h3>
              <span className="card-subtitle">Fixed Cycle vs AI Adaptive Time (sec)</span>
            </div>
          </div>
          <div style={{ width: '100%', height: 230 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WAITING_TIME_COMPARISON} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="junction" tick={{ fontSize: 9, fill: '#64748B' }} tickFormatter={(val) => val.split(' ')[0]} />
                <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="fixedOld" name="Fixed Timer" fill="#94A3B8" radius={[3, 3, 0, 0]} />
                <Bar dataKey="aiOptimized" name="AI Adaptive" fill="var(--color-primary)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
