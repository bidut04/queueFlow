import React, { useState, useEffect } from 'react';
import { platformStore } from '../services/platformState';
import type { PlatformPageId, Organization } from '../types/platform';
import { PlatformHeader } from './PlatformHeader';
import { Sidebar } from '../../../components/layout/Sidebar';
import type { NavItem } from '../../../types/navigation';
import { TenantContextBanner } from './TenantContextBanner';
import { authApi } from '../../../api/auth.api';

import { PlatformDashboard } from '../pages/PlatformDashboard';
import { OrganizationsPage } from '../pages/OrganizationsPage';
import { OrganizationDetailsPage } from '../pages/OrganizationDetailsPage';
import { PlatformUsersPage } from '../pages/PlatformUsersPage';
import { SubscriptionsPage } from '../pages/SubscriptionsPage';
import { SystemHealthPage } from '../pages/SystemHealthPage';
import { ShardsPage } from '../pages/ShardsPage';
import { MigrationsPage } from '../pages/MigrationsPage';
import { AuditLogsPage } from '../pages/AuditLogsPage';
import { PlatformSettingsPage } from '../pages/PlatformSettingsPage';
import { CreateOrganizationWizardPage } from './wizard/CreateOrganizationWizardPage';
import { RegistrationApprovalsPage } from '../pages/RegistrationApprovalsPage';

interface PlatformLayoutProps {
  onExitPlatform?: () => void;
  onEnterTenantApp?: (org: Organization) => void;
}

