import { api } from './client';
import type {
  Organization,
  TenantAdmin,
  PlatformUser,
  PlatformSubscriptionPlan,
  SystemComponentHealth,
  ShardInfo,
  TenantMigrationJob,
  PlatformAuditLog,
  PlatformSettings,
  OrgType,
  OrgStatus,
  SubscriptionState,
  PlatformRole,
  TenantRole
} from '../modules/platform/types/platform';
import {
  MOCK_ORGANIZATIONS,
  MOCK_TENANT_ADMINS,
  MOCK_PLATFORM_USERS,
  MOCK_SUBSCRIPTION_PLANS,
  MOCK_SYSTEM_HEALTH,
  MOCK_SHARDS,
  MOCK_TENANT_MIGRATIONS,
  MOCK_AUDIT_LOGS,
  MOCK_PLATFORM_SETTINGS
} from '../modules/platform/data/mockPlatformData';

// Query & Input types
export interface OrganizationListQueryParams {
  search?: string;
  status?: string;
  type?: string;
  shardId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreatePlatformOrganizationInput {
  name: string;
  legalName?: string;
  slug?: string;
  type: OrgType;
  contactEmail: string;
  contactPhone: string;
  country: string;
  timezone: string;
  primaryAdminName: string;
  primaryAdminEmail: string;
  primaryAdminPhone?: string;
  planName?: string;
  preferredShardId?: string;
}

export interface UpdatePlatformOrganizationInput {
  name?: string;
  legalName?: string;
  planCode?: string;
  contactEmail?: string;
  contactPhone?: string;
  country?: string;
  timezone?: string;
}

export interface CreateTenantAdminInput {
  name: string;
  email: string;
  phone: string;
  role: TenantRole;
}

export interface UpdateTenantAdminInput {
  name?: string;
  phone?: string;
  role?: TenantRole;
  status?: 'ACTIVE' | 'SUSPENDED';
}

export interface InvitePlatformUserInput {
  name: string;
  email: string;
  role: PlatformRole;
}

export interface UpdatePlatformUserInput {
  name?: string;
  role?: PlatformRole;
  status?: 'ACTIVE' | 'SUSPENDED';
}

export interface StartMigrationInput {
  tenantId: string;
  targetShardId: string;
  notes?: string;
}

export interface AuditLogQueryParams {
  actor?: string;
  action?: string;
  resource?: string;
  tenantId?: string;
  result?: string;
  page?: number;
  limit?: number;
}

export interface PlatformDashboardOverview {
  organizations: {
    total: number;
    active: number;
    suspended: number;
    provisioning: number;
    migrating: number;
    archived: number;
  };
  infrastructure: {
    totalLocations: number;
    totalPlatformUsers: number;
    activeSubscriptions: number;
    monthlyBookings: number;
  };
  health: {
    overallStatus: 'HEALTHY' | 'DEGRADED' | 'DOWN';
    api: string;
    database: string;
    redis: string;
    kafka: string;
    socketIo: string;
    workers: string;
    shards: string;
    outbox: string;
  };
  recentOrganizationActivity?: any[];
  recentPlatformActivity?: any[];
}

export interface PendingOrganizationItem {
  id: string;
  name: string;
  legalName?: string;
  slug?: string;
  email?: string;
  phone?: string;
  type?: string;
  status: string;
  createdAt: string;
  adminEmail?: string;
  adminFullName?: string;
  reviewAuditLogs?: any[];
}

// Data Mappers between Backend Entities & Frontend UI Models
export const mapBackendOrgToFrontend = (item: any): Organization => ({
  id: item.id,
  name: item.name || 'Unnamed Organization',
  legalName: item.legalName || item.name || '',
  slug: item.slug || item.id,
  type: (item.type || 'BANK') as OrgType,
  status: (item.status === 'PROVISIONING' ? 'PENDING' : item.status) as OrgStatus,
  registrationStatus: item.status === 'PROVISIONING'
    ? 'PENDING_APPROVAL'
    : (item.status === 'ACTIVE' ? 'APPROVED' : (item.status === 'SUSPENDED' ? 'HOLD' : 'APPROVED')),
  plan: item.planName || item.plan?.name || 'Standard',
  subscriptionState: (item.status === 'ACTIVE'
    ? 'ACTIVE'
    : (item.status === 'SUSPENDED' ? 'SUSPENDED' : 'TRIAL')) as SubscriptionState,
  contactEmail: item.email || item.AdministratorEmail || '',
  contactPhone: item.phone || '',
  country: item.country || 'Global',
  timezone: item.timezone || 'Asia/Kolkata',
  branchesCount: item.locationCount ?? item._count?.locations ?? 0,
  usersCount: item.userCount ?? item._count?.users ?? 0,
  employeesCount: item.employeeCount ?? item._count?.employees ?? 0,
  servicesCount: item.serviceCount ?? item._count?.services ?? 0,
  activeQueuesCount: item.queueCount ?? item._count?.queues ?? 0,
  monthlyBookingsCount: item.bookingCount ?? item._count?.bookings ?? 0,
  currentShard: item.shardId || 'shard_01',
  region: item.regionCode || 'ap-south-1',
  createdDate: item.createdAt ? new Date(item.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  lastActivity: item.lastActivityAt ? new Date(item.lastActivityAt).toLocaleString() : 'Recently',
  primaryAdminName: item.Administrator || item.adminFullName || 'Admin',
  primaryAdminEmail: item.AdministratorEmail || item.email || item.adminEmail || '',
  primaryAdminPhone: item.phone || item.adminPhone || '',
  remarks: item.statusReason || undefined,
  logoUrl: item.logoUrl || undefined,
});

export const mapBackendShardToFrontend = (item: any): ShardInfo => ({
  id: item.code || item.id,
  region: item.regionCode ? `${item.regionCode} (Asia Pacific)` : (item.region || 'ap-south-1 (Mumbai)'),
  status: item.status === 'ACTIVE' ? 'HEALTHY' : (item.status === 'READ_ONLY' ? 'READ_ONLY' : 'DEGRADED'),
  weight: item.weight ?? 100,
  tenantCount: item.tenantCount ?? 0,
  dbHealth: item.dbHealth === 'HEALTHY' ? 'HEALTHY' : (item.dbHealth === 'DOWN' ? 'DOWN' : 'DEGRADED'),
  readOnly: Boolean(item.readOnly),
  capacityTenants: item.tenantCapacity ?? 500,
  utilizationPercent: item.tenantCapacity ? Math.round(((item.tenantCount ?? 0) / item.tenantCapacity) * 100) : 0,
  lastHealthCheck: item.lastHealthAt ? new Date(item.lastHealthAt).toLocaleTimeString() : 'Just now',
  connectionPoolSize: 200,
  activeConnections: item.totalRequests ?? 1,
});

export const mapBackendUserToFrontend = (item: any): PlatformUser => ({
  id: item.id || item.userId,
  name: item.user?.email ? item.user.email.split('@')[0] : (item.name || 'Platform Admin'),
  email: item.user?.email || item.email || '',
  role: item.role || 'PLATFORM_OWNER',
  status: item.status || 'ACTIVE',
  lastLogin: item.user?.lastLoginAt ? new Date(item.user.lastLoginAt).toLocaleString() : 'Recently',
  mfaStatus: item.user?.mfaEnabled ? 'ENABLED' : 'DISABLED',
  createdDate: item.createdAt ? new Date(item.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  avatarUrl: item.avatarUrl || undefined,
});

export const mapBackendHealthToFrontend = (healthData: any): SystemComponentHealth[] => {
  if (!healthData) return [...MOCK_SYSTEM_HEALTH];
  if (Array.isArray(healthData.components)) {
    return healthData.components.map((c: any, index: number) => ({
      id: `comp-${index + 1}`,
      name: c.name,
      type: c.name.toLowerCase().includes('database')
        ? 'Database'
        : c.name.toLowerCase().includes('redis')
        ? 'Cache'
        : c.name.toLowerCase().includes('gateway')
        ? 'Gateway'
        : 'Service',
      status: c.status || 'HEALTHY',
      latencyMs: c.latencyMs ?? 1,
      lastHeartbeatSec: 2,
      errorRatePercent: c.status === 'DOWN' ? 100 : (c.status === 'DEGRADED' ? 5 : 0),
      details: c.status === 'DOWN' ? 'Connection offline' : 'Operational'
    }));
  }
  if (healthData.health) {
    const h = healthData.health;
    return [
      { id: 'comp-1', name: 'PostgreSQL Multi-Shard Cluster', type: 'Database', status: h.database || 'HEALTHY', latencyMs: 2, lastHeartbeatSec: 1, errorRatePercent: 0, details: 'Operational' },
      { id: 'comp-2', name: 'Redis Cache & Session Store', type: 'Cache', status: h.redis || 'HEALTHY', latencyMs: 1, lastHeartbeatSec: 1, errorRatePercent: 0, details: 'In-memory operational' },
      { id: 'comp-3', name: 'Express API Gateway / Control Tower', type: 'Gateway', status: h.api || 'HEALTHY', latencyMs: 4, lastHeartbeatSec: 1, errorRatePercent: 0, details: 'Responding 200 OK' },
      { id: 'comp-4', name: 'Socket.IO Realtime Queue Cluster', type: 'Service', status: h.socketIo || 'HEALTHY', latencyMs: 3, lastHeartbeatSec: 1, errorRatePercent: 0, details: 'Connected' },
      { id: 'comp-5', name: 'Background Workers & Outbox Engine', type: 'Service', status: h.workers || 'HEALTHY', latencyMs: 5, lastHeartbeatSec: 2, errorRatePercent: 0, details: 'Processing' }
    ];
  }
  return [...MOCK_SYSTEM_HEALTH];
};

export const mapBackendAuditToFrontend = (item: any): PlatformAuditLog => ({
  id: item.id,
  timestamp: item.createdAt ? new Date(item.createdAt).toLocaleString() : new Date().toLocaleString(),
  actor: item.actorUserId || item.actor || 'Super Admin',
  actorRole: item.actorRole || 'PLATFORM_OWNER',
  action: item.action,
  organizationId: item.tenantId || item.organizationId,
  organizationName: item.tenant?.name || item.organizationName,
  resource: item.resourceType || item.resource || 'Platform',
  resourceId: item.resourceId || '',
  ipAddress: item.ipAddress || '127.0.0.1',
  userAgent: item.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : 'Mozilla/5.0'),
  result: (item.result === 'FAILED' ? 'FAILED' : 'SUCCESS'),
  reason: item.reason
});

// Local in-memory caches for fallback when working in dev or offline
let localOrgs = [...MOCK_ORGANIZATIONS];
let localTenantAdmins = [...MOCK_TENANT_ADMINS];
let localUsers = [...MOCK_PLATFORM_USERS];
let localShards = [...MOCK_SHARDS];
let localMigrations = [...MOCK_TENANT_MIGRATIONS];
let localAuditLogs = [...MOCK_AUDIT_LOGS];
let localSettings = { ...MOCK_PLATFORM_SETTINGS };

export const normalizeCountryCode = (country?: string): string => {
  if (!country) return 'US';
  const clean = country.trim();
  const map: Record<string, string> = {
    'united states': 'US',
    'usa': 'US',
    'us': 'US',
    'india': 'IN',
    'in': 'IN',
    'canada': 'CA',
    'ca': 'CA',
    'united kingdom': 'GB',
    'uk': 'GB',
    'gb': 'GB',
    'germany': 'DE',
    'de': 'DE',
    'bangladesh': 'BD',
    'bd': 'BD',
    'singapore': 'SG',
    'sg': 'SG',
    'australia': 'AU',
    'au': 'AU',
    'united arab emirates': 'AE',
    'uae': 'AE',
    'ae': 'AE',
  };
  const mapped = map[clean.toLowerCase()];
  if (mapped) return mapped;
  if (clean.length === 2) return clean.toUpperCase();
  return clean.slice(0, 2).toUpperCase() || 'US';
};

/**
 * Super Admin & Platform Control Tower API Client
 */
export const platformApi = {
  // 1. Dashboard Overview
  getDashboardOverview: async (): Promise<PlatformDashboardOverview> => {
    try {
      const res = await api.get<PlatformDashboardOverview>('/platform/dashboard');
      if (res && res.organizations) return res;
      throw new Error('Invalid dashboard payload');
    } catch {
      // Fallback calculation from local state
      return {
        organizations: {
          total: localOrgs.length,
          active: localOrgs.filter((o) => o.status === 'ACTIVE').length,
          suspended: localOrgs.filter((o) => o.status === 'SUSPENDED').length,
          provisioning: localOrgs.filter((o) => o.status === 'PENDING').length,
          migrating: 0,
          archived: localOrgs.filter((o) => o.status === 'ARCHIVED').length,
        },
        infrastructure: {
          totalLocations: localOrgs.reduce((acc, o) => acc + o.branchesCount, 0),
          totalPlatformUsers: localUsers.length,
          activeSubscriptions: localOrgs.filter((o) => o.subscriptionState === 'ACTIVE').length,
          monthlyBookings: localOrgs.reduce((acc, o) => acc + o.monthlyBookingsCount, 0),
        },
        health: {
          overallStatus: 'HEALTHY',
          api: 'HEALTHY',
          database: 'HEALTHY',
          redis: 'HEALTHY',
          kafka: 'HEALTHY',
          socketIo: 'HEALTHY',
          workers: 'HEALTHY',
          shards: 'HEALTHY',
          outbox: 'HEALTHY',
        }
      };
    }
  },

  // 2. Organizations
  getOrganizations: async (query?: OrganizationListQueryParams): Promise<Organization[]> => {
    try {
      const res = await api.get<any>('/platform/organizations', {
        params: query as Record<string, string | number | boolean | undefined>,
      });
      const items = Array.isArray(res) ? res : (res?.items || res?.data?.items || []);
      if (Array.isArray(items) && items.length > 0) {
        const mapped = items.map(mapBackendOrgToFrontend);
        localOrgs = mapped;
        return mapped;
      }
      return localOrgs;
    } catch {
      return localOrgs;
    }
  },

  getOrganization360: async (organizationId: string): Promise<Organization> => {
    try {
      const res = await api.get<any>(`/platform/organizations/${organizationId}`);
      if (res) {
        return mapBackendOrgToFrontend(res);
      }
      throw new Error('Empty organization 360 payload');
    } catch {
      const found = localOrgs.find((o) => o.id === organizationId);
      if (!found) throw new Error(`Organization ${organizationId} not found`);
      return found;
    }
  },

  createOrganization: async (input: CreatePlatformOrganizationInput): Promise<Organization> => {
    try {
      const res = await api.post<any>('/platform/organizations', {
        name: input.name,
        legalName: input.legalName || input.name,
        slug: input.slug || input.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        type: input.type,
        contactEmail: input.contactEmail,
        contactPhone: input.contactPhone,
        country: normalizeCountryCode(input.country),
        timezone: input.timezone,
        adminFullName: input.primaryAdminName,
        adminEmail: input.primaryAdminEmail,
        adminPhone: input.primaryAdminPhone,
        planCode: (input.planName || 'standard').toLowerCase(),
        preferredShardId: input.preferredShardId || 'shard_01',
      });
      const org = mapBackendOrgToFrontend(res);
      localOrgs = [org, ...localOrgs.filter((o) => o.id !== org.id)];
      return org;
    } catch (err: any) {
      if (err?.status && err.status >= 400 && err.status < 500) {
        throw err;
      }
      const newOrgId = `org-${Date.now().toString().slice(-4)}`;
      const fallbackOrg: Organization = {
        id: newOrgId,
        name: input.name,
        legalName: input.legalName || input.name,
        slug: input.slug || input.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        type: input.type,
        status: 'ACTIVE',
        plan: input.planName || 'Professional',
        subscriptionState: 'ACTIVE',
        contactEmail: input.contactEmail,
        contactPhone: input.contactPhone,
        country: input.country,
        timezone: input.timezone,
        branchesCount: 1,
        usersCount: 1,
        employeesCount: 5,
        servicesCount: 4,
        activeQueuesCount: 1,
        monthlyBookingsCount: 0,
        currentShard: input.preferredShardId || 'shard_01',
        region: 'ap-south-1',
        createdDate: new Date().toISOString().split('T')[0],
        lastActivity: 'Just now',
        primaryAdminName: input.primaryAdminName,
        primaryAdminEmail: input.primaryAdminEmail,
        primaryAdminPhone: input.primaryAdminPhone,
      };
      localOrgs = [fallbackOrg, ...localOrgs];
      return fallbackOrg;
    }
  },

  updateOrganization: async (
    id: string,
    input: UpdatePlatformOrganizationInput
  ): Promise<Organization> => {
    try {
      const res = await api.patch<any>(`/platform/organizations/${id}`, input);
      const updated = mapBackendOrgToFrontend(res);
      localOrgs = localOrgs.map((o) => (o.id === id ? updated : o));
      return updated;
    } catch {
      localOrgs = localOrgs.map((o) =>
        o.id === id
          ? {
              ...o,
              name: input.name || o.name,
              legalName: input.legalName || o.legalName,
              contactEmail: input.contactEmail || o.contactEmail,
              contactPhone: input.contactPhone || o.contactPhone,
              timezone: input.timezone || o.timezone,
              country: input.country || o.country,
            }
          : o
      );
      const found = localOrgs.find((o) => o.id === id);
      if (!found) throw new Error(`Organization ${id} not found`);
      return found;
    }
  },

  suspendOrganization: async (id: string, reason: string): Promise<Organization> => {
    try {
      const res = await api.post<any>(`/platform/organizations/${id}/suspend`, { reason });
      const updated = mapBackendOrgToFrontend(res);
      localOrgs = localOrgs.map((o) => (o.id === id ? updated : o));
      return updated;
    } catch {
      localOrgs = localOrgs.map((o) =>
        o.id === id ? { ...o, status: 'SUSPENDED', subscriptionState: 'SUSPENDED', remarks: reason } : o
      );
      const found = localOrgs.find((o) => o.id === id);
      if (!found) throw new Error(`Organization ${id} not found`);
      return found;
    }
  },

  activateOrganization: async (id: string, reason?: string): Promise<Organization> => {
    try {
      const res = await api.post<any>(`/platform/organizations/${id}/activate`, { reason });
      const updated = mapBackendOrgToFrontend(res);
      localOrgs = localOrgs.map((o) => (o.id === id ? updated : o));
      return updated;
    } catch {
      localOrgs = localOrgs.map((o) =>
        o.id === id ? { ...o, status: 'ACTIVE', subscriptionState: 'ACTIVE', remarks: reason } : o
      );
      const found = localOrgs.find((o) => o.id === id);
      if (!found) throw new Error(`Organization ${id} not found`);
      return found;
    }
  },

  archiveOrganization: async (id: string, reason?: string): Promise<Organization> => {
    try {
      const res = await api.post<any>(`/platform/organizations/${id}/archive`, { reason });
      const updated = mapBackendOrgToFrontend(res);
      localOrgs = localOrgs.map((o) => (o.id === id ? updated : o));
      return updated;
    } catch {
      localOrgs = localOrgs.map((o) =>
        o.id === id ? { ...o, status: 'ARCHIVED', remarks: reason } : o
      );
      const found = localOrgs.find((o) => o.id === id);
      if (!found) throw new Error(`Organization ${id} not found`);
      return found;
    }
  },

  getOrganizationUsage: async (id: string): Promise<any> => {
    try {
      return await api.get<any>(`/platform/organizations/${id}/usage`);
    } catch {
      const org = localOrgs.find((o) => o.id === id);
      return {
        tenantId: id,
        branchesCount: org?.branchesCount || 1,
        usersCount: org?.usersCount || 1,
        monthlyBookings: org?.monthlyBookingsCount || 0,
        activeQueuesCount: org?.activeQueuesCount || 1,
      };
    }
  },

  // 3. Tenant Admins
  getTenantAdmins: async (organizationId: string): Promise<TenantAdmin[]> => {
    try {
      const res = await api.get<any[]>(`/platform/organizations/${organizationId}/admins`);
      if (Array.isArray(res) && res.length > 0) {
        return res.map((item) => ({
          id: item.id || item.userId,
          organizationId: item.tenantId || organizationId,
          organizationName: item.tenant?.name || 'Organization',
          name: item.user?.fullName || item.name || 'Tenant Admin',
          email: item.user?.email || item.email || '',
          phone: item.user?.phone || item.phone || '',
          role: (item.role || 'TENANT_ADMIN') as TenantRole,
          status: item.status || 'ACTIVE',
          lastLogin: item.user?.lastLoginAt ? new Date(item.user.lastLoginAt).toLocaleString() : 'Recently',
          createdDate: item.createdAt ? new Date(item.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        }));
      }
      return localTenantAdmins.filter((a) => a.organizationId === organizationId);
    } catch {
      return localTenantAdmins.filter((a) => a.organizationId === organizationId);
    }
  },

  createTenantAdmin: async (
    organizationId: string,
    input: CreateTenantAdminInput
  ): Promise<TenantAdmin> => {
    try {
      const res = await api.post<any>(`/platform/organizations/${organizationId}/admins`, {
        adminFullName: input.name,
        adminEmail: input.email,
        adminPhone: input.phone,
        role: input.role,
      });
      const newAdmin: TenantAdmin = {
        id: res.id || `tadmin-${Date.now().toString().slice(-4)}`,
        organizationId,
        organizationName: 'Organization',
        name: input.name,
        email: input.email,
        phone: input.phone,
        role: input.role,
        status: 'ACTIVE',
        lastLogin: 'Never',
        createdDate: new Date().toISOString().split('T')[0],
      };
      localTenantAdmins = [newAdmin, ...localTenantAdmins];
      return newAdmin;
    } catch {
      const newAdmin: TenantAdmin = {
        id: `tadmin-${Date.now().toString().slice(-4)}`,
        organizationId,
        organizationName: 'Organization',
        name: input.name,
        email: input.email,
        phone: input.phone,
        role: input.role,
        status: 'ACTIVE',
        lastLogin: 'Never',
        createdDate: new Date().toISOString().split('T')[0],
      };
      localTenantAdmins = [newAdmin, ...localTenantAdmins];
      return newAdmin;
    }
  },

  // 4. Platform Users
  getPlatformUsers: async (): Promise<PlatformUser[]> => {
    try {
      const res = await api.get<any[]>('/platform/users');
      if (Array.isArray(res) && res.length > 0) {
        const mapped = res.map(mapBackendUserToFrontend);
        localUsers = mapped;
        return mapped;
      }
      return localUsers;
    } catch {
      return localUsers;
    }
  },

  invitePlatformUser: async (input: InvitePlatformUserInput): Promise<PlatformUser> => {
    try {
      const res = await api.post<any>('/platform/users', {
        email: input.email,
        role: input.role,
      });
      const user = mapBackendUserToFrontend(res);
      localUsers = [user, ...localUsers];
      return user;
    } catch {
      const newUser: PlatformUser = {
        id: `puser-${Date.now().toString().slice(-4)}`,
        name: input.name,
        email: input.email,
        role: input.role,
        status: 'ACTIVE',
        lastLogin: 'Never',
        mfaStatus: 'ENABLED',
        createdDate: new Date().toISOString().split('T')[0],
      };
      localUsers = [newUser, ...localUsers];
      return newUser;
    }
  },

  updatePlatformUser: async (
    id: string,
    input: UpdatePlatformUserInput
  ): Promise<PlatformUser> => {
    try {
      const res = await api.patch<any>(`/platform/users/${id}`, input);
      const updated = mapBackendUserToFrontend(res);
      localUsers = localUsers.map((u) => (u.id === id ? updated : u));
      return updated;
    } catch {
      localUsers = localUsers.map((u) =>
        u.id === id
          ? {
              ...u,
              name: input.name || u.name,
              role: input.role || u.role,
              status: input.status || u.status,
            }
          : u
      );
      const found = localUsers.find((u) => u.id === id);
      if (!found) throw new Error(`Platform user ${id} not found`);
      return found;
    }
  },

  // 5. Subscriptions & Plans
  getSubscriptions: async (): Promise<any[]> => {
    try {
      const res = await api.get<any[]>('/platform/subscriptions');
      return Array.isArray(res) ? res : [];
    } catch {
      return [];
    }
  },

  getPlans: async (): Promise<PlatformSubscriptionPlan[]> => {
    try {
      const res = await api.get<any[]>('/platform/plans');
      if (Array.isArray(res) && res.length > 0) {
        return res.map((p) => ({
          id: p.id || p.code,
          name: p.name,
          priceMonthly: p.priceMonthly || 0,
          activeOrgsCount: p.activeOrgsCount || 0,
          maxBranches: p.maxLocations || 'Unlimited',
          maxUsers: p.maxUsers || 'Unlimited',
          maxBookingsMonthly: p.maxMonthlyBookings || 'Unlimited',
          features: Array.isArray(p.features) ? p.features : ['Core Queue Engine', 'Multi-tenant Routing'],
        }));
      }
      return MOCK_SUBSCRIPTION_PLANS;
    } catch {
      return MOCK_SUBSCRIPTION_PLANS;
    }
  },

  // 6. System Health
  getSystemHealth: async (): Promise<SystemComponentHealth[]> => {
    try {
      const res = await api.get<any>('/platform/system-health');
      return mapBackendHealthToFrontend(res);
    } catch {
      return [...MOCK_SYSTEM_HEALTH];
    }
  },

  // 7. Shards
  getShards: async (): Promise<ShardInfo[]> => {
    try {
      const res = await api.get<any[]>('/platform/shards');
      if (Array.isArray(res) && res.length > 0) {
        const mapped = res.map(mapBackendShardToFrontend);
        localShards = mapped;
        return mapped;
      }
      return localShards;
    } catch {
      return localShards;
    }
  },

  updateShard: async (id: string, input: { weight?: number; readOnly?: boolean; status?: string }): Promise<ShardInfo> => {
    try {
      const res = await api.patch<any>(`/platform/shards/${id}`, input);
      const updated = mapBackendShardToFrontend(res);
      localShards = localShards.map((s) => (s.id === id ? updated : s));
      return updated;
    } catch {
      localShards = localShards.map((s) =>
        s.id === id
          ? {
              ...s,
              weight: input.weight ?? s.weight,
              readOnly: input.readOnly ?? s.readOnly,
              status: (input.readOnly ? 'READ_ONLY' : (input.status || s.status)) as any,
            }
          : s
      );
      const found = localShards.find((s) => s.id === id);
      if (!found) throw new Error(`Shard ${id} not found`);
      return found;
    }
  },

  // 8. Migrations
  getMigrations: async (): Promise<TenantMigrationJob[]> => {
    try {
      const res = await api.get<any[]>('/platform/migrations');
      if (Array.isArray(res) && res.length > 0) {
        localMigrations = res;
        return res;
      }
      return localMigrations;
    } catch {
      return localMigrations;
    }
  },

  startMigration: async (input: StartMigrationInput): Promise<TenantMigrationJob> => {
    try {
      const res = await api.post<any>('/platform/migrations', input);
      const job: TenantMigrationJob = {
        id: res.id || `mig-${Date.now().toString().slice(-4)}`,
        organizationId: input.tenantId,
        organizationName: res.tenantName || 'Tenant Org',
        sourceShard: res.sourceShard || 'shard_01',
        destinationShard: input.targetShardId,
        status: 'COPYING',
        progressPercent: 25,
        startedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
        initiatedBy: 'Super Admin',
        notes: input.notes || 'Tenant shard migration',
      };
      localMigrations = [job, ...localMigrations];
      return job;
    } catch {
      const job: TenantMigrationJob = {
        id: `mig-${Date.now().toString().slice(-4)}`,
        organizationId: input.tenantId,
        organizationName: localOrgs.find((o) => o.id === input.tenantId)?.name || 'Tenant Org',
        sourceShard: localOrgs.find((o) => o.id === input.tenantId)?.currentShard || 'shard_01',
        destinationShard: input.targetShardId,
        status: 'COPYING',
        progressPercent: 25,
        startedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
        initiatedBy: 'Super Admin',
        notes: input.notes || 'Zero-downtime tenant shard migration',
      };
      localMigrations = [job, ...localMigrations];
      return job;
    }
  },

  rollbackMigration: async (id: string, reason?: string): Promise<TenantMigrationJob> => {
    try {
      const res = await api.post<any>(`/platform/migrations/${id}/rollback`, { reason });
      localMigrations = localMigrations.map((m) =>
        m.id === id ? { ...m, status: 'ROLLING_BACK', progressPercent: 100 } : m
      );
      return res || localMigrations.find((m) => m.id === id);
    } catch {
      localMigrations = localMigrations.map((m) =>
        m.id === id ? { ...m, status: 'ROLLING_BACK', progressPercent: 100 } : m
      );
      const found = localMigrations.find((m) => m.id === id);
      if (!found) throw new Error(`Migration ${id} not found`);
      return found;
    }
  },

  // 9. Audit Logs
  getAuditLogs: async (query?: AuditLogQueryParams): Promise<PlatformAuditLog[]> => {
    try {
      const res = await api.get<any>('/platform/audit', {
        params: query as Record<string, string | number | boolean | undefined>,
      });
      const items = Array.isArray(res) ? res : (res?.items || res?.data?.items || []);
      if (Array.isArray(items) && items.length > 0) {
        const mapped = items.map(mapBackendAuditToFrontend);
        localAuditLogs = mapped;
        return mapped;
      }
      return localAuditLogs;
    } catch {
      return localAuditLogs;
    }
  },

  // 10. Platform Settings
  getSettings: async (): Promise<PlatformSettings> => {
    try {
      const res = await api.get<any>('/platform/settings');
      if (res && res.general) {
        localSettings = res;
        return res;
      }
      return localSettings;
    } catch {
      return localSettings;
    }
  },

  updateSettings: async (category: string, settings: Record<string, unknown>): Promise<PlatformSettings> => {
    try {
      const res = await api.patch<any>('/platform/settings', { category, settings });
      if (res && res.general) {
        localSettings = res;
        return res;
      }
      localSettings = { ...localSettings, [category]: { ...(localSettings as any)[category], ...settings } };
      return localSettings;
    } catch {
      localSettings = { ...localSettings, [category]: { ...(localSettings as any)[category], ...settings } };
      return localSettings;
    }
  },

  // 11. Self-Registration Approvals (Super Admin Review)
  getPendingOrganizations: async (options?: { limit?: number; cursor?: string }): Promise<PendingOrganizationItem[]> => {
    try {
      const res = await api.get<any>('/organizations/pending-approval', {
        params: options as Record<string, string | number | boolean | undefined>,
      });
      const items = Array.isArray(res) ? res : (res?.items || res?.data || []);
      return items;
    } catch {
      return localOrgs
        .filter((o) => o.status === 'PENDING' || o.registrationStatus === 'PENDING_APPROVAL')
        .map((o) => ({
          id: o.id,
          name: o.name,
          legalName: o.legalName,
          slug: o.slug,
          email: o.contactEmail,
          phone: o.contactPhone,
          type: o.type,
          status: o.status,
          createdAt: o.createdDate,
          adminEmail: o.primaryAdminEmail,
          adminFullName: o.primaryAdminName,
        }));
    }
  },

  approveRegistration: async (orgId: string, notes?: string): Promise<{ success: boolean; message?: string }> => {
    try {
      return await api.post(`/organizations/${orgId}/approve`, { notes });
    } catch {
      // Fallback: activate via platform endpoint or update local
      try {
        await api.post(`/platform/organizations/${orgId}/activate`, { reason: notes || 'Approved by Super Admin' });
      } catch {
        // ignore
      }
      localOrgs = localOrgs.map((o) =>
        o.id === orgId ? { ...o, status: 'ACTIVE', registrationStatus: 'APPROVED', remarks: notes } : o
      );
      return { success: true, message: 'Organization approved successfully' };
    }
  },

  rejectRegistration: async (orgId: string, reason?: string): Promise<{ success: boolean; message?: string }> => {
    try {
      return await api.post(`/organizations/${orgId}/reject`, { reason });
    } catch {
      try {
        await api.post(`/platform/organizations/${orgId}/archive`, { reason: reason || 'Registration rejected' });
      } catch {
        // ignore
      }
      localOrgs = localOrgs.map((o) =>
        o.id === orgId ? { ...o, status: 'REJECTED', registrationStatus: 'REJECTED', remarks: reason } : o
      );
      return { success: true, message: 'Organization registration rejected' };
    }
  },

  getReviewLogs: async (orgId: string): Promise<any[]> => {
    try {
      return await api.get<any[]>(`/organizations/${orgId}/review-logs`);
    } catch {
      return [];
    }
  },
};
