import React, { useState, useEffect, useMemo } from 'react';
import { platformStore } from '../services/platformState';
import { usePlatformAuditLogs } from '../hooks';
import type { PlatformAuditLog } from '../types/platform';
import type { TableColumn } from '../../../types/table';
import { GlobalTable } from '../../../components/table/GlobalTable';

export const AuditLogsPage: React.FC = () => {
  const { data: liveLogs } = usePlatformAuditLogs();
  const [storeLogs, setStoreLogs] = useState<PlatformAuditLog[]>(platformStore.auditLogs);

  // Filters
  const [actionFilter, setActionFilter] = useState('ALL');
  const [resultFilter, setResultFilter] = useState('ALL');

  useEffect(() => {
    return platformStore.subscribe(() => {
      setStoreLogs([...platformStore.auditLogs]);
    });
  }, []);

  const logs = (liveLogs && liveLogs.length > 0) ? liveLogs : storeLogs;


  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
      const matchesResult = resultFilter === 'ALL' || log.result === resultFilter;

      return matchesAction && matchesResult;
    });
  }, [logs, actionFilter, resultFilter]);

  const columns: TableColumn<PlatformAuditLog>[] = [
    {
      key: 'timestamp',
      header: 'Timestamp',
      sortable: true,
      accessor: (log) => (
        <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#64748b' }}>
          {log.timestamp}
        </span>
      )
    },
    {
      key: 'actor',
      header: 'Actor',
      sortable: true,
      accessor: (log) => (
        <span style={{ fontWeight: 700, color: '#0f172a' }}>
          {log.actor} <span style={{ fontSize: 10.5, color: '#6366f1' }}>({log.actorRole})</span>
        </span>
      )
    },
    {
      key: 'action',
      header: 'Action',
      sortable: true,
      accessor: (log) => (
        <span style={{ fontSize: 11, fontWeight: 800, backgroundColor: '#f1f5f9', color: '#1e293b', padding: '2px 8px', borderRadius: 4 }}>
          {log.action}
        </span>
      )
    },
    {
      key: 'organizationName',
      header: 'Organization',
      sortable: true,
      accessor: (log) => (
        <span style={{ fontWeight: 600, color: '#334155' }}>
          {log.organizationName || 'Platform Global'}
        </span>
      )
    },
    {
      key: 'resource',
      header: 'Resource & ID',
      sortable: true,
      accessor: (log) => (
        <span style={{ fontSize: 12, color: '#64748b' }}>
          {log.resource}: <code style={{ color: '#0f172a' }}>{log.resourceId}</code>
        </span>
      )
    },
    {
      key: 'ipAddress',
      header: 'IP Address',
      sortable: true,
      accessor: (log) => (
        <span style={{ fontFamily: 'monospace', fontSize: 11.5, color: '#64748b' }}>
          {log.ipAddress}
        </span>
      )
    },
    {
      key: 'result',
      header: 'Result',
      sortable: true,
      accessor: (log) => (
        <span
          style={{
            fontSize: 10.5,
            fontWeight: 800,
            padding: '2px 6px',
            borderRadius: 4,
            backgroundColor: log.result === 'SUCCESS' ? '#d1fae5' : '#fee2e2',
            color: log.result === 'SUCCESS' ? '#047857' : '#b91c1c'
          }}
        >
          {log.result}
        </span>
      )
    },
    {
      key: 'reason',
      header: 'Details / Reason',
      sortable: true,
      accessor: (log) => (
        <span style={{ fontSize: 12, color: '#64748b' }}>
          {log.reason || 'N/A'}
        </span>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <GlobalTable<PlatformAuditLog>
        data={filteredLogs}
        columns={columns}
        keyExtractor={(log) => log.id}
        title="Platform Security & Compliance Audit Trail"
        subtitle="Mandatory immutable audit logging for all Super Admin actions, organization lifecycle mutations, role assignments, and shard operations."
        searchPlaceholder="Search actor, action, organization, IP address or resource ID..."
        enableSearch={true}
        enablePagination={true}
        defaultItemsPerPage={10}
        headerActions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 12, fontWeight: 600, color: '#334155' }}
            >
              <option value="ALL">All Actions</option>
              <option value="ORGANIZATION_CREATED">ORGANIZATION_CREATED</option>
              <option value="ORGANIZATION_SUSPENDED">ORGANIZATION_SUSPENDED</option>
              <option value="ORGANIZATION_ACTIVATED">ORGANIZATION_ACTIVATED</option>
              <option value="TENANT_CONTEXT_SWITCHED">TENANT_CONTEXT_SWITCHED</option>
              <option value="MIGRATION_STARTED">MIGRATION_STARTED</option>
              <option value="MIGRATION_ROLLED_BACK">MIGRATION_ROLLED_BACK</option>
              <option value="PLATFORM_SETTING_CHANGED">PLATFORM_SETTING_CHANGED</option>
            </select>

            <select
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value)}
              style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 12, fontWeight: 600, color: '#334155' }}
            >
              <option value="ALL">All Results</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="FAILED">FAILED</option>
            </select>
          </div>
        }
      />
    </div>
  );
};
