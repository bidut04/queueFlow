import React from 'react';
import { ShieldAlert, LogOut } from 'lucide-react';
import type { Organization } from '../types/platform';

interface TenantContextBannerProps {
  organization: Organization;
  onExitContext: () => void;
}

export const TenantContextBanner: React.FC<TenantContextBannerProps> = ({
  organization,
  onExitContext
}) => {
  return (
    <div
      style={{
        backgroundColor: '#1e1b4b',
        color: '#ffffff',
        padding: '10px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '2px solid #6366f1',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        zIndex: 9999,
        position: 'sticky',
        top: 0
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            backgroundColor: '#4338ca',
            padding: '4px 10px',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.5px',
            textTransform: 'uppercase'
          }}
        >
          <ShieldAlert size={14} color="#a5b4fc" />
          Super Admin Impersonation Mode
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, color: '#c7d2fe' }}>Viewing Organization:</span>
          <span style={{ fontWeight: 800, fontSize: 14, color: '#ffffff' }}>
            {organization.name}
          </span>
          <span
            style={{
              fontSize: 11,
              backgroundColor: '#312e81',
              color: '#93c5fd',
              padding: '2px 8px',
              borderRadius: 4,
              fontFamily: 'monospace'
            }}
          >
            {organization.id}
          </span>
          <span
            style={{
              fontSize: 11,
              backgroundColor: '#1e293b',
              color: '#a7f3d0',
              padding: '2px 8px',
              borderRadius: 4
            }}
          >
            {organization.currentShard}
          </span>
        </div>
      </div>

      <button
        onClick={onExitContext}
        style={{
          backgroundColor: '#4f46e5',
          color: '#ffffff',
          border: '1px solid #6366f1',
          borderRadius: 6,
          padding: '6px 14px',
          fontSize: 12,
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          transition: 'all 0.2s ease'
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#4338ca')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#4f46e5')}
      >
        <LogOut size={14} />
        Exit Tenant Context (Back to Platform Control Tower)
      </button>
    </div>
  );
};
