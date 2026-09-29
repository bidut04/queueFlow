import React, { useState } from 'react';
import {
  Type,
  Mail,
  Phone,
  Lock,
  Calendar,
  Clock,
  Hash,
  Upload,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import type { FormConfig, FormField } from '../../types/formBuilder';
import { evaluateFieldVisibility, validateFieldValue } from '../../utils/formEngine';
import { Combobox } from '../ui/Combobox';
import { Button } from '../ui/Button';

export interface DynamicFormRendererProps {
  form: FormConfig;
  initialValues?: Record<string, unknown>;
  onSubmit: (values: Record<string, unknown>) => void;
  onCancel?: () => void;
  readOnly?: boolean;
  submitButtonText?: string;
}

export const DynamicFormRenderer: React.FC<DynamicFormRendererProps> = ({
  form,
  initialValues = {},
  onSubmit,
  onCancel,
  readOnly = false,
  submitButtonText = 'Submit Form'
}) => {
  const [formValues, setFormValues] = useState<Record<string, unknown>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const sortedFields = [...form.fields]
    .filter((f) => f.enabled)
    .sort((a, b) => a.order - b.order);

  const handleValueChange = (key: string, value: unknown) => {
    if (readOnly) return;
    const updatedValues = { ...formValues, [key]: value };
    setFormValues(updatedValues);

    // Validate on change if already touched
    if (touched[key]) {
      const field = sortedFields.find((f) => f.key === key);
      if (field) {
        const errorMsg = validateFieldValue(field, value, updatedValues);
        setErrors((prev) => ({
          ...prev,
          [key]: errorMsg || ''
        }));
      }
    }
  };

  const handleBlur = (key: string) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    const field = sortedFields.find((f) => f.key === key);
    if (field) {
      const errorMsg = validateFieldValue(field, formValues[key], formValues);
      setErrors((prev) => ({
        ...prev,
        [key]: errorMsg || ''
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly) return;

    // Validate all visible fields
    const newErrors: Record<string, string> = {};
    const newTouched: Record<string, boolean> = {};
    let isValid = true;

    sortedFields.forEach((field) => {
      newTouched[field.key] = true;
      const isVisible = evaluateFieldVisibility(field, formValues);
      if (isVisible) {
        const err = validateFieldValue(field, formValues[field.key], formValues);
        if (err) {
          newErrors[field.key] = err;
          isValid = false;
        }
      }
    });

    setTouched(newTouched);
    setErrors(newErrors);

    if (isValid) {
      // Collect only visible field values
      const visibleValues: Record<string, unknown> = {};
      sortedFields.forEach((field) => {
        if (evaluateFieldVisibility(field, formValues)) {
          visibleValues[field.key] = formValues[field.key] ?? '';
        }
      });
      onSubmit(visibleValues);
    }
  };

  const renderFieldIcon = (type: FormField['type']) => {
    const size = 15;
    const color = '#64748b';
    switch (type) {
      case 'EMAIL':
        return <Mail size={size} color={color} />;
      case 'PHONE':
        return <Phone size={size} color={color} />;
      case 'PASSWORD':
        return <Lock size={size} color={color} />;
      case 'NUMBER':
        return <Hash size={size} color={color} />;
      case 'DATE':
      case 'DATETIME':
        return <Calendar size={size} color={color} />;
      case 'TIME':
        return <Clock size={size} color={color} />;
      default:
        return <Type size={size} color={color} />;
    }
  };

  const renderControl = (field: FormField) => {
    const val = formValues[field.key];
    const stringVal = val !== undefined && val !== null ? String(val) : '';
    const fieldError = errors[field.key];

    switch (field.type) {
      case 'TEXTAREA':
        return (
          <textarea
            rows={3}
            disabled={readOnly}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            value={stringVal}
            onChange={(e) => handleValueChange(field.key, e.target.value)}
            onBlur={() => handleBlur(field.key)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 8,
              border: fieldError ? '1px solid #ef4444' : '1px solid #cbd5e1',
              fontSize: 12.5,
              fontFamily: 'inherit',
              outline: 'none',
              resize: 'vertical'
            }}
          />
        );

      case 'RADIO':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(field.options || []).filter((o) => o.enabled).map((opt) => {
              const isSelected = stringVal === opt.value;
              return (
                <label
                  key={opt.value}
                  onClick={() => handleValueChange(field.key, opt.value)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: isSelected ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                    backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                    cursor: readOnly ? 'default' : 'pointer',
                    fontSize: 12,
                    fontWeight: isSelected ? 700 : 500,
                    color: isSelected ? '#1d4ed8' : '#334155',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <input
                    type="radio"
                    name={field.key}
                    checked={isSelected}
                    onChange={() => {}}
                    disabled={readOnly}
                    style={{ accentColor: '#2563eb', cursor: 'pointer' }}
                  />
                  <span>{opt.label}</span>
                </label>
              );
            })}
          </div>
        );

      case 'DROPDOWN': {
        const comboboxOptions = (field.options || [])
          .filter((o) => o.enabled)
          .map((o) => ({ value: o.value, label: o.label }));

        return (
          <Combobox
            options={comboboxOptions}
            value={stringVal}
            onChange={(selectedVal: string) => handleValueChange(field.key, selectedVal)}
            placeholder={field.placeholder || `Select ${field.label.toLowerCase()}...`}
          />
        );
      }

      case 'CHECKBOX':
      case 'MULTI_SELECT': {
        const selectedList: string[] = Array.isArray(val) ? val : val ? [String(val)] : [];
        const optionsList = (field.options || []).filter((o) => o.enabled);

        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
            {optionsList.map((opt) => {
              const isChecked = selectedList.includes(opt.value);
              return (
                <div
                  key={opt.value}
                  onClick={() => {
                    if (readOnly) return;
                    const nextList = isChecked
                      ? selectedList.filter((v) => v !== opt.value)
                      : [...selectedList, opt.value];
                    handleValueChange(field.key, nextList);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 10px',
                    borderRadius: 7,
                    border: isChecked ? '1px solid #2563eb' : '1px solid #cbd5e1',
                    backgroundColor: isChecked ? '#eff6ff' : '#ffffff',
                    fontSize: 11.5,
                    fontWeight: isChecked ? 700 : 500,
                    color: isChecked ? '#1d4ed8' : '#475569',
                    cursor: readOnly ? 'default' : 'pointer'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    disabled={readOnly}
                    style={{ accentColor: '#2563eb' }}
                  />
                  <span>{opt.label}</span>
                </div>
              );
            })}
          </div>
        );
      }

      case 'BOOLEAN': {
        const boolVal = Boolean(val);
        return (
          <div
            onClick={() => handleValueChange(field.key, !boolVal)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              cursor: readOnly ? 'default' : 'pointer'
            }}
          >
            {boolVal ? (
              <ToggleRight size={28} color="#2563eb" />
            ) : (
              <ToggleLeft size={28} color="#94a3b8" />
            )}
            <span style={{ fontSize: 12, fontWeight: 600, color: boolVal ? '#1d4ed8' : '#64748b' }}>
              {boolVal ? 'Enabled / Yes' : 'Disabled / No'}
            </span>
          </div>
        );
      }

      case 'FILE': {
        return (
          <div style={{
            border: '2px dashed #cbd5e1',
            borderRadius: 10,
            padding: '16px 12px',
            textAlign: 'center',
            backgroundColor: '#f8fafc',
            cursor: readOnly ? 'default' : 'pointer'
          }}>
            <Upload size={22} color="#94a3b8" style={{ marginBottom: 4 }} />
            <p style={{ fontSize: 11.5, fontWeight: 600, color: '#334155', margin: 0 }}>
              {stringVal ? `File Attached: ${stringVal}` : 'Click or drop file here to upload'}
            </p>
            <p style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>
              Supported formats: PDF, JPG, PNG (Max {field.validation?.maxFileSizeMb || 5} MB)
            </p>
            {!readOnly && (
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleValueChange(field.key, file.name);
                  }
                }}
                style={{ display: 'none' }}
                id={`file_input_${field.id}`}
              />
            )}
          </div>
        );
      }

      case 'DATE':
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 8, border: fieldError ? '1px solid #ef4444' : '1px solid #cbd5e1', backgroundColor: '#ffffff' }}>
            <Calendar size={15} color="#64748b" />
            <input
              type="date"
              disabled={readOnly}
              value={stringVal}
              onChange={(e) => handleValueChange(field.key, e.target.value)}
              onBlur={() => handleBlur(field.key)}
              style={{ width: '100%', border: 'none', outline: 'none', fontSize: 12, fontFamily: 'inherit', color: '#0f172a' }}
            />
          </div>
        );

      case 'TIME':
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 8, border: fieldError ? '1px solid #ef4444' : '1px solid #cbd5e1', backgroundColor: '#ffffff' }}>
            <Clock size={15} color="#64748b" />
            <input
              type="time"
              disabled={readOnly}
              value={stringVal}
              onChange={(e) => handleValueChange(field.key, e.target.value)}
              onBlur={() => handleBlur(field.key)}
              style={{ width: '100%', border: 'none', outline: 'none', fontSize: 12, fontFamily: 'inherit', color: '#0f172a' }}
            />
          </div>
        );

      // Default inputs: TEXT, EMAIL, PHONE, PASSWORD, NUMBER
      default:
        return (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '7px 10px',
            borderRadius: 8,
            border: fieldError ? '1px solid #ef4444' : '1px solid #cbd5e1',
            backgroundColor: '#ffffff',
            boxShadow: 'none',
            transition: 'border 0.15s ease'
          }}>
            {renderFieldIcon(field.type)}
            <input
              type={
                field.type === 'PASSWORD'
                  ? 'password'
                  : field.type === 'NUMBER'
                  ? 'number'
                  : field.type === 'EMAIL'
                  ? 'email'
                  : 'text'
              }
              disabled={readOnly}
              placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
              value={stringVal}
              onChange={(e) => handleValueChange(field.key, e.target.value)}
              onBlur={() => handleBlur(field.key)}
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                fontSize: 12,
                fontFamily: 'inherit',
                color: '#0f172a',
                backgroundColor: 'transparent'
              }}
            />
          </div>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Form Header Info */}
      {form.name && (
        <div style={{ marginBottom: 4, borderBottom: '1px solid #f1f5f9', paddingBottom: 10 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: 0 }}>
            {form.name}
          </h3>
          {form.description && (
            <p style={{ fontSize: 11.5, color: '#64748b', marginTop: 3 }}>
              {form.description}
            </p>
          )}
        </div>
      )}

      {/* Dynamic Fields Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {sortedFields.map((field) => {
          const isVisible = evaluateFieldVisibility(field, formValues);
          if (!isVisible) return null;

          const fieldError = errors[field.key];

          return (
            <div key={field.id} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {/* Field Label & Indicators */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>{field.label}</span>
                  {field.required && <span style={{ color: '#ef4444', fontWeight: 800 }}>*</span>}
                </label>

                {field.security?.sensitive && (
                  <span style={{ fontSize: 9.5, fontWeight: 700, color: '#be123c', backgroundColor: '#fff1f2', padding: '1px 6px', borderRadius: 4 }}>
                    SENSITIVE
                  </span>
                )}
              </div>

              {/* Description / Hint */}
              {field.description && (
                <p style={{ fontSize: 10.5, color: '#64748b', marginTop: -2, marginBottom: 2 }}>
                  {field.description}
                </p>
              )}

              {/* Control Renderer */}
              {renderControl(field)}

              {/* Validation Error Message */}
              {fieldError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#ef4444', fontSize: 10.5, fontWeight: 600 }}>
                  <AlertCircle size={12} />
                  <span>{fieldError}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      {!readOnly && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, marginTop: 12, borderTop: '1px solid #f1f5f9', paddingTop: 14 }}>
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" variant="primary" icon={<CheckCircle2 size={15} />}>
            {submitButtonText}
          </Button>
        </div>
      )}
    </form>
  );
};
