import React, { useState, useEffect } from 'react';
import {
  FolderTree,
  Plus,
  Save,
  CheckCircle2,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  Settings,
  Eye,
  X,
  Layers,
  Sparkles,
  Lock,
  GitBranch,
  Briefcase
} from 'lucide-react';
import type { FormConfig, FormField, FieldType, FormType, LoginConfig } from '../types/formBuilder';
import { formStore } from '../utils/formEngine';
import { FieldPalette } from '../components/forms/FieldPalette';
import { FieldSettingsPanel } from '../components/forms/FieldSettingsPanel';
import { DynamicFormRenderer } from '../components/forms/DynamicFormRenderer';
import { Button } from '../components/ui/Button';

export const FormBuilderPage: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = useState<string>('branch_kolkata');
  const [selectedFormType, setSelectedFormType] = useState<FormType>('BOOKING');
  const [selectedService, setSelectedService] = useState<string>('service_kyc');
  const [activeConfig, setActiveConfig] = useState<FormConfig | null>(null);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Login config state
  const [loginConfig, setLoginConfig] = useState<LoginConfig>({
    tenantId: 'tenant_queflow_bank',
    branchId: 'branch_kolkata',
    supportedIdentifiers: ['PHONE', 'EMAIL', 'CUSTOMER_ID'],
    allowPasswordAuth: true,
    allowOtpAuth: true,
    requireCaptcha: false
  });

  useEffect(() => {
    const loadedConfigs = formStore.getConfigs();

    const matching = loadedConfigs.find(
      (c) =>
        c.branchId === selectedBranch &&
        c.formType === selectedFormType &&
        (selectedFormType === 'BOOKING' ? c.serviceId === selectedService : true)
    );

    if (matching) {
      if (selectedFormType === 'BOOKING' || selectedFormType === 'APPOINTMENT') {
        const allowedKeys = ['full_name', 'phone', 'service', 'gender'];
        const filtered = matching.fields.filter((f) => allowedKeys.includes(f.key));
        const updatedConfig = { ...matching, fields: filtered };
        setActiveConfig(updatedConfig);
        if (filtered.length > 0) setSelectedFieldId(filtered[0].id);
      } else {
        setActiveConfig(matching);
        if (matching.fields.length > 0) {
          setSelectedFieldId(matching.fields[0].id);
        }
      }
    } else {
      // Create new draft template if none exists
      const newForm: FormConfig = {
        id: `form_${selectedFormType.toLowerCase()}_${selectedBranch}_v1`,
        tenantId: 'tenant_queflow_bank',
        branchId: selectedBranch,
        serviceId: selectedFormType === 'BOOKING' ? selectedService : undefined,
        name: `${selectedBranch.replace('branch_', '').toUpperCase()} ${selectedFormType} Form`,
        description: `Custom ${selectedFormType.toLowerCase()} form configuration for branch`,
        formType: selectedFormType,
        version: 1,
        status: 'DRAFT',
        fields: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      formStore.saveFormConfig(newForm);
      setActiveConfig(newForm);
    }

    // Load login config
    const logins = formStore.getLoginConfigs();
    const lMatch = logins.find((l) => l.branchId === selectedBranch);
    if (lMatch) setLoginConfig(lMatch);
  }, [selectedBranch, selectedFormType, selectedService]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSaveDraft = () => {
    if (!activeConfig) return;
    const saved = formStore.saveFormConfig(activeConfig);
    setActiveConfig(saved);
    showToast('Draft configuration saved successfully!');
  };

  const handlePublish = () => {
    if (!activeConfig) return;
    const published = formStore.publishFormConfig(activeConfig.id);
    if (published) {
      setActiveConfig(published);
      showToast('Form Published! Now active for live customer bookings.');
    }
  };

  const handleCreateNewVersion = () => {
    if (!activeConfig) return;
    const newVersion = formStore.createNewVersion(activeConfig);
    setActiveConfig(newVersion);
    showToast(`Created new Draft Version V${newVersion.version}`);
  };

  const handleAddField = (type: FieldType) => {
    if (!activeConfig) return;

    const count = activeConfig.fields.length + 1;
    const newKey = `field_${type.toLowerCase()}_${count}`;
    const newField: FormField = {
      id: `f_${Date.now()}`,
      key: newKey,
      label: `New ${type.replace('_', ' ')} Field`,
      type,
      placeholder: `Enter ${type.toLowerCase()}...`,
      required: false,
      enabled: true,
      order: count,
      options: ['DROPDOWN', 'RADIO', 'CHECKBOX', 'MULTI_SELECT'].includes(type)
        ? [
            { value: 'OPTION_1', label: 'Option 1', enabled: true, order: 1 },
            { value: 'OPTION_2', label: 'Option 2', enabled: true, order: 2 }
          ]
        : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedFields = [...activeConfig.fields, newField];
    const updatedConfig = { ...activeConfig, fields: updatedFields };
    setActiveConfig(updatedConfig);
    setSelectedFieldId(newField.id);
  };

  const handleUpdateField = (updated: FormField) => {
    if (!activeConfig) return;
    const updatedFields = activeConfig.fields.map((f) => (f.id === updated.id ? updated : f));
    setActiveConfig({ ...activeConfig, fields: updatedFields });
  };

  const handleDeleteField = (id: string) => {
    if (!activeConfig) return;
    const updatedFields = activeConfig.fields.filter((f) => f.id !== id);
    setActiveConfig({ ...activeConfig, fields: updatedFields });
    if (selectedFieldId === id) {
      setSelectedFieldId(updatedFields[0]?.id || null);
    }
  };

  const handleDuplicateField = (field: FormField) => {
    if (!activeConfig) return;
    const newField: FormField = {
      ...field,
      id: `f_${Date.now()}`,
      key: `${field.key}_copy`,
      label: `${field.label} (Copy)`,
      order: activeConfig.fields.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updatedFields = [...activeConfig.fields, newField];
    setActiveConfig({ ...activeConfig, fields: updatedFields });
    setSelectedFieldId(newField.id);
  };

  const handleMoveField = (index: number, direction: 'up' | 'down') => {
    if (!activeConfig) return;
    const fields = [...activeConfig.fields];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= fields.length) return;

    const temp = fields[index];
    fields[index] = fields[targetIndex];
    fields[targetIndex] = temp;

    // Reassign order
    fields.forEach((f, idx) => {
      f.order = idx + 1;
    });

    setActiveConfig({ ...activeConfig, fields });
  };

  const selectedField = activeConfig?.fields.find((f) => f.id === selectedFieldId);

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

      {/* Top Page Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
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
              <FolderTree size={18} color="#2563eb" />
            </div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Dynamic Branch Form Builder
              </h1>
              <p style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                Configure custom fields, validation rules & conditional logic per branch & service.
              </p>
            </div>
          </div>
        </div>

        {/* Top Control Bar: Branch, Form Type, Service Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Branch Picker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: '#ffffff', padding: '4px 10px', borderRadius: 8, border: '1px solid #cbd5e1' }}>
            <GitBranch size={13} color="#2563eb" />
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              style={{ border: 'none', outline: 'none', backgroundColor: 'transparent', fontSize: 11.5, fontWeight: 700, color: '#0f172a', cursor: 'pointer' }}
            >
              <option value="branch_kolkata">Kolkata Branch</option>
              <option value="branch_delhi">Delhi Branch</option>
              <option value="branch_siliguri">Siliguri Branch</option>
              <option value="branch_main">Main Branch</option>
            </select>
          </div>

          {/* Form Type Picker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: '#ffffff', padding: '4px 10px', borderRadius: 8, border: '1px solid #cbd5e1' }}>
            <Layers size={13} color="#2563eb" />
            <select
              value={selectedFormType}
              onChange={(e) => setSelectedFormType(e.target.value as FormType)}
              style={{ border: 'none', outline: 'none', backgroundColor: 'transparent', fontSize: 11.5, fontWeight: 700, color: '#0f172a', cursor: 'pointer' }}
            >
              <option value="BOOKING">Booking Form</option>
              <option value="REGISTRATION">Registration Form</option>
              <option value="LOGIN">Login Configuration</option>
              <option value="APPOINTMENT">Appointment Form</option>
              <option value="FEEDBACK">Feedback Form</option>
            </select>
          </div>

          {/* Service Picker (For BOOKING form type) */}
          {selectedFormType === 'BOOKING' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: '#ffffff', padding: '4px 10px', borderRadius: 8, border: '1px solid #cbd5e1' }}>
              <Briefcase size={13} color="#2563eb" />
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                style={{ border: 'none', outline: 'none', backgroundColor: 'transparent', fontSize: 11.5, fontWeight: 700, color: '#0f172a', cursor: 'pointer' }}
              >
                <option value="service_kyc">KYC Verification Service</option>
                <option value="service_cash">Cash Deposit Service</option>
                <option value="service_loan">Loan Consultation Service</option>
                <option value="service_specialist">Specialist Consultation</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Version Status Toolbar */}
      {activeConfig && (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: 12,
          border: '1px solid #e2e8f0',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
            <Button
              type="button"
              variant="secondary"
              icon={<Eye size={14} />}
              onClick={() => setIsPreviewModalOpen(true)}
            >
              Live Preview
            </Button>

            {activeConfig.status === 'PUBLISHED' ? (
              <Button
                type="button"
                variant="secondary"
                icon={<Plus size={14} />}
                onClick={handleCreateNewVersion}
              >
                Create New Draft Version
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  icon={<Save size={14} />}
                  onClick={handleSaveDraft}
                >
                  Save Draft
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  icon={<CheckCircle2 size={14} />}
                  onClick={handlePublish}
                >
                  Publish Version
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Form Builder Layout: 3 Columns (Palette, Canvas, Settings) */}
      {selectedFormType === 'LOGIN' ? (
        /* Special Login Configuration Panel */
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: 12,
          border: '1px solid #e2e8f0',
          padding: 24,
          maxWidth: 600,
          display: 'flex',
          flexDirection: 'column',
          gap: 18
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid #f1f5f9', paddingBottom: 12 }}>
            <Lock size={20} color="#2563eb" />
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Branch Login Strategy Configuration
              </h3>
              <p style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                Configure supported authentication identifiers for {selectedBranch.replace('branch_', '').toUpperCase()} Branch.
              </p>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 8 }}>
              Supported Customer Login Identifiers:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {(['EMAIL', 'PHONE', 'CUSTOMER_ID', 'USERNAME'] as const).map((idType) => {
                const isChecked = loginConfig.supportedIdentifiers.includes(idType);
                return (
                  <label
                    key={idType}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: isChecked ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
                      backgroundColor: isChecked ? '#eff6ff' : '#ffffff',
                      fontSize: 12,
                      fontWeight: 700,
                      color: isChecked ? '#1d4ed8' : '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        const updated = isChecked
                          ? loginConfig.supportedIdentifiers.filter((i) => i !== idType)
                          : [...loginConfig.supportedIdentifiers, idType];
                        const newConfig = { ...loginConfig, supportedIdentifiers: updated };
                        setLoginConfig(newConfig);
                        formStore.saveLoginConfig(newConfig);
                        showToast('Login configuration updated!');
                      }}
                      style={{ accentColor: '#2563eb' }}
                    />
                    <span>{idType.replace('_', ' ')}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, borderTop: '1px solid #f1f5f9', paddingTop: 14 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, color: '#334155', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={loginConfig.allowPasswordAuth}
                onChange={(e) => {
                  const newConfig = { ...loginConfig, allowPasswordAuth: e.target.checked };
                  setLoginConfig(newConfig);
                  formStore.saveLoginConfig(newConfig);
                  showToast('Password authentication setting updated!');
                }}
                style={{ accentColor: '#2563eb' }}
              />
              Allow Password Authentication
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, color: '#334155', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={loginConfig.allowOtpAuth}
                onChange={(e) => {
                  const newConfig = { ...loginConfig, allowOtpAuth: e.target.checked };
                  setLoginConfig(newConfig);
                  formStore.saveLoginConfig(newConfig);
                  showToast('SMS OTP login setting updated!');
                }}
                style={{ accentColor: '#2563eb' }}
              />
              Allow SMS / Mobile OTP Authentication
            </label>
          </div>
        </div>
      ) : (
        /* Regular Dynamic Form Builder Workbench */
        <div style={{
          display: 'grid',
          gridTemplateColumns: selectedField ? '260px 1fr 340px' : '260px 1fr',
          gap: 16,
          alignItems: 'start'
        }}>
          {/* 1. Left Palette */}
          <FieldPalette onAddField={handleAddField} />

          {/* 2. Center Drag & Drop Canvas */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 12,
            border: '1px solid #e2e8f0',
            padding: 16,
            minHeight: 520,
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 10 }}>
              <div>
                <h4 style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Form Field Canvas ({activeConfig?.fields.length || 0} fields)
                </h4>
                <p style={{ fontSize: 10.5, color: '#64748b', marginTop: 2 }}>
                  Reorder, configure options, set conditional visibility & validation.
                </p>
              </div>
            </div>

            {/* Field Canvas Items List */}
            {activeConfig?.fields.length === 0 ? (
              <div style={{ padding: '48px 16px', textAlign: 'center', color: '#94a3b8', border: '2px dashed #e2e8f0', borderRadius: 10 }}>
                <FolderTree size={32} color="#cbd5e1" style={{ marginBottom: 8 }} />
                <p style={{ fontSize: 13, fontWeight: 700, color: '#475569', margin: 0 }}>
                  No fields added to this form yet
                </p>
                <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                  Click any field type from the left palette to build your branch form.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {activeConfig?.fields.map((field, idx) => {
                  const isSelected = field.id === selectedFieldId;
                  return (
                    <div
                      key={field.id}
                      onClick={() => setSelectedFieldId(field.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        borderRadius: 10,
                        border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                        backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: isSelected ? '0 4px 12px rgba(37, 99, 235, 0.12)' : 'none'
                      }}
                    >
                      {/* Left Reorder & Details */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveField(idx, 'up');
                            }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0, opacity: idx === 0 ? 0.3 : 1 }}
                          >
                            <ArrowUp size={12} />
                          </button>
                          <button
                            type="button"
                            disabled={idx === (activeConfig?.fields.length || 0) - 1}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveField(idx, 'down');
                            }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0 }}
                          >
                            <ArrowDown size={12} />
                          </button>
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>
                              {field.label}
                            </span>
                            {field.required && (
                              <span style={{ fontSize: 9.5, fontWeight: 800, color: '#ef4444', backgroundColor: '#fef2f2', padding: '1px 5px', borderRadius: 4 }}>
                                REQUIRED
                              </span>
                            )}
                            {field.visibility && (
                              <span style={{ fontSize: 9.5, fontWeight: 800, color: '#2563eb', backgroundColor: '#eff6ff', padding: '1px 5px', borderRadius: 4 }}>
                                CONDITIONAL
                              </span>
                            )}
                          </div>
                          <p style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>
                            Key: <code>{field.key}</code> | Type: <strong>{field.type}</strong>
                          </p>
                        </div>
                      </div>

                      {/* Right Action Icons */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <button
                          type="button"
                          title="Duplicate"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateField(field);
                          }}
                          style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 4 }}
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          type="button"
                          title="Settings"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFieldId(field.id);
                          }}
                          style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', padding: 4 }}
                        >
                          <Settings size={14} />
                        </button>
                        <button
                          type="button"
                          title="Delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteField(field.id);
                          }}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 4 }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. Right Field Settings Panel */}
          {selectedField && (
            <FieldSettingsPanel
              field={selectedField}
              allFields={activeConfig?.fields || []}
              onUpdateField={handleUpdateField}
              onClose={() => setSelectedFieldId(null)}
            />
          )}
        </div>
      )}

      {/* Live Form Interactive Preview Modal */}
      {isPreviewModalOpen && activeConfig && (
        <div className="qf-modal-overlay">
          <div className="qf-modal-content" style={{ padding: 24, maxWidth: 540 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, borderBottom: '1px solid #f1f5f9', paddingBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Eye size={18} color="#2563eb" />
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Live Form Preview ({activeConfig.branchId.replace('branch_', '').toUpperCase()})
                </h3>
              </div>
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>

            <DynamicFormRenderer
              form={activeConfig}
              onSubmit={(submitted) => {
                alert(`Dynamic Form Submitted Successfully!\n\nPayload Snapshot:\n${JSON.stringify(submitted, null, 2)}`);
                setIsPreviewModalOpen(false);
              }}
              onCancel={() => setIsPreviewModalOpen(false)}
              submitButtonText="Test Submit"
            />
          </div>
        </div>
      )}
    </div>
  );
};
