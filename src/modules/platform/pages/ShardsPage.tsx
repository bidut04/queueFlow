import React, { useState, useEffect } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { platformStore } from '../services/platformState';
import { usePlatformShards, useUpdateShard } from '../hooks';
import type { ShardInfo, PlatformPageId } from '../types/platform';
import type { TableColumn } from '../../../types/table';
import { GlobalTable } from '../../../components/table/GlobalTable';
import { MigrationModal } from '../components/MigrationModal';

interface ShardsPageProps {
  onNavigate: (tab: PlatformPageId) => void;
}

export const ShardsPage: React.FC<ShardsPageProps> = () => {
  const { data: liveShards } = usePlatformShards();
  const updateShardMutation = useUpdateShard();
  const [shards, setShards] = useState<ShardInfo[]>(liveShards || platformStore.shards);
  const [isMigrationModalOpen, setIsMigrationModalOpen] = useState(false);

  useEffect(() => {
    if (liveShards && liveShards.length > 0) {
      setShards(liveShards);
    }
  }, [liveShards]);

  useEffect(() => {
    return platformStore.subscribe(() => {
      setShards([...platformStore.shards]);
    });
  }, []);

  const handleToggleReadOnly = async (shardId: string, currentReadOnly: boolean) => {
    const s = shards.find((item) => item.id === shardId);
    if (!s) return;

    if (window.confirm(`Set ${shardId} to ${currentReadOnly ? 'Read-Write' : 'Read-Only'} mode?`)) {
      try {
        await updateShardMutation.mutateAsync({
          id: shardId,
          input: { readOnly: !currentReadOnly }
        });
      } catch {
        // Fallback
      }

      s.readOnly = !currentReadOnly;
      s.status = s.readOnly ? 'READ_ONLY' : 'HEALTHY';
      setShards([...shards]);
    }
  };


  const columns: TableColumn<ShardInfo>[] = [
    {
      key: 'id',
      header: 'Shard ID',
      sortable: true,
      accessor: (s) => (
        <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#4338ca' }}>
          {s.id}
        </span>
      )
    },
    {
      key: 'region',
      header: 'Region',
      sortable: true,
      accessor: (s) => (
        <span style={{ color: '#334155', fontWeight: 600 }}>{s.region}</span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      accessor: (s) => (
        <span
          style={{
            fontSize: 10.5,
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: 4,
            backgroundColor:
              s.status === 'HEALTHY'
                ? '#d1fae5'
                : s.status === 'READ_ONLY'
                ? '#e0e7ff'
                : '#fee2e2',
            color:
              s.status === 'HEALTHY'
                ? '#047857'
                : s.status === 'READ_ONLY'
                ? '#3730a3'
                : '#b91c1c'
          }}
        >
          {s.status}
        </span>
      )
    },
    {
      key: 'tenantCount',
      header: 'Tenants',
      sortable: true,
      accessor: (s) => (
        <span style={{ fontWeight: 700, color: '#0f172a' }}>
          {s.tenantCount} / {s.capacityTenants}
        </span>
      )
    },
    {
      key: 'utilizationPercent',
      header: 'Capacity Utilization',
      sortable: true,
      accessor: (s) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 140 }}>
          <div style={{ flex: 1, height: 7, borderRadius: 4, backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
            <div
              style={{
                width: `${s.utilizationPercent}%`,
                height: '100%',
                backgroundColor: s.utilizationPercent > 85 ? '#ef4444' : '#10b981',
                borderRadius: 4
              }}
            />
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>{s.utilizationPercent}%</span>
        </div>
      )
    },
    {
      key: 'dbHealth',
      header: 'DB Health',
      sortable: true,
      accessor: (s) => (
        <span style={{ fontSize: 12, fontWeight: 700, color: s.dbHealth === 'HEALTHY' ? '#10b981' : '#f59e0b' }}>
          ● {s.dbHealth}
        </span>
      )
    },
    {
      key: 'activeConnections',
      header: 'Pool Connections',
      sortable: true,
      accessor: (s) => (
        <span style={{ color: '#64748b', fontSize: 12 }}>
          {s.activeConnections} / {s.connectionPoolSize} active
        </span>
      )
    },
    {
      key: 'lastHealthCheck',
      header: 'Last Health Check',
      sortable: true,
      accessor: (s) => <span style={{ color: '#64748b', fontSize: 12 }}>{s.lastHealthCheck}</span>
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'center',
      accessor: (s) => (
        <button
          onClick={() => handleToggleReadOnly(s.id, s.readOnly)}
          style={{
            backgroundColor: s.readOnly ? '#ecfdf5' : '#f1f5f9',
            border: '1px solid #cbd5e1',
            borderRadius: 4,
            padding: '4px 8px',
            fontSize: 11,
            fontWeight: 700,
            color: s.readOnly ? '#059669' : '#475569',
            cursor: 'pointer'
          }}
        >
          {s.readOnly ? 'Enable Write' : 'Set Read-Only'}
        </button>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <GlobalTable<ShardInfo>
        data={shards}
        columns={columns}
        keyExtractor={(s) => s.id}
        title="Database Shard Catalog & Ring Topology"
        subtitle="QueueFlow consistent-hashing multi-region database shards, capacity utilization, and read-only maintenance states."
        searchPlaceholder="Search shard ID or AWS region..."
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
            <ArrowLeftRight size={14} /> Start Shard Migration
          </button>
        }
      />

      <MigrationModal
        organizations={platformStore.organizations}
        shards={platformStore.shards}
        isOpen={isMigrationModalOpen}
        onClose={() => setIsMigrationModalOpen(false)}
        onSuccess={() => setShards([...platformStore.shards])}
      />
    </div>
  );
};
