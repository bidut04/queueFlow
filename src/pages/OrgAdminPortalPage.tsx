import React, { useState, useEffect } from 'react';
import { orgAdminAuthStore, type OrgAdminUser } from '../modules/platform/services/orgAdminAuthStore';
import { platformStore } from '../modules/platform/services/platformState';
import type { Organization } from '../modules/platform/types/platform';
import { OrgAdminAuthCard } from '../modules/platform/components/orgPortal/OrgAdminAuthCard';
import { OrgAdminStatusCard } from '../modules/platform/components/orgPortal/OrgAdminStatusCard';
import { CreateOrganizationWizardPage } from '../modules/platform/components/wizard/CreateOrganizationWizardPage';
import { Building2, ArrowLeft } from 'lucide-react';

interface OrgAdminPortalPageProps {
  onNavigateToSuperAdmin?: () => void;
  onEnterTenantDashboard?: (org: Organization) => void;
}

export const OrgAdminPortalPage: React.FC<OrgAdminPortalPageProps> = ({
  onNavigateToSuperAdmin,
  onEnterTenantDashboard
}) => {
  const [currentUser, setCurrentUser] = useState<OrgAdminUser | null>(orgAdminAuthStore.currentUser);
  const [currentOrg, setCurrentOrg] = useState<Organization | undefined>(
    orgAdminAuthStore.getAssociatedOrganization()
  );
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  useEffect(() => {
    const unsubAuth = orgAdminAuthStore.subscribe(() => {
      const user = orgAdminAuthStore.currentUser;
      setCurrentUser(user);
      setCurrentOrg(orgAdminAuthStore.getAssociatedOrganization());
    });

    const unsubPlatform = platformStore.subscribe(() => {
      setCurrentOrg(orgAdminAuthStore.getAssociatedOrganization());
    });

    return () => {
      unsubAuth();
      unsubPlatform();
    };
  }, []);

  const handleAuthenticated = (user: OrgAdminUser) => {
    setCurrentUser(user);
    const existingOrg = orgAdminAuthStore.getAssociatedOrganization();
    setCurrentOrg(existingOrg);
    if (!existingOrg) {
      setIsRegistering(true);
    }
  };

  const handleRegistrationSuccess = (newOrg: Organization) => {
    orgAdminAuthStore.setRegisteredOrganization(newOrg.id);
    setCurrentOrg(newOrg);
    setIsRegistering(false);
  };

  const handleLaunchTenantApp = (org: Organization) => {
    platformStore.switchTenantContext(org.id);
    if (onEnterTenantDashboard) {
      onEnterTenantDashboard(org);
    } else {
      window.location.href = '/dashboard';
    }
  };

  const handleOpenSuperAdmin = () => {
    if (onNavigateToSuperAdmin) {
      onNavigateToSuperAdmin();
    } else {
      window.location.href = '/platform';
    }
  };

  return (
    <div
      style={{
        width: '100%',
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        boxSizing: 'border-box'
      }}
    >
      {/* Top Banner Navigation Helper for pair testing */}
      <div
        style={{
          width: '100%',
          marginBottom: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <a
            href="/login"
            onClick={(e) => { e.preventDefault(); window.location.href = '/login'; }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none', color: '#64748b', fontSize: 12, fontWeight: 700 }}
            title="Back to Login"
          >
            <ArrowLeft size={15} />
          </a>
          <Building2 size={18} color="#522b47" />
          <span style={{ fontSize: 13, fontWeight: 800, color: '#1e293b' }}>
            Organization Admin Self-Service Portal
          </span>
        </div>

        <button
          type="button"
          onClick={handleOpenSuperAdmin}
          style={{
            backgroundColor: '#090d16',
            color: '#818cf8',
            border: '1px solid #1e293b',
            borderRadius: 6,
            padding: '5px 12px',
            fontSize: 11,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          Super Admin Control Tower (Approvals)
        </button>
      </div>

      {/* Main View Switcher */}
      {!currentUser ? (
        // 1. Not Authenticated: Beautiful login page matching user's screenshot
        <OrgAdminAuthCard onAuthenticated={handleAuthenticated} />
      ) : isRegistering || !currentOrg ? (
        // 2. Authenticated but Needs to Register: Reused 5-Step Wizard
        <div style={{ width: '100%' }}>
          <CreateOrganizationWizardPage
            mode="ORG_ADMIN"
            initialAdminData={{
              primaryAdminName: currentUser.name,
              primaryAdminEmail: currentUser.email,
              primaryAdminPhone: currentUser.phone
            }}
            onSuccess={handleRegistrationSuccess}
            onCancel={() => {
              if (currentOrg) {
                setIsRegistering(false);
              } else {
                orgAdminAuthStore.signOut();
              }
            }}
          />
        </div>
      ) : (
        // 3. Registered: Real-time Application Status Tracker
        <OrgAdminStatusCard
          user={currentUser}
          organization={currentOrg}
          onSignOut={() => {
            orgAdminAuthStore.signOut();
            setIsRegistering(false);
          }}
          onEditRegistration={() => setIsRegistering(true)}
          onEnterTenantDashboard={handleLaunchTenantApp}
          onOpenSuperAdminTower={handleOpenSuperAdmin}
        />
      )}
    </div>
  );
};
