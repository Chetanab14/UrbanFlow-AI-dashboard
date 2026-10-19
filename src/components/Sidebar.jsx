import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Video,
  BarChart3,
  FileText,
  AlertTriangle,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Radio
} from 'lucide-react';

export default function Sidebar({ collapsed, setCollapsed, activeAlertCount = 2 }) {
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Live Cameras', path: '/cameras', icon: Video },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Report', path: '/reports', icon: FileText },
    { name: 'Alert & Emergency', path: '/alerts', icon: AlertTriangle, badge: activeAlertCount },
    { name: 'Setting', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem('urbanflow_auth');
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`} aria-label="Main Navigation">
      {/* Sidebar Header Brand */}
      <div className="sidebar-header">
        <NavLink to="/" className="sidebar-logo" title="UrbanFlow AI">
          <div className="logo-icon-box">
            <Radio size={16} color="#FFFFFF" strokeWidth={2.5} />
          </div>
          <div className="logo-text-group">
            <span className="logo-brand">UrbanFlow AI</span>
            <span className="logo-sub">Traffic Control</span>
          </div>
        </NavLink>
        <button
          type="button"
          className="sidebar-toggle-btn"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* Six Navigation Items */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
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
              {item.badge && item.badge > 0 && (
                <span className="nav-badge-pill">{item.badge}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom User Profile Section */}
      <div className="sidebar-footer">
        <div className="user-avatar" title="Officer Vikram Patil">
          VP
        </div>
        <div className="user-meta">
          <span className="user-name">Admin Officer</span>
          <span className="user-role">Traffic Control</span>
        </div>
        {!collapsed && (
          <button
            type="button"
            className="sidebar-toggle-btn"
            style={{ marginLeft: 'auto' }}
            onClick={handleLogout}
            title="Sign out of console"
          >
            <LogOut size={14} />
          </button>
        )}
      </div>
    </aside>
  );
}
