import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Settings
} from 'lucide-react';
import type { FormField, FormFieldOption, VisibilityOperator } from '../../types/formBuilder';

export interface FieldSettingsPanelProps {
  field: FormField;
  allFields: FormField[];
  onUpdateField: (updated: FormField) => void;
  onClose: () => void;
}

export const FieldSettingsPanel: React.FC<FieldSettingsPanelProps> = ({
  field,
  allFields,
  onUpdateField,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'options' | 'validation' | 'visibility' | 'security'>('general');

  const otherFields = allFields.filter((f) => f.id !== field.id);

  const handleGeneralChange = (key: keyof FormField, value: unknown) => {
    onUpdateField({
      ...field,
      [key]: value,
      updatedAt: new Date().toISOString()
    });
  };

  const handleValidationChange = (key: string, value: unknown) => {
    onUpdateField({
      ...field,
      validation: {
        ...(field.validation || {}),
        [key]: value
      },
      updatedAt: new Date().toISOString()
    });
  };

  const handleSecurityChange = (key: string, value: unknown) => {
    onUpdateField({
      ...field,
      security: {
        sensitive: field.security?.sensitive ?? false,
        encrypted: field.security?.encrypted ?? false,
        searchable: field.security?.searchable ?? true,
        visibleToCustomer: field.security?.visibleToCustomer ?? true,
        visibleToStaff: field.security?.visibleToStaff ?? true,
        [key]: value
      },
      updatedAt: new Date().toISOString()
    });
  };

  const handleAddOption = () => {
    const currentOptions = field.options || [];
    const nextNum = currentOptions.length + 1;
    const newOpt: FormFieldOption = {
      value: `OPTION_${nextNum}`,
      label: `Option ${nextNum}`,
      enabled: true,
      order: nextNum
    };
    onUpdateField({
      ...field,
      options: [...currentOptions, newOpt],
      updatedAt: new Date().toISOString()
    });
  };

  const handleUpdateOption = (index: number, key: keyof FormFieldOption, value: unknown) => {
    const currentOptions = [...(field.options || [])];
    currentOptions[index] = {
      ...currentOptions[index],
      [key]: value
    };
    onUpdateField({
      ...field,
      options: currentOptions,
      updatedAt: new Date().toISOString()
    });
  };

  const handleDeleteOption = (index: number) => {
    const currentOptions = (field.options || []).filter((_, i) => i !== index);
    onUpdateField({
      ...field,
      options: currentOptions,
      updatedAt: new Date().toISOString()
    });
  };

  const showOptionsTab = ['DROPDOWN', 'RADIO', 'CHECKBOX', 'MULTI_SELECT'].includes(field.type);

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: 12,
      border: '1px solid #e2e8f0',
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 10 }}>
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Settings size={14} color="#2563eb" /> Field Settings: {field.label}
          </h4>
          <p style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>
            Field Type: <strong style={{ color: '#2563eb' }}>{field.type}</strong> | Key: <code>{field.key}</code>
          </p>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
          <X size={16} />
        </button>
      </div>

      {/* Tabs Navbar */}
      <div style={{ display: 'flex', gap: 4, backgroundColor: '#f8fafc', padding: 3, borderRadius: 8, border: '1px solid #e2e8f0' }}>
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          style={{
            flex: 1,
            padding: '5px 0',
            fontSize: 10.5,
            fontWeight: 700,
            borderRadius: 6,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTab === 'general' ? '#ffffff' : 'transparent',
            color: activeTab === 'general' ? '#2563eb' : '#64748b',
            boxShadow: activeTab === 'general' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
          }}
        >
          General
        </button>
        {showOptionsTab && (
          <button
            type="button"
            onClick={() => setActiveTab('options')}
            style={{
              flex: 1,
              padding: '5px 0',
              fontSize: 10.5,
              fontWeight: 700,
              borderRadius: 6,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'options' ? '#ffffff' : 'transparent',
              color: activeTab === 'options' ? '#2563eb' : '#64748b',
              boxShadow: activeTab === 'options' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            Options
          </button>
        )}
        <button
          type="button"
          onClick={() => setActiveTab('validation')}
          style={{
            flex: 1,
            padding: '5px 0',
            fontSize: 10.5,
            fontWeight: 700,
            borderRadius: 6,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTab === 'validation' ? '#ffffff' : 'transparent',
            color: activeTab === 'validation' ? '#2563eb' : '#64748b',
            boxShadow: activeTab === 'validation' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
          }}
        >
          Validation
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('visibility')}
          style={{
            flex: 1,
            padding: '5px 0',
            fontSize: 10.5,
            fontWeight: 700,
            borderRadius: 6,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTab === 'visibility' ? '#ffffff' : 'transparent',
            color: activeTab === 'visibility' ? '#2563eb' : '#64748b',
            boxShadow: activeTab === 'visibility' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
          }}
        >
          Rules
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('security')}
          style={{
            flex: 1,
            padding: '5px 0',
            fontSize: 10.5,
            fontWeight: 700,
            borderRadius: 6,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTab === 'security' ? '#ffffff' : 'transparent',
            color: activeTab === 'security' ? '#2563eb' : '#64748b',
            boxShadow: activeTab === 'security' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
          }}
        >
          Security
        </button>
      </div>

      {/* Tab 1: General */}
      {activeTab === 'general' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
              Field Label *
            </label>
            <input
              type="text"
              value={field.label}
              onChange={(e) => handleGeneralChange('label', e.target.value)}
              style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12 }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
              Field Key (Machine Readable) *
            </label>
            <input
              type="text"
              value={field.key}
              onChange={(e) => handleGeneralChange('key', e.target.value.toLowerCase().replace(/\s+/g, '_'))}
              style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12, fontFamily: 'monospace' }}
            />
            <p style={{ fontSize: 9.5, color: '#94a3b8', marginTop: 2 }}>
              Used in payload JSON snapshots e.g. <code>full_name</code>, <code>date_of_birth</code>
            </p>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
              Placeholder Text
            </label>
            <input
              type="text"
              value={field.placeholder || ''}
              onChange={(e) => handleGeneralChange('placeholder', e.target.value)}
              style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12 }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
              Description / User Guidance
            </label>
            <input
              type="text"
              value={field.description || ''}
              onChange={(e) => handleGeneralChange('description', e.target.value)}
              style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12 }}
            />
          </div>

          <div style={{ display: 'flex', gap: 16, borderTop: '1px solid #f1f5f9', paddingTop: 10 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#334155', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) => handleGeneralChange('required', e.target.checked)}
                style={{ accentColor: '#2563eb' }}
              />
              Is Required
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#334155', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={field.enabled}
                onChange={(e) => handleGeneralChange('enabled', e.target.checked)}
                style={{ accentColor: '#2563eb' }}
              />
              Is Enabled
            </label>
          </div>
        </div>
      )}

      {/* Tab 2: Options (For Dropdown / Radio / Checkbox) */}
      {activeTab === 'options' && showOptionsTab && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#475569' }}>CONFIGURE OPTIONS</span>
            <button
              type="button"
              onClick={handleAddOption}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 10px',
                borderRadius: 6,
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                border: '1px solid #bfdbfe',
                fontSize: 10.5,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Plus size={12} /> Add Option
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 220, overflowY: 'auto' }}>
            {(field.options || []).map((opt, idx) => (
              <div
                key={idx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 30px',
                  gap: 6,
                  alignItems: 'center',
                  backgroundColor: '#f8fafc',
                  padding: 6,
                  borderRadius: 6,
                  border: '1px solid #e2e8f0'
                }}
              >
                <input
                  type="text"
                  placeholder="Label (e.g. Male)"
                  value={opt.label}
                  onChange={(e) => handleUpdateOption(idx, 'label', e.target.value)}
                  style={{ padding: '4px 6px', borderRadius: 4, border: '1px solid #cbd5e1', fontSize: 11 }}
                />
                <input
                  type="text"
                  placeholder="Value (e.g. MALE)"
                  value={opt.value}
                  onChange={(e) => handleUpdateOption(idx, 'value', e.target.value.toUpperCase().replace(/\s+/g, '_'))}
                  style={{ padding: '4px 6px', borderRadius: 4, border: '1px solid #cbd5e1', fontSize: 11, fontFamily: 'monospace' }}
                />
                <button
                  type="button"
                  onClick={() => handleDeleteOption(idx)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Validation */}
      {activeTab === 'validation' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div>
              <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#475569', marginBottom: 3 }}>
                Min Length
              </label>
              <input
                type="number"
                placeholder="e.g. 3"
                value={field.validation?.minLength ?? ''}
                onChange={(e) => handleValidationChange('minLength', e.target.value ? Number(e.target.value) : undefined)}
                style={{ width: '100%', padding: '5px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#475569', marginBottom: 3 }}>
                Max Length
              </label>
              <input
                type="number"
                placeholder="e.g. 100"
                value={field.validation?.maxLength ?? ''}
                onChange={(e) => handleValidationChange('maxLength', e.target.value ? Number(e.target.value) : undefined)}
                style={{ width: '100%', padding: '5px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#475569', marginBottom: 3 }}>
              Regex Pattern (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. ^[0-9]{10}$"
              value={field.validation?.regex ?? ''}
              onChange={(e) => handleValidationChange('regex', e.target.value)}
              style={{ width: '100%', padding: '5px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11, fontFamily: 'monospace' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#475569', marginBottom: 3 }}>
              Custom Error Message
            </label>
            <input
              type="text"
              placeholder="e.g. Please enter a valid NID number"
              value={field.validation?.errorMessage ?? ''}
              onChange={(e) => handleValidationChange('errorMessage', e.target.value)}
              style={{ width: '100%', padding: '5px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
            />
          </div>
        </div>
      )}

      {/* Tab 4: Conditional Visibility */}
      {activeTab === 'visibility' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={{ fontSize: 10.5, color: '#64748b', margin: 0 }}>
            Configure conditional rules (e.g. Show field only when <strong>Existing Account</strong> EQUALS <strong>YES</strong>).
          </p>

          <div>
            <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#475569', marginBottom: 3 }}>
              Depends On Field
            </label>
            <select
              value={field.visibility?.dependsOn || ''}
              onChange={(e) => {
                const depKey = e.target.value;
                if (!depKey) {
                  onUpdateField({ ...field, visibility: undefined });
                } else {
                  onUpdateField({
                    ...field,
                    visibility: {
                      dependsOn: depKey,
                      operator: field.visibility?.operator || 'EQUALS',
                      value: field.visibility?.value || ''
                    }
                  });
                }
              }}
              style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11, backgroundColor: '#ffffff' }}
            >
              <option value="">No condition (Always Visible)</option>
              {otherFields.map((f) => (
                <option key={f.key} value={f.key}>
                  {f.label} ({f.key})
                </option>
              ))}
            </select>
          </div>

          {field.visibility?.dependsOn && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#475569', marginBottom: 3 }}>
                  Operator
                </label>
                <select
                  value={field.visibility.operator}
                  onChange={(e) => {
                    onUpdateField({
                      ...field,
                      visibility: {
                        ...field.visibility!,
                        operator: e.target.value as VisibilityOperator
                      }
                    });
                  }}
                  style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11, backgroundColor: '#ffffff' }}
                >
                  <option value="EQUALS">EQUALS</option>
                  <option value="NOT_EQUALS">NOT EQUALS</option>
                  <option value="CONTAINS">CONTAINS</option>
                  <option value="IN">IN LIST</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#475569', marginBottom: 3 }}>
                  Target Value
                </label>
                <input
                  type="text"
                  placeholder="e.g. YES"
                  value={String(field.visibility.value ?? '')}
                  onChange={(e) => {
                    onUpdateField({
                      ...field,
                      visibility: {
                        ...field.visibility!,
                        value: e.target.value
                      }
                    });
                  }}
                  style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 11 }}
                />
              </div>
            </>
          )}
        </div>
      )}

      {/* Tab 5: Security */}
      {activeTab === 'security' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, color: '#334155', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={field.security?.sensitive ?? false}
              onChange={(e) => handleSecurityChange('sensitive', e.target.checked)}
              style={{ accentColor: '#e11d48' }}
            />
            Sensitive Data (e.g. Passport, NID, Password)
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, color: '#334155', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={field.security?.encrypted ?? false}
              onChange={(e) => handleSecurityChange('encrypted', e.target.checked)}
              style={{ accentColor: '#2563eb' }}
            />
            Server-side Encrypted at Rest
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, color: '#334155', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={field.security?.searchable ?? true}
              onChange={(e) => handleSecurityChange('searchable', e.target.checked)}
              style={{ accentColor: '#2563eb' }}
            />
            Allow Searching in Admin Directory
          </label>
        </div>
      )}
    </div>
  );
};
