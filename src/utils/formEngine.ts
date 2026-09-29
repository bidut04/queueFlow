import type { FormConfig, FormField, LoginConfig } from '../types/formBuilder';
import { INITIAL_FORM_CONFIGS, INITIAL_LOGIN_CONFIGS } from '../data/formBuilderMockData';

const LOCAL_STORAGE_KEY = 'queflow_dynamic_form_configs';
const LOGIN_CONFIG_STORAGE_KEY = 'queflow_login_configs';

/**
 * Evaluates whether a field should be visible based on current form field values
 */
export function evaluateFieldVisibility(
  field: FormField,
  formValues: Record<string, unknown>
): boolean {
  if (!field.enabled) return false;
  if (!field.visibility) return true;

  const { dependsOn, operator, value: targetValue } = field.visibility;
  const parentValue = formValues[dependsOn];

  if (parentValue === undefined || parentValue === null || parentValue === '') {
    return false;
  }

  const parentStr = String(parentValue).toUpperCase();
  const targetStr = String(targetValue).toUpperCase();

  switch (operator) {
    case 'EQUALS':
      return parentStr === targetStr;
    case 'NOT_EQUALS':
      return parentStr !== targetStr;
    case 'CONTAINS':
      return parentStr.includes(targetStr);
    case 'IN':
      if (Array.isArray(targetValue)) {
        return targetValue.map((v) => String(v).toUpperCase()).includes(parentStr);
      }
      return false;
    case 'NOT_IN':
      if (Array.isArray(targetValue)) {
        return !targetValue.map((v) => String(v).toUpperCase()).includes(parentStr);
      }
      return true;
    default:
      return true;
  }
}

/**
 * Validates a field value against its configured validation schema
 */
export function validateFieldValue(
  field: FormField,
  value: unknown,
  formValues: Record<string, unknown>
): string | null {
  // First check if field is visible
  const isVisible = evaluateFieldVisibility(field, formValues);
  if (!isVisible) return null;

  const rules = field.validation || {};
  const isValueEmpty =
    value === undefined ||
    value === null ||
    (typeof value === 'string' && value.trim() === '') ||
    (Array.isArray(value) && value.length === 0);

  // Required check
  if ((field.required || rules.required) && isValueEmpty) {
    return rules.errorMessage || `${field.label} is required`;
  }

  if (isValueEmpty) return null;

  const stringVal = String(value);

  // Min Length check
  if (rules.minLength !== undefined && stringVal.length < rules.minLength) {
    return rules.errorMessage || `${field.label} must be at least ${rules.minLength} characters`;
  }

  // Max Length check
  if (rules.maxLength !== undefined && stringVal.length > rules.maxLength) {
    return rules.errorMessage || `${field.label} must not exceed ${rules.maxLength} characters`;
  }

  // Number Min/Max check
  if (field.type === 'NUMBER') {
    const numVal = Number(value);
    if (isNaN(numVal)) {
      return rules.errorMessage || `${field.label} must be a valid number`;
    }
    if (rules.min !== undefined && numVal < rules.min) {
      return rules.errorMessage || `${field.label} must be at least ${rules.min}`;
    }
    if (rules.max !== undefined && numVal > rules.max) {
      return rules.errorMessage || `${field.label} must not exceed ${rules.max}`;
    }
  }

  // Email format check
  if ((field.type === 'EMAIL' || rules.email) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(stringVal)) {
    return rules.errorMessage || `Please enter a valid email address`;
  }

  // Phone format check
  if ((field.type === 'PHONE' || rules.phone) && !/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/.test(stringVal)) {
    return rules.errorMessage || `Please enter a valid phone number`;
  }

  // Regex pattern check
  if (rules.regex) {
    try {
      const reg = new RegExp(rules.regex);
      if (!reg.test(stringVal)) {
        return rules.errorMessage || `${field.label} format is invalid`;
      }
    } catch {
      // Invalid regex string ignore
    }
  }

  return null;
}

/**
 * Storage manager for Form Configurations with LocalStorage persistence
 */
