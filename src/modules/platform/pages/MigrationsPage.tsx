import React, { useState, useEffect } from 'react';
import { Plus, RotateCcw, ArrowLeftRight, Activity, Database, CheckCircle2 } from 'lucide-react';
import { platformStore } from '../services/platformState';
import { usePlatformMigrations, useRollbackMigration } from '../hooks';
import type { TenantMigrationJob, PlatformPageId } from '../types/platform';
import type { TableColumn } from '../../../types/table';
import { GlobalTable } from '../../../components/table/GlobalTable';
import { MigrationModal } from '../components/MigrationModal';

interface MigrationsPageProps {
  onNavigate: (tab: PlatformPageId) => void;
}

export const MigrationsPage: React.FC<MigrationsPageProps> = () => {
  const { data: liveMigrations } = usePlatformMigrations();
  const rollbackMutation = useRollbackMigration();
  const [storeMigrations, setStoreMigrations] = useState<TenantMigrationJob[]>(platformStore.migrations);
  const [isMigrationModalOpen, setIsMigrationModalOpen] = useState(false);

  useEffect(() => {
    return platformStore.subscribe(() => {
      setStoreMigrations([...platformStore.migrations]);
    });
  }, []);

  const migrations = (liveMigrations && liveMigrations.length > 0) ? liveMigrations : storeMigrations;

  const activeMigrations = migrations.filter(
    (m) => m.status === 'COPYING' || m.status === 'VERIFYING' || m.status === 'CUTTING_OVER'
  );
  const completedMigrations = migrations.filter((m) => m.status === 'COMPLETED');

  const handleRollback = async (migrationId: string, orgName: string) => {
    if (window.confirm(`SECURITY ROLLBACK: Are you sure you want to rollback migration ${migrationId} for ${orgName}? The previous shard mapping will be restored.`)) {
      try {
        await rollbackMutation.mutateAsync({ id: migrationId });
      } catch {
        // Fallback
      }
      platformStore.rollbackMigration(migrationId);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return { bg: '#d1fae5', color: '#047857', border: '#a7f3d0' };
      case 'CUTTING_OVER':
      case 'COPYING':
      case 'VERIFYING':
        return { bg: '#e0e7ff', color: '#3730a3', border: '#c7d2fe' };
      case 'PLANNED':
        return { bg: '#fef3c7', color: '#b45309', border: '#fde68a' };
      case 'ROLLING_BACK':
      case 'FAILED':
        return { bg: '#fee2e2', color: '#b91c1c', border: '#fecaca' };
      default:
        return { bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' };
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
              color: badge.color,
              border: `1px solid ${badge.border}`
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Top 4 KPI Metric Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12 }}>
        <div className="qf-card" style={{ padding: '12px 14px', borderLeft: '3px solid #4f46e5' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>Total Shard Cutover Jobs</span>
            <ArrowLeftRight size={15} color="#4f46e5" />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '4px 0 2px 0' }}>{migrations.length}</h3>
          <span style={{ fontSize: 10, color: '#64748b', fontWeight: 500 }}>Lifecycle shard operations</span>
        </div>

        <div className="qf-card" style={{ padding: '12px 14px', borderLeft: '3px solid #3b82f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>In-Flight Active Sync</span>
            <Activity size={15} color="#3b82f6" />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '4px 0 2px 0' }}>{activeMigrations.length}</h3>
          <span style={{ fontSize: 10, color: activeMigrations.length > 0 ? '#3b82f6' : '#10b981', fontWeight: 600 }}>
            {activeMigrations.length > 0 ? 'Live replication in progress' : 'Cluster idle & synchronized'}
          </span>
        </div>

        <div className="qf-card" style={{ padding: '12px 14px', borderLeft: '3px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>Completed Migrations</span>
            <CheckCircle2 size={15} color="#10b981" />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '4px 0 2px 0' }}>{completedMigrations.length}</h3>
          <span style={{ fontSize: 10, color: '#10b981', fontWeight: 600 }}>Zero downtime verified</span>
        </div>

        <div className="qf-card" style={{ padding: '12px 14px', borderLeft: '3px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>Active Shards in Ring</span>
            <Database size={15} color="#f59e0b" />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '4px 0 2px 0' }}>{platformStore.shards.length}</h3>
          <span style={{ fontSize: 10, color: '#64748b', fontWeight: 500 }}>Multi-region consistent hash</span>
        </div>
      </div>

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
        emptyStateMessage={
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '20px 0' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4338ca' }}>
              <ArrowLeftRight size={22} />
            </div>
            <div style={{ textAlign: 'center', maxWidth: 460 }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', margin: '0 0 4px 0' }}>No Active Shard Migrations</h4>
              <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 14px 0', lineHeight: 1.5 }}>
                All tenant databases are currently balanced across active database shards. You can initiate a zero-downtime migration to rebalance cluster capacity at any time.
              </p>
              <button
                type="button"
                onClick={() => setIsMigrationModalOpen(true)}
                style={{
                  backgroundColor: '#4f46e5',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '8px 16px',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                <Plus size={14} /> Schedule First Migration
              </button>
            </div>
          </div>
        }
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
        onSuccess={() => setStoreMigrations([...platformStore.migrations])}
      />
    </div>
  );
};