export const PlatformLayout: React.FC<PlatformLayoutProps> = ({
  onExitPlatform,
}) => {
  const getTabFromUrl = (): { tab: PlatformPageId; orgId?: string } => {
    const pathname = window.location.pathname.replace(/^\/platform\/?/, '');
    const segments = pathname.split('/');
    const subRoute = segments[0] || 'overview';

    if (subRoute === 'org-details') {
      const orgIdFromPath = segments[1];
      const searchParams = new URLSearchParams(window.location.search);
      const orgIdFromQuery = searchParams.get('id');
      const orgId = orgIdFromPath || orgIdFromQuery || undefined;
      return { tab: 'org-details', orgId };
    }

    const validTabs: PlatformPageId[] = [
      'overview',
      'organizations',
      'create-organization',
      'org-details',
      'users',
      'subscriptions',
      'system-health',
      'shards',
      'migrations',
      'audit',
      'settings',
      'approvals'
    ];

    if (validTabs.includes(subRoute as PlatformPageId)) {
      return { tab: subRoute as PlatformPageId };
    }

    return { tab: 'overview' };
  };

  const initialUrlState = getTabFromUrl();
  const [activeTab, setActiveTab] = useState<PlatformPageId>(initialUrlState.tab);
  const [selectedOrgId, setSelectedOrgId] = useState<string | undefined>(initialUrlState.orgId);
  const [activeTenantContext, setActiveTenantContext] = useState<Organization | null>(platformStore.activeTenantContext);
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState<number>(() =>
    platformStore.organizations.filter((o) => o.status === 'PENDING').length
  );

  useEffect(() => {
    return platformStore.subscribe(() => {
      setPendingApprovalsCount(platformStore.organizations.filter((o) => o.status === 'PENDING').length);
    });
  }, []);

  const platformNavItems: NavItem[] = [
    { id: 'overview', label: 'Overview', iconName: 'overview' },
    { id: 'organizations', label: 'Organizations', iconName: 'organizations' },
    { id: 'approvals', label: 'Registration Approvals', iconName: 'approvals', badgeCount: pendingApprovalsCount },
    { id: 'users', label: 'Platform Users', iconName: 'users' },
    { id: 'subscriptions', label: 'Subscriptions / Plans', iconName: 'subscriptions' },
    { id: 'system-health', label: 'System Health', iconName: 'system-health' },
    { id: 'shards', label: 'Shards Management', iconName: 'shards' },
    { id: 'migrations', label: 'Tenant Migrations', iconName: 'migrations' },
    { id: 'audit', label: 'Platform Audit Logs', iconName: 'audit' },
    { id: 'settings', label: 'Platform Settings', iconName: 'settings' }
  ];

  useEffect(() => {
    if (!authApi.isSuperAdmin()) return;
    platformStore.loadFromBackend();
    return platformStore.subscribe(() => {
      setActiveTenantContext(platformStore.activeTenantContext);
    });
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const { tab, orgId } = getTabFromUrl();
      setActiveTab(tab);
      if (orgId) {
        setSelectedOrgId(orgId);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (tab: PlatformPageId, orgId?: string) => {
    setActiveTab(tab);
    if (orgId) {
      setSelectedOrgId(orgId);
    }

    let newPath = `/platform/${tab}`;
    if (tab === 'overview') {
      newPath = '/platform';
    } else if (tab === 'org-details' && orgId) {
      newPath = `/platform/org-details/${orgId}`;
    }

    if (window.location.pathname !== newPath) {
      window.history.pushState({ tab, orgId }, '', newPath);
    }
  };

  const handleSelectTenantContext = (orgId: string) => {
    platformStore.switchTenantContext(orgId);
    handleNavigate('org-details', orgId);
  };

  const handleExitTenantContext = () => {
    platformStore.switchTenantContext(null);
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'overview':
        return <PlatformDashboard onNavigate={handleNavigate} />;
      case 'organizations':
        return (
          <OrganizationsPage
            onNavigate={handleNavigate}
            onSelectTenantContext={handleSelectTenantContext}
          />
        );
      case 'create-organization':
        return <CreateOrganizationWizardPage onNavigate={handleNavigate} />;
      case 'org-details':
        return (
          <OrganizationDetailsPage
            organizationId={selectedOrgId || platformStore.organizations[0].id}
            onNavigate={handleNavigate}
            onSelectTenantContext={handleSelectTenantContext}
          />
        );
      case 'users':
        return <PlatformUsersPage onNavigate={handleNavigate} />;
      case 'subscriptions':
        return <SubscriptionsPage />;
      case 'system-health':
        return <SystemHealthPage />;
      case 'shards':
        return <ShardsPage onNavigate={handleNavigate} />;
      case 'migrations':
        return <MigrationsPage onNavigate={handleNavigate} />;
      case 'audit':
        return <AuditLogsPage />;
      case 'approvals':
        return (
          <RegistrationApprovalsPage
            onNavigate={handleNavigate}
            onSelectTenantContext={handleSelectTenantContext}
          />
        );
      case 'settings':
        return <PlatformSettingsPage />;
      default:
        return <PlatformDashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        maxHeight: '100vh',
        width: '100vw',
        flex: 1,
        overflow: 'hidden',
        backgroundColor: '#f8fafc',
        color: '#0f172a',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
      }}
    >
      {/* Banner shown if Impersonated Tenant Context is active */}
      {activeTenantContext && (
        <TenantContextBanner
          organization={activeTenantContext}
          onExitContext={handleExitTenantContext}
        />
      )}

      {/* Control Tower Header */}
      <PlatformHeader
        onSelectTenantContext={handleSelectTenantContext}
        onExitPlatform={onExitPlatform}
      />

      {/* Main Body with Sidebar + Content */}
      <div style={{ display: 'flex', flex: 1, width: '100%', minHeight: 0, overflow: 'hidden', alignItems: 'stretch' }}>
        <Sidebar
          activePage={activeTab}
          onSelectPage={(t) => handleNavigate(t as PlatformPageId)}
          items={platformNavItems}
        />

        <main className="qf-platform-main"
          style={{
            flex: 1,
            width: '100%',
            minHeight: 0,
            maxHeight: '100%',
            backgroundColor: '#f8fafc',
            color: '#0f172a',
            padding: '16px 20px 32px 20px',
            overflowY: 'auto',
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div
            key={activeTab}
            className="qf-page-transition"
            style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
          >
            {renderActivePage()}
          </div>
        </main>
      </div>
    </div>
  );
};
