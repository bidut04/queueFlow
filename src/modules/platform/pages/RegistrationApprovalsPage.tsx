import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MessageSquare,
  Clock,
  ShieldCheck,
  Building2,
  ExternalLink
} from 'lucide-react';
import { platformStore } from '../services/platformState';
import type { Organization, OrgStatus, PlatformPageId } from '../types/platform';
import type { TableColumn } from '../../../types/table';
import { GlobalTable } from '../../../components/table/GlobalTable';
import {
  ApprovalActionModal,
  type ApprovalActionType
} from '../components/approvals/ApprovalActionModal';

interface RegistrationApprovalsPageProps {
  onNavigate: (tab: PlatformPageId, orgId?: string) => void;
  onSelectTenantContext: (orgId: string) => void;
}

export const RegistrationApprovalsPage: React.FC<RegistrationApprovalsPageProps> = ({
  onNavigate,
  onSelectTenantContext
}) => {
  const [organizations, setOrganizations] = useState<Organization[]>(platformStore.organizations);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalActionType, setModalActionType] = useState<ApprovalActionType>('APPROVE');
  const [targetOrg, setTargetOrg] = useState<Organization | null>(null);

  useEffect(() => {
    return platformStore.subscribe(() => {
      setOrganizations([...platformStore.organizations]);
    });
  }, []);

  const openActionModal = (action: ApprovalActionType, org: Organization) => {
    setModalActionType(action);
    setTargetOrg(org);
    setIsModalOpen(true);
  };

  const handleModalConfirm = (orgId: string, remarks: string) => {
    if (modalActionType === 'APPROVE') {
      platformStore.approveRegistration(orgId, remarks);
    } else if (modalActionType === 'HOLD') {
      platformStore.holdRegistration(orgId, remarks);
    } else if (modalActionType === 'REJECT') {
      platformStore.rejectRegistration(orgId, remarks);
    } else if (modalActionType === 'REMARKS') {
      platformStore.updateOrganizationRemarks(orgId, remarks);
    }
  };

  const pendingCount = organizations.filter((o) => o.status === 'PENDING').length;
  const holdCount = organizations.filter((o) => o.status === 'HOLD').length;
  const rejectedCount = organizations.filter((o) => o.status === 'REJECTED').length;
  const activeCount = organizations.filter((o) => o.status === 'ACTIVE').length;

  const filteredOrgs = useMemo(() => {
    return organizations.filter((org) => {
      if (filterStatus === 'ALL') return true;
      return org.status === filterStatus;
    });
  }, [organizations, filterStatus]);

  const getBadgeStyle = (status: OrgStatus) => {
    switch (status) {
      case 'PENDING':
        return { bg: '#fef3c7', text: '#b45309', border: '#fde68a' };
      case 'HOLD':
        return { bg: '#ffedd5', text: '#c2410c', border: '#fed7aa' };
      case 'REJECTED':
        return { bg: '#fee2e2', text: '#b91c1c', border: '#fca5a5' };
      case 'ACTIVE':
      default:
        return { bg: '#d1fae5', text: '#047857', border: '#a7f3d0' };
    }
  };

  // Reusable GlobalTable Columns
  const columns: TableColumn<Organization>[] = [
    {
      key: 'name',
      header: 'Organization',
      sortable: true,
      accessor: (org) => (
        <div>
          <span
            onClick={() => onNavigate('org-details', org.id)}
            style={{ fontWeight: 800, color: '#0f172a', cursor: 'pointer', textDecoration: 'underline' }}
            title="View Details"
          >
            {org.name}
          </span>
          <div style={{ fontSize: 10.5, color: '#64748b' }}>
            {org.type} • <code>{org.slug}</code>
          </div>
        </div>
      )
    },
    {
      key: 'primaryAdminName',
      header: 'Admin & Contact',
      sortable: true,
      accessor: (org) => (
        <div>
          <div style={{ fontWeight: 600, color: '#334155' }}>{org.primaryAdminName}</div>
          <div style={{ fontSize: 10.5, color: '#64748b' }}>{org.contactEmail}</div>
        </div>
      )
    },
    {
      key: 'plan',
      header: 'Plan',
      sortable: true,
      accessor: (org) => (
        <span
          style={{
            fontSize: 10.5,
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: 4,
            backgroundColor: org.plan === 'Free' ? '#ecfdf5' : '#e0e7ff',
            color: org.plan === 'Free' ? '#065f46' : '#3730a3'
          }}
        >
          {org.plan}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      accessor: (org) => {
        const badge = getBadgeStyle(org.status);
        return (
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: 4,
              backgroundColor: badge.bg,
              color: badge.text,
              border: `1px solid ${badge.border}`
            }}
          >
            {org.status}
          </span>
        );
      }
    },
    {
      key: 'remarks',
      header: 'Remarks / Notes',
      sortable: false,
      accessor: (org) =>
        org.remarks ? (
          <div style={{ fontSize: 11, color: '#334155', fontStyle: 'italic', maxWidth: 190 }}>
            &ldquo;{org.remarks}&rdquo;
            {org.reviewedBy && (
              <div style={{ fontSize: 9.5, color: '#94a3b8', fontStyle: 'normal' }}>
                by {org.reviewedBy}
              </div>
            )}
          </div>
        ) : (
          <span style={{ fontSize: 10.5, color: '#cbd5e1' }}>None</span>
        )
    },
    {
      key: 'createdDate',
      header: 'Submitted',
      sortable: true,
      accessor: (org) => (
        <span style={{ fontSize: 11, color: '#64748b', whiteSpace: 'nowrap' }}>
          {org.createdDate}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'center',
      accessor: (org) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
          <button
            type="button"
            title="Approve Organization"
            onClick={() => openActionModal('APPROVE', org)}
            style={{
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#059669',
              borderRadius: 4,
              padding: '4px 7px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 10.5,
              fontWeight: 700
            }}
          >
            <CheckCircle2 size={12} /> Approve
          </button>
          <button
            type="button"
            title="Place on Hold"
            onClick={() => openActionModal('HOLD', org)}
            style={{
              backgroundColor: '#fff7ed',
              border: '1px solid #fed7aa',
              color: '#ea580c',
              borderRadius: 4,
              padding: '4px 7px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 10.5,
              fontWeight: 700
            }}
          >
            <AlertTriangle size={12} /> Hold
          </button>
          <button
            type="button"
            title="Reject Registration"
            onClick={() => openActionModal('REJECT', org)}
            style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              borderRadius: 4,
              padding: '4px 7px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 10.5,
              fontWeight: 700
            }}
          >
            <XCircle size={12} /> Reject
          </button>
          <button
            type="button"
            title="Edit Remarks"
            onClick={() => openActionModal('REMARKS', org)}
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #cbd5e1',
              color: '#475569',
              borderRadius: 4,
              padding: '4px 6px',
              cursor: 'pointer'
            }}
          >
            <MessageSquare size={12} />
          </button>
          <button
            type="button"
            title="Impersonate Tenant Context"
            onClick={() => onSelectTenantContext(org.id)}
            style={{
              backgroundColor: '#e0e7ff',
              border: '1px solid #c7d2fe',
              color: '#4338ca',
              borderRadius: 4,
              padding: '4px 6px',
              cursor: 'pointer'
            }}
          >
            <ExternalLink size={12} />
          </button>
        </div>
      )
    }
  ];

  const filterToolbar = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
      {[
        { key: 'ALL', label: `All (${organizations.length})` },
        { key: 'PENDING', label: `Pending (${pendingCount})` },
        { key: 'HOLD', label: `On Hold (${holdCount})` },
        { key: 'REJECTED', label: `Rejected (${rejectedCount})` },
        { key: 'ACTIVE', label: `Active (${activeCount})` }
      ].map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => setFilterStatus(tab.key)}
          style={{
            padding: '5px 11px',
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 700,
            border: filterStatus === tab.key ? '1px solid #4f46e5' : '1px solid #cbd5e1',
            backgroundColor: filterStatus === tab.key ? '#eef2ff' : '#ffffff',
            color: filterStatus === tab.key ? '#4338ca' : '#475569',
            cursor: 'pointer'
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldCheck size={20} color="#4f46e5" />
            <h1 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Organization Registration Approvals
            </h1>
          </div>
          <p style={{ fontSize: 11.5, color: '#64748b', margin: '2px 0 0 0' }}>
            Review, hold, and approve tenant organization self-registration requests.
          </p>
        </div>

        <button
          type="button"
          onClick={() => { window.location.href = '/org-portal'; }}
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: 6,
            padding: '5px 12px',
            fontSize: 11,
            fontWeight: 700,
            color: '#4338ca',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          <Building2 size={13} /> Open Org Admin Portal View
        </button>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        <div className="qf-card" style={{ padding: 12, backgroundColor: '#fffbeb', border: '1px solid #fde68a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#b45309', fontSize: 10.5, fontWeight: 800 }}>
            <Clock size={13} /> PENDING REVIEW
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#92400e', margin: '2px 0 0 0' }}>
            {pendingCount}
          </h2>
        </div>

        <div className="qf-card" style={{ padding: 12, backgroundColor: '#fff7ed', border: '1px solid #fed7aa' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#c2410c', fontSize: 10.5, fontWeight: 800 }}>
            <AlertTriangle size={13} /> ON HOLD
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#9a3412', margin: '2px 0 0 0' }}>
            {holdCount}
          </h2>
        </div>

        <div className="qf-card" style={{ padding: 12, backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#dc2626', fontSize: 10.5, fontWeight: 800 }}>
            <XCircle size={13} /> REJECTED
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#991b1b', margin: '2px 0 0 0' }}>
            {rejectedCount}
          </h2>
        </div>

        <div className="qf-card" style={{ padding: 12, backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#059669', fontSize: 10.5, fontWeight: 800 }}>
            <CheckCircle2 size={13} /> ACTIVE / APPROVED
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#065f46', margin: '2px 0 0 0' }}>
            {activeCount}
          </h2>
        </div>
      </div>

      {/* Reusing GlobalTable directly from Bookings Page */}
      <GlobalTable<Organization>
        data={filteredOrgs}
        columns={columns}
        keyExtractor={(org) => org.id}
        title="Registration Review Queue"
        subtitle={`Showing ${filteredOrgs.length} applications (${pendingCount} awaiting approval)`}
        searchPlaceholder="Search organization name, admin, slug or email..."
        enableSearch={true}
        enablePagination={true}
        defaultItemsPerPage={10}
        headerActions={filterToolbar}
      />

      {/* Action Dialog Modal */}
      <ApprovalActionModal
        isOpen={isModalOpen}
        actionType={modalActionType}
        organization={targetOrg}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleModalConfirm}
      />
    </div>
  );
};
