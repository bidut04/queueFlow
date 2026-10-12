import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, XCircle, MessageSquare } from 'lucide-react';
import type { Organization } from '../../types/platform';

export type ApprovalActionType = 'APPROVE' | 'HOLD' | 'REJECT' | 'REMARKS';

interface ApprovalActionModalProps {
  isOpen: boolean;
  actionType: ApprovalActionType;
  organization: Organization | null;
  onClose: () => void;
  onConfirm: (orgId: string, remarks: string) => void;
}

export const ApprovalActionModal: React.FC<ApprovalActionModalProps> = ({
  isOpen,
  actionType,
  organization,
  onClose,
  onConfirm
}) => {
  const [remarks, setRemarks] = useState(organization?.remarks || '');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !organization) return null;

  const getActionConfig = () => {
    switch (actionType) {
      case 'APPROVE':
        return {
          title: 'Approve Organization Registration',
          description: `Activate ${organization.name} and provision operational tenant environment.`,
          icon: <CheckCircle2 size={20} color="#059669" />,
          btnText: 'Confirm & Approve',
          btnBg: '#059669',
          requireRemarks: false,
          placeholderRemarks: 'Optional approval notes (e.g. Verified documentation and approved for production)'
        };
      case 'HOLD':
        return {
          title: 'Place Application On Hold',
          description: `Temporarily hold ${organization.name}. The organization admin will see your remarks.`,
          icon: <AlertTriangle size={20} color="#ea580c" />,
          btnText: 'Place On Hold',
          btnBg: '#ea580c',
          requireRemarks: true,
          placeholderRemarks: 'Specify required documents or verification needed (e.g. Please upload business license)'
        };
      case 'REJECT':
        return {
          title: 'Reject Organization Registration',
          description: `Decline registration for ${organization.name}. Provide a clear reason.`,
          icon: <XCircle size={20} color="#dc2626" />,
          btnText: 'Confirm Rejection',
          btnBg: '#dc2626',
          requireRemarks: true,
          placeholderRemarks: 'Specify rejection justification (e.g. Duplicate entity or incomplete verification)'
        };
      case 'REMARKS':
      default:
        return {
          title: 'Edit Review Remarks',
          description: `Update administrative remarks for ${organization.name}.`,
          icon: <MessageSquare size={20} color="#4f46e5" />,
          btnText: 'Save Remarks',
          btnBg: '#4f46e5',
          requireRemarks: false,
          placeholderRemarks: 'Internal audit notes or reviewer remarks'
        };
    }
  };

  const config = getActionConfig();

  const handleAction = () => {
    setError(null);
    if (config.requireRemarks && !remarks.trim()) {
      setError('Remarks are required for this action so the organization admin understands next steps.');
      return;
    }
    onConfirm(organization.id, remarks.trim());
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
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: 16
      }}
    >
      <div
        className="qf-card"
        style={{
          width: '100%',
          maxWidth: 520,
          backgroundColor: '#ffffff',
          borderRadius: 12,
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          padding: 22,
          display: 'flex',
          flexDirection: 'column',
          gap: 16
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {config.icon}
            <div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a' }}>
                {config.title}
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: 11, color: '#64748b' }}>
                {config.description}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4 }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Organization summary chip */}
        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: '10px 12px', fontSize: 11.5, color: '#334155' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span><strong>Organization:</strong> {organization.name}</span>
            <span style={{ fontWeight: 700, color: organization.plan === 'Free' ? '#059669' : '#4f46e5' }}>{organization.plan} Plan</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span><strong>Contact:</strong> {organization.contactEmail}</span>
            <span><strong>Current Status:</strong> <code style={{ fontWeight: 700 }}>{organization.status}</code></span>
          </div>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', fontSize: 11, padding: '6px 10px', borderRadius: 5 }}>
            {error}
          </div>
        )}

        {/* Remarks Input */}
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
            Reviewer Remarks / Feedback {config.requireRemarks && <span style={{ color: '#ef4444' }}>*</span>}
          </label>
          <textarea
            rows={4}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder={config.placeholderRemarks}
            style={{
              width: '100%',
              padding: '8px 10px',
              border: '1px solid #cbd5e1',
              borderRadius: 6,
              fontSize: 12,
              color: '#0f172a',
              outline: 'none',
              boxSizing: 'border-box',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              backgroundColor: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: 6,
              padding: '6px 14px',
              fontSize: 11.5,
              fontWeight: 700,
              color: '#475569',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAction}
            style={{
              backgroundColor: config.btnBg,
              color: '#ffffff',
              border: 'none',
              borderRadius: 6,
              padding: '6px 16px',
              fontSize: 11.5,
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            {config.btnText}
          </button>
        </div>
      </div>
    </div>
  );
};
