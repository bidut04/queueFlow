import React, { useState, useEffect } from 'react';
import {
  Lock,
  Plus,
  Save,
  CheckCircle2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Settings,
  Eye,
  EyeOff,
  Sparkles,
  GitBranch,
  Edit3,
  Link,
  Copy,
  ExternalLink,
  Mail,
  LogIn,
  ShieldCheck,
  Layers3
} from 'lucide-react';
import type { FormConfig, FormField, FieldType } from '../types/formBuilder';
import { formStore } from '../utils/formEngine';
import { FieldSettingsPanel } from '../components/forms/FieldSettingsPanel';
import { Button } from '../components/ui/Button';

export const LoginFormPage: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = useState<string>('branch_kolkata');
  const [activeConfig, setActiveConfig] = useState<FormConfig | null>(null);
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [newFieldType, setNewFieldType] = useState<FieldType>('TEXT');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Live Login Form State for Preview
  const [previewEmail, setPreviewEmail] = useState('');
  const [previewPassword, setPreviewPassword] = useState('');
  const [previewRole, setPreviewRole] = useState<'admin' | 'staff' | 'manager'>('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const formUrl = `${window.location.origin}/login/${selectedBranch}`;

  useEffect(() => {
    const loadedConfigs = formStore.getConfigs();
    const matching = loadedConfigs.find(
      (c) => c.branchId === selectedBranch && c.formType === 'LOGIN'
    );

    if (matching) {
      setActiveConfig(matching);
    } else {
      const defaultLoginForm: FormConfig = {
        id: `form_login_${selectedBranch}_v1`,
        tenantId: 'tenant_queflow_bank',
        branchId: selectedBranch,
        name: `Branch Login Form (${selectedBranch.replace('branch_', '').toUpperCase()})`,
        description: 'Configured login authentication form layout for staff & admins',
        formType: 'LOGIN',
        version: 1,
        status: 'PUBLISHED',
        fields: [
          {
            id: 'f_login_role',
            key: 'login_role',
            label: 'Select Login Role',
            type: 'RADIO',
            required: true,
            enabled: true,
            order: 1,
            options: [
              { value: 'admin', label: 'Admin', enabled: true, order: 1 },
              { value: 'staff', label: 'Staff', enabled: true, order: 2 },
              { value: 'manager', label: 'Manager', enabled: true, order: 3 }
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'f_login_email',
            key: 'email',
            label: 'Email or Username',
            type: 'EMAIL',
            placeholder: 'admin@queflow.com',
            required: true,
            enabled: true,
            order: 2,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'f_login_pass',
            key: 'password',
            label: 'Password',
            type: 'TEXT',
            placeholder: '••••••••••••',
            required: true,
            enabled: true,
            order: 3,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'f_remember_me',
            key: 'remember_me',
            label: 'Remember me',
            type: 'CHECKBOX',
            required: false,
            enabled: true,
            order: 4,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      formStore.saveFormConfig(defaultLoginForm);
      setActiveConfig(defaultLoginForm);
    }
  }, [selectedBranch]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSaveDraft = () => {
    if (!activeConfig) return;
    const saved = formStore.saveFormConfig(activeConfig);
    setActiveConfig(saved);
    showToast('Login form structure saved successfully!');
  };

  const handlePublish = () => {
    if (!activeConfig) return;
    const published = formStore.publishFormConfig(activeConfig.id);
    if (published) {
      setActiveConfig(published);
      showToast('Login form published & activated for live logins!');
    }
  };

  const handleAddField = () => {
    if (!activeConfig) return;
    const count = activeConfig.fields.length + 1;
    const newField: FormField = {
      id: `f_login_${Date.now()}`,
      key: `login_field_${newFieldType.toLowerCase()}_${count}`,
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
    showToast('New login field added!');
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

  const handlePreviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
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
              <Lock size={18} color="#2563eb" />
            </div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Dynamic Login Form Builder
              </h1>
              <p style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                Configure branch login fields, authentication rules & preview live login forms.
              </p>
            </div>
          </div>
        </div>

        {/* Branch Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: '#ffffff', padding: '5px 12px', borderRadius: 8, border: '1px solid #cbd5e1' }}>
            <GitBranch size={14} color="#2563eb" />
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              style={{ border: 'none', outline: 'none', backgroundColor: 'transparent', fontSize: 12, fontWeight: 700, color: '#0f172a', cursor: 'pointer' }}
            >
              <option value="branch_kolkata">Kolkata Branch</option>
              <option value="branch_delhi">Delhi Branch</option>
              <option value="branch_siliguri">Siliguri Branch</option>
              <option value="branch_main">Main Branch</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shareable Public Login Form URL Banner */}
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
            Public Branch Login URL:
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
              showToast('Login Portal URL copied to clipboard!');
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
            <ExternalLink size={12} /> Open Portal
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
                  Add, edit, or reorder fields required for branch login authentication.
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
                <option value="TEXT">Single Line Text / Username</option>
                <option value="EMAIL">Email Address</option>
                <option value="NUMBER">OTP / PIN Code</option>
                <option value="RADIO">Role Choices</option>
                <option value="DROPDOWN">Branch Dropdown</option>
                <option value="CHECKBOX">Remember Me Checkbox</option>
              </select>
              <Button variant="primary" icon={<Plus size={14} />} onClick={handleAddField}>
                Add Field
              </Button>
            </div>

            {/* List of Configured Fields (HORIZONTAL FLEX ROW LAYOUT) */}
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              {activeConfig?.fields.map((field, idx) => {
                const isSelected = editingField?.id === field.id;
                return (
                  <div
                    key={field.id}
                    onClick={() => setEditingField(field)}
                    style={{
                      flex: '1 1 220px',
                      minWidth: 200,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 10,
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: isSelected ? '2px solid #2563eb' : '1px solid #cbd5e1',
                      backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 2px 8px rgba(37, 99, 235, 0.12)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {/* Reorder Arrows Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
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
                        <ArrowUp size={13} />
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
                        <ArrowDown size={13} />
                      </button>
                    </div>

                    {/* Details Column */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>{field.label}</span>
                        {field.required && (
                          <span style={{ fontSize: 9, fontWeight: 800, color: '#ef4444', backgroundColor: '#fef2f2', padding: '1px 6px', borderRadius: 4, display: 'inline-block' }}>
                            REQUIRED
                          </span>
                        )}
                        {field.visibility && (
                          <span style={{ fontSize: 9, fontWeight: 800, color: '#2563eb', backgroundColor: '#dbeafe', padding: '1px 6px', borderRadius: 4, display: 'inline-block' }}>
                            CONDITIONAL
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 10.5, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>Key: <code style={{ backgroundColor: '#f1f5f9', padding: '1px 4px', borderRadius: 4 }}>{field.key}</code></span>
                        <span>|</span>
                        <span>Type: <strong style={{ color: '#334155' }}>{field.type}</strong></span>
                      </div>
                    </div>

                    {/* Action Buttons Column */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
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
                          padding: 6,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Edit Field Settings"
                      >
                        <Settings size={14} />
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
                          padding: 6,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Delete Field"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. BOTTOM SECTION UNDER IT: Live "How Login Form Looks Like (Live Preview)" */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 12,
            border: '1px solid #e2e8f0',
            padding: '18px 22px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: 14
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Eye size={16} color="#2563eb" />
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  How Login Form Looks Like (Live Preview)
                </h3>
              </div>
              <span style={{ fontSize: 10, fontWeight: 800, color: '#16a34a', backgroundColor: '#f0fdf4', padding: '2px 8px', borderRadius: 6 }}>
                LIVE PREVIEW
              </span>
            </div>

            {/* Authentic Live Login Preview Card */}
            <div style={{
              maxWidth: 440,
              width: '100%',
              margin: '0 auto',
              backgroundColor: '#ffffff',
              borderRadius: 16,
              border: '1px solid #cbd5e1',
              padding: '24px 24px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.06)'
            }}>
              {/* Header Branding */}
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: '#eff6ff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 10,
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)'
                }}>
                  <Layers3 size={24} color="#2563eb" />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {selectedBranch.replace('branch_', '').toUpperCase()} Login Portal
                </h3>
                <p style={{ fontSize: 11.5, color: '#64748b', marginTop: 3 }}>
                  Sign in to access your administrative workspace
                </p>
              </div>

              {/* Success Alert Banner */}
              {isSubmitted && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  color: '#166534',
                  padding: '10px 14px',
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 600,
                  marginBottom: 16
                }}>
                  <CheckCircle2 size={16} color="#16a34a" />
                  <span>Login credentials validated! Redirecting...</span>
                </div>
              )}

              {/* Dynamic Login Form */}
              <form onSubmit={handlePreviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {activeConfig?.fields.filter((f) => f.enabled).map((field) => (
                  <div key={field.id}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 5 }}>
                      {field.label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}
                    </label>

                    {field.type === 'RADIO' ? (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, backgroundColor: '#f8fafc', padding: 4, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                        {(field.options || [
                          { value: 'admin', label: 'Admin' },
                          { value: 'staff', label: 'Staff' },
                          { value: 'manager', label: 'Manager' }
                        ]).map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setPreviewRole(opt.value as 'admin' | 'staff' | 'manager')}
                            style={{
                              padding: '6px 0',
                              borderRadius: 6,
                              border: 'none',
                              fontSize: 11,
                              fontWeight: 700,
                              cursor: 'pointer',
                              backgroundColor: previewRole === opt.value ? '#ffffff' : 'transparent',
                              color: previewRole === opt.value ? '#2563eb' : '#64748b',
                              boxShadow: previewRole === opt.value ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    ) : field.type === 'CHECKBOX' ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#475569', fontWeight: 600, cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            style={{ accentColor: '#2563eb', width: 14, height: 14, cursor: 'pointer' }}
                          />
                          {field.label}
                        </label>
                        <a href="#forgot" onClick={(e) => e.preventDefault()} style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>
                          Forgot password?
                        </a>
                      </div>
                    ) : field.key === 'password' || field.type === 'TEXT' && field.label.toLowerCase().includes('password') ? (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '9px 12px',
                        borderRadius: 8,
                        border: '1px solid #cbd5e1',
                        backgroundColor: '#ffffff'
                      }}>
                        <Lock size={16} color="#94a3b8" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required={field.required}
                          placeholder={field.placeholder || '••••••••••••'}
                          value={previewPassword}
                          onChange={(e) => setPreviewPassword(e.target.value)}
                          style={{
                            width: '100%',
                            border: 'none',
                            outline: 'none',
                            fontSize: 13,
                            color: '#0f172a',
                            fontFamily: 'inherit'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#94a3b8' }}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    ) : (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '9px 12px',
                        borderRadius: 8,
                        border: '1px solid #cbd5e1',
                        backgroundColor: '#ffffff'
                      }}>
                        <Mail size={16} color="#94a3b8" />
                        <input
                          type={field.type === 'EMAIL' ? 'email' : 'text'}
                          required={field.required}
                          placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
                          value={previewEmail}
                          onChange={(e) => setPreviewEmail(e.target.value)}
                          style={{
                            width: '100%',
                            border: 'none',
                            outline: 'none',
                            fontSize: 13,
                            color: '#0f172a',
                            fontFamily: 'inherit'
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}

                <Button
                  type="submit"
                  variant="primary"
                  icon={<LogIn size={16} />}
                  className="w-full justify-center py-2.5 mt-2"
                >
                  Sign In to Workspace
                </Button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 10, color: '#94a3b8', fontSize: 11 }}>
                  <ShieldCheck size={14} color="#10b981" />
                  <span>256-bit Encrypted Secure Login</span>
                </div>
              </form>
            </div>
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
