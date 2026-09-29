export type FormType =
  | 'REGISTRATION'
  | 'LOGIN'
  | 'BOOKING'
  | 'APPOINTMENT'
  | 'FEEDBACK'
  | 'CUSTOMER_PROFILE';

export type FieldType =
  | 'TEXT'
  | 'TEXTAREA'
  | 'NUMBER'
  | 'EMAIL'
  | 'PHONE'
  | 'PASSWORD'
  | 'DATE'
  | 'TIME'
  | 'DATETIME'
  | 'RADIO'
  | 'CHECKBOX'
  | 'DROPDOWN'
  | 'MULTI_SELECT'
  | 'FILE'
  | 'BOOLEAN';

export type VisibilityOperator =
  | 'EQUALS'
  | 'NOT_EQUALS'
  | 'CONTAINS'
  | 'IN'
  | 'NOT_IN';

export interface FieldVisibilityRule {
  dependsOn: string;
  operator: VisibilityOperator;
  value: string | number | boolean | string[];
}

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  regex?: string;
  email?: boolean;
  phone?: boolean;
  fileTypes?: string[];
  maxFileSizeMb?: number;
  errorMessage?: string;
}

export interface FormFieldOption {
  value: string;
  label: string;
  enabled: boolean;
  order: number;
}

export interface FormFieldSecurity {
  sensitive: boolean;
  encrypted: boolean;
  searchable: boolean;
  visibleToCustomer: boolean;
  visibleToStaff: boolean;
}

export interface FormField {
  id: string;
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  description?: string;
  required: boolean;
  enabled: boolean;
  order: number;
  defaultValue?: unknown;
  options?: FormFieldOption[];
  validation?: FieldValidation;
  visibility?: FieldVisibilityRule;
  security?: FormFieldSecurity;
  createdAt: string;
  updatedAt: string;
}

export type FormVersionStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface FormConfig {
  id: string;
  tenantId: string;
  branchId: string;
  serviceId?: string; // Optional for service-specific booking forms
  name: string;
  description?: string;
  formType: FormType;
  version: number;
  status: FormVersionStatus;
  fields: FormField[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export type LoginIdentifier = 'EMAIL' | 'PHONE' | 'CUSTOMER_ID' | 'USERNAME';

export interface LoginConfig {
  tenantId: string;
  branchId: string;
  supportedIdentifiers: LoginIdentifier[];
  allowPasswordAuth: boolean;
  allowOtpAuth: boolean;
  requireCaptcha: boolean;
}

export interface BookingFormSnapshot {
  bookingId: string;
  tenantId: string;
  branchId: string;
  serviceId: string;
  formId: string;
  formVersion: number;
  submittedValues: Record<string, unknown>;
  createdAt: string;
}
