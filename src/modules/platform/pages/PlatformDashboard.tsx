import React, { useState, useEffect } from 'react';
import {
  Building2,
  CheckCircle2,
  AlertTriangle,
  Users2,
  CreditCard,
  TrendingUp,
  Activity,
  ArrowRight,
  Server,
  Database,
  Cpu,
  Radio,
  Boxes,
  ChevronRight
} from 'lucide-react';
import { platformStore } from '../services/platformState';
import type { Organization, SystemComponentHealth, PlatformAuditLog, PlatformPageId } from '../types/platform';
import type { TableColumn } from '../../../types/table';
import { GlobalTable } from '../../../components/table/GlobalTable';

interface PlatformDashboardProps {
  onNavigate: (tab: PlatformPageId, orgId?: string) => void;
}

export const PlatformDashboard: React.FC<PlatformDashboardProps> = ({ onNavigate }) => {
  const [organizations, setOrganizations] = useState<Organization[]>(platformStore.organizations);
  const [healthItems, setHealthItems] = useState<SystemComponentHealth[]>(platformStore.systemHealth);
  const [auditLogs, setAuditLogs] = useState<PlatformAuditLog[]>(platformStore.auditLogs);

  useEffect(() => {
    return platformStore.subscribe(() => {
      setOrganizations([...platformStore.organizations]);
      setHealthItems([...platformStore.systemHealth]);
      setAuditLogs([...platformStore.auditLogs]);
    });
  }, []);

  const totalOrgs = organizations.length;
  const activeOrgs = organizations.filter((o) => o.status === 'ACTIVE').length;
  const suspendedOrgs = organizations.filter((o) => o.status === 'SUSPENDED').length;
  const totalBranches = organizations.reduce((acc, o) => acc + o.branchesCount, 0);
  const totalPlatformUsers = platformStore.platformUsers.length;
  const activeSubscriptions = organizations.filter((o) => o.subscriptionState === 'ACTIVE').length;
  const totalMonthlyBookings = organizations.reduce((acc, o) => acc + o.monthlyBookingsCount, 0);

  const getHealthBadge = (status: string) => {
    switch (status) {
      case 'HEALTHY':
        return { color: '#10b981', bg: '#ecfdf5', label: 'HEALTHY' };
      case 'DEGRADED':
        return { color: '#f59e0b', bg: '#fffbeb', label: 'DEGRADED' };
      case 'DOWN':
        return { color: '#ef4444', bg: '#fef2f2', label: 'DOWN' };
      default:
        return { color: '#6b7280', bg: '#f3f4f6', label: 'UNKNOWN' };
    }
  };

  const auditColumns: TableColumn<PlatformAuditLog>[] = [
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
      key: 'ipAddress',
      header: 'IP / Device',
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
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Control Tower Header Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <h1 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Platform Super Admin Control Tower
            </h1>
            <span style={{ fontSize: 8.5, fontWeight: 700, backgroundColor: '#e0e7ff', color: '#4338ca', padding: '1px 4px', borderRadius: 3 }}>
              Mother Company Portal
            </span>
          </div>
          <p style={{ fontSize: 10, color: '#64748b', marginTop: 1, margin: 0 }}>
            Global platform metrics, organization lifecycles, database shard rings, and system health monitors.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 4 }}>
          <button
            onClick={() => onNavigate('organizations')}
            style={{
              backgroundColor: '#4f46e5',
              color: '#ffffff',
              border: 'none',
              borderRadius: 6,
              padding: '7px 8px',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <Building2 size={11} /> Manage Organizations
          </button>
        </div>
      </div>

      {/* Top 8 KPI Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, minmax(0, 1fr))', gap: 6 }}>
        {/* Total Orgs */}
        <div className="qf-card" style={{ padding: '6px 8px', borderLeft: '3px solid #4f46e5' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 9.5, fontWeight: 700, color: '#64748b' }}>Total Organizations</span>
            <Building2 size={13} color="#4f46e5" />
          </div>
          <h2 style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', margin: '2px 0 0 0' }}>{totalOrgs}</h2>
          <span style={{ fontSize: 9, color: '#10b981', fontWeight: 600 }}>Across 5 Database Shards</span>
        </div>

        {/* Active Orgs */}
        <div className="qf-card" style={{ padding: '6px 8px', borderLeft: '3px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 9.5, fontWeight: 700, color: '#64748b' }}>Active Organizations</span>
            <CheckCircle2 size={13} color="#10b981" />
          </div>
          <h2 style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', margin: '2px 0 0 0' }}>{activeOrgs}</h2>
          <span style={{ fontSize: 9, color: '#64748b' }}>{Math.round((activeOrgs / totalOrgs) * 100)}% active rate</span>
        </div>

        {/* Suspended Orgs */}
        <div className="qf-card" style={{ padding: '6px 8px', borderLeft: '3px solid #ef4444' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 9.5, fontWeight: 700, color: '#64748b' }}>Suspended Orgs</span>
            <AlertTriangle size={13} color="#ef4444" />
          </div>
          <h2 style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', margin: '2px 0 0 0' }}>{suspendedOrgs}</h2>
          <span style={{ fontSize: 8, color: '#ef4444', fontWeight: 600 }}>Billing or Compliance Holds</span>
        </div>

        {/* Total Branches */}
        <div className="qf-card" style={{ padding: '6px 8px', borderLeft: '3px solid #0284c7' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 9.5, fontWeight: 700, color: '#64748b' }}>Total Branches</span>
            <Server size={13} color="#0284c7" />
          </div>
          <h2 style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', margin: '2px 0 0 0' }}>{totalBranches}</h2>
          <span style={{ fontSize: 9, color: '#64748b' }}>Across all tenant networks</span>
        </div>

        {/* Platform Users */}
        <div className="qf-card" style={{ padding: '6px 8px', borderLeft: '3px solid #8b5cf6' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 9.5, fontWeight: 700, color: '#64748b' }}>Platform Users</span>
            <Users2 size={13} color="#8b5cf6" />
          </div>
          <h2 style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', margin: '2px 0 0 0' }}>{totalPlatformUsers}</h2>
          <span style={{ fontSize: 8, color: '#64748b' }}>Super Admin & Support staff</span>
        </div>

        {/* Active Subscriptions */}
        <div className="qf-card" style={{ padding: '6px 8px', borderLeft: '3px solid #059669' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 9.5, fontWeight: 700, color: '#64748b' }}>Active Subscriptions</span>
            <CreditCard size={13} color="#059669" />
          </div>
          <h2 style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', margin: '2px 0 0 0' }}>{activeSubscriptions}</h2>
          <span style={{ fontSize: 9, color: '#10b981', fontWeight: 600 }}>Starter, Pro & Enterprise</span>
        </div>

        {/* Monthly Bookings */}
        <div className="qf-card" style={{ padding: '6px 8px', borderLeft: '3px solid #ec4899' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 9.5, fontWeight: 700, color: '#64748b' }}>Monthly Bookings</span>
            <TrendingUp size={13} color="#ec4899" />
          </div>
          <h2 style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', margin: '2px 0 0 0' }}>
            {totalMonthlyBookings.toLocaleString()}
          </h2>
          <span style={{ fontSize: 9, color: '#10b981', fontWeight: 600 }}>+14.2% vs last month</span>
        </div>

        {/* System Health */}
        <div className="qf-card" style={{ padding: '6px 8px', borderLeft: '3px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 9.5, fontWeight: 700, color: '#64748b' }}>System Health</span>
            <Activity size={13} color="#10b981" />
          </div>
          <h2 style={{ fontSize: 13, fontWeight: 800, color: '#10b981', margin: '2px 0 0 0' }}>
            99.98% SLA
          </h2>
          <span style={{ fontSize: 9, color: '#64748b' }}>10 Services Operational</span>
        </div>
      </div>

      {/* Main Grid: Organization Activity & Platform Health */}
      <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: 8 }}>
        {/* Left Column: Organization Activity Table & Summary */}
        <div className="qf-card" style={{ padding: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div>
              <h3 style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', margin: 0 }}>Organization Activity</h3>
              <p style={{ fontSize: 9.5, color: '#64748b', margin: 0 }}>
                Newly onboarded, active, and suspended tenant organizations
              </p>
            </div>
            <button
              onClick={() => onNavigate('organizations')}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#4f46e5',
                fontSize: 10,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              View All <ArrowRight size={11} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {organizations.slice(0, 5).map((org) => (
              <div
                key={org.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '5px 8px',
                  backgroundColor: '#f8fafc',
                  borderRadius: 5,
                  border: '1px solid #f1f5f9'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {org.logoUrl ? (
                    <img
                      src={org.logoUrl}
                      alt={org.name}
                      style={{ width: 22, height: 22, borderRadius: 4, objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 4,
                        backgroundColor: '#e0e7ff',
                        color: '#4338ca',
                        fontSize: 9.5,
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {org.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <p
                        onClick={() => onNavigate('org-details', org.id)}
                        style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#0f172a', cursor: 'pointer' }}
                      >
                        {org.name}
                      </p>
                      <span
                        style={{
                          fontSize: 8.5,
                          fontWeight: 700,
                          padding: '1px 4px',
                          borderRadius: 3,
                          backgroundColor: org.status === 'ACTIVE' ? '#d1fae5' : '#fee2e2',
                          color: org.status === 'ACTIVE' ? '#047857' : '#b91c1c'
                        }}
                      >
                        {org.status}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: 9, color: '#64748b' }}>
                      {org.type} • {org.branchesCount} Branches • {org.plan} • Shard: {org.currentShard}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('org-details', org.id)}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: 4,
                    padding: '2px 6px',
                    fontSize: 9.5,
                    fontWeight: 600,
                    color: '#334155',
                    cursor: 'pointer'
                  }}
                >
                  Details
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Platform Health Grid */}
        <div className="qf-card" style={{ padding: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Activity size={17} color="#2563eb" />
              </div>
              <div>
                <h3 style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', margin: 0 }}>Platform Component Health</h3>
                <p style={{ fontSize: 10, color: '#64748b', margin: '1px 0 0 0' }}>
                  Real-time latency & component status
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('system-health')}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#2563eb',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              Control <ArrowRight size={13} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {healthItems.slice(0, 6).map((item) => {
              const hBadge = getHealthBadge(item.status);
              const getComponentStyle = (name: string) => {
                if (name.includes('API Gateway')) return { icon: Server, color: '#059669', bg: '#ecfdf5' };
                if (name.includes('PostgreSQL')) return { icon: Database, color: '#0284c7', bg: '#f0f9ff' };
                if (name.includes('Redis')) return { icon: Activity, color: '#dc2626', bg: '#fef2f2' };
                if (name.includes('Kafka')) return { icon: Cpu, color: '#7c3aed', bg: '#f5f3ff' };
                if (name.includes('Socket.IO')) return { icon: Radio, color: '#0891b2', bg: '#ecfeff' };
                return { icon: Boxes, color: '#2563eb', bg: '#eff6ff' };
              };
              const compStyle = getComponentStyle(item.name);
              const CompIcon = compStyle.icon;

              return (
                <div
                  key={item.id}
                  onClick={() => onNavigate('system-health')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    backgroundColor: '#f8fafc',
                    borderRadius: 6,
                    border: '1px solid #f1f5f9',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: compStyle.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <CompIcon size={15} color={compStyle.color} />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#0f172a' }}>{item.name}</p>
                      <p style={{ margin: 0, fontSize: 9.5, color: '#64748b' }}>
                        Latency: {item.latencyMs}ms • Heartbeat: {item.lastHeartbeatSec}s ago
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        fontSize: 9.5,
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: 12,
                        backgroundColor: hBadge.bg,
                        color: hBadge.color
                      }}
                    >
                      ● {hBadge.label}
                    </span>
                    <ChevronRight size={14} color="#94a3b8" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Platform Activity Log Stream using GlobalTable */}
      <GlobalTable<PlatformAuditLog>
        data={auditLogs}
        columns={auditColumns}
        keyExtractor={(log) => log.id}
        title="Recent Platform Activity Audit"
        subtitle="Audited Super Admin actions, organization lifecycle events, and shard operations"
        searchPlaceholder="Search audit logs..."
        enableSearch={true}
        enablePagination={true}
        defaultItemsPerPage={5}
        headerActions={
          <button
            onClick={() => onNavigate('audit')}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#4f46e5',
              fontSize: 10,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            Audit Search <ArrowRight size={11} />
          </button>
        }
      />
    </div>
  );
};
