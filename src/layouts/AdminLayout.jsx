import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { INITIAL_ALERTS } from '../data/demoData';

export default function AdminLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('subhash-chowk');

  // Load alerts from localStorage or initialize with demoData
  const [alerts, setAlerts] = useState(() => {
    try {
      const saved = localStorage.getItem('urbanflow_alerts');
      return saved ? JSON.parse(saved) : INITIAL_ALERTS;
    } catch {
      return INITIAL_ALERTS;
    }
  });

  // Sync alerts to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('urbanflow_alerts', JSON.stringify(alerts));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [alerts]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const activeAlertCount = alerts.filter(a => a.status === 'active').length;

  return (
    <div className="app-layout">
      {/* Fixed Collapsible Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        activeAlertCount={activeAlertCount}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Header
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          alerts={alerts}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="page-content">
          <Outlet context={{ selectedLocation, setSelectedLocation, alerts, setAlerts }} />
        </main>
      </div>
    </div>
  );
}
