import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { platformStore } from '../services/platformState';
import type { PlatformUser, PlatformPageId } from '../types/platform';
import type { TableColumn } from '../../../types/table';
import { GlobalTable } from '../../../components/table/GlobalTable';
import { PlatformUserModal } from '../components/PlatformUserModal';

interface PlatformUsersPageProps {
  onNavigate: (tab: PlatformPageId) => void;
}

export const PlatformUsersPage: React.FC<PlatformUsersPageProps> = () => {
  const [users, setUsers] = useState<PlatformUser[]>(platformStore.platformUsers);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  useEffect(() => {
    return platformStore.subscribe(() => {
      setUsers([...platformStore.platformUsers]);
    });
  }, []);

  const handleToggleSuspend = (userId: string, currentStatus: string) => {
    const usr = platformStore.platformUsers.find((u) => u.id === userId);
    if (!usr) return;

    if (usr.role === 'PLATFORM_OWNER') {
      alert('Security Policy: Cannot suspend PLATFORM_OWNER user.');
      return;
    }

    usr.status = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    setUsers([...platformStore.platformUsers]);
  };

  const columns: TableColumn<PlatformUser>[] = [
    {
      key: 'name',
      header: 'User',
      sortable: true,
      accessor: (u) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {u.avatarUrl ? (
            <img src={u.avatarUrl} alt={u.name} style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: '#e0e7ff', color: '#4338ca', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {u.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <span style={{ fontWeight: 700, color: '#0f172a' }}>{u.name}</span>
        </div>
      )
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
      accessor: (u) => <span style={{ color: '#475569' }}>{u.email}</span>
    },
    {
      key: 'role',
      header: 'Platform Role',
      sortable: true,
      accessor: (u) => (
        <span
          style={{
            fontSize: 10.5,
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: 4,
            backgroundColor: u.role === 'PLATFORM_OWNER' ? '#312e81' : u.role === 'PLATFORM_ADMIN' ? '#e0e7ff' : '#f1f5f9',
            color: u.role === 'PLATFORM_OWNER' ? '#ffffff' : u.role === 'PLATFORM_ADMIN' ? '#3730a3' : '#475569'
          }}
        >
          {u.role}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      accessor: (u) => (
        <span style={{ fontSize: 10.5, fontWeight: 800, color: u.status === 'ACTIVE' ? '#047857' : '#b91c1c' }}>
          {u.status}
        </span>
      )
    },
    {
      key: 'mfaStatus',
      header: 'MFA Status',
      sortable: true,
      accessor: (u) => (
        <span style={{ fontSize: 11, fontWeight: 700, color: u.mfaStatus === 'ENABLED' ? '#10b981' : '#f59e0b' }}>
          ● {u.mfaStatus}
        </span>
      )
    },
    {
      key: 'lastLogin',
      header: 'Last Login',
      sortable: true,
      accessor: (u) => <span style={{ color: '#64748b', fontSize: 12 }}>{u.lastLogin}</span>
    },
    {
      key: 'createdDate',
      header: 'Joined Date',
      sortable: true,
      accessor: (u) => <span style={{ color: '#64748b', fontSize: 12 }}>{u.createdDate}</span>
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'center',
      accessor: (u) => (
        u.role !== 'PLATFORM_OWNER' ? (
          <button
            onClick={() => handleToggleSuspend(u.id, u.status)}
            style={{
              backgroundColor: u.status === 'ACTIVE' ? '#fef2f2' : '#ecfdf5',
              border: '1px solid #cbd5e1',
              borderRadius: 4,
              padding: '4px 8px',
              fontSize: 11,
              fontWeight: 700,
              color: u.status === 'ACTIVE' ? '#dc2626' : '#059669',
              cursor: 'pointer'
            }}
          >
            {u.status === 'ACTIVE' ? 'Suspend Access' : 'Reactivate'}
          </button>
        ) : (
          <span style={{ fontSize: 11, color: '#94a3b8', fontStyle: 'italic' }}>Protected Owner</span>
        )
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <GlobalTable<PlatformUser>
        data={users}
        columns={columns}
        keyExtractor={(u) => u.id}
        title="Platform Control Tower Users"
        subtitle="Manage staff members with platform-level access (PLATFORM_OWNER, PLATFORM_ADMIN, PLATFORM_SUPPORT)."
        searchPlaceholder="Search staff member name, email or role..."
        enableSearch={true}
        enablePagination={true}
        defaultItemsPerPage={10}
        headerActions={
          <button
            onClick={() => setIsInviteModalOpen(true)}
            style={{
              backgroundColor: '#4f46e5',
              color: '#ffffff',
              border: 'none',
              borderRadius: 6,
              padding: '8px 16px',
              fontSize: 12.5,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Plus size={14} /> Invite Platform Staff
          </button>
        }
      />

      <PlatformUserModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSuccess={() => setUsers([...platformStore.platformUsers])}
      />
    </div>
  );
};
