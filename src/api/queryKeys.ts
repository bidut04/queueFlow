export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

export const employeeKeys = {
  all: ['employees'] as const,
  lists: () => [...employeeKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...employeeKeys.lists(), { filters }] as const,
  details: () => [...employeeKeys.all, 'detail'] as const,
  detail: (id: string) => [...employeeKeys.details(), id] as const,
};

export const bookingKeys = {
  all: ['bookings'] as const,
  lists: () => [...bookingKeys.all, 'list'] as const,
  list: (branchId?: string, status?: string) =>
    [...bookingKeys.lists(), { branchId, status }] as const,
  details: () => [...bookingKeys.all, 'detail'] as const,
  detail: (id: string) => [...bookingKeys.details(), id] as const,
};

export const queueKeys = {
  all: ['queue'] as const,
  active: (branchId: string) => [...queueKeys.all, 'active', branchId] as const,
  detail: (id: string) => [...queueKeys.all, 'detail', id] as const,
  policy: (queueId: string) => [...queueKeys.all, 'policy', queueId] as const,
};

export const platformKeys = {
  all: ['platform'] as const,
  dashboard: () => [...platformKeys.all, 'dashboard'] as const,
  organizations: () => [...platformKeys.all, 'organizations'] as const,
  organizationList: (filters?: Record<string, unknown>) =>
    [...platformKeys.organizations(), 'list', { filters }] as const,
  organizationDetail: (id: string) => [...platformKeys.organizations(), 'detail', id] as const,
  organizationAdmins: (id: string) => [...platformKeys.organizations(), 'admins', id] as const,
  organizationUsage: (id: string) => [...platformKeys.organizations(), 'usage', id] as const,
  users: () => [...platformKeys.all, 'users'] as const,
  shards: () => [...platformKeys.all, 'shards'] as const,
  migrations: () => [...platformKeys.all, 'migrations'] as const,
  health: () => [...platformKeys.all, 'health'] as const,
  subscriptions: () => [...platformKeys.all, 'subscriptions'] as const,
  plans: () => [...platformKeys.all, 'plans'] as const,
  auditLogs: (filters?: Record<string, unknown>) =>
    [...platformKeys.all, 'auditLogs', { filters }] as const,
  settings: () => [...platformKeys.all, 'settings'] as const,
  approvals: () => [...platformKeys.all, 'approvals'] as const,
  reviewLogs: (id: string) => [...platformKeys.all, 'reviewLogs', id] as const,
};

export const branchKeys = {
  all: ['branches'] as const,
  lists: () => [...branchKeys.all, 'list'] as const,
  detail: (id: string) => [...branchKeys.all, 'detail', id] as const,
};

export const departmentKeys = {
  all: ['departments'] as const,
  lists: () => [...departmentKeys.all, 'list'] as const,
  detail: (id: string) => [...departmentKeys.all, 'detail', id] as const,
};

export const serviceKeys = {
  all: ['services'] as const,
  lists: () => [...serviceKeys.all, 'list'] as const,
  detail: (id: string) => [...serviceKeys.all, 'detail', id] as const,
};

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  detail: (id: string) => [...categoryKeys.all, 'detail', id] as const,
};

export const roleKeys = {
  all: ['roles'] as const,
  lists: () => [...roleKeys.all, 'list'] as const,
  detail: (id: string) => [...roleKeys.all, 'detail', id] as const,
  permissions: () => [...roleKeys.all, 'permissions'] as const,
};

export const associationKeys = {
  all: ['associations'] as const,
  lists: () => [...associationKeys.all, 'list'] as const,
  detail: (id: string) => [...associationKeys.all, 'detail', id] as const,
};

export const formKeys = {
  all: ['forms'] as const,
  lists: () => [...formKeys.all, 'list'] as const,
  published: (branchId: string, formType: string, serviceId?: string) =>
    [...formKeys.all, 'published', branchId, formType, serviceId] as const,
  detail: (id: string) => [...formKeys.all, 'detail', id] as const,
  loginConfigs: () => [...formKeys.all, 'loginConfigs'] as const,
};

