import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { platformStore } from '../services/platformState';
import { useSuspendOrganization } from '../hooks';
import type { Organization } from '../types/platform';
import { toast } from '../../../components/ui/Toast';

interface SuspendOrganizationModalProps {
  organization: Organization | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SuspendOrganizationModal: React.FC<SuspendOrganizationModalProps> = ({
  organization,
  isOpen,
  onClose,
  onSuccess
}) => {
  const suspendMutation = useSuspendOrganization();
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !organization) return null;

  const handleConfirmSuspend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('A suspension reason is mandatory for audit compliance.');
      return;
    }

    try {
      await suspendMutation.mutateAsync({
        id: organization.id,
        reason: reason.trim()
      });
      toast.success(`Organization "${organization.name}" has been suspended.`);
    } catch (err: any) {
      toast.fromApiError(err, 'Failed to suspend organization');
    }

    await platformStore.suspendOrganization(organization.id, reason.trim());
    setReason('');
    setError('');
    onSuccess();
    onClose();
  };



  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: 20
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 520,
          backgroundColor: '#ffffff',
          borderRadius: 12,
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 24px',
            backgroundColor: '#ef4444',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <AlertTriangle size={22} color="#ffffff" />
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>
              Suspend Organization "{organization.name}"?
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', padding: 4 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleConfirmSuspend} style={{ padding: 24 }}>
          <div style={{ padding: 12, backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, marginBottom: 16 }}>
            <p style={{ margin: 0, fontSize: 12, color: '#991b1b', lineHeight: '1.5' }}>
              <strong>Lifecycle Notice:</strong> Suspending an organization disables API ingress, halts active queues, and blocks tenant admin logons. <strong>Tenant data will NOT be deleted.</strong>
            </p>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
              Suspension Reason (Mandatory for Audit Trail) *
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Payment invoice overdue by 45 days / Security compliance hold..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError('');
              }}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: error ? '2px solid #ef4444' : '1px solid #cbd5e1',
                borderRadius: 6,
                fontSize: 13,
                outline: 'none'
              }}
            />
            {error && <p style={{ margin: '4px 0 0 0', fontSize: 11, color: '#ef4444', fontWeight: 600 }}>{error}</p>}
          </div>

          <div style={{ padding: 10, backgroundColor: '#f8fafc', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 11, color: '#64748b', marginBottom: 20 }}>
            <div><strong>Target Organization ID:</strong> {organization.id}</div>
            <div><strong>Current Status:</strong> {organization.status} → <strong>SUSPENDED</strong></div>
            <div><strong>Target Shard:</strong> {organization.currentShard}</div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                padding: '8px 16px',
                borderRadius: 6,
                fontSize: 12.5,
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                backgroundColor: '#dc2626',
                color: '#ffffff',
                border: 'none',
                padding: '8px 18px',
                borderRadius: 6,
                fontSize: 12.5,
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(220,38,38,0.3)'
              }}
            >
              Suspend Organization
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
