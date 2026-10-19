import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  ClipboardList, BrainCircuit, BarChart3, Cpu,
  Server, Zap, Thermometer, ChevronLeft, ChevronRight, LogOut, Code2
} from 'lucide-react';

const DEV_NAV = [
  { name: 'Logs',            path: '/developer/logs',           icon: ClipboardList },
  { name: 'Model Accuracy',  path: '/developer/model-accuracy', icon: BrainCircuit  },
  { name: 'Model Status',    path: '/developer/model-status',   icon: BarChart3     },
  { name: 'Hardware Status', path: '/developer/hardware',       icon: Cpu           },
  { name: 'Jetson',          path: '/developer/jetson',         icon: Server        },
  { name: 'Power Supply',    path: '/developer/power-supply',   icon: Zap           },
  { name: 'Temperature',     path: '/developer/temperature',    icon: Thermometer   },
];

export default function DeveloperLayout() {
  const navigate  = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const auth     = JSON.parse(localStorage.getItem('urbanflow_auth') || '{}');
  const initials = auth.email ? auth.email.slice(0, 2).toUpperCase() : 'DV';

  const handleLogout = () => {
    localStorage.removeItem('urbanflow_auth');
    navigate('/login');
  };

  return (
    <div className="app-layout">
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`} aria-label="Developer Navigation">
        <div className="sidebar-header">
          <NavLink to="/developer/logs" className="sidebar-logo" title="Developer Console">
            <div className="logo-icon-box" style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)' }}>
              <Code2 size={16} color="#fff" strokeWidth={2.5} />
            </div>
            <div className="logo-text-group">
              <span className="logo-brand">Dev Console</span>
              <span className="logo-sub">System Diagnostics</span>
            </div>
          </NavLink>
          <button
            type="button"
            className="sidebar-toggle-btn"
            onClick={() => setCollapsed(c => !c)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {DEV_NAV.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
                data-tooltip={item.name}
                title={collapsed ? item.name : undefined}
              >
                <Icon size={16} className="nav-icon" />
                <span className="nav-label">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div
            className="user-avatar"
            style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)' }}
            title={auth.email}
          >
            {initials}
          </div>
          <div className="user-meta">
            <span className="user-name">{auth.email || 'Developer'}</span>
            <span className="user-role" style={{ color: '#8B5CF6' }}>Developer</span>
          </div>
          {!collapsed && (
            <button
              type="button"
              className="sidebar-toggle-btn"
              style={{ marginLeft: 'auto' }}
              onClick={handleLogout}
              title="Sign out"
            >
              <LogOut size={14} />
            </button>
          )}
        </div>
      </aside>

      <div className="main-wrapper">
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
