import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Power,
  ExternalLink,
  Plus,
  ArrowLeftRight
} from 'lucide-react';
import { platformStore } from '../services/platformState';
import {
  usePlatformOrganization,
  usePlatformTenantAdmins,
  useActivateOrganization,
} from '../hooks';
import type { Organization, TenantAdmin, PlatformPageId } from '../types/platform';
import { GlobalTable } from '../../../components/table/GlobalTable';
import { SuspendOrganizationModal } from '../components/SuspendOrganizationModal';
import { TenantAdminModal } from '../components/TenantAdminModal';
import { MigrationModal } from '../components/MigrationModal';
import { toast } from '../../../components/ui/Toast';

interface OrganizationDetailsPageProps {
  organizationId: string;
  onNavigate: (tab: PlatformPageId, orgId?: string) => void;
  onSelectTenantContext: (orgId: string) => void;
}

export const OrganizationDetailsPage: React.FC<OrganizationDetailsPageProps> = ({
  organizationId,
  onNavigate,
  onSelectTenantContext
}) => {
  const { data: liveOrg } = usePlatformOrganization(organizationId);
  const { data: liveAdmins } = usePlatformTenantAdmins(organizationId);
  const activateMutation = useActivateOrganization();

  const [org, setOrg] = useState<Organization | undefined>(
    liveOrg || platformStore.organizations.find((o) => o.id === organizationId)
  );
  const [tenantAdmins, setTenantAdmins] = useState<TenantAdmin[]>(
    liveAdmins || platformStore.tenantAdmins.filter((a) => a.organizationId === organizationId)
  );

  const [activeTab, setActiveTab] = useState<
    'overview' | 'branches' | 'admins' | 'users' | 'services' | 'usage' | 'subscription' | 'infrastructure' | 'audit'
  >('overview');

  // Modals
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isMigrationModalOpen, setIsMigrationModalOpen] = useState(false);

  useEffect(() => {
    if (liveOrg) {
      setOrg(liveOrg);
    }
  }, [liveOrg]);

  useEffect(() => {
    if (liveAdmins && liveAdmins.length > 0) {
      setTenantAdmins(liveAdmins);
    }
  }, [liveAdmins]);

  useEffect(() => {
    return platformStore.subscribe(() => {
      const found = platformStore.organizations.find((o) => o.id === organizationId);
      setOrg(found ? { ...found } : undefined);
      setTenantAdmins(platformStore.tenantAdmins.filter((a) => a.organizationId === organizationId));
    });
  }, [organizationId]);

  if (!org) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>Organization Not Found</h2>
        <button onClick={() => onNavigate('organizations')}>Back to Organizations</button>
      </div>
    );
  }

  const handleActivate = async () => {
    if (window.confirm(`Are you sure you want to reactivate ${org.name}?`)) {
      try {
        await activateMutation.mutateAsync({ id: org.id });
        toast.success(`Organization "${org.name}" reactivated successfully!`);
      } catch (err: any) {
        toast.fromApiError(err, 'Failed to reactivate organization');
      }
      platformStore.activateOrganization(org.id);
    }
  };


  const currentShardInfo = platformStore.shards.find((s) => s.id === org.currentShard);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Back Button & Header */}
      <div>
        <button
          onClick={() => onNavigate('organizations')}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: '#64748b',
            fontSize: 12.5,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 12
          }}
        >
          <ArrowLeft size={16} /> Back to Organizations Catalog
        </button>

        {/* Organization Detail Header Banner */}
        <div className="qf-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {org.logoUrl ? (
                <img src={org.logoUrl} alt={org.name} style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover' }} />
              ) : (
                <div style={{ width: 56, height: 56, borderRadius: 10, backgroundColor: '#e0e7ff', color: '#4338ca', fontSize: 18, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {org.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: 0 }}>{org.name}</h1>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: 4,
                      backgroundColor: org.status === 'ACTIVE' ? '#d1fae5' : '#fee2e2',
                      color: org.status === 'ACTIVE' ? '#047857' : '#b91c1c'
                    }}
                  >
                    {org.status}
                  </span>
                  <span style={{ fontSize: 11, backgroundColor: '#e0e7ff', color: '#3730a3', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
                    {org.plan} Plan
                  </span>
                </div>
                <p style={{ margin: '4px 0 0 0', fontSize: 12.5, color: '#64748b' }}>
                  ID: <code style={{ color: '#334155' }}>{org.id}</code> • Slug: <code style={{ color: '#334155' }}>{org.slug}</code> • Created {org.createdDate} • Shard: <code style={{ color: '#4338ca' }}>{org.currentShard}</code>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <button
                onClick={() => onSelectTenantContext(org.id)}
                style={{
                  backgroundColor: '#4338ca',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '8px 14px',
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <ExternalLink size={14} /> Open Tenant Context
              </button>

              <button
                onClick={() => setIsAdminModalOpen(true)}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: 6,
                  padding: '8px 14px',
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: '#334155',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <Plus size={14} /> Add Tenant Admin
              </button>

              <button
                onClick={() => setIsMigrationModalOpen(true)}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: 6,
                  padding: '8px 14px',
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: '#334155',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <ArrowLeftRight size={14} /> Migrate Shard
              </button>

              {org.status === 'ACTIVE' ? (
                <button
                  onClick={() => setIsSuspendModalOpen(true)}
                  style={{
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: 6,
                    padding: '8px 14px',
                    fontSize: 12.5,
                    fontWeight: 700,
                    color: '#dc2626',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Power size={14} /> Suspend
                </button>
              ) : (
                <button
                  onClick={handleActivate}
                  style={{
                    backgroundColor: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    borderRadius: 6,
                    padding: '8px 14px',
                    fontSize: 12.5,
                    fontWeight: 700,
                    color: '#059669',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Power size={14} /> Reactivate
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div style={{ display: 'flex', borderBottom: '1px solid #cbd5e1', gap: 4 }}>
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'branches', label: `Branches (${org.branchesCount})` },
          { id: 'admins', label: `Tenant Admins (${tenantAdmins.length})` },
          { id: 'users', label: `Staff Users (${org.usersCount})` },
          { id: 'services', label: `Services (${org.servicesCount})` },
          { id: 'infrastructure', label: 'Infrastructure & Shard' },
          { id: 'subscription', label: 'Subscription' },
          { id: 'audit', label: 'Audit Trail' }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '10px 16px',
                border: 'none',
                borderBottom: isActive ? '3px solid #4f46e5' : '3px solid transparent',
                backgroundColor: 'transparent',
                color: isActive ? '#4f46e5' : '#64748b',
                fontWeight: isActive ? 800 : 600,
                fontSize: 13,
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Key Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            <div className="qf-card" style={{ padding: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>Total Branches</span>
              <h3 style={{ margin: '6px 0 0 0', fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{org.branchesCount}</h3>
            </div>
            <div className="qf-card" style={{ padding: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>Staff Users</span>
              <h3 style={{ margin: '6px 0 0 0', fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{org.usersCount}</h3>
            </div>
            <div className="qf-card" style={{ padding: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>Active Queues</span>
              <h3 style={{ margin: '6px 0 0 0', fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{org.activeQueuesCount}</h3>
            </div>
            <div className="qf-card" style={{ padding: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>Monthly Bookings</span>
              <h3 style={{ margin: '6px 0 0 0', fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{org.monthlyBookingsCount.toLocaleString()}</h3>
            </div>
          </div>

          {/* Org Details Info */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            <div className="qf-card" style={{ padding: 20 }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: 15, fontWeight: 800, color: '#0f172a' }}>Primary Contact Information</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                <div><strong>Primary Admin:</strong> {org.primaryAdminName}</div>
                <div><strong>Admin Email:</strong> {org.primaryAdminEmail}</div>
                <div><strong>Admin Phone:</strong> {org.primaryAdminPhone || 'N/A'}</div>
                <div><strong>Legal Name:</strong> {org.legalName}</div>
                <div><strong>Country / Timezone:</strong> {org.country} ({org.timezone})</div>
              </div>
            </div>

            <div className="qf-card" style={{ padding: 20 }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: 15, fontWeight: 800, color: '#0f172a' }}>Infrastructure Assignment</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                <div><strong>Assigned DB Shard:</strong> <code style={{ color: '#4338ca' }}>{org.currentShard}</code></div>
                <div><strong>AWS Region:</strong> {org.region}</div>
                <div><strong>Shard Status:</strong> {currentShardInfo?.status || 'HEALTHY'}</div>
                <div><strong>Capacity Used:</strong> {currentShardInfo?.utilizationPercent}% ({currentShardInfo?.tenantCount} tenants on shard)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'admins' && (
        <GlobalTable<TenantAdmin>
          data={tenantAdmins}
          columns={[
            {
              key: 'name',
              header: 'Name',
              sortable: true,
              accessor: (adm) => <span style={{ fontWeight: 700, color: '#0f172a' }}>{adm.name}</span>
            },
            {
              key: 'email',
              header: 'Email',
              sortable: true,
              accessor: (adm) => <span style={{ color: '#475569' }}>{adm.email}</span>
            },
            {
              key: 'role',
              header: 'Role',
              sortable: true,
              accessor: (adm) => (
                <span style={{ fontSize: 10.5, fontWeight: 700, backgroundColor: '#e0e7ff', color: '#3730a3', padding: '2px 8px', borderRadius: 4 }}>
                  {adm.role}
                </span>
              )
            },
            {
              key: 'status',
              header: 'Status',
              sortable: true,
              accessor: (adm) => (
                <span style={{ fontSize: 10.5, fontWeight: 800, color: adm.status === 'ACTIVE' ? '#047857' : '#b91c1c' }}>
                  {adm.status}
                </span>
              )
            },
            {
              key: 'lastLogin',
              header: 'Last Login',
              sortable: true,
              accessor: (adm) => <span style={{ color: '#64748b', fontSize: 12 }}>{adm.lastLogin}</span>
            },
            {
              key: 'createdDate',
              header: 'Created',
              sortable: true,
              accessor: (adm) => <span style={{ color: '#64748b', fontSize: 12 }}>{adm.createdDate}</span>
            }
          ]}
          keyExtractor={(adm) => adm.id}
          title="Tenant Administrators"
          searchPlaceholder="Search tenant admin name or email..."
          enableSearch={true}
          enablePagination={true}
          headerActions={
            <button
              onClick={() => setIsAdminModalOpen(true)}
              style={{ backgroundColor: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: 6, padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <Plus size={14} /> Add Tenant Admin
            </button>
          }
        />
      )}

      {activeTab === 'infrastructure' && (
        <div className="qf-card" style={{ padding: 24 }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 800, color: '#0f172a' }}>
            Infrastructure & Database Shard Information
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            <div style={{ padding: 16, backgroundColor: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: 14, fontWeight: 700, color: '#334155' }}>
                Current Shard Metadata
              </h4>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: '#475569', lineHeight: 1.8 }}>
                <li><strong>Shard ID:</strong> {org.currentShard}</li>
                <li><strong>AWS Region:</strong> {currentShardInfo?.region || org.region}</li>
                <li><strong>Shard Status:</strong> {currentShardInfo?.status || 'HEALTHY'}</li>
                <li><strong>Read Only Mode:</strong> {currentShardInfo?.readOnly ? 'ENABLED' : 'DISABLED'}</li>
                <li><strong>Database Health:</strong> {currentShardInfo?.dbHealth || 'HEALTHY'}</li>
                <li><strong>Last Health Check:</strong> {currentShardInfo?.lastHealthCheck || '2 secs ago'}</li>
              </ul>
            </div>

            <div style={{ padding: 16, backgroundColor: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: 14, fontWeight: 700, color: '#334155' }}>
                Database Connection Pool & Security
              </h4>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: '#475569', lineHeight: 1.8 }}>
                <li><strong>Connection Pool Size:</strong> {currentShardInfo?.connectionPoolSize || 200}</li>
                <li><strong>Active Connections:</strong> {currentShardInfo?.activeConnections || 42}</li>
                <li><strong>Database Host:</strong> db-{org.currentShard}.internal.queueflow.net</li>
                <li><strong>TLS Encryption:</strong> Required (TLS v1.3)</li>
                <li><strong>Secrets & Passwords:</strong> <span style={{ fontFamily: 'monospace', color: '#94a3b8' }}>••••••••••••••••</span></li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <SuspendOrganizationModal
        organization={org}
        isOpen={isSuspendModalOpen}
        onClose={() => setIsSuspendModalOpen(false)}
        onSuccess={() => setOrg(platformStore.organizations.find((o) => o.id === organizationId))}
      />

      <TenantAdminModal
        organizations={platformStore.organizations}
        defaultOrgId={org.id}
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSuccess={() => setTenantAdmins(platformStore.tenantAdmins.filter((a) => a.organizationId === organizationId))}
      />

      <MigrationModal
        organizations={platformStore.organizations}
        shards={platformStore.shards}
        defaultOrgId={org.id}
        isOpen={isMigrationModalOpen}
        onClose={() => setIsMigrationModalOpen(false)}
        onSuccess={() => setOrg(platformStore.organizations.find((o) => o.id === organizationId))}
      />
    </div>
  );
};
