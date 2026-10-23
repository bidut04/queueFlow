import React from 'react';
import {
  X,
  CheckCircle2,
  PlayCircle,
  XCircle,
  Trash2
} from 'lucide-react';
import type { PortalAppointment, AppointmentStatus } from '../types/portalBooking';

interface BookingDetailModalProps {
  appointment: PortalAppointment | null;
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: AppointmentStatus) => void;
  onDelete: (id: string) => void;
}

export const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  appointment,
  onClose,
  onUpdateStatus,
  onDelete,
}) => {
  if (!appointment) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          backgroundColor: '#ffffff',
          borderRadius: 16,
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                fontSize: 13,
                fontWeight: 900,
                padding: '3px 8px',
                borderRadius: 6,
              }}
            >
              #{appointment.ticketNumber}
            </span>
            <span style={{ fontSize: 14, fontWeight: 700 }}>Appointment Details</span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              border: 'none',
              background: 'transparent',
              color: '#94a3b8',
              cursor: 'pointer',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: 20 }}>
          {/* Customer highlight */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
              paddingBottom: 16,
              borderBottom: '1px solid #f1f5f9',
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
                {appointment.customerName}
              </h3>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                {appointment.customerPhone || 'No phone recorded'} • {appointment.customerEmail || 'No email recorded'}
              </div>
            </div>

            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: 20,
                backgroundColor:
                  appointment.status === 'Done'
                    ? '#dcfce7'
                    : appointment.status === 'On-going'
                    ? '#fef3c7'
                    : '#e0f2fe',
                color:
                  appointment.status === 'Done'
                    ? '#15803d'
                    : appointment.status === 'On-going'
                    ? '#b45309'
                    : '#0369a1',
              }}
            >
              {appointment.status}
            </span>
          </div>

          {/* Details list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Service:</span>
              <span style={{ fontWeight: 700, color: '#0f172a' }}>{appointment.serviceName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Assigned Specialist:</span>
              <span style={{ fontWeight: 700, color: '#0f172a' }}>{appointment.staffName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Scheduled Window:</span>
              <span style={{ fontWeight: 700, color: '#0f172a' }}>{appointment.timeSlotFormatted}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Branch:</span>
              <span style={{ fontWeight: 700, color: '#0f172a' }}>{appointment.branchName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Queue Source:</span>
              <span style={{ fontWeight: 600, color: '#475569' }}>
                {appointment.isWalkIn ? 'Walk-in Desk' : 'Online Digital Pass'}
              </span>
            </div>
          </div>

          {/* Status Actions Bar */}
          <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
              Update Queue Status
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 8 }}>
              <button
                onClick={() => onUpdateStatus(appointment.id, 'On-going')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  padding: '8px 10px',
                  borderRadius: 8,
                  backgroundColor: '#fef3c7',
                  color: '#b45309',
                  border: '1px solid #fde68a',
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                <PlayCircle size={14} />
                <span>Call In / Serving</span>
              </button>

              <button
                onClick={() => onUpdateStatus(appointment.id, 'Done')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  padding: '8px 10px',
                  borderRadius: 8,
                  backgroundColor: '#dcfce7',
                  color: '#15803d',
                  border: '1px solid #bbf7d0',
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                <CheckCircle2 size={14} />
                <span>Mark Done</span>
              </button>

              <button
                onClick={() => onUpdateStatus(appointment.id, 'No-show')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  padding: '8px 10px',
                  borderRadius: 8,
                  backgroundColor: '#fee2e2',
                  color: '#b91c1c',
                  border: '1px solid #fecaca',
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                <XCircle size={14} />
                <span>No-show</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '12px 20px',
            backgroundColor: '#f8fafc',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <button
            onClick={() => {
              if (window.confirm('Cancel and delete this booking?')) {
                onDelete(appointment.id);
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              border: 'none',
              background: 'transparent',
              color: '#ef4444',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Trash2 size={14} />
            <span>Cancel Booking</span>
          </button>

          <button
            onClick={onClose}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#475569',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
