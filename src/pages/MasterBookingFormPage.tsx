import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Save,
  CheckCircle2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Settings,
  Eye,
  Sparkles,
  GitBranch,
  Briefcase,
  Edit3,
  Link,
  Copy,
  ExternalLink
} from 'lucide-react';
import type { FormConfig, FormField, FieldType } from '../types/formBuilder';
import { formStore } from '../utils/formEngine';
import { FieldSettingsPanel } from '../components/forms/FieldSettingsPanel';
import { Button } from '../components/ui/Button';
import { useSaveFormConfig, usePublishFormConfig } from '../api';
import { Combobox } from '../components/ui/Combobox';

const resolveBookingConfig = (branch: string, service: string): FormConfig => {
  const loadedConfigs = formStore.getConfigs();
  const matching = loadedConfigs.find(
    (c) => c.branchId === branch && c.serviceId === service && c.formType === 'BOOKING'
  );
  if (matching) {
    const allowedKeys = ['full_name', 'phone', 'service', 'gender'];
    const filtered = matching.fields.filter((f) => allowedKeys.includes(f.key));
    return { ...matching, fields: filtered };
  }
  const newForm: FormConfig = {
    id: `form_booking_${branch}_${service}_v1`,
    tenantId: 'tenant_queflow_bank',
    branchId: branch,
    serviceId: service,
    name: `Booking Form (${branch.replace('branch_', '').toUpperCase()})`,
    description: 'Configured booking form layout for customer appointments',
    formType: 'BOOKING',
    version: 1,
    status: 'PUBLISHED',
    fields: [
      {
        id: 'f_name',
        key: 'full_name',
        label: 'Customer Name',
        type: 'TEXT',
        placeholder: 'Enter customer name',
        required: true,
        enabled: true,
        order: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'f_phone',
        key: 'phone',
        label: 'Phone Number',
        type: 'PHONE',
        placeholder: '+880 1700 000000',
        required: true,
        enabled: true,
        order: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'f_service',
        key: 'service',
        label: 'Select Service',
        type: 'DROPDOWN',
        required: true,
        enabled: true,
        order: 3,
        options: [
          { value: 'GENERAL', label: 'General Consultation', enabled: true, order: 1 },
          { value: 'KYC', label: 'KYC Verification', enabled: true, order: 2 },
          { value: 'CASH', label: 'Cash Service', enabled: true, order: 3 },
          { value: 'LOAN', label: 'Loan Consultation', enabled: true, order: 4 },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'f_gender',
        key: 'gender',
        label: 'Gender',
        type: 'RADIO',
        required: true,
        enabled: true,
        order: 4,
        options: [
          { value: 'MALE', label: 'Male', enabled: true, order: 1 },
          { value: 'FEMALE', label: 'Female', enabled: true, order: 2 },
          { value: 'OTHER', label: 'Other', enabled: true, order: 3 },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  formStore.saveFormConfig(newForm);
  return newForm;
};

export const MasterBookingFormPage: React.FC = () => {
  const saveFormMutation = useSaveFormConfig();
  const publishFormMutation = usePublishFormConfig();

  const [selectedBranch, setSelectedBranch] = useState<string>('branch_kolkata');
  const [selectedService, setSelectedService] = useState<string>('service_kyc');
  const [activeConfig, setActiveConfig] = useState<FormConfig>(() =>
    resolveBookingConfig('branch_kolkata', 'service_kyc')
  );
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [newFieldType, setNewFieldType] = useState<FieldType>('TEXT');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const formUrl = `${window.location.origin}/book/${selectedBranch}/${selectedService}`;

  const handleBranchSelect = (branch: string) => {
    setSelectedBranch(branch);
    setActiveConfig(resolveBookingConfig(branch, selectedService));
  };

  const handleServiceSelect = (service: string) => {
    setSelectedService(service);
    setActiveConfig(resolveBookingConfig(selectedBranch, service));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSaveDraft = async () => {
    if (!activeConfig) return;
    try {
      const saved = await saveFormMutation.mutateAsync(activeConfig);
      setActiveConfig(saved);
      showToast('Form structure saved successfully!');
    } catch {
      const saved = formStore.saveFormConfig(activeConfig);
      setActiveConfig(saved);
      showToast('Form structure saved locally!');
    }
  };

  const handlePublish = async () => {
    if (!activeConfig) return;
    try {
      const published = await publishFormMutation.mutateAsync(activeConfig.id);
      if (published) {
        setActiveConfig(published);
      }
      showToast('Booking form published & activated for live bookings!');
    } catch {
      const published = formStore.publishFormConfig(activeConfig.id);
      if (published) {
        setActiveConfig(published);
      }
      showToast('Booking form published & activated!');
    }
  };

  const handleAddField = () => {
    if (!activeConfig) return;
    const count = activeConfig.fields.length + 1;
    const newField: FormField = {
      id: `f_${Date.now()}`,
      key: `field_${newFieldType.toLowerCase()}_${count}`,
      label: `New ${newFieldType.replace('_', ' ')} Field`,
      type: newFieldType,
      placeholder: `Enter ${newFieldType.toLowerCase()}...`,
      required: false,
      enabled: true,
      order: count,
      options: ['DROPDOWN', 'RADIO', 'CHECKBOX'].includes(newFieldType)
        ? [
          { value: 'OPTION_1', label: 'Option 1', enabled: true, order: 1 },
          { value: 'OPTION_2', label: 'Option 2', enabled: true, order: 2 }
        ]
        : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updated = { ...activeConfig, fields: [...activeConfig.fields, newField] };
    setActiveConfig(updated);
    setEditingField(newField);
    showToast('New field added to booking form!');
  };

  const handleUpdateField = (updatedField: FormField) => {
    if (!activeConfig) return;
    const updatedFields = activeConfig.fields.map((f) => (f.id === updatedField.id ? updatedField : f));
    setActiveConfig({ ...activeConfig, fields: updatedFields });
    setEditingField(updatedField);
  };

  const handleDeleteField = (id: string) => {
    if (!activeConfig) return;
    const updatedFields = activeConfig.fields.filter((f) => f.id !== id);
    setActiveConfig({ ...activeConfig, fields: updatedFields });
    if (editingField?.id === id) setEditingField(null);
  };

  const handleMoveField = (index: number, direction: 'up' | 'down') => {
    if (!activeConfig) return;
    const fields = [...activeConfig.fields];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= fields.length) return;

    const temp = fields[index];
    fields[index] = fields[targetIdx];
    fields[targetIdx] = temp;
    fields.forEach((f, i) => { f.order = i + 1; });

    setActiveConfig({ ...activeConfig, fields });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 9999,
          backgroundColor: '#0f172a',
          color: '#ffffff',
          fontSize: 12,
          fontWeight: 700,
          padding: '10px 16px',
          borderRadius: 8,
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <Sparkles size={16} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Title & Authorized Admin Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              backgroundColor: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileText size={18} color="#2563eb" />
            </div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Master Booking Form Editor
              </h1>
              <p style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                Configure fields, required inputs & preview how the booking form looks for customers.
              </p>
            </div>
          </div>
        </div>

        {/* Branch & Service Selectors */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: '#ffffff', padding: '5px 12px', borderRadius: 8, border: '1px solid #cbd5e1' }}>
            <GitBranch size={14} color="#2563eb" />
            <select
              value={selectedBranch}
              onChange={(e) => handleBranchSelect(e.target.value)}
              style={{ border: 'none', outline: 'none', backgroundColor: 'transparent', fontSize: 12, fontWeight: 700, color: '#0f172a', cursor: 'pointer' }}
            >
              <option value="branch_kolkata">Kolkata Branch</option>
              <option value="branch_delhi">Delhi Branch</option>
              <option value="branch_siliguri">Siliguri Branch</option>
              <option value="branch_main">Main Branch</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: '#ffffff', padding: '5px 12px', borderRadius: 8, border: '1px solid #cbd5e1' }}>
            <Briefcase size={14} color="#2563eb" />
            <select
              value={selectedService}
              onChange={(e) => handleServiceSelect(e.target.value)}
              style={{ border: 'none', outline: 'none', backgroundColor: 'transparent', fontSize: 12, fontWeight: 700, color: '#0f172a', cursor: 'pointer' }}
            >
              <option value="service_kyc">KYC Verification Service</option>
              <option value="service_cash">Cash Deposit Service</option>
              <option value="service_loan">Loan Consultation Service</option>
              <option value="service_specialist">Specialist Consultation</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shareable Public Booking Form URL Banner */}
      <div style={{
        backgroundColor: '#eff6ff',
        borderRadius: 10,
        border: '1px solid #bfdbfe',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link size={15} color="#2563eb" />
          <span style={{ fontSize: 11, fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase' }}>
            Public Customer Booking Form URL:
          </span>
          <code style={{
            backgroundColor: '#ffffff',
            padding: '3px 8px',
            borderRadius: 6,
            border: '1px solid #cbd5e1',
            fontSize: 11,
            color: '#0f172a',
            fontWeight: 600
          }}>
            {formUrl}
          </code>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(formUrl);
              showToast('Booking Form URL copied to clipboard!');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '5px 10px',
              borderRadius: 6,
              backgroundColor: '#2563eb',
              color: '#ffffff',
              fontSize: 11,
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <Copy size={12} /> Copy Link
          </button>
          <a
            href={formUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '5px 10px',
              borderRadius: 6,
              backgroundColor: '#ffffff',
              color: '#2563eb',
              border: '1px solid #bfdbfe',
              fontSize: 11,
              fontWeight: 700,
              textDecoration: 'none'
            }}
          >
            <ExternalLink size={12} /> Open Form
          </a>
        </div>
      </div>

      {/* Status Bar & Action Controls */}
      {activeConfig && (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: 12,
          border: '1px solid #e2e8f0',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>
              {activeConfig.name}
            </span>
            <span style={{
              fontSize: 10.5,
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: 6,
              backgroundColor: activeConfig.status === 'PUBLISHED' ? '#dcfce7' : '#fef3c7',
              color: activeConfig.status === 'PUBLISHED' ? '#15803d' : '#b45309'
            }}>
              V{activeConfig.version} ({activeConfig.status})
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Button variant="secondary" icon={<Save size={14} />} onClick={handleSaveDraft}>
              Save Structure
            </Button>
            <Button variant="primary" icon={<CheckCircle2 size={14} />} onClick={handlePublish}>
              Publish Active Form
            </Button>
          </div>
        </div>
      )}

      {/* Main Container Layout */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>

        {/* Left Main Column: Form Fields Structure (Flex 1) + Live Preview Underneath */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* 1. TOP SECTION: Form Fields Structure & Configuration (FLEXBOX FLEX 1) */}
          <div style={{
            flex: 1,
            backgroundColor: '#ffffff',
            borderRadius: 12,
            border: '1px solid #e2e8f0',
            padding: 18,
            display: 'flex',
            flexDirection: 'column',
            gap: 14
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 10 }}>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Edit3 size={16} color="#2563eb" /> Form Fields Structure
                </h3>
                <p style={{ fontSize: 11, color: '#64748b', marginTop: 2, margin: 0 }}>
                  Add, edit, or reorder fields needed in this booking form.
                </p>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#2563eb', backgroundColor: '#eff6ff', padding: '3px 8px', borderRadius: 6, display: 'inline-block' }}>
                {activeConfig?.fields.length || 0} Fields
              </span>
            </div>

            {/* Quick Add Field Bar (FLEXBOX LAYOUT) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: '#f8fafc', padding: 8, borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <select
                value={newFieldType}
                onChange={(e) => setNewFieldType(e.target.value as FieldType)}
                style={{ flex: 1, padding: '7px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12, fontWeight: 600, outline: 'none', backgroundColor: '#ffffff' }}
              >
                <option value="TEXT">Single Line Text</option>
                <option value="TEXTAREA">Multi-line Text</option>
                <option value="NUMBER">Number Input</option>
                <option value="EMAIL">Email Address</option>
                <option value="PHONE">Phone Number</option>
                <option value="DATE">Date Picker</option>
                <option value="TIME">Time Slot</option>
                <option value="DROPDOWN">Dropdown Selector</option>
                <option value="RADIO">Radio Choices</option>
                <option value="CHECKBOX">Checkbox Choices</option>
                <option value="FILE">File Attachment</option>
              </select>
              <Button variant="primary" icon={<Plus size={14} />} onClick={handleAddField}>
                Add Field
              </Button>
            </div>

            {/* List of Configured Fields (HORIZONTAL FLEX ROW LAYOUT - COMPACT FONT SIZE) */}
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {activeConfig?.fields.map((field, idx) => {
                const isSelected = editingField?.id === field.id;
                return (
                  <div
                    key={field.id}
                    onClick={() => setEditingField(field)}
                    style={{
                      flex: '1 1 240px',
                      minWidth: 220,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 8,
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: isSelected ? '2px solid #2563eb' : '1px solid #cbd5e1',
                      backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 2px 8px rgba(37, 99, 235, 0.12)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {/* Reorder Arrows Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveField(idx, 'up');
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: idx === 0 ? 'not-allowed' : 'pointer',
                          color: idx === 0 ? '#cbd5e1' : '#475569',
                          padding: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Move Up"
                      >
                        <ArrowUp size={11} />
                      </button>
                      <button
                        type="button"
                        disabled={idx === (activeConfig.fields.length - 1)}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveField(idx, 'down');
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: idx === (activeConfig.fields.length - 1) ? 'not-allowed' : 'pointer',
                          color: idx === (activeConfig.fields.length - 1) ? '#cbd5e1' : '#475569',
                          padding: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Move Down"
                      >
                        <ArrowDown size={11} />
                      </button>
                    </div>

                    {/* Details Column (Compact Font Size) */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 11.5, fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {field.label}
                        </span>
                        {field.required && (
                          <span style={{ fontSize: 8.5, fontWeight: 800, color: '#ef4444', backgroundColor: '#fef2f2', padding: '1px 4px', borderRadius: 4, display: 'inline-block' }}>
                            REQUIRED
                          </span>
                        )}
                        {field.visibility && (
                          <span style={{ fontSize: 8.5, fontWeight: 800, color: '#2563eb', backgroundColor: '#dbeafe', padding: '1px 4px', borderRadius: 4, display: 'inline-block' }}>
                            CONDITIONAL
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 9.5, color: '#64748b', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span>Key: <code style={{ backgroundColor: '#f1f5f9', padding: '1px 4px', borderRadius: 4, fontSize: 9 }}>{field.key}</code></span>
                        <span>|</span>
                        <span>Type: <strong style={{ color: '#334155' }}>{field.type}</strong></span>
                      </div>
                    </div>

                    {/* Action Buttons Column */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingField(field);
                        }}
                        style={{
                          background: '#f1f5f9',
                          border: '1px solid #cbd5e1',
                          borderRadius: 6,
                          color: '#2563eb',
                          cursor: 'pointer',
                          padding: 5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Edit Field Settings"
                      >
                        <Settings size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteField(field.id);
                        }}
                        style={{
                          background: '#fef2f2',
                          border: '1px solid #fecaca',
                          borderRadius: 6,
                          color: '#ef4444',
                          cursor: 'pointer',
                          padding: 5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Delete Field"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. BOTTOM SECTION UNDER IT: Live "How Form Looks Like (Live Preview)" (EXACT MATCH OF BOOKINGS PAGE HORIZONTAL FLEX FORM) */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 12,
            border: '1px solid #e2e8f0',
            padding: '16px 18px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Eye size={16} color="#2563eb" />
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  How Form Looks Like (Live Preview)
                </h3>
              </div>
              <span style={{ fontSize: 10, fontWeight: 800, color: '#16a34a', backgroundColor: '#f0fdf4', padding: '2px 8px', borderRadius: 6 }}>
                EXACT BOOKING ENTRY FORM LOOK
              </span>
            </div>

            {/* Single Row Horizontal Flex Form - EXACT BOOKINGS PAGE LOOK */}
            {activeConfig && (
              <form onSubmit={(e) => { e.preventDefault(); alert('Test Booking Entry Submitted!'); }} style={{ display: 'flex', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
                {activeConfig.fields.filter((f) => f.enabled).map((field) => (
                  <div key={field.id} style={{ flex: '1 1 170px', minWidth: 140 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                      {field.label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}
                    </label>

                    {field.type === 'DROPDOWN' ? (
                      <Combobox
                        options={(field.options || []).map((o) => ({ value: o.value, label: o.label }))}
                        value={field.defaultValue ? String(field.defaultValue) : ''}
                        onChange={() => { }}
                        placeholder={field.placeholder || `Select ${field.label.toLowerCase()}...`}
                      />
                    ) : field.type === 'RADIO' ? (
                      <Combobox
                        options={(field.options || []).map((o) => ({ value: o.value, label: o.label }))}
                        value={(field.options || [])[0]?.value || ''}
                        onChange={() => { }}
                        placeholder={`Select ${field.label.toLowerCase()}...`}
                      />
                    ) : (
                      <input
                        type={field.type === 'PHONE' ? 'text' : field.type === 'NUMBER' ? 'number' : 'text'}
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                        style={{
                          width: '100%',
                          padding: '7px 10px',
                          borderRadius: 8,
                          border: '1px solid #cbd5e1',
                          fontSize: 12,
                          fontFamily: 'inherit',
                          outline: 'none',
                          backgroundColor: '#ffffff'
                        }}
                      />
                    )}
                  </div>
                ))}

                {/* Action Buttons identical to Bookings Page */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <Button type="button" variant="secondary">
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    Confirm Booking
                  </Button>
                </div>
              </form>
            )}
          </div>

        </div>

        {/* FIELD SETTINGS DRAWER (When a field is clicked) */}
        {editingField && (
          <div style={{ width: 340, flexShrink: 0 }}>
            <FieldSettingsPanel
              field={editingField}
              allFields={activeConfig?.fields || []}
              onUpdateField={handleUpdateField}
              onClose={() => setEditingField(null)}
            />
          </div>
        )}

      </div>
    </div>
  );
};
