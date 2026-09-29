import type { FormConfig, LoginConfig } from '../types/formBuilder';

export const INITIAL_FORM_CONFIGS: FormConfig[] = [
  // 1. Initial Booking Form (Kolkata Branch) - Customer Name, Phone Number, Service, Gender
  {
    id: 'form_kyc_kolkata_v1',
    tenantId: 'tenant_queflow_bank',
    branchId: 'branch_kolkata',
    serviceId: 'service_kyc',
    name: 'Standard Booking Form',
    description: 'Initial booking form containing Customer Name, Phone Number, Service, and Gender',
    formType: 'BOOKING',
    version: 1,
    status: 'PUBLISHED',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
    fields: [
      {
        id: 'field_full_name',
        key: 'full_name',
        label: 'Customer Name',
        type: 'TEXT',
        placeholder: 'Enter customer name',
        required: true,
        enabled: true,
        order: 1,
        validation: { required: true, minLength: 2, maxLength: 100 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'field_phone',
        key: 'phone',
        label: 'Phone Number',
        type: 'PHONE',
        placeholder: '+880 1700 000000',
        required: true,
        enabled: true,
        order: 2,
        validation: { required: true, phone: true },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'field_service',
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
          { value: 'LOAN', label: 'Loan Consultation', enabled: true, order: 4 }
        ],
        validation: { required: true },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'field_gender',
        key: 'gender',
        label: 'Gender',
        type: 'RADIO',
        required: true,
        enabled: true,
        order: 4,
        options: [
          { value: 'MALE', label: 'Male', enabled: true, order: 1 },
          { value: 'FEMALE', label: 'Female', enabled: true, order: 2 },
          { value: 'OTHER', label: 'Other', enabled: true, order: 3 }
        ],
        validation: { required: true },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  },

  // 2. Hospital Appointment Form (Delhi Branch)
  {
    id: 'form_hospital_appointment_v1',
    tenantId: 'tenant_queflow_health',
    branchId: 'branch_delhi',
    serviceId: 'service_specialist',
    name: 'Hospital Specialist Appointment Form',
    description: 'Patient intake & consultation form for Delhi Health Branch',
    formType: 'APPOINTMENT',
    version: 1,
    status: 'PUBLISHED',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
    fields: [
      {
        id: 'field_patient_name',
        key: 'customer_name',
        label: 'Customer Name',
        type: 'TEXT',
        placeholder: 'Full name of customer',
        required: true,
        enabled: true,
        order: 1,
        validation: { required: true, minLength: 2 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'field_patient_phone',
        key: 'phone',
        label: 'Phone Number',
        type: 'PHONE',
        placeholder: '+880 1700 000000',
        required: true,
        enabled: true,
        order: 2,
        validation: { required: true, phone: true },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'field_department',
        key: 'service',
        label: 'Select Service',
        type: 'DROPDOWN',
        required: true,
        enabled: true,
        order: 3,
        options: [
          { value: 'CARDIOLOGY', label: 'Cardiology', enabled: true, order: 1 },
          { value: 'DENTAL', label: 'Dental Care', enabled: true, order: 2 },
          { value: 'NEUROLOGY', label: 'Neurology', enabled: true, order: 3 },
          { value: 'PEDIATRICS', label: 'Pediatrics', enabled: true, order: 4 }
        ],
        validation: { required: true },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'field_patient_gender',
        key: 'gender',
        label: 'Gender',
        type: 'RADIO',
        required: true,
        enabled: true,
        order: 4,
        options: [
          { value: 'MALE', label: 'Male', enabled: true, order: 1 },
          { value: 'FEMALE', label: 'Female', enabled: true, order: 2 },
          { value: 'OTHER', label: 'Other', enabled: true, order: 3 }
        ],
        validation: { required: true },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  },

  // 3. Customer Registration Form (Main Branch)
  {
    id: 'form_registration_main_v1',
    tenantId: 'tenant_queflow_bank',
    branchId: 'branch_main',
    name: 'Customer Registration Form',
    description: 'Dynamic customer onboarding registration configuration',
    formType: 'REGISTRATION',
    version: 1,
    status: 'PUBLISHED',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
    fields: [
      {
        id: 'reg_full_name',
        key: 'full_name',
        label: 'Customer Name',
        type: 'TEXT',
        placeholder: 'Enter customer name',
        required: true,
        enabled: true,
        order: 1,
        validation: { required: true },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'reg_phone',
        key: 'phone',
        label: 'Phone Number',
        type: 'PHONE',
        placeholder: '+880 1700 000000',
        required: true,
        enabled: true,
        order: 2,
        validation: { required: true, phone: true },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'reg_service',
        key: 'service',
        label: 'Select Service',
        type: 'DROPDOWN',
        required: true,
        enabled: true,
        order: 3,
        options: [
          { value: 'GENERAL', label: 'General Service', enabled: true, order: 1 },
          { value: 'VIP', label: 'VIP Priority Service', enabled: true, order: 2 }
        ],
        validation: { required: true },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'reg_gender',
        key: 'gender',
        label: 'Gender',
        type: 'RADIO',
        required: true,
        enabled: true,
        order: 4,
        options: [
          { value: 'MALE', label: 'Male', enabled: true, order: 1 },
          { value: 'FEMALE', label: 'Female', enabled: true, order: 2 },
          { value: 'OTHER', label: 'Other', enabled: true, order: 3 }
        ],
        validation: { required: true },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  }
];

export const INITIAL_LOGIN_CONFIGS: LoginConfig[] = [
  {
    tenantId: 'tenant_queflow_bank',
    branchId: 'branch_kolkata',
    supportedIdentifiers: ['PHONE', 'EMAIL', 'CUSTOMER_ID'],
    allowPasswordAuth: true,
    allowOtpAuth: true,
    requireCaptcha: false
  },
  {
    tenantId: 'tenant_queflow_health',
    branchId: 'branch_delhi',
    supportedIdentifiers: ['EMAIL', 'PHONE'],
    allowPasswordAuth: true,
    allowOtpAuth: false,
    requireCaptcha: true
  }
];
