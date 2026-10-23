import React from 'react';
import { Calendar, CheckCircle2, AlertTriangle, Clock3, TrendingUp, TrendingDown } from 'lucide-react';
import type { BookingKPIStats } from '../types/portalBooking';

interface BookingKPIHeaderProps {
  stats: BookingKPIStats;
}

export const BookingKPIHeader: React.FC<BookingKPIHeaderProps> = ({ stats }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16,
        marginBottom: 20
      }}
    >
      {/* 1. Total Appointment */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 14,
          padding: '16px 20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>Total Appointment</span>
            <span
              title="All appointments scheduled for this period"
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                backgroundColor: '#f1f5f9',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                color: '#94a3b8',
                cursor: 'help'
              }}
            >
              i
            </span>
          </div>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Calendar size={16} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            {stats.totalAppointments}
          </span>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 12,
              fontWeight: 700,
              color: '#059669',
              backgroundColor: '#ecfdf5',
              padding: '2px 8px',
              borderRadius: 20
            }}
          >
            <TrendingUp size={12} />
            <span>+12%</span>
            <span style={{ fontSize: 11, fontWeight: 500, color: '#64748b' }}>vs last week</span>
          </div>
        </div>
      </div>

      {/* 2. Compl. Appointment */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 14,
          padding: '16px 20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>Compl. Appointment</span>
            <span
              title="Percentage of appointments successfully completed"
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                backgroundColor: '#f1f5f9',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                color: '#94a3b8',
                cursor: 'help'
              }}
            >
              i
            </span>
          </div>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              backgroundColor: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CheckCircle2 size={16} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            {stats.completedPercent}%
          </span>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 12,
              fontWeight: 700,
              color: '#059669',
              backgroundColor: '#ecfdf5',
              padding: '2px 8px',
              borderRadius: 20
            }}
          >
            <TrendingUp size={12} />
            <span>+12%</span>
            <span style={{ fontSize: 11, fontWeight: 500, color: '#64748b' }}>vs last week</span>
          </div>
        </div>
      </div>

      {/* 3. No Show Appointment */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 14,
          padding: '16px 20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>No Show Appointment</span>
            <span
              title="Customers who missed their appointed queue call"
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                backgroundColor: '#f1f5f9',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                color: '#94a3b8',
                cursor: 'help'
              }}
            >
              i
            </span>
          </div>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              backgroundColor: '#fff7ed',
              color: '#ea580c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <AlertTriangle size={16} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            {stats.noShowPercent}%
          </span>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 12,
              fontWeight: 700,
              color: '#ea580c',
              backgroundColor: '#fff7ed',
              padding: '2px 8px',
              borderRadius: 20
            }}
          >
            <TrendingUp size={12} />
            <span>+12%</span>
            <span style={{ fontSize: 11, fontWeight: 500, color: '#64748b' }}>vs last week</span>
          </div>
        </div>
      </div>

      {/* 4. Avg. Waitlist Time */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 14,
          padding: '16px 20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>Avg. Waitlist Time</span>
            <span
              title="Average time customer spent in waiting queue before being called"
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                backgroundColor: '#f1f5f9',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                color: '#94a3b8',
                cursor: 'help'
              }}
            >
              i
            </span>
          </div>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              backgroundColor: '#f5f3ff',
              color: '#7c3aed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Clock3 size={16} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            {stats.avgWaitlistHours} <span style={{ fontSize: 18, fontWeight: 600, color: '#64748b' }}>hrs</span>
          </span>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 12,
              fontWeight: 700,
              color: '#0284c7',
              backgroundColor: '#f0f9ff',
              padding: '2px 8px',
              borderRadius: 20
            }}
          >
            <TrendingDown size={12} />
            <span>-6%</span>
            <span style={{ fontSize: 11, fontWeight: 500, color: '#64748b' }}>vs last week</span>
          </div>
        </div>
      </div>
    </div>
  );
};
