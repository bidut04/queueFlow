export type OrgStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING' | 'HOLD' | 'REJECTED' | 'ARCHIVED';

export type RegistrationStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'HOLD' | 'REJECTED';

export type OrgType = 
  | 'BANK' 
  | 'HOSPITAL' 
  | 'CLINIC' 
  | 'GOVERNMENT' 
  | 'POST_OFFICE' 
  | 'UNIVERSITY' 
  | 'CORPORATE' 
  | 'SERVICE_CENTER' 
  | 'OTHER';

export type PlatformRole = 'PLATFORM_OWNER' | 'PLATFORM_ADMIN' | 'PLATFORM_SUPPORT';

export type TenantRole = 'TENANT_OWNER' | 'TENANT_ADMIN';

export type ShardStatus = 'HEALTHY' | 'DEGRADED' | 'READ_ONLY' | 'OFFLINE' | 'MIGRATING';

export type HealthState = 'HEALTHY' | 'DEGRADED' | 'DOWN' | 'UNKNOWN';

export type SubscriptionState = 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'SUSPENDED' | 'CANCELLED';

export type MigrationState = 
  | 'PLANNED' 
  | 'COPYING' 
  | 'VERIFYING' 
  | 'READY_FOR_CUTOVER' 
  | 'CUTTING_OVER' 
  | 'COMPLETED' 
  | 'ROLLING_BACK' 
  | 'FAILED';

export interface Organization {
  id: string;
  name: string;
  legalName: string;
  slug: string;
  type: OrgType;
  status: OrgStatus;
  plan: string;
  subscriptionState: SubscriptionState;
  contactEmail: string;
  contactPhone: string;
  country: string;
  timezone: string;
  branchesCount: number;
  usersCount: number;
  employeesCount: number;
  servicesCount: number;
  activeQueuesCount: number;
  monthlyBookingsCount: number;
  currentShard: string;
  region: string;
  createdDate: string;
  lastActivity: string;
  logoUrl?: string;
  primaryAdminName: string;
  primaryAdminEmail: string;
  primaryAdminPhone?: string;
  registrationStatus?: RegistrationStatus;
  remarks?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  submittedByEmail?: string;
}

export interface RegisterOrgInput {
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
  planName: string;
  preferredShardId?: string;
  adminPassword?: string;
}

export interface TenantAdmin {
  id: string;
  organizationId: string;
  organizationName: string;
  name: string;
  email: string;
  phone: string;
  role: TenantRole;
  status: 'ACTIVE' | 'SUSPENDED';
  lastLogin: string;
  createdDate: string;
}

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: PlatformRole;
  status: 'ACTIVE' | 'SUSPENDED';
  lastLogin: string;
  mfaStatus: 'ENABLED' | 'DISABLED';
  createdDate: string;
  avatarUrl?: string;
}

export interface PlatformSubscriptionPlan {
  id: string;
  name: string;
  priceMonthly: number;
  activeOrgsCount: number;
  maxBranches: number | 'Unlimited';
  maxUsers: number | 'Unlimited';
  maxBookingsMonthly: number | 'Unlimited';
  features: string[];
}

export interface SystemComponentHealth {
  id: string;
  name: string;
  type: string;
  status: HealthState;
  latencyMs: number;
  lastHeartbeatSec: number;
  errorRatePercent: number;
  lastFailureTime?: string;
  details?: string;
}

export interface ShardInfo {
  id: string;
  region: string;
  status: ShardStatus;
  weight: number;
  tenantCount: number;
  dbHealth: HealthState;
  readOnly: boolean;
  capacityTenants: number;
  utilizationPercent: number;
  lastHealthCheck: string;
  connectionPoolSize: number;
  activeConnections: number;
}

export interface TenantMigrationJob {
  id: string;
  organizationId: string;
  organizationName: string;
  sourceShard: string;
  destinationShard: string;
  status: MigrationState;
  progressPercent: number;
  startedAt: string;
  completedAt?: string;
  initiatedBy: string;
  notes?: string;
}

export interface PlatformAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  organizationId?: string;
  organizationName?: string;
  resource: string;
  resourceId: string;
  ipAddress: string;
  userAgent: string;
  result: 'SUCCESS' | 'FAILED';
  reason?: string;
}

export interface PlatformSettings {
  general: {
    platformName: string;
    supportEmail: string;
    maintenanceMode: boolean;
    allowNewRegistrations: boolean;
  };
  security: {
    enforceMfaForStaff: boolean;
    sessionTimeoutMinutes: number;
    maxLoginAttempts: number;
    ipWhitelist: string[];
  };
  rateLimits: {
    apiRequestsPerMinute: number;
    publicFormSubmissionsPerMin: number;
  };
  notifications: {
    systemAlertEmails: string[];
    slackWebhookUrlMasked: string;
  };
  infrastructure: {
    defaultShard: string;
    autoFailover: boolean;
    backupFrequencyHours: number;
  };
}

export type PlatformPageId = 
  | 'overview'
  | 'organizations'
  | 'create-organization'
  | 'org-details'
  | 'users'
  | 'subscriptions'
  | 'system-health'
  | 'shards'
  | 'migrations'
  | 'audit'
  | 'settings'
  | 'approvals';
