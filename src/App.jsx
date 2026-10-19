import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import DeveloperLayout from './layouts/DeveloperLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DeveloperDashboard from './pages/DeveloperDashboard';
import LiveCameras from './pages/LiveCameras';
import Analytics from './pages/Analytics';
import Report from './pages/Report';
import AlertsEmergency from './pages/AlertsEmergency';
import Settings from './pages/Settings';

/* ─── Auth helpers ──────────────────────────────────────── */
function getAuth() {
  try { return JSON.parse(localStorage.getItem('urbanflow_auth') || '{}'); }
  catch { return {}; }
}

function ProtectedRoute({ children }) {
  const auth = getAuth();
  if (!auth.authenticated) return <Navigate to="/login" replace />;
  return children;
}

/* Index route: developer → /developer/logs, others → /dashboard */
function RootRedirect() {
  const auth = getAuth();
  if (!auth.authenticated) return <Navigate to="/login" replace />;
  if (auth.role === 'developer') return <Navigate to="/developer/logs" replace />;
  return <Dashboard />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* ── Developer console (own layout + sidebar) ── */}
        <Route
          path="/developer"
          element={
            <ProtectedRoute>
              <DeveloperLayout />
            </ProtectedRoute>
          }
        >
          {/* Default: redirect to logs */}
          <Route index element={<Navigate to="logs" replace />} />
          {/* All 7 dev sections share one DeveloperDashboard component */}
          <Route path=":section" element={<DeveloperDashboard />} />
        </Route>

        {/* ── Admin layout ───────────────────────────── */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Index: role-aware redirect */}
          <Route index element={<RootRedirect />} />

          {/* Standard pages */}
          <Route path="cameras"   element={<LiveCameras />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="reports"   element={<Report />} />
          <Route path="alerts"    element={<AlertsEmergency />} />
          <Route path="settings"  element={<Settings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
