import type {
  Organization,
  TenantAdmin,
  PlatformUser,
  PlatformSubscriptionPlan,
  SystemComponentHealth,
  ShardInfo,
  TenantMigrationJob,
  PlatformAuditLog,
  PlatformSettings
} from '../types/platform';

export const MOCK_SHARDS: ShardInfo[] = [];

export const MOCK_ORGANIZATIONS: Organization[] = [];

export const MOCK_TENANT_ADMINS: TenantAdmin[] = [];

export const MOCK_PLATFORM_USERS: PlatformUser[] = [];

export const MOCK_SUBSCRIPTION_PLANS: PlatformSubscriptionPlan[] = [
  {
    id: 'plan-free',
    name: 'Free',
    priceMonthly: 0,
    activeOrgsCount: 0,
    maxBranches: 1,
    maxUsers: 2,
    maxBookingsMonthly: 100,
    features: ['1 Branch Queue Dispenser', 'Single Service Counter', 'Standard Ticket Dispenser', 'Community Support']
  },
  {
    id: 'plan-starter',
    name: 'Starter',
    priceMonthly: 49,
    activeOrgsCount: 0,
    maxBranches: 3,
    maxUsers: 10,
    maxBookingsMonthly: 1000,
    features: ['Real-time Queue Dashboard', 'Basic Analytics', 'Email Notifications']
  },
  {
    id: 'plan-professional',
    name: 'Professional',
    priceMonthly: 149,
    activeOrgsCount: 0,
    maxBranches: 10,
    maxUsers: 50,
    maxBookingsMonthly: 10000,
    features: ['All Starter Features', 'SMS Alerts', 'Multi-department Routing', 'Audit Logging']
  },
  {
    id: 'plan-enterprise',
    name: 'Enterprise',
    priceMonthly: 499,
    activeOrgsCount: 0,
    maxBranches: 'Unlimited',
    maxUsers: 'Unlimited',
    maxBookingsMonthly: 'Unlimited',
    features: ['Dedicated Database Shard', 'Custom SLA (99.99%)', '24/7 Dedicated Support', 'Custom Integrations']
  }
];

export const MOCK_SYSTEM_HEALTH: SystemComponentHealth[] = [];

export const MOCK_TENANT_MIGRATIONS: TenantMigrationJob[] = [];

export const MOCK_AUDIT_LOGS: PlatformAuditLog[] = [];

export const MOCK_PLATFORM_SETTINGS: PlatformSettings = {
  general: {
    platformName: 'QueueFlow Control Tower',
    supportEmail: 'admin@queueflow.io',
    maintenanceMode: false,
    allowNewRegistrations: true
  },
  security: {
    enforceMfaForStaff: false,
    sessionTimeoutMinutes: 60,
    maxLoginAttempts: 5,
    ipWhitelist: []
  },
  rateLimits: {
    apiRequestsPerMinute: 10000,
    publicFormSubmissionsPerMin: 300
  },
  notifications: {
    systemAlertEmails: [],
    slackWebhookUrlMasked: ''
  },
  infrastructure: {
    defaultShard: 'shard_01',
    autoFailover: true,
    backupFrequencyHours: 24
  }
};
