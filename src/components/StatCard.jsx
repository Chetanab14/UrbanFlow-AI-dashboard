import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  variant = 'primary',
  trend,
  progress,
  demoLabel = 'Simulated'
}) {
  const iconVariantClass = `stat-icon-${variant}`;
  
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <div className={`stat-icon-wrapper ${iconVariantClass}`}>
          {Icon && <Icon size={20} strokeWidth={2} />}
        </div>
        <span className="badge-demo">{demoLabel}</span>
      </div>

      <div className="stat-value-group">
        <span className="stat-label">{title}</span>
        <span className="stat-value">{value}</span>
      </div>

      {progress !== undefined && (
        <div className="stat-progress-bar-bg">
          <div 
            className="stat-progress-bar-fill"
            style={{ 
              width: `${Math.min(100, Math.max(0, progress))}%`,
              backgroundColor: variant === 'critical' ? 'var(--color-critical)' : 
                               variant === 'warning' ? 'var(--color-warning)' : 
                               variant === 'teal' ? 'var(--color-teal)' : 'var(--color-primary)'
            }} 
          />
        </div>
      )}

      {(subtext || trend) && (
        <div className="stat-subtext">
          {trend && (
            <span className={trend.direction === 'up' ? 'stat-trend-up' : 'stat-trend-down'}>
              {trend.direction === 'up' ? <ArrowUpRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> : <ArrowDownRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />}
              {trend.label}
            </span>
          )}
          {subtext && <span>{subtext}</span>}
        </div>
      )}
    </div>
  );
}
