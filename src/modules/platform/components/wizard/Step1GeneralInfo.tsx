import React from 'react';
import type { OrgType } from '../../types/platform';
import { ComboBox, type ComboBoxOption } from '../../../../components/ui/Combobox';

export interface Step1Data {
  name: string;
  legalName: string;
  slug: string;
  type: OrgType;
  contactEmail: string;
  contactPhone: string;
  country: string;
  timezone: string;
}

interface Step1GeneralInfoProps {
  data: Step1Data;
  onChange: (fields: Partial<Step1Data>) => void;
  errors: Record<string, string>;
}

const orgTypeOptions: ComboBoxOption<OrgType>[] = [
  { value: 'BANK', label: 'Banking & Finance (BANK)' },
  { value: 'HOSPITAL', label: 'Hospital Network (HOSPITAL)' },
  { value: 'CLINIC', label: 'Healthcare Clinic (CLINIC)' },
  { value: 'GOVERNMENT', label: 'Government Agency (GOVERNMENT)' },
  { value: 'POST_OFFICE', label: 'Postal Service (POST_OFFICE)' },
  { value: 'UNIVERSITY', label: 'University & Education (UNIVERSITY)' },
  { value: 'CORPORATE', label: 'Corporate Enterprise (CORPORATE)' },
  { value: 'SERVICE_CENTER', label: 'Customer Service Center (SERVICE_CENTER)' },
  { value: 'OTHER', label: 'Other Industry (OTHER)' }
];

const countryOptions: ComboBoxOption[] = [
  { value: 'United States', label: 'United States' },
  { value: 'Canada', label: 'Canada' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'Germany', label: 'Germany' },
  { value: 'Bangladesh', label: 'Bangladesh' },
  { value: 'Singapore', label: 'Singapore' },
  { value: 'Australia', label: 'Australia' },
  { value: 'United Arab Emirates', label: 'United Arab Emirates' }
];

const timezoneOptions: ComboBoxOption[] = [
  { value: 'America/New_York', label: 'America/New_York (EST/EDT)' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles (PST/PDT)' },
  { value: 'Europe/London', label: 'Europe/London (GMT/BST)' },
  { value: 'Europe/Frankfurt', label: 'Europe/Frankfurt (CET)' },
  { value: 'Asia/Dhaka', label: 'Asia/Dhaka (BST)' },
  { value: 'Asia/Singapore', label: 'Asia/Singapore (SGT)' }
];

export const Step1GeneralInfo: React.FC<Step1GeneralInfoProps> = ({
  data,
  onChange,
  errors
}) => {
  return (
    <div className="qf-card" style={{ padding: 16 }}>
      <div style={{ marginBottom: 14 }}>
        <h3 style={{ fontSize: 13.5, fontWeight: 800, color: '#0f172a', margin: 0 }}>
          Step 1: Organization General Details
        </h3>
        <p style={{ fontSize: 10.5, color: '#64748b', margin: '2px 0 0 0' }}>
          Provide the company identity, legal entity name, industry segment, and contact attributes.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {/* Organization Name */}
        <div>
          <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
            Organization Name <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => {
              const nameVal = e.target.value;
              const generatedSlug = nameVal.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
              onChange({ name: nameVal, slug: generatedSlug });
            }}
            placeholder="e.g. City National Bank"
            style={{
              width: '100%',
              padding: '6px 10px',
              border: `1px solid ${errors.name ? '#ef4444' : '#cbd5e1'}`,
              borderRadius: 5,
              fontSize: 11.5,
              color: '#0f172a',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          {errors.name && <p style={{ fontSize: 9.5, color: '#ef4444', margin: '2px 0 0 0' }}>{errors.name}</p>}
        </div>

        {/* Legal Name */}
        <div>
          <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
            Legal Entity Name
          </label>
          <input
            type="text"
            value={data.legalName}
            onChange={(e) => onChange({ legalName: e.target.value })}
            placeholder="e.g. City National Banking Corp Ltd."
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

        {/* Slug */}
        <div>
          <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
            Tenant URL Slug <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: 10.5, color: '#64748b', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRight: 'none', padding: '6px 8px', borderRadius: '5px 0 0 5px' }}>
              app.queflow.com/
            </span>
            <input
              type="text"
              value={data.slug}
              onChange={(e) => onChange({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
              placeholder="city-national-bank"
              style={{
                flex: 1,
                padding: '6px 10px',
                border: `1px solid ${errors.slug ? '#ef4444' : '#cbd5e1'}`,
                borderRadius: '0 5px 5px 0',
                fontSize: 11.5,
                color: '#0f172a',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
          {errors.slug && <p style={{ fontSize: 9.5, color: '#ef4444', margin: '2px 0 0 0' }}>{errors.slug}</p>}
        </div>

        {/* Organization Type ComboBox */}
        <div>
          <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
            Industry Segment <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <ComboBox<OrgType>
            options={orgTypeOptions}
            value={data.type}
            onChange={(val) => onChange({ type: val })}
            searchPlaceholder="Search industry segment..."
          />
        </div>

        {/* Contact Email */}
        <div>
          <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
            Primary Contact Email <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="email"
            value={data.contactEmail}
            onChange={(e) => onChange({ contactEmail: e.target.value })}
            placeholder="admin@citybank.com"
            style={{
              width: '100%',
              padding: '6px 10px',
              border: `1px solid ${errors.contactEmail ? '#ef4444' : '#cbd5e1'}`,
              borderRadius: 5,
              fontSize: 11.5,
              color: '#0f172a',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          {errors.contactEmail && <p style={{ fontSize: 9.5, color: '#ef4444', margin: '2px 0 0 0' }}>{errors.contactEmail}</p>}
        </div>

        {/* Contact Phone */}
        <div>
          <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
            Contact Phone Number
          </label>
          <input
            type="text"
            value={data.contactPhone}
            onChange={(e) => onChange({ contactPhone: e.target.value })}
            placeholder="+1 (555) 234-5678"
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

        {/* Country ComboBox */}
        <div>
          <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
            Operating Country
          </label>
          <ComboBox
            options={countryOptions}
            value={data.country}
            onChange={(val) => onChange({ country: val })}
            searchPlaceholder="Search country..."
          />
        </div>

        {/* Timezone ComboBox */}
        <div>
          <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
            Primary Timezone
          </label>
          <ComboBox
            options={timezoneOptions}
            value={data.timezone}
            onChange={(val) => onChange({ timezone: val })}
            searchPlaceholder="Search timezone..."
          />
        </div>
      </div>
    </div>
  );
};
