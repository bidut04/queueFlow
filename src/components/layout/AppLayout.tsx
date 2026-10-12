import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import type { NavPageId } from '../../types/navigation';
import { DashboardPage } from '../../pages/DashboardPage';
import { BookingsPage } from '../../pages/BookingsPage';
import { MasterBookingFormPage } from '../../pages/MasterBookingFormPage';
import { BranchesPage } from '../../pages/BranchesPage';
import { ServicesPage } from '../../pages/ServicesPage';
import { EmployeesPage } from '../../pages/EmployeesPage';
import { UsersPage } from '../../pages/UsersPage';
import { TicketsPage } from '../../pages/TicketsPage';
import { QueuePage } from '../../pages/QueuePage';
import { ReportsPage } from '../../pages/ReportsPage';
import { SettingsPage } from '../../pages/SettingsPage';
import { LoginPage } from '../../pages/LoginPage';
import { LoginFormPage } from '../../pages/LoginFormPage';
import { FormBuilderPage } from '../../pages/FormBuilderPage';
import { RolesPage } from '../../pages/RolesPage';
import { DepartmentsPage } from '../../pages/DepartmentsPage';
import { EmployeeDepartmentAssociationPage } from '../../pages/EmployeeDepartmentAssociationPage';
import { PlatformLayout } from '../../modules/platform/components/PlatformLayout';
import { platformStore } from '../../modules/platform/services/platformState';
import { TenantContextBanner } from '../../modules/platform/components/TenantContextBanner';
import { OrgAdminPortalPage } from '../../pages/OrgAdminPortalPage';

export const AppLayout: React.FC = () => {
  // Read clean initial page from URL path e.g. /platform or /bookings
  const getInitialPage = (): NavPageId => {
    const pathname = window.location.pathname.replace(/^\//, '');
    if (pathname.startsWith('platform')) return 'platform';
    const validPages: NavPageId[] = [
      'platform',
      'dashboard',
      'bookings',
      'master-booking-form',
      'form-builder',
      'login',
      'login-form',
      'roles',
      'departments',
      'employee-department-association',
      'branches',
      'services',
      'employees',
      'users',
      'tickets',
      'queue',
      'reports',
      'settings',
      'org-portal'
    ];
    return validPages.includes(pathname as NavPageId) ? (pathname as NavPageId) : 'dashboard';
  };

  const [activePage, setActivePage] = useState<NavPageId>(getInitialPage);
  const [activeTenantContext, setActiveTenantContext] = useState(platformStore.activeTenantContext);

  useEffect(() => {
    return platformStore.subscribe(() => {
      setActiveTenantContext(platformStore.activeTenantContext);
    });
  }, []);

  const handleSelectPage = (pageId: NavPageId) => {
    setActivePage(pageId);
    const newPath = pageId === 'dashboard' ? '/' : `/${pageId}`;
    if (window.location.pathname !== newPath) {
      window.history.pushState({ pageId }, '', newPath);
    }
  };

  // Listen for browser Back / Forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname.replace(/^\//, '');
      if (pathname.startsWith('platform')) {
        setActivePage('platform');
        return;
      }
      const validPages: NavPageId[] = [
        'platform',
        'dashboard',
        'bookings',
        'master-booking-form',
        'form-builder',
        'login',
        'login-form',
        'roles',
        'departments',
        'employee-department-association',
        'branches',
        'services',
        'employees',
        'users',
        'tickets',
        'queue',
        'reports',
        'settings',
        'org-portal'
      ];
      setActivePage(validPages.includes(pathname as NavPageId) ? (pathname as NavPageId) : 'dashboard');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Dedicated Super Admin Control Tower mode
  if (activePage === 'platform') {
    return (
      <PlatformLayout
        onExitPlatform={() => handleSelectPage('dashboard')}
        onEnterTenantApp={() => handleSelectPage('dashboard')}
      />
    );
  }

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage onNavigate={(pageId) => handleSelectPage(pageId)} />;
      case 'bookings':
        return <BookingsPage />;
      case 'master-booking-form':
        return <MasterBookingFormPage />;
      case 'form-builder':
        return <FormBuilderPage />;
      case 'login':
        return <LoginPage onNavigate={(pageId) => handleSelectPage(pageId as NavPageId)} />;
      case 'org-portal':
        return (
          <OrgAdminPortalPage
            onNavigateToSuperAdmin={() => handleSelectPage('platform')}
            onEnterTenantDashboard={() => handleSelectPage('dashboard')}
          />
        );
      case 'login-form':
        return <LoginFormPage />;
      case 'roles':
        return <RolesPage />;
      case 'departments':
        return <DepartmentsPage />;
      case 'employee-department-association':
        return <EmployeeDepartmentAssociationPage />;
      case 'branches':
        return <BranchesPage />;
      case 'services':
        return <ServicesPage />;
      case 'employees':
        return <EmployeesPage />;
      case 'users':
        return <UsersPage />;
      case 'tickets':
        return <TicketsPage />;
      case 'queue':
        return <QueuePage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage onNavigate={(pageId) => handleSelectPage(pageId)} />;
    }
  };

  return (
    <div className="app-container">
      {/* Impersonated Tenant Context Banner (if active) */}
      {activeTenantContext && (
        <TenantContextBanner
          organization={activeTenantContext}
          onExitContext={() => platformStore.switchTenantContext(null)}
        />
      )}

      {/* Fixed Left Sidebar */}
      <Sidebar activePage={activePage} onSelectPage={handleSelectPage} />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Header />
        <main
          className="content-area"
          style={
            activePage === 'login'
              ? { padding: 0, maxWidth: '100%', margin: 0, width: '100%' }
              : activePage === 'org-portal'
              ? { padding: '10px 14px', maxWidth: '100%', margin: 0 }
              : undefined
          }
        >
          <div key={activePage} className="qf-page-transition">
            {renderActivePage()}
          </div>
        </main>
      </div>
    </div>
  );
};

