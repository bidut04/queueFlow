import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Eye,
  Power,
  ExternalLink
} from 'lucide-react';
import { platformStore } from '../services/platformState';
import type { Organization, OrgStatus, PlatformPageId } from '../types/platform';
import type { TableColumn } from '../../../types/table';
import { GlobalTable } from '../../../components/table/GlobalTable';
import { CreateOrganizationModal } from '../components/CreateOrganizationModal';
import { SuspendOrganizationModal } from '../components/SuspendOrganizationModal';

interface OrganizationsPageProps {
  onNavigate: (tab: PlatformPageId, orgId?: string) => void;
  onSelectTenantContext: (orgId: string) => void;
}

export const OrganizationsPage: React.FC<OrganizationsPageProps> = ({
  onNavigate,
  onSelectTenantContext
}) => {
  const [organizations, setOrganizations] = useState<Organization[]>(platformStore.organizations);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [planFilter, setPlanFilter] = useState<string>('ALL');
  const [shardFilter, setShardFilter] = useState<string>('ALL');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [orgToSuspend, setOrgToSuspend] = useState<Organization | null>(null);

  useEffect(() => {
    return platformStore.subscribe(() => {
      setOrganizations([...platformStore.organizations]);
    });
  }, []);

  const filteredOrganizations = useMemo(() => {
    return organizations.filter((org) => {
      const matchesStatus = statusFilter === 'ALL' || org.status === statusFilter;
      const matchesPlan = planFilter === 'ALL' || org.plan === planFilter;
      const matchesShard = shardFilter === 'ALL' || org.currentShard === shardFilter;

      return matchesStatus && matchesPlan && matchesShard;
    });
  }, [organizations, statusFilter, planFilter, shardFilter]);

  const handleActivate = (orgId: string) => {
    if (window.confirm('Are you sure you want to reactivate this organization?')) {
      platformStore.activateOrganization(orgId);
    }
  };

  const getStatusBadgeClass = (status: OrgStatus) => {
    switch (status) {
      case 'ACTIVE':
        return { bg: '#d1fae5', color: '#047857', border: '#a7f3d0' };
      case 'SUSPENDED':
        return { bg: '#fee2e2', color: '#b91c1c', border: '#fca5a5' };
      case 'PENDING':
        return { bg: '#fef3c7', color: '#b45309', border: '#fde68a' };
      case 'HOLD':
        return { bg: '#ffedd5', color: '#c2410c', border: '#fed7aa' };
      case 'REJECTED':
        return { bg: '#fee2e2', color: '#b91c1c', border: '#fca5a5' };
      case 'ARCHIVED':
        return { bg: '#f3f4f6', color: '#4b5563', border: '#e5e7eb' };
    }
  };

  const columns: TableColumn<Organization>[] = [
    {
      key: 'name',
      header: 'Organization',
      sortable: true,
      accessor: (org) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {org.logoUrl ? (
            <img src={org.logoUrl} alt={org.name} style={{ width: 34, height: 34, borderRadius: 6, objectFit: 'cover' }} />
          ) : (
            <div style={{ width: 34, height: 34, borderRadius: 6, backgroundColor: '#e0e7ff', color: '#4338ca', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {org.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <p
              onClick={() => onNavigate('org-details', org.id)}
              style={{ margin: 0, fontWeight: 700, color: '#0f172a', cursor: 'pointer' }}
            >
              {org.name}
            </p>
            <p style={{ margin: '1px 0 0 0', fontSize: 11, color: '#64748b' }}>
              {org.type} • {org.contactEmail}
            </p>
          </div>
        </div>
      )
    },
    {
      key: 'id',
      header: 'Org ID',
      sortable: true,
      accessor: (org) => (
        <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#475569' }}>{org.id}</span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      accessor: (org) => {
        const badge = getStatusBadgeClass(org.status);
        return (
          <span
            style={{
              fontSize: 10.5,
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: 4,
              backgroundColor: badge.bg,
              color: badge.color,
              border: `1px solid ${badge.border}`
            }}
          >
            {org.status}
          </span>
        );
      }
    },
    {
      key: 'plan',
      header: 'Plan',
      sortable: true,
      accessor: (org) => <span style={{ fontWeight: 600, color: '#334155' }}>{org.plan}</span>
    },
    {
      key: 'branchesCount',
      header: 'Branches',
      sortable: true,
      accessor: (org) => <span style={{ fontWeight: 700, color: '#0f172a' }}>{org.branchesCount}</span>
    },
    {
      key: 'usersCount',
      header: 'Users',
      sortable: true,
      accessor: (org) => <span style={{ color: '#64748b' }}>{org.usersCount}</span>
    },
    {
      key: 'currentShard',
      header: 'Current Shard',
      sortable: true,
      accessor: (org) => <span style={{ fontFamily: 'monospace', fontSize: 11.5, color: '#4338ca' }}>{org.currentShard}</span>
    },
    {
      key: 'createdDate',
      header: 'Created',
      sortable: true,
      accessor: (org) => <span style={{ fontSize: 12, color: '#64748b' }}>{org.createdDate}</span>
    },
    {
      key: 'lastActivity',
      header: 'Last Activity',
      sortable: true,
      accessor: (org) => <span style={{ fontSize: 12, color: '#64748b' }}>{org.lastActivity}</span>
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'center',
      accessor: (org) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <button
            title="View Details"
            onClick={() => onNavigate('org-details', org.id)}
            style={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: 4, padding: 6, color: '#3b82f6', cursor: 'pointer' }}
          >
            <Eye size={14} />
          </button>
          <button
            title="Switch Context (Impersonate Tenant)"
            onClick={() => onSelectTenantContext(org.id)}
            style={{ backgroundColor: '#e0e7ff', border: '1px solid #c7d2fe', borderRadius: 4, padding: 6, color: '#4338ca', cursor: 'pointer' }}
          >
            <ExternalLink size={14} />
          </button>
          {org.status === 'ACTIVE' ? (
            <button
              title="Suspend Organization"
              onClick={() => setOrgToSuspend(org)}
              style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 4, padding: 6, color: '#ef4444', cursor: 'pointer' }}
            >
              <Power size={14} />
            </button>
          ) : (
            <button
              title="Reactivate Organization"
              onClick={() => handleActivate(org.id)}
              style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 4, padding: 6, color: '#10b981', cursor: 'pointer' }}
            >
              <Power size={14} />
            </button>
          )}
        </div>
      )
    }
  ];

  const headerFilters = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 12, fontWeight: 600, color: '#334155' }}
      >
        <option value="ALL">All Statuses</option>
        <option value="ACTIVE">ACTIVE</option>
        <option value="PENDING">PENDING</option>
        <option value="HOLD">ON HOLD</option>
        <option value="REJECTED">REJECTED</option>
        <option value="SUSPENDED">SUSPENDED</option>
        <option value="ARCHIVED">ARCHIVED</option>
      </select>

      <select
        value={planFilter}
        onChange={(e) => setPlanFilter(e.target.value)}
        style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 12, fontWeight: 600, color: '#334155' }}
      >
        <option value="ALL">All Plans</option>
        <option value="Free">Free</option>
        <option value="Starter">Starter</option>
        <option value="Professional">Professional</option>
        <option value="Enterprise">Enterprise</option>
      </select>

      <select
        value={shardFilter}
        onChange={(e) => setShardFilter(e.target.value)}
        style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 12, fontWeight: 600, color: '#334155', fontFamily: 'monospace' }}
      >
        <option value="ALL">All Shards</option>
        {platformStore.shards.map((s) => (
          <option key={s.id} value={s.id}>{s.id}</option>
        ))}
      </select>

      <button
        onClick={() => onNavigate('create-organization')}
        style={{
          backgroundColor: '#4f46e5',
          color: '#ffffff',
          border: 'none',
          borderRadius: 6,
          padding: '7px 14px',
          fontSize: 12,
          fontWeight: 800,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}
      >
        <Plus size={14} /> Create Organization
      </button>
    </div>
  );

  const pendingCount = organizations.filter((o) => o.status === 'PENDING').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {pendingCount > 0 && (
        <div
          style={{
            backgroundColor: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: 8,
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#92400e', fontSize: 12, fontWeight: 700 }}>
            <span>⚠️ There are <strong>{pendingCount}</strong> self-registered organizations awaiting Super Admin review and approval.</span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('approvals')}
            style={{
              backgroundColor: '#d97706',
              color: '#ffffff',
              border: 'none',
              borderRadius: 5,
              padding: '5px 12px',
              fontSize: 11.5,
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            Open Approvals Queue →
          </button>
        </div>
      )}
      <GlobalTable<Organization>
        data={filteredOrganizations}
        columns={columns}
        keyExtractor={(org) => org.id}
        title="Tenant Organizations Catalog"
        subtitle="Manage multi-tenant company accounts, database shard assignments, subscription states, and lifecycle actions."
        searchPlaceholder="Search organization name, ID, slug or email..."
        enableSearch={true}
        enablePagination={true}
        defaultItemsPerPage={10}
        headerActions={headerFilters}
      />

      {/* Modals */}
      <CreateOrganizationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={() => setOrganizations([...platformStore.organizations])}
      />

      <SuspendOrganizationModal
        organization={orgToSuspend}
        isOpen={Boolean(orgToSuspend)}
        onClose={() => setOrgToSuspend(null)}
        onSuccess={() => setOrganizations([...platformStore.organizations])}
      />
    </div>
  );
};
