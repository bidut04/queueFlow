import React, { useState, useEffect } from 'react';
import { platformStore } from '../services/platformState';
import type { PlatformPageId, Organization } from '../types/platform';
import { PlatformHeader } from './PlatformHeader';
import { PlatformSidebar } from './PlatformSidebar';
import { TenantContextBanner } from './TenantContextBanner';

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

interface PlatformLayoutProps {
  onExitPlatform: () => void;
  onEnterTenantApp: (org: Organization) => void;
}

export const PlatformLayout: React.FC<PlatformLayoutProps> = ({
  onExitPlatform,
  onEnterTenantApp
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
      'settings'
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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
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
    setIsMobileSidebarOpen(false);
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
    const org = platformStore.organizations.find((o) => o.id === orgId);
    if (org) {
      onEnterTenantApp(org);
    }
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
        backgroundColor: '#0b0f19',
        color: '#f8fafc',
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
        onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
      />

      {/* Main Body with Sidebar + Content */}
      <div style={{ display: 'flex', flex: 1, width: '100%', minHeight: 0, overflow: 'hidden' }}>
        {/* Desktop Sidebar */}
        <div className="qf-desktop-sidebar">
          <PlatformSidebar activeTab={activeTab} onSelectTab={(t) => handleNavigate(t)} />
        </div>

        {/* Mobile Sidebar Backdrop Drawer */}
        {isMobileSidebarOpen && (
          <div
            className="qf-mobile-drawer-backdrop"
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <div
              className="qf-mobile-drawer-content"
              onClick={(e) => e.stopPropagation()}
            >
              <PlatformSidebar activeTab={activeTab} onSelectTab={(t) => handleNavigate(t)} />
            </div>
          </div>
        )}

        <main
          style={{
            flex: 1,
            width: '100%',
            height: '100%',
            backgroundColor: '#f8fafc',
            color: '#0f172a',
            padding: '6px 10px',
            overflowY: 'auto',
            minWidth: 0
          }}
        >
          <div key={activeTab} className="qf-page-transition">
            {renderActivePage()}
          </div>
        </main>
      </div>
    </div>
  );
};
