import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Bell,
  Building2,
  ChevronDown,
  LogOut
} from 'lucide-react';
import { platformStore } from '../services/platformState';
import type { Organization } from '../types/platform';
import { authApi } from '../../../api/auth.api';

interface PlatformHeaderProps {
  onSelectTenantContext: (orgId: string) => void;
  onExitPlatform: () => void;
}

export const PlatformHeader: React.FC<PlatformHeaderProps> = ({
  onSelectTenantContext,
  onExitPlatform
}) => {
  const [organizations, setOrganizations] = useState<Organization[]>(platformStore.organizations);
  const [currentUser, setCurrentUser] = useState(platformStore.currentUser);
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);

  useEffect(() => {
    return platformStore.subscribe(() => {
      setOrganizations([...platformStore.organizations]);
      setCurrentUser({ ...platformStore.currentUser });
    });
  }, []);

  return (
    <header
      style={{
        height: 42,
        width: '100%',
        backgroundColor: '#ffffff',
        color: '#0f172a',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 12px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        flexShrink: 0
      }}
    >
      {/* Brand & Workspace Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(79,70,229,0.25)'
            }}
          >
            <ShieldCheck size={14} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontWeight: 800, fontSize: 13, letterSpacing: '-0.3px', color: '#0f172a' }}>
                QueueFlow
              </span>
              <span
                style={{
                  backgroundColor: '#e0e7ff',
                  color: '#4338ca',
                  fontSize: 8.5,
                  fontWeight: 800,
                  padding: '1px 5px',
                  borderRadius: 4,
                  border: '1px solid #c7d2fe',
                  letterSpacing: '0.4px',
                  textTransform: 'uppercase'
                }}
              >
                Control Tower
              </span>
            </div>
          </div>
        </div>

        <div style={{ height: 16, width: 1, backgroundColor: '#e2e8f0', margin: '0 2px' }} />

        {/* Organization Quick Switcher */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowOrgDropdown((prev) => !prev)}
            style={{
              backgroundColor: '#f8fafc',
              color: '#334155',
              border: '1px solid #cbd5e1',
              borderRadius: 5,
              padding: '3px 8px',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              transition: 'all 0.15s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#94a3b8';
              e.currentTarget.style.backgroundColor = '#f1f5f9';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.backgroundColor = '#f8fafc';
            }}
          >
            <Building2 size={12} color="#4f46e5" />
            <span>Switch Context</span>
            <ChevronDown size={12} color="#64748b" />
          </button>

          {showOrgDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: 4,
                width: 230,
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 6,
                boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                padding: '4px 0',
                zIndex: 200
              }}
            >
              <div style={{ padding: '6px 10px', borderBottom: '1px solid #f1f5f9' }}>
                <p style={{ fontSize: 9.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', margin: 0 }}>
                  Select Tenant Organization
                </p>
              </div>
              <div style={{ maxHeight: 220, overflowY: 'auto' }}>
                {organizations.map((org) => (
                  <button
                    key={org.id}
                    onClick={() => {
                      setShowOrgDropdown(false);
                      onSelectTenantContext(org.id);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '6px 10px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#0f172a',
                      fontSize: 11,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'backgroundColor 0.15s ease'
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 11, color: '#0f172a' }}>{org.name}</p>
                      <p style={{ margin: 0, fontSize: 9.5, color: '#64748b' }}>
                        {org.type} • {org.currentShard}
                      </p>
                    </div>
                    <span
                      style={{
                        fontSize: 8.5,
                        fontWeight: 700,
                        padding: '1px 5px',
                        borderRadius: 3,
                        backgroundColor: org.status === 'ACTIVE' ? '#d1fae5' : '#fee2e2',
                        color: org.status === 'ACTIVE' ? '#047857' : '#b91c1c'
                      }}
                    >
                      {org.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Header Status & User */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* System Status Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            backgroundColor: '#ecfdf5',
            padding: '3px 8px',
            borderRadius: 12,
            border: '1px solid #a7f3d0',
            fontSize: 10,
            fontWeight: 700,
            color: '#047857'
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 5px #10b981' }} />
          Operational
        </div>

        {/* Notifications Icon */}
        <button
          style={{
            position: 'relative',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            padding: 4,
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Platform Security Alerts"
        >
          <Bell size={15} />
          <span
            style={{
              position: 'absolute',
              top: 2,
              right: 2,
              width: 5,
              height: 5,
              borderRadius: '50%',
              backgroundColor: '#ef4444'
            }}
          />
        </button>

        <div style={{ height: 16, width: 1, backgroundColor: '#e2e8f0' }} />

        {/* Super Admin User Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {currentUser.avatarUrl ? (
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1px solid #c7d2fe'
              }}
            />
          ) : (
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: '#e0e7ff',
                color: '#4338ca',
                fontSize: 10,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              AW
            </div>
          )}
          <div style={{ textAlign: 'left' }}>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#0f172a' }}>{currentUser.name}</p>
            <p style={{ margin: 0, fontSize: 9, color: '#4f46e5', fontWeight: 700 }}>{currentUser.role}</p>
          </div>
        </div>

        {/* Exit Super Admin to Tenant App Button */}
        <button
          onClick={onExitPlatform}
          title="Exit Super Admin and view Tenant Application"
          style={{
            backgroundColor: '#ffffff',
            color: '#475569',
            border: '1px solid #cbd5e1',
            borderRadius: 5,
            padding: '3px 8px',
            fontSize: 10.5,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            transition: 'all 0.15s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = '#4f46e5';
            e.currentTarget.style.borderColor = '#818cf8';
            e.currentTarget.style.backgroundColor = '#f8fafc';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = '#475569';
            e.currentTarget.style.borderColor = '#cbd5e1';
            e.currentTarget.style.backgroundColor = '#ffffff';
          }}
        >
          <Building2 size={12} />
          Tenant App
        </button>

        {/* Super Admin Log Out Button */}
        <button
          onClick={() => authApi.logout()}
          title="Sign out of Super Admin"
          style={{
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            border: '1px solid #fee2e2',
            borderRadius: 5,
            padding: '3px 8px',
            fontSize: 10.5,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            transition: 'all 0.15s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#fee2e2';
            e.currentTarget.style.borderColor = '#fecaca';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#fef2f2';
            e.currentTarget.style.borderColor = '#fee2e2';
          }}
        >
          <LogOut size={12} color="#dc2626" />
          Log Out
        </button>
      </div>
    </header>
  );
};