export const formStore = {
  getConfigs(): FormConfig[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed: FormConfig[] = JSON.parse(stored);
        // Ensure BOOKING forms only contain the 4 required fields: full_name, phone, service, gender
        const cleaned = parsed.map((config) => {
          if (config.formType === 'BOOKING' || config.formType === 'APPOINTMENT') {
            const allowedKeys = ['full_name', 'phone', 'service', 'gender', 'customer_name'];
            const filteredFields = config.fields.filter((f) => allowedKeys.includes(f.key));
            return { ...config, fields: filteredFields.length > 0 ? filteredFields : INITIAL_FORM_CONFIGS[0].fields };
          }
          return config;
        });
        return cleaned;
      }
    } catch {
      // Fallback
    }
    this.saveConfigs(INITIAL_FORM_CONFIGS);
    return INITIAL_FORM_CONFIGS;
  },

  saveConfigs(configs: FormConfig[]): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(configs));
    } catch (e) {
      console.error('Failed to save form configs to LocalStorage', e);
    }
  },

  getPublishedForm(branchId: string, formType: string, serviceId?: string): FormConfig | null {
    const configs = this.getConfigs();
    return (
      configs.find(
        (c) =>
          c.branchId === branchId &&
          c.formType === formType &&
          (serviceId ? c.serviceId === serviceId : true) &&
          c.status === 'PUBLISHED'
      ) ||
      configs.find((c) => c.formType === formType && c.status === 'PUBLISHED') ||
      null
    );
  },

  saveFormConfig(config: FormConfig): FormConfig {
    const configs = this.getConfigs();
    const existingIndex = configs.findIndex((c) => c.id === config.id);

    let updatedConfigs: FormConfig[];
    if (existingIndex >= 0) {
      updatedConfigs = [...configs];
      updatedConfigs[existingIndex] = { ...config, updatedAt: new Date().toISOString() };
    } else {
      updatedConfigs = [config, ...configs];
    }

    this.saveConfigs(updatedConfigs);
    return config;
  },

  publishFormConfig(id: string): FormConfig | null {
    const configs = this.getConfigs();
    const target = configs.find((c) => c.id === id);
    if (!target) return null;

    // Archive older published versions of the same form/branch/service
    const updated = configs.map((c) => {
      if (
        c.branchId === target.branchId &&
        c.formType === target.formType &&
        c.serviceId === target.serviceId &&
        c.status === 'PUBLISHED' &&
        c.id !== target.id
      ) {
        return { ...c, status: 'ARCHIVED' as const, updatedAt: new Date().toISOString() };
      }
      if (c.id === target.id) {
        return {
          ...c,
          status: 'PUBLISHED' as const,
          publishedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    });

    this.saveConfigs(updated);
    return updated.find((c) => c.id === id) || null;
  },

  createNewVersion(baseConfig: FormConfig): FormConfig {
    const configs = this.getConfigs();
    const nextVersion = baseConfig.version + 1;
    const newConfig: FormConfig = {
      ...baseConfig,
      id: `form_${baseConfig.formType.toLowerCase()}_${baseConfig.branchId}_v${nextVersion}`,
      version: nextVersion,
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: undefined
    };

    configs.unshift(newConfig);
    this.saveConfigs(configs);
    return newConfig;
  },

  getLoginConfigs(): LoginConfig[] {
    try {
      const stored = localStorage.getItem(LOGIN_CONFIG_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    localStorage.setItem(LOGIN_CONFIG_STORAGE_KEY, JSON.stringify(INITIAL_LOGIN_CONFIGS));
    return INITIAL_LOGIN_CONFIGS;
  },

  saveLoginConfig(config: LoginConfig): void {
    const configs = this.getLoginConfigs();
    const idx = configs.findIndex((c) => c.branchId === config.branchId);
    if (idx >= 0) configs[idx] = config;
    else configs.push(config);
    localStorage.setItem(LOGIN_CONFIG_STORAGE_KEY, JSON.stringify(configs));
  }
};
