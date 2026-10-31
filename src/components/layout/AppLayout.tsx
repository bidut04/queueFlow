import { PageSkeleton } from '../ui/PageSkeleton';
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import type { NavPageId } from '../../types/navigation';
import { platformStore } from '../../modules/platform/services/platformState';
import { TenantContextBanner } from '../../modules/platform/components/TenantContextBanner';
import { authApi } from '../../api/auth.api';
import {
  canUserAccessPage,
  PERMISSIONS_UPDATED_EVENT,
} from '../../lib/permissions';

// Route-based Dynamic Code-Splitting via React.lazy
const DashboardPage = lazy(() => import('../../pages/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const BookingsPage = lazy(() => import('../../pages/BookingsPage').then((m) => ({ default: m.BookingsPage })));
const MasterBookingFormPage = lazy(() => import('../../pages/MasterBookingFormPage').then((m) => ({ default: m.MasterBookingFormPage })));
const BranchesPage = lazy(() => import('../../pages/BranchesPage').then((m) => ({ default: m.BranchesPage })));
const ServicesPage = lazy(() => import('../../pages/ServicesPage').then((m) => ({ default: m.ServicesPage })));
const CategoriesPage = lazy(() => import('../../pages/CategoriesPage').then((m) => ({ default: m.CategoriesPage })));
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
const PermissionsMatrixPage = lazy(() => import('../../pages/PermissionsMatrixPage').then((m) => ({ default: m.PermissionsMatrixPage })));
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
      'permissions',
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
  const [activeTenantContext, setActiveTenantContext] = useState(() => authApi.isSuperAdmin() ? platformStore.activeTenantContext : null);
  const [, setPermissionsVersion] = useState<number>(0);

  // Subscribe to live permission grants and revocations
  useEffect(() => {
    const handlePermissionsUpdated = () => {
      setPermissionsVersion((v) => v + 1);
    };
    window.addEventListener(PERMISSIONS_UPDATED_EVENT, handlePermissionsUpdated);
    return () => {
      window.removeEventListener(PERMISSIONS_UPDATED_EVENT, handlePermissionsUpdated);
    };
  }, []);

  useEffect(() => {
    if (!authApi.isSuperAdmin()) return;
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
    // Access Control Guard: If an administrator has revoked viewing privileges for this page,
    // block access and present the Access Revoked notification
    if (!canUserAccessPage(activePage)) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[460px] p-8 text-center bg-white rounded-2xl border border-slate-200/90 shadow-xs max-w-lg mx-auto mt-12 animate-in fade-in">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-4 shadow-2xs">
            <ShieldAlert size={32} />
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 mb-2">
            Access Revoked
          </span>
          <h2 className="text-[18px] font-extrabold text-slate-900 tracking-tight">
            Module Revoked by Administrator
          </h2>
          <p className="text-xs text-slate-500 mt-2 max-w-md leading-relaxed">
            An authorized administrator has revoked viewing and operational privileges for the{' '}
            <strong className="text-slate-800 capitalize">{activePage.replace(/-/g, ' ')}</strong> module.
            This item has been removed from your navigation bar and access is currently disabled.
          </p>
          <div className="mt-5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 max-w-sm text-left">
            <span className="font-bold text-slate-800 block mb-1">Need Access to this Module?</span>
            Contact your verified Tenant Administrator to re-enable access privileges in the <strong>Permissions Matrix</strong>.
          </div>
          <button
            type="button"
            onClick={() => handleSelectPage('dashboard')}
            className="mt-6 px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft size={13} /> Return to Dashboard
          </button>
        </div>
      );
    }

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
        return <RolesPage onNavigate={(pageId) => handleSelectPage(pageId as NavPageId)} />;
      case 'permissions':
        return <PermissionsMatrixPage />;
      case 'departments':
        return <DepartmentsPage />;
      case 'employee-department-association':
        return <EmployeeDepartmentAssociationPage />;
      case 'branches':
        return <BranchesPage />;
      case 'services':
        return <ServicesPage />;
      case 'categories':
        return <CategoriesPage />;
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
