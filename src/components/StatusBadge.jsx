import React from 'react';

export default function StatusBadge({ status, label, showDot = true }) {
  const normStatus = (status || '').toLowerCase();
  
  let badgeClass = 'badge-info';
  let displayLabel = label || status;

  if (normStatus === 'online' || normStatus === 'ready' || normStatus === 'resolved' || normStatus === 'normal') {
    badgeClass = 'badge-online';
  } else if (normStatus === 'offline' || normStatus === 'archived') {
    badgeClass = 'badge-offline';
  } else if (normStatus === 'critical' || normStatus === 'heavy' || normStatus === 'active') {
    badgeClass = 'badge-critical';
  } else if (normStatus === 'warning' || normStatus === 'moderate' || normStatus === 'acknowledged') {
    badgeClass = 'badge-warning';
  } else if (normStatus === 'info' || normStatus === 'informational') {
    badgeClass = 'badge-info';
  }

  return (
    <span className={`badge ${badgeClass}`}>
      {showDot && <span className="badge-dot" />}
      {displayLabel}
    </span>
  );
}
