import React from 'react';
import type { TenantRole } from '../../types/platform';
import { ComboBox, type ComboBoxOption } from '../../../../components/ui/Combobox';

export interface Step4Data {
  primaryAdminName: string;
  primaryAdminEmail: string;
  primaryAdminPhone: string;
  adminRole: TenantRole;
  enforceMfa: boolean;
}

interface Step4AdminAccountProps {
  data: Step4Data;
  onChange: (fields: Partial<Step4Data>) => void;
  errors: Record<string, string>;
}

const tenantRoleOptions: ComboBoxOption<TenantRole>[] = [
  { value: 'TENANT_OWNER', label: 'TENANT_OWNER (Full Administrative Access)' },
  { value: 'TENANT_ADMIN', label: 'TENANT_ADMIN (Operational Admin Access)' }
];

export const Step4AdminAccount: React.FC<Step4AdminAccountProps> = ({
  data,
  onChange,
  errors
}) => {
  return (
    <div className="qf-card" style={{ padding: 16 }}>
      <div style={{ marginBottom: 14 }}>
        <h3 style={{ fontSize: 13.5, fontWeight: 800, color: '#0f172a', margin: 0 }}>
          Step 4: Primary Tenant Administrator Account
        </h3>
        <p style={{ fontSize: 10.5, color: '#64748b', margin: '2px 0 0 0' }}>
          Create the first administrator user credentials for managing this tenant organization.
        </p>
      </div>

      <div className="qf-form-grid-4">
        {/* Admin Name */}
        <div>
          <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
            Administrator Full Name <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="text"
            value={data.primaryAdminName}
            onChange={(e) => onChange({ primaryAdminName: e.target.value })}
            placeholder="e.g. Sarah Jenkins"
            style={{
              width: '100%',
              padding: '6px 10px',
              border: `1px solid ${errors.primaryAdminName ? '#ef4444' : '#cbd5e1'}`,
              borderRadius: 5,
              fontSize: 11.5,
              color: '#0f172a',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          {errors.primaryAdminName && <p style={{ fontSize: 9.5, color: '#ef4444', margin: '2px 0 0 0' }}>{errors.primaryAdminName}</p>}
        </div>

        {/* Admin Email */}
        <div>
          <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
            Administrator Email <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="email"
            value={data.primaryAdminEmail}
            onChange={(e) => onChange({ primaryAdminEmail: e.target.value })}
            placeholder="s.jenkins@citybank.com"
            style={{
              width: '100%',
              padding: '6px 10px',
              border: `1px solid ${errors.primaryAdminEmail ? '#ef4444' : '#cbd5e1'}`,
              borderRadius: 5,
              fontSize: 11.5,
              color: '#0f172a',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          {errors.primaryAdminEmail && <p style={{ fontSize: 9.5, color: '#ef4444', margin: '2px 0 0 0' }}>{errors.primaryAdminEmail}</p>}
        </div>

        {/* Admin Phone */}
        <div>
          <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
            Direct Phone Number
          </label>
          <input
            type="text"
            value={data.primaryAdminPhone}
            onChange={(e) => onChange({ primaryAdminPhone: e.target.value })}
            placeholder="+1 (555) 987-6543"
            style={{
              width: '100%',
              padding: '6px 10px',
              border: '1px solid #cbd5e1',
              borderRadius: 5,
              fontSize: 11.5,
              color: '#0f172a',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Admin Role ComboBox */}
        <div>
          <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
            Assigned Tenant Role
          </label>
          <ComboBox<TenantRole>
            options={tenantRoleOptions}
            value={data.adminRole}
            onChange={(val) => onChange({ adminRole: val })}
            searchPlaceholder="Search role..."
          />
        </div>

        {/* Enforce MFA Checkbox */}
        <div style={{ gridColumn: 'span 2', marginTop: 4 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={data.enforceMfa}
              onChange={(e) => onChange({ enforceMfa: e.target.checked })}
              style={{ width: 15, height: 15, accentColor: '#4f46e5' }}
            />
            <span style={{ fontSize: 11, fontWeight: 600, color: '#0f172a' }}>
              Enforce Mandatory Two-Factor Authentication (MFA) on First Login
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};
