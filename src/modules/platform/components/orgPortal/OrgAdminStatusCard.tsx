import React from 'react';
import {
  Clock,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Building2,
  CreditCard,
  Server,
  User,
  ArrowRight,
  LogOut,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import type { Organization } from '../../types/platform';
import type { OrgAdminUser } from '../../services/orgAdminAuthStore';

interface OrgAdminStatusCardProps {
  user: OrgAdminUser;
  organization: Organization;
  onSignOut: () => void;
  onEditRegistration: () => void;
  onEnterTenantDashboard: (org: Organization) => void;
  onOpenSuperAdminTower: () => void;
}

export const OrgAdminStatusCard: React.FC<OrgAdminStatusCardProps> = ({
  user,
  organization,
  onSignOut,
  onEditRegistration,
  onEnterTenantDashboard,
  onOpenSuperAdminTower
}) => {
  const status = organization.status;

  const renderStatusBanner = () => {
    switch (status) {
      case 'PENDING':
        return (
          <div
            style={{
              backgroundColor: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: 10,
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 14
            }}
          >
            <Clock size={22} color="#b45309" style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#92400e' }}>
                Application Under Review
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: 11.5, color: '#78350f', lineHeight: 1.5 }}>
                Your organization registration for <strong>{organization.name}</strong> has been submitted and is currently in the Super Admin review queue. You will be notified as soon as it is approved.
              </p>
              <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={onOpenSuperAdminTower}
                  style={{
                    backgroundColor: '#f59e0b',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '6px 12px',
                    fontSize: 11,
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <ExternalLink size={13} /> Switch to Super Admin to Approve / Review
                </button>
              </div>
            </div>
          </div>
        );

      case 'HOLD':
        return (
          <div
            style={{
              backgroundColor: '#fff7ed',
              border: '1px solid #fed7aa',
              borderRadius: 10,
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 14
            }}
          >
            <AlertTriangle size={22} color="#c2410c" style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#9a3412' }}>
                  Application Placed On Hold
                </h3>
                <span style={{ fontSize: 10.5, fontWeight: 700, backgroundColor: '#ffedd5', color: '#c2410c', padding: '2px 8px', borderRadius: 4 }}>
                  Action Required
                </span>
              </div>
              <p style={{ margin: '4px 0 8px 0', fontSize: 11.5, color: '#7c2d12', lineHeight: 1.5 }}>
                The Super Admin has placed your application on hold pending further information.
              </p>
              {organization.remarks && (
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #fdba74',
                    borderRadius: 6,
                    padding: '10px 14px',
                    fontSize: 11.5,
                    color: '#431407',
                    fontWeight: 600,
                    marginBottom: 10
                  }}
                >
                  <strong>Super Admin Remarks:</strong> &ldquo;{organization.remarks}&rdquo;
                  {organization.reviewedBy && (
                    <span style={{ display: 'block', marginTop: 4, fontSize: 10, color: '#9a3412', fontWeight: 500 }}>
                      Reviewed by {organization.reviewedBy} at {organization.reviewedAt}
                    </span>
                  )}
                </div>
              )}
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={onEditRegistration}
                  style={{
                    backgroundColor: '#ea580c',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '6px 14px',
                    fontSize: 11.5,
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <RefreshCw size={13} /> Update &amp; Re-submit Registration
                </button>
                <button
                  type="button"
                  onClick={onOpenSuperAdminTower}
                  style={{
                    backgroundColor: '#ffffff',
                    color: '#9a3412',
                    border: '1px solid #fed7aa',
                    borderRadius: 6,
                    padding: '6px 12px',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Super Admin Panel
                </button>
              </div>
            </div>
          </div>
        );

      case 'REJECTED':
        return (
          <div
            style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 10,
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 14
            }}
          >
            <XCircle size={22} color="#dc2626" style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#991b1b' }}>
                Application Rejected
              </h3>
              <p style={{ margin: '4px 0 8px 0', fontSize: 11.5, color: '#7f1d1d', lineHeight: 1.5 }}>
                Your organization registration could not be approved at this time.
              </p>
              {organization.remarks && (
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #fca5a5',
                    borderRadius: 6,
                    padding: '10px 14px',
                    fontSize: 11.5,
                    color: '#7f1d1d',
                    fontWeight: 600,
                    marginBottom: 10
                  }}
                >
                  <strong>Super Admin Reason:</strong> &ldquo;{organization.remarks}&rdquo;
                </div>
              )}
              <button
                type="button"
                onClick={onEditRegistration}
                style={{
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '6px 14px',
                  fontSize: 11.5,
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Submit New Application
              </button>
            </div>
          </div>
        );

      case 'ACTIVE':
      default:
        return (
          <div
            style={{
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: 10,
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 14
            }}
          >
            <CheckCircle2 size={22} color="#059669" style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#065f46' }}>
                  Organization Approved &amp; Active!
                </h3>
                <span style={{ fontSize: 10.5, fontWeight: 700, backgroundColor: '#d1fae5', color: '#047857', padding: '2px 8px', borderRadius: 4 }}>
                  Ready to Launch
                </span>
              </div>
              <p style={{ margin: '4px 0 10px 0', fontSize: 11.5, color: '#047857', lineHeight: 1.5 }}>
                Congratulations! Your organization has been approved by the Super Admin and your tenant shard ring has been provisioned.
              </p>
              {organization.remarks && (
                <p style={{ margin: '0 0 10px 0', fontSize: 11, color: '#065f46', fontStyle: 'italic' }}>
                  Admin Note: {organization.remarks}
                </p>
              )}
              <button
                type="button"
                onClick={() => onEnterTenantDashboard(organization)}
                style={{
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '8px 18px',
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 2px 6px rgba(5, 150, 105, 0.3)'
                }}
              >
                Launch Tenant Workspace <ArrowRight size={14} />
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className="qf-card"
      style={{
        maxWidth: 780,
        width: '100%',
        margin: '0 auto',
        padding: 24,
        backgroundColor: '#ffffff',
        borderRadius: 14,
        boxShadow: '0 10px 30px rgba(0,0,0,0.06)'
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <span style={{ fontSize: 10.5, fontWeight: 800, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Organization Admin Portal
          </span>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '2px 0 0 0' }}>
            {organization.name}
          </h2>
          <p style={{ fontSize: 11.5, color: '#64748b', margin: '2px 0 0 0', display: 'flex', alignItems: 'center', gap: 4 }}>
            <User size={13} color="#64748b" /> Logged in as <strong>{user.name}</strong> ({user.email})
          </p>
        </div>

        <button
          type="button"
          onClick={onSignOut}
          style={{
            backgroundColor: '#f1f5f9',
            border: '1px solid #cbd5e1',
            borderRadius: 6,
            padding: '6px 12px',
            fontSize: 11.5,
            fontWeight: 700,
            color: '#475569',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          <LogOut size={13} /> Sign Out
        </button>
      </div>

      {/* Dynamic Status Banner */}
      <div style={{ marginBottom: 20 }}>
        {renderStatusBanner()}
      </div>

      {/* Organization Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginBottom: 18 }}>
        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#4338ca', fontWeight: 800, fontSize: 12, marginBottom: 8 }}>
            <Building2 size={15} /> Company Profile
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 11, color: '#334155' }}>
            <div><strong>Organization:</strong> {organization.name}</div>
            <div><strong>Legal Entity:</strong> {organization.legalName || 'N/A'}</div>
            <div><strong>Industry Type:</strong> {organization.type}</div>
            <div><strong>Contact Email:</strong> {organization.contactEmail}</div>
            <div><strong>Contact Phone:</strong> {organization.contactPhone}</div>
          </div>
        </div>

        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#059669', fontWeight: 800, fontSize: 12, marginBottom: 8 }}>
            <CreditCard size={15} /> Plan &amp; Infrastructure
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 11, color: '#334155' }}>
            <div><strong>Subscription Tier:</strong> <span style={{ fontWeight: 800, color: organization.plan === 'Free' ? '#059669' : '#4338ca' }}>{organization.plan} Plan</span></div>
            <div><strong>Billing Status:</strong> {organization.subscriptionState}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Server size={13} color="#6366f1" />
              <span><strong>Assigned Shard:</strong> <code>{organization.currentShard}</code></span>
            </div>
            <div><strong>Region:</strong> {organization.region}</div>
            <div><strong>Submitted Date:</strong> {organization.createdDate}</div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
        <span style={{ fontSize: 11, color: '#94a3b8' }}>
          Org ID: <code>{organization.id}</code>
        </span>
        <button
          type="button"
          onClick={onOpenSuperAdminTower}
          style={{
            background: 'none',
            border: 'none',
            color: '#6366f1',
            fontSize: 11.5,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}
        >
          Control Tower Review Portal <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
};
