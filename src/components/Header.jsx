import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Bell,
  MapPin,
  ChevronDown,
  Activity,
  ShieldCheck,
  User,
  Settings,
  LogOut,
  AlertTriangle,
  Menu,
  Clock,
  ExternalLink
} from 'lucide-react';
import { LOCATIONS } from '../data/demoData';

export default function Header({
  selectedLocation,
  setSelectedLocation,
  alerts = [],
  onOpenMobileMenu
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute breadcrumbs and title
  const getPageMeta = () => {
    switch (location.pathname) {
      case '/':
        return { title: 'Traffic Control Dashboard', breadcrumb: 'UrbanFlow / Dashboard' };
      case '/cameras':
        return { title: 'Live Camera Network', breadcrumb: 'UrbanFlow / Live Cameras' };
      case '/analytics':
        return { title: 'Traffic Analytics & Flow', breadcrumb: 'UrbanFlow / Analytics' };
      case '/reports':
        return { title: 'Traffic Reports & Audits', breadcrumb: 'UrbanFlow / Reports' };
      case '/alerts':
        return { title: 'Incident & Emergency Control', breadcrumb: 'UrbanFlow / Alert & Emergency' };
      case '/settings':
        return { title: 'System & Signal Settings', breadcrumb: 'UrbanFlow / Setting' };
      default:
        return { title: 'Traffic Management', breadcrumb: 'UrbanFlow / Control' };
    }
  };

  const { title, breadcrumb } = getPageMeta();
  const unreadAlerts = alerts.filter(a => a.status === 'active');

  const handleLogout = () => {
    localStorage.removeItem('urbanflow_auth');
    navigate('/login');
  };

  return (
    <header className="top-header">
      {/* Left Area: Mobile hamburger & Page Title */}
      <div className="header-left">
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={onOpenMobileMenu}
          aria-label="Toggle Navigation"
        >
          <Menu size={22} />
        </button>

        <div className="header-page-title-group">
          <h1 className="header-page-title">{title}</h1>
          <span className="header-breadcrumbs">{breadcrumb}</span>
        </div>
      </div>

      {/* Right Area: Location, AI status, Notifications, Officer Profile */}
      <div className="header-right">
        {/* Location selector for Shirpur, Maharashtra */}
        <div className="location-selector" title="Select monitoring sector in Shirpur">
          <MapPin size={16} color="var(--color-primary)" />
          <span>Shirpur, MH:</span>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            aria-label="Select Traffic Junction"
          >
            {LOCATIONS.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        {/* System Status Pill */}
        <div className="system-status-indicator" title="Edge AI inference nodes operating nominally">
          <span className="status-pulse-dot" />
          <span>Live AI Engine: Optimal</span>
        </div>

        {/* Notifications Icon and Dropdown */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            type="button"
            className="header-action-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Real-time Incident Alerts"
            aria-label="View Traffic Alerts"
          >
            <Bell size={18} />
            {unreadAlerts.length > 0 && (
              <span className="notification-count-badge">
                {unreadAlerts.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-navy)' }}>
                    Active Incidents
                  </h4>
                  <p style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
                    {unreadAlerts.length} unresolved notifications
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    setShowNotifications(false);
                    navigate('/alerts');
                  }}
                >
                  View All
                </button>
              </div>

              <div className="notification-list">
                {alerts.slice(0, 4).map((alert) => (
                  <div
                    key={alert.id}
                    className={`notification-item ${alert.severity}`}
                    onClick={() => {
                      setShowNotifications(false);
                      navigate('/alerts');
                    }}
                  >
                    <div style={{ marginTop: 2 }}>
                      <AlertTriangle
                        size={16}
                        color={alert.severity === 'critical' ? 'var(--color-critical)' : 'var(--color-warning)'}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-navy)' }}>
                          {alert.type}
                        </span>
                        <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>
                          {alert.timestamp.split(' ')[0]}
                        </span>
                      </div>
                      <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2, lineHeight: 1.3 }}>
                        {alert.description.substring(0, 75)}...
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-teal)' }}>
                          {alert.junction}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ padding: '8px 12px', borderTop: '1px solid var(--color-border)', textAlign: 'center', backgroundColor: '#FAFAFA' }}>
                <Link
                  to="/alerts"
                  style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }}
                  onClick={() => setShowNotifications(false)}
                >
                  Open Incident Dispatch Console →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu Trigger and Dropdown */}
        <div style={{ position: 'relative' }} ref={profileRef}>
          <button
            type="button"
            className="officer-profile-menu-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            aria-label="Officer Profile Menu"
          >
            <div className="officer-header-avatar">VP</div>
            <span className="officer-header-name">Admin Officer</span>
            <ChevronDown size={14} color="#64748B" />
          </button>

          {showProfileMenu && (
            <div className="profile-dropdown-menu">
              <div className="profile-dropdown-header">
                <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--color-navy)' }}>
                  Officer Vikram Patil
                </div>
                <div style={{ fontSize: 11, color: 'var(--color-teal)', fontWeight: 600 }}>
                  Badge #UF-MH18-402
                </div>
                <div style={{ fontSize: 10, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                  Shirpur Traffic Control Station 1
                </div>
              </div>

              <div className="profile-dropdown-nav">
                <button
                  type="button"
                  className="profile-nav-btn"
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/settings');
                  }}
                >
                  <User size={15} />
                  <span>Officer Profile</span>
                </button>
                <button
                  type="button"
                  className="profile-nav-btn"
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/settings');
                  }}
                >
                  <Settings size={15} />
                  <span>Control Settings</span>
                </button>
                <div style={{ height: 1, backgroundColor: 'var(--color-border)', margin: '4px 0' }} />
                <button
                  type="button"
                  className="profile-nav-btn logout-btn"
                  onClick={handleLogout}
                >
                  <LogOut size={15} />
                  <span>Sign Out Console</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
