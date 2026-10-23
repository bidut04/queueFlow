import React, { useState } from 'react';
import {
  Clock,
  Users,
  CheckCircle2,
  Megaphone,
  Play,
  Check,
  UserX,
  RotateCcw,
  Radio,
  Building,
} from 'lucide-react';
import { GlobalTable } from '../components/table/GlobalTable';
import { Badge } from '../components/ui/Badge';
import type { TableColumn } from '../types/table';
import {
  useActiveQueue,
  useCallEntry,
  useStartService,
  useCompleteService,
  useMarkNoShow,
  useRequeueEntry,
} from '../api/hooks/queueHooks';
import type { QueueEntryItem } from '../api/queue.api';
import { useRealtimeQueue, useSocket } from '../socket';

export const QueuePage: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = useState<string>('branch_central');
  const [selectedCounter, setSelectedCounter] = useState<string>('Counter 1');

  // Activate Realtime WebSocket subscription for this branch
  useRealtimeQueue(selectedBranch);
  const { isConnected } = useSocket();

  // Query live queue data (automatically invalidated whenever socket emits queue events)
  const { data: queueData = [], isLoading } = useActiveQueue(selectedBranch);

  const callEntryMutation = useCallEntry();
  const startServiceMutation = useStartService();
  const completeServiceMutation = useCompleteService();
  const markNoShowMutation = useMarkNoShow();
  const requeueEntryMutation = useRequeueEntry();

  const waitingCount = queueData.filter((q) => q.status === 'WAITING').length;
  const inServiceCount = queueData.filter(
    (q) => q.status === 'CALLED' || q.status === 'IN_SERVICE'
  ).length;
  const completedCount = queueData.filter((q) => q.status === 'COMPLETED').length;

  const handleCall = (entry: QueueEntryItem) => {
    callEntryMutation.mutate({ id: entry.id, counterId: selectedCounter });
  };

  const handleStart = (entry: QueueEntryItem) => {
    startServiceMutation.mutate(entry.id);
  };

  const handleComplete = (entry: QueueEntryItem) => {
    completeServiceMutation.mutate(entry.id);
  };

  const handleNoShow = (entry: QueueEntryItem) => {
    markNoShowMutation.mutate(entry.id);
  };

  const handleRequeue = (entry: QueueEntryItem) => {
    requeueEntryMutation.mutate({ id: entry.id, options: { reason: 'Customer requested reschedule' } });
  };

  const columns: TableColumn<QueueEntryItem>[] = [
    {
      key: 'tokenLabel',
      header: 'Token #',
      sortable: true,
      accessor: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              fontWeight: 800,
              fontSize: 13,
              color: '#2563eb',
              fontFamily: 'monospace',
            }}
          >
            {row.tokenLabel || `#${row.tokenNumber}`}
          </span>
          {row.status === 'CALLED' && (
            <span
              style={{
                fontSize: 9,
                fontWeight: 800,
                padding: '1px 5px',
                borderRadius: 4,
                backgroundColor: '#fef3c7',
                color: '#b45309',
                border: '1px solid #fde68a',
                animation: 'pulse 1.5s infinite',
              }}
            >
              CALLING
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'customerName',
      header: 'Customer',
      sortable: true,
      accessor: (row) => (
        <span style={{ fontWeight: 600, color: '#0f172a' }}>
          {row.customerName || 'Walk-in Customer'}
        </span>
      ),
    },
    {
      key: 'counterId',
      header: 'Assigned Desk',
      sortable: true,
      accessor: (row) => (
        <span style={{ color: '#475569', fontSize: 12 }}>
          {row.counterId || '—'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      accessor: (row) => <Badge label={row.status} />,
    },
    {
      key: 'createdAt',
      header: 'Created Time',
      sortable: true,
      accessor: (row) => (
        <span style={{ color: '#64748b', fontSize: 11 }}>
          {row.createdAt ? new Date(row.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Desk Controls',
      sortable: false,
      accessor: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {row.status === 'WAITING' && (
            <button
              onClick={() => handleCall(row)}
              disabled={callEntryMutation.isPending}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 8px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
              }}
              title="Call to assigned desk"
            >
              <Megaphone size={12} />
              <span>Call</span>
            </button>
          )}

          {row.status === 'CALLED' && (
            <button
              onClick={() => handleStart(row)}
              disabled={startServiceMutation.isPending}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 8px',
                backgroundColor: '#059669',
                color: '#ffffff',
                border: 'none',
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
              }}
              title="Start serving customer"
            >
              <Play size={12} />
              <span>Start</span>
            </button>
          )}

          {row.status === 'IN_SERVICE' && (
            <button
              onClick={() => handleComplete(row)}
              disabled={completeServiceMutation.isPending}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 8px',
                backgroundColor: '#10b981',
                color: '#ffffff',
                border: 'none',
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
              }}
              title="Finish & complete service"
            >
              <Check size={12} />
              <span>Complete</span>
            </button>
          )}

          {(row.status === 'CALLED' || row.status === 'WAITING') && (
            <button
              onClick={() => handleNoShow(row)}
              disabled={markNoShowMutation.isPending}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 7px',
                backgroundColor: '#f1f5f9',
                color: '#64748b',
                border: '1px solid #cbd5e1',
                borderRadius: 6,
                fontSize: 10.5,
                fontWeight: 600,
                cursor: 'pointer',
              }}
              title="Mark as No Show"
            >
              <UserX size={11} />
              <span>No-Show</span>
            </button>
          )}

          {row.status === 'NO_SHOW' && (
            <button
              onClick={() => handleRequeue(row)}
              disabled={requeueEntryMutation.isPending}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 7px',
                backgroundColor: '#f8fafc',
                color: '#475569',
                border: '1px solid #cbd5e1',
                borderRadius: 6,
                fontSize: 10.5,
                fontWeight: 600,
                cursor: 'pointer',
              }}
              title="Re-insert into queue"
            >
              <RotateCcw size={11} />
              <span>Requeue</span>
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Top Header & Branch Switcher */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h1 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Real-Time Queue Monitor
            </h1>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '2px 8px',
                borderRadius: 999,
                fontSize: 10,
                fontWeight: 700,
                backgroundColor: isConnected ? '#dcfce7' : '#fee2e2',
                color: isConnected ? '#15803d' : '#b91c1c',
                border: `1px solid ${isConnected ? '#bbf7d0' : '#fecaca'}`,
              }}
            >
              <Radio size={10} />
              <span>{isConnected ? 'Socket Synced' : 'Socket Reconnecting'}</span>
            </span>
          </div>
          <p style={{ margin: '3px 0 0', fontSize: 12, color: '#64748b' }}>
            Live tokens, desk call state machine, and TV screen broadcasting via WebSockets.
          </p>
        </div>

        {/* Branch and Counter selectors */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Building size={14} color="#64748b" />
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              style={{
                padding: '5px 10px',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                fontSize: 12,
                fontWeight: 600,
                color: '#1e293b',
                backgroundColor: '#ffffff',
                outline: 'none',
              }}
            >
              <option value="branch_central">Central Flagship Branch</option>
              <option value="branch_downtown">Downtown Express Branch</option>
              <option value="branch_west">Westside Customer Hub</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>My Counter:</span>
            <select
              value={selectedCounter}
              onChange={(e) => setSelectedCounter(e.target.value)}
              style={{
                padding: '5px 10px',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                fontSize: 12,
                fontWeight: 600,
                color: '#1e293b',
                backgroundColor: '#ffffff',
                outline: 'none',
              }}
            >
              <option value="Counter 1">Counter 1</option>
              <option value="Counter 2">Counter 2</option>
              <option value="Counter 3">Counter 3</option>
              <option value="Desk A">Desk A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Queue Stat Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16 }}>
        <div className="qf-card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Users size={22} color="#3b82f6" />
          </div>
          <div>
            <p style={{ fontSize: 12, color: '#64748b', fontWeight: 600, margin: 0 }}>
              Currently Waiting
            </p>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: '2px 0 0' }}>
              {waitingCount} Tokens
            </h3>
          </div>
        </div>

        <div className="qf-card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: '#ecfdf5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckCircle2 size={22} color="#10b981" />
          </div>
          <div>
            <p style={{ fontSize: 12, color: '#64748b', fontWeight: 600, margin: 0 }}>
              Active / In Service
            </p>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: '2px 0 0' }}>
              {inServiceCount} Serving
            </h3>
          </div>
        </div>

        <div className="qf-card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: '#f5f3ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Clock size={22} color="#8b5cf6" />
          </div>
          <div>
            <p style={{ fontSize: 12, color: '#64748b', fontWeight: 600, margin: 0 }}>
              Completed Today
            </p>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: '2px 0 0' }}>
              {completedCount} Completed
            </h3>
          </div>
        </div>
      </div>

      {/* Live Table */}
      <GlobalTable<QueueEntryItem>
        data={queueData}
        columns={columns}
        keyExtractor={(row) => row.id}
        title="Live Branch Queue Feed"
        searchPlaceholder="Search token number or customer..."
        enableSearch={true}
        enablePagination={true}
        loading={isLoading}
      />
    </div>
  );
};
