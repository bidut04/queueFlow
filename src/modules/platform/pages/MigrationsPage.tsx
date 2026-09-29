import React, { useState, useEffect } from 'react';
import { Plus, RotateCcw } from 'lucide-react';
import { platformStore } from '../services/platformState';
import type { TenantMigrationJob, PlatformPageId } from '../types/platform';
import type { TableColumn } from '../../../types/table';
import { GlobalTable } from '../../../components/table/GlobalTable';
import { MigrationModal } from '../components/MigrationModal';

interface MigrationsPageProps {
  onNavigate: (tab: PlatformPageId) => void;
}

export const MigrationsPage: React.FC<MigrationsPageProps> = () => {
  const [migrations, setMigrations] = useState<TenantMigrationJob[]>(platformStore.migrations);
  const [isMigrationModalOpen, setIsMigrationModalOpen] = useState(false);

  useEffect(() => {
    return platformStore.subscribe(() => {
      setMigrations([...platformStore.migrations]);
    });
  }, []);

  const handleRollback = (migrationId: string, orgName: string) => {
    if (window.confirm(`SECURITY ROLLBACK: Are you sure you want to rollback migration ${migrationId} for ${orgName}? The previous shard mapping will be restored.`)) {
      platformStore.rollbackMigration(migrationId);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return { bg: '#d1fae5', color: '#047857' };
      case 'CUTTING_OVER':
      case 'COPYING':
      case 'VERIFYING':
        return { bg: '#e0e7ff', color: '#3730a3' };
      case 'PLANNED':
        return { bg: '#fef3c7', color: '#b45309' };
      case 'ROLLING_BACK':
      case 'FAILED':
        return { bg: '#fee2e2', color: '#b91c1c' };
      default:
        return { bg: '#f3f4f6', color: '#4b5563' };
    }
  };

  const columns: TableColumn<TenantMigrationJob>[] = [
    {
      key: 'id',
      header: 'Migration ID',
      sortable: true,
      accessor: (mig) => (
        <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#475569' }}>
          {mig.id}
        </span>
      )
    },
    {
      key: 'organizationName',
      header: 'Organization',
      sortable: true,
      accessor: (mig) => (
        <span style={{ fontWeight: 700, color: '#0f172a' }}>{mig.organizationName}</span>
      )
    },
    {
      key: 'sourceShard',
      header: 'Source Shard',
      sortable: true,
      accessor: (mig) => (
        <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#64748b' }}>{mig.sourceShard}</span>
      )
    },
    {
      key: 'destinationShard',
      header: 'Destination Shard',
      sortable: true,
      accessor: (mig) => (
        <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#4338ca', fontWeight: 700 }}>{mig.destinationShard}</span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      accessor: (mig) => {
        const badge = getStatusBadge(mig.status);
        return (
          <span
            style={{
              fontSize: 10.5,
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: 4,
              backgroundColor: badge.bg,
              color: badge.color
            }}
          >
            {mig.status}
          </span>
        );
      }
    },
    {
      key: 'progressPercent',
      header: 'Progress',
      sortable: true,
      accessor: (mig) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 120 }}>
          <div style={{ flex: 1, height: 6, borderRadius: 4, backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
            <div style={{ width: `${mig.progressPercent}%`, height: '100%', backgroundColor: mig.progressPercent === 100 ? '#10b981' : '#4f46e5' }} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>{mig.progressPercent}%</span>
        </div>
      )
    },
    {
      key: 'startedAt',
      header: 'Started',
      sortable: true,
      accessor: (mig) => <span style={{ fontSize: 12, color: '#64748b' }}>{mig.startedAt}</span>
    },
    {
      key: 'initiatedBy',
      header: 'Initiated By',
      sortable: true,
      accessor: (mig) => <span style={{ fontSize: 12, color: '#475569' }}>{mig.initiatedBy}</span>
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'center',
      accessor: (mig) => {
        const canRollback = mig.status !== 'COMPLETED' && mig.status !== 'ROLLING_BACK';
        return (
          canRollback ? (
            <button
              onClick={() => handleRollback(mig.id, mig.organizationName)}
              style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 4,
                padding: '4px 8px',
                fontSize: 11,
                fontWeight: 700,
                color: '#dc2626',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <RotateCcw size={12} /> Rollback
            </button>
          ) : (
            <span style={{ fontSize: 11, color: '#10b981', fontWeight: 700 }}>Complete</span>
          )
        );
      }
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <GlobalTable<TenantMigrationJob>
        data={migrations}
        columns={columns}
        keyExtractor={(mig) => mig.id}
        title="Tenant Database Shard Migrations"
        subtitle="Managed zero-downtime tenant shard cutovers (Copy → Verify → Cutover → Complete) with automated rollback safeguards."
        searchPlaceholder="Search migration ID, organization, or shard..."
        enableSearch={true}
        enablePagination={true}
        defaultItemsPerPage={10}
        headerActions={
          <button
            onClick={() => setIsMigrationModalOpen(true)}
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
            <Plus size={14} /> New Migration Job
          </button>
        }
      />

      <MigrationModal
        organizations={platformStore.organizations}
        shards={platformStore.shards}
        isOpen={isMigrationModalOpen}
        onClose={() => setIsMigrationModalOpen(false)}
        onSuccess={() => setMigrations([...platformStore.migrations])}
      />
    </div>
  );
};
