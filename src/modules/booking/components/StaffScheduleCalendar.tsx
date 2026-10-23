import React from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Scissors,
  Users,
  Ticket,
  FileText,
  Bell,
  MoreVertical
} from 'lucide-react';
import type { StaffResource, PortalAppointment, AppointmentStatus } from '../types/portalBooking';

interface StaffScheduleCalendarProps {
  staffList: StaffResource[];
  appointments: PortalAppointment[];
  onSelectAppointment: (appointment: PortalAppointment) => void;
  onSlotClick: (staff: StaffResource, hour: number) => void;
}

// 9:00 AM to 5:00 PM time slots (hours 9 to 17)
const TIME_SLOTS = [
  { hour: 9, label: '9:00 am' },
  { hour: 10, label: '10:00 am' },
  { hour: 11, label: '11:00 am' },
  { hour: 12, label: '12:00 pm' },
  { hour: 13, label: '1:00 pm' },
  { hour: 14, label: '2:00 pm' },
  { hour: 15, label: '3:00 pm' },
  { hour: 16, label: '4:00 pm' },
  { hour: 17, label: '5:00 pm' },
];

export const StaffScheduleCalendar: React.FC<StaffScheduleCalendarProps> = ({
  staffList,
  appointments,
  onSelectAppointment,
  onSlotClick,
}) => {
  // Helper to calculate top position and height inside an hourly grid
  // Each hour row is 100px high
  const HOUR_HEIGHT = 90;

  const getStatusBadgeStyle = (status: AppointmentStatus) => {
    switch (status) {
      case 'Done':
        return {
          backgroundColor: '#dcfce7',
          color: '#15803d',
          borderColor: '#bbf7d0',
          label: 'Done',
        };
      case 'On-going':
        return {
          backgroundColor: '#fef3c7',
          color: '#b45309',
          borderColor: '#fde68a',
          label: 'On-going',
        };
      case 'Waiting':
        return {
          backgroundColor: '#e0f2fe',
          color: '#0369a1',
          borderColor: '#bae6fd',
          label: 'Waiting',
        };
      case 'Confirmed':
        return {
          backgroundColor: '#f3e8ff',
          color: '#7e22ce',
          borderColor: '#e9d5ff',
          label: 'Confirmed',
        };
      default:
        return {
          backgroundColor: '#f1f5f9',
          color: '#475569',
          borderColor: '#e2e8f0',
          label: status,
        };
    }
  };

  const getCardStyle = (status: AppointmentStatus) => {
    switch (status) {
      case 'Done':
        return {
          backgroundColor: '#dcfce7',
          borderLeft: '4px solid #22c55e',
          color: '#14532d',
        };
      case 'On-going':
        return {
          backgroundColor: '#fef3c7',
          borderLeft: '4px solid #f59e0b',
          color: '#78350f',
        };
      case 'Waiting':
        return {
          backgroundColor: '#e0f2fe',
          borderLeft: '4px solid #0284c7',
          color: '#0c4a6e',
        };
      case 'Confirmed':
        return {
          backgroundColor: '#f3e8ff',
          borderLeft: '4px solid #a855f7',
          color: '#581c87',
        };
      default:
        return {
          backgroundColor: '#f8fafc',
          borderLeft: '4px solid #94a3b8',
          color: '#1e293b',
        };
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        backgroundColor: '#ffffff',
        borderRadius: 14,
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)',
        overflow: 'hidden',
        minHeight: 820,
      }}
    >
      {/* 1. Left Dark Mini-Rail (Matching Screenshot 1) */}
      <div
        style={{
          width: 52,
          backgroundColor: '#111827',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 16,
          paddingBottom: 16,
          justifyContent: 'space-between',
          flexShrink: 0,
          borderRight: '1px solid #1f2937',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          {/* Logo Icon */}
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              backgroundColor: '#2563eb',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 16,
            }}
          >
            B
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
              marginTop: 10,
            }}
          >
            <button
              title="Calendar"
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CalendarIcon size={18} />
            </button>
            <button
              title="Time Clock"
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                backgroundColor: 'transparent',
                border: 'none',
                color: '#9ca3af',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Clock size={18} />
            </button>
            <button
              title="Services"
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                backgroundColor: 'transparent',
                border: 'none',
                color: '#9ca3af',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Scissors size={18} />
            </button>
            <button
              title="Staff & Customers"
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                backgroundColor: 'transparent',
                border: 'none',
                color: '#9ca3af',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Users size={18} />
            </button>
            <button
              title="Tickets"
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                backgroundColor: 'transparent',
                border: 'none',
                color: '#9ca3af',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ticket size={18} />
            </button>
            <button
              title="Records"
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                backgroundColor: 'transparent',
                border: 'none',
                color: '#9ca3af',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileText size={18} />
            </button>
          </div>
        </div>

        {/* Bottom user profile & alerts */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <button
            title="Alerts"
            style={{
              position: 'relative',
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#9ca3af',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Bell size={16} />
            <span
              style={{
                position: 'absolute',
                top: 4,
                right: 4,
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: '#ef4444',
              }}
            />
          </button>
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&auto=format&fit=crop&q=80"
            alt="Profile"
            style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
          />
        </div>
      </div>

      {/* 2. Main Schedule Grid Container */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowX: 'auto' }}>
        {/* Header Row: Staff Resource Columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `80px repeat(${staffList.length}, minmax(210px, 1fr))`,
            borderBottom: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          {/* Time corner header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRight: '1px solid #f1f5f9',
              color: '#94a3b8',
            }}
          >
            <Users size={16} />
          </div>

          {/* Staff Member Header Cards */}
          {staffList.map((staff) => (
            <div
              key={staff.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRight: '1px solid #f1f5f9',
                backgroundColor: '#ffffff',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                {/* Staff Avatar with Online Indicator */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <img
                    src={
                      staff.avatarUrl ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                    }
                    alt={staff.name}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #ffffff',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }}
                  />
                  {staff.isOnline && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: '#10b981',
                        border: '2px solid #ffffff',
                      }}
                    />
                  )}
                </div>

                {/* Name & Title */}
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: '#0f172a',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {staff.name}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: '#64748b',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {staff.roleTitle}
                  </div>
                </div>
              </div>

              <button
                aria-label="Staff Options"
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <MoreVertical size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Timetable Body Grid */}
        <div style={{ position: 'relative', flex: 1 }}>
          {TIME_SLOTS.map((slot) => (
            <div
              key={slot.hour}
              style={{
                display: 'grid',
                gridTemplateColumns: `80px repeat(${staffList.length}, minmax(210px, 1fr))`,
                height: HOUR_HEIGHT,
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              {/* Hour Label */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  paddingTop: 8,
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#64748b',
                  borderRight: '1px solid #f1f5f9',
                  backgroundColor: '#fafbfc',
                  userSelect: 'none',
                }}
              >
                <span>{slot.label.split(' ')[0]}</span>
                <span style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase' }}>
                  {slot.label.split(' ')[1]}
                </span>
              </div>

              {/* Slot cell for each staff column */}
              {staffList.map((staff) => (
                <div
                  key={`${slot.hour}-${staff.id}`}
                  onClick={() => onSlotClick(staff, slot.hour)}
                  style={{
                    borderRight: '1px solid #f1f5f9',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                />
              ))}
            </div>
          ))}

          {/* Render Appointments as Absolute Floating Cards over Grid */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 80,
              right: 0,
              bottom: 0,
              display: 'grid',
              gridTemplateColumns: `repeat(${staffList.length}, minmax(210px, 1fr))`,
              pointerEvents: 'none',
            }}
          >
            {staffList.map((staff) => {
              // Find appointments assigned to this staff member
              const staffAppts = appointments.filter((a) => a.staffId === staff.id);

              return (
                <div key={staff.id} style={{ position: 'relative', height: '100%' }}>
                  {staffAppts.map((appt) => {
                    // Calculate start time in fractional hours relative to 9:00 AM
                    const [startH, startM] = appt.startTime.split(':').map(Number);
                    const [endH, endM] = appt.endTime.split(':').map(Number);

                    const startOffsetHours = startH + startM / 60 - 9;
                    const durationHours = endH + endM / 60 - (startH + startM / 60);

                    // Clamp to visible range
                    if (startOffsetHours < 0 || startOffsetHours > 9) return null;

                    const topPx = startOffsetHours * HOUR_HEIGHT + 4;
                    const heightPx = Math.max(durationHours * HOUR_HEIGHT - 8, 48);

                    const badge = getStatusBadgeStyle(appt.status);
                    const cardStyle = getCardStyle(appt.status);

                    return (
                      <div
                        key={appt.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAppointment(appt);
                        }}
                        style={{
                          position: 'absolute',
                          top: topPx,
                          left: 6,
                          right: 6,
                          height: heightPx,
                          borderRadius: 8,
                          padding: '8px 10px',
                          boxShadow: '0 2px 6px rgba(15, 23, 42, 0.06)',
                          cursor: 'pointer',
                          pointerEvents: 'auto',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                          ...cardStyle,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = '0 6px 14px rgba(15, 23, 42, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 6px rgba(15, 23, 42, 0.06)';
                        }}
                      >
                        {/* Header: Time Slot + Status Pill Badge */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: 4,
                          }}
                        >
                          <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.85 }}>
                            {appt.timeSlotFormatted}
                          </span>
                          <span
                            style={{
                              fontSize: 9,
                              fontWeight: 800,
                              padding: '2px 6px',
                              borderRadius: 10,
                              backgroundColor: badge.backgroundColor,
                              color: badge.color,
                              border: `1px solid ${badge.borderColor}`,
                              textTransform: 'capitalize',
                            }}
                          >
                            {badge.label}
                          </span>
                        </div>

                        {/* Customer Name */}
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 800,
                            lineHeight: 1.2,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {appt.customerName}
                        </div>

                        {/* Service Name */}
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            opacity: 0.85,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {appt.serviceName}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
