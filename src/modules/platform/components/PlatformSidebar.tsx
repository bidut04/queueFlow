import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Users2,
  CreditCard,
  Activity,
  Database,
  ArrowLeftRight,
  ShieldCheck,
  Settings,
  ClipboardCheck
} from 'lucide-react';
import type { PlatformPageId } from '../types/platform';
import { platformStore } from '../services/platformState';

interface PlatformSidebarProps {
  activeTab: PlatformPageId;
  onSelectTab: (tab: PlatformPageId) => void;
}

export const PlatformSidebar: React.FC<PlatformSidebarProps> = ({
  activeTab,
  onSelectTab
}) => {
  const pendingCount = platformStore.organizations.filter((o) => o.status === 'PENDING').length;

  const navItems = [
    { id: 'overview' as PlatformPageId, label: 'Overview', icon: LayoutDashboard },
    { id: 'organizations' as PlatformPageId, label: 'Organizations', icon: Building2 },
    { id: 'approvals' as PlatformPageId, label: 'Registration Approvals', icon: ClipboardCheck, badge: pendingCount },
    { id: 'users' as PlatformPageId, label: 'Platform Users', icon: Users2 },
    { id: 'subscriptions' as PlatformPageId, label: 'Subscriptions / Plans', icon: CreditCard },
    { id: 'system-health' as PlatformPageId, label: 'System Health', icon: Activity },
    { id: 'shards' as PlatformPageId, label: 'Shards Management', icon: Database },
    { id: 'migrations' as PlatformPageId, label: 'Tenant Migrations', icon: ArrowLeftRight },
    { id: 'audit' as PlatformPageId, label: 'Platform Audit Logs', icon: ShieldCheck },
    { id: 'settings' as PlatformPageId, label: 'Platform Settings', icon: Settings }
  ];

  return (
    <aside
      style={{
        width: 215,
        backgroundColor: '#090d16',
        borderRight: '1px solid #1e293b',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '10px 8px',
        flexShrink: 0,
        height: '100%',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <div style={{ padding: '2px 8px 8px 8px', marginBottom: 6, borderBottom: '1px solid #1e293b', flexShrink: 0 }}>
          <p style={{ fontSize: 10, fontWeight: 800, color: '#64748b', letterSpacing: '0.8px', textTransform: 'uppercase', margin: 0 }}>
            Platform Control Plane
          </p>
        </div>

        <nav className="qf-sidebar-nav" style={{ display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto', flex: 1, paddingRight: 2 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '7px 10px',
                  borderRadius: 6,
                  border: 'none',
                  backgroundColor: isActive ? '#3730a3' : 'transparent',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  fontSize: 12.5,
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
                onMouseOver={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = '#1e293b';
                    e.currentTarget.style.color = '#f1f5f9';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#94a3b8';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon size={16} color={isActive ? '#818cf8' : '#64748b'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && item.badge > 0 ? (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      backgroundColor: '#f59e0b',
                      color: '#ffffff',
                      borderRadius: 10,
                      padding: '1px 6px',
                      lineHeight: '14px'
                    }}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info Box */}
      <div
        style={{
          padding: 8,
          borderRadius: 6,
          backgroundColor: '#111827',
          border: '1px solid #1f2937',
          marginTop: 8,
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
          <span style={{ fontSize: 10.5, fontWeight: 700, color: '#f3f4f6' }}>Shard Ring</span>
          <span style={{ fontSize: 9.5, color: '#34d399', fontWeight: 800 }}>5 Shards</span>
        </div>
        <p style={{ fontSize: 9.5, color: '#9ca3af', margin: 0 }}>
          Consistent-hashing router.
        </p>
      </div>
    </aside>
  );
};
