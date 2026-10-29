import { PageSkeleton } from '../ui/PageSkeleton';
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import type { NavPageId } from '../../types/navigation';
import { platformStore } from '../../modules/platform/services/platformState';
import { TenantContextBanner } from '../../modules/platform/components/TenantContextBanner';
import { authApi } from '../../api/auth.api';

// Route-based Dynamic Code-Splitting via React.lazy
const DashboardPage = lazy(() => import('../../pages/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const BookingsPage = lazy(() => import('../../pages/BookingsPage').then((m) => ({ default: m.BookingsPage })));
const MasterBookingFormPage = lazy(() => import('../../pages/MasterBookingFormPage').then((m) => ({ default: m.MasterBookingFormPage })));
const BranchesPage = lazy(() => import('../../pages/BranchesPage').then((m) => ({ default: m.BranchesPage })));
const ServicesPage = lazy(() => import('../../pages/ServicesPage').then((m) => ({ default: m.ServicesPage })));
const EmployeesPage = lazy(() => import('../../pages/EmployeesPage').then((m) => ({ default: m.EmployeesPage })));
const UsersPage = lazy(() => import('../../pages/UsersPage').then((m) => ({ default: m.UsersPage })));
const TicketsPage = lazy(() => import('../../pages/TicketsPage').then((m) => ({ default: m.TicketsPage })));
const QueuePage = lazy(() => import('../../pages/QueuePage').then((m) => ({ default: m.QueuePage })));
const ReportsPage = lazy(() => import('../../pages/ReportsPage').then((m) => ({ default: m.ReportsPage })));
const SettingsPage = lazy(() => import('../../pages/SettingsPage').then((m) => ({ default: m.SettingsPage })));
const LoginPage = lazy(() => import('../../pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const LoginFormPage = lazy(() => import('../../pages/LoginFormPage').then((m) => ({ default: m.LoginFormPage })));
const FormBuilderPage = lazy(() => import('../../pages/FormBuilderPage').then((m) => ({ default: m.FormBuilderPage })));
const RolesPage = lazy(() => import('../../pages/RolesPage').then((m) => ({ default: m.RolesPage })));
const DepartmentsPage = lazy(() => import('../../pages/DepartmentsPage').then((m) => ({ default: m.DepartmentsPage })));
const EmployeeDepartmentAssociationPage = lazy(() => import('../../pages/EmployeeDepartmentAssociationPage').then((m) => ({ default: m.EmployeeDepartmentAssociationPage })));
const PlatformLayout = lazy(() => import('../../modules/platform/components/PlatformLayout').then((m) => ({ default: m.PlatformLayout })));
const OrgAdminPortalPage = lazy(() => import('../../pages/OrgAdminPortalPage').then((m) => ({ default: m.OrgAdminPortalPage })));
const SetupPasswordPage = lazy(() => import('../../pages/SetupPasswordPage').then((m) => ({ default: m.SetupPasswordPage })));
const QueueBookingPortalPage = lazy(() => import('../../pages/QueueBookingPortalPage').then((m) => ({ default: m.QueueBookingPortalPage })));

const PageLoadingFallback: React.FC = () => <PageSkeleton />;

export const AppLayout: React.FC = () => {
  // Read clean initial page from URL path e.g. /platform or /bookings
  const getInitialPage = (): NavPageId => {
    const pathname = window.location.pathname.replace(/^\//, '');

    // Allow password setup page and public queue booking portal without login
    if (pathname.startsWith('setup-password')) {
      return 'setup-password';
    }

    if (pathname === 'booking-portal' || pathname === 'booking' || pathname === 'queue-portal') {
      return 'queue-portal';
    }

    if (!authApi.isAuthenticated()) {
      if (window.location.pathname !== '/login') {
        window.history.replaceState({ pageId: 'login' }, '', '/login');
      }
      return 'login';
    }

    // NORMAL USER RESTRICTION: Normal users can only see the Queue & Booking portal
    if (authApi.isNormalUser()) {
      if (window.location.pathname !== '/queue-portal') {
        window.history.replaceState({ pageId: 'queue-portal' }, '', '/queue-portal');
      }
      return 'queue-portal';
    }

    const isSuper = authApi.isSuperAdmin();

    // SUPER ADMIN RESTRICTION: When Super Admin is authenticated, ONLY the platform
    // superadmin section can be opened. Never allow tenant section.
    if (isSuper) {
      if (!pathname.startsWith('platform')) {
        window.history.replaceState({ pageId: 'platform' }, '', '/platform');
      }
      return 'platform';
    }

    if (pathname.startsWith('platform')) {
      return 'dashboard';
    }

    if (pathname === 'login') {
      window.history.replaceState({ pageId: 'dashboard' }, '', '/');
      return 'dashboard';
    }

    const validPages: NavPageId[] = [
      'platform',
      'dashboard',
      'bookings',
      'master-booking-form',
      'form-builder',
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
      'org-portal',
      'setup-password',
      'queue-portal',
    ];
    if (pathname === 'booking-portal' || pathname === 'booking') return 'queue-portal';
    return validPages.includes(pathname as NavPageId) ? (pathname as NavPageId) : 'dashboard';
  };

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => authApi.isAuthenticated());
  const [activePage, setActivePage] = useState<NavPageId>(getInitialPage);
  const [activeTenantContext, setActiveTenantContext] = useState(platformStore.activeTenantContext);

  useEffect(() => {
    return platformStore.subscribe(() => {
      setActiveTenantContext(platformStore.activeTenantContext);
    });
  }, []);

  const handleSelectPage = (pageId: NavPageId) => {
    // NORMAL USER RESTRICTION: Normal user can ONLY access the Queue & Booking portal
    if (authApi.isNormalUser()) {
      setActivePage('queue-portal');
      if (window.location.pathname !== '/queue-portal') {
        window.history.replaceState({ pageId: 'queue-portal' }, '', '/queue-portal');
      }
      return;
    }

    // When super admin is authenticated, block navigating to any tenant section page
    if (authApi.isSuperAdmin() && pageId !== 'platform') {
      setActivePage('platform');
      if (window.location.pathname !== '/platform') {
        window.history.replaceState({ pageId: 'platform' }, '', '/platform');
      }
      return;
    }

    setActivePage(pageId);
    const newPath = pageId === 'dashboard' ? '/' : `/${pageId}`;
    if (window.location.pathname !== newPath) {
      window.history.pushState({ pageId }, '', newPath);
    }
  };

  // Listen for browser Back / Forward buttons and auth events
  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname.replace(/^\//, '');

      if (pathname.startsWith('setup-password')) {
        setActivePage('setup-password');
        return;
      }

      if (pathname === 'booking-portal' || pathname === 'booking' || pathname === 'queue-portal') {
        setActivePage('queue-portal');
        return;
      }

      const authed = authApi.isAuthenticated();
      setIsAuthenticated(authed);

      if (!authed) {
        setActivePage('login');
        if (window.location.pathname !== '/login') {
          window.history.replaceState({ pageId: 'login' }, '', '/login');
        }
        return;
      }

      if (authApi.isNormalUser()) {
        setActivePage('queue-portal');
        if (window.location.pathname !== '/queue-portal') {
          window.history.replaceState({ pageId: 'queue-portal' }, '', '/queue-portal');
        }
        return;
      }

      const isSuper = authApi.isSuperAdmin();

      if (isSuper) {
        if (!pathname.startsWith('platform')) {
          window.history.replaceState({ pageId: 'platform' }, '', '/platform');
        }
        setActivePage('platform');
        return;
      }

      if (pathname === 'login') {
        window.history.replaceState({ pageId: 'dashboard' }, '', '/');
        setActivePage('dashboard');
        return;
      }

      if (pathname.startsWith('platform')) {
        setActivePage('dashboard');
        return;
      }

      const validPages: NavPageId[] = [
        'platform',
        'dashboard',
        'bookings',
        'master-booking-form',
        'form-builder',
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
        'org-portal',
        'setup-password',
        'queue-portal',
      ];
      setActivePage(validPages.includes(pathname as NavPageId) ? (pathname as NavPageId) : 'dashboard');
    };

    const handleUnauthorized = () => {
      setIsAuthenticated(false);
      setActivePage('login');
      if (window.location.pathname !== '/login') {
        window.history.pushState({ pageId: 'login' }, '', '/login');
      }
    };

    const handleLogin = () => {
      setIsAuthenticated(true);
      const isSuper = authApi.isSuperAdmin();
      const isNormal = authApi.isNormalUser();
      const targetPage: NavPageId = isSuper ? 'platform' : isNormal ? 'queue-portal' : 'dashboard';
      const targetPath = isSuper ? '/platform' : isNormal ? '/queue-portal' : '/';
      setActivePage(targetPage);
      if (window.location.pathname !== targetPath) {
        window.history.replaceState({ pageId: targetPage }, '', targetPath);
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    window.addEventListener('auth:login', handleLogin);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
      window.removeEventListener('auth:login', handleLogin);
    };
  }, []);

  // Password Setup Page (Accessible via email invite link)
  if (activePage === 'setup-password') {
    return (
      <Suspense fallback={<PageLoadingFallback />}>
        <SetupPasswordPage onNavigate={(pageId) => handleSelectPage(pageId as NavPageId)} />
      </Suspense>
    );
  }

  // Public Queue & Service Booking Portal (Accessible directly at /queue-portal)
  if (activePage === 'queue-portal') {
    return (
      <Suspense fallback={<PageLoadingFallback />}>
        <QueueBookingPortalPage
          onNavigate={(pageId) => {
            handleSelectPage(pageId as NavPageId);
          }}
        />
      </Suspense>
    );
  }

  // Not logged in: Show Login Page directly (without sidebar/header)
  if (!isAuthenticated) {
    return (
      <Suspense fallback={<PageLoadingFallback />}>
        <LoginPage
          onNavigate={(pageId) => {
            setIsAuthenticated(authApi.isAuthenticated());
            handleSelectPage(pageId as NavPageId);
          }}
        />
      </Suspense>
    );
  }

  // Dedicated Super Admin Control Tower mode (Protected Guard)
  if (activePage === 'platform' || authApi.isSuperAdmin()) {
    if (!authApi.isSuperAdmin()) {
      return (
        <Suspense fallback={<PageLoadingFallback />}>
          <LoginPage
            onNavigate={(pageId) => {
              setIsAuthenticated(authApi.isAuthenticated());
              handleSelectPage(pageId as NavPageId);
            }}
            initialMessage="Super Admin authentication required to access the Platform Control Tower. Please sign in with admin@gmail.com."
          />
        </Suspense>
      );
    }

    return (
      <Suspense fallback={<PageLoadingFallback />}>
        <PlatformLayout
          onExitPlatform={async () => {
            await authApi.logout();
            setIsAuthenticated(false);
            setActivePage('login');
            window.location.href = '/login';
          }}
          onEnterTenantApp={() => {
            // Super admin is restricted to platform section only
          }}
        />
      </Suspense>
    );
  }

  // Normal user (customer): Exclusively show QueueBookingPortalPage (No sidebar, no admin header)
  if (authApi.isNormalUser()) {
    return (
      <Suspense fallback={<PageLoadingFallback />}>
        <QueueBookingPortalPage
          onNavigate={(pageId) => {
            handleSelectPage(pageId as NavPageId);
          }}
        />
      </Suspense>
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
        <Header onNavigate={(pageId) => handleSelectPage(pageId as NavPageId)} />
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
            <Suspense fallback={<PageLoadingFallback />}>
              {renderActivePage()}
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
};
