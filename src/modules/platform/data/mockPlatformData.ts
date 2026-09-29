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

export const MOCK_SHARDS: ShardInfo[] = [
  {
    id: 'shard-us-east-1a',
    region: 'us-east-1 (N. Virginia)',
    status: 'HEALTHY',
    weight: 100,
    tenantCount: 142,
    dbHealth: 'HEALTHY',
    readOnly: false,
    capacityTenants: 200,
    utilizationPercent: 71,
    lastHealthCheck: '5 secs ago',
    connectionPoolSize: 200,
    activeConnections: 48
  },
  {
    id: 'shard-us-west-2a',
    region: 'us-west-2 (Oregon)',
    status: 'HEALTHY',
    weight: 100,
    tenantCount: 98,
    dbHealth: 'HEALTHY',
    readOnly: false,
    capacityTenants: 200,
    utilizationPercent: 49,
    lastHealthCheck: '3 secs ago',
    connectionPoolSize: 200,
    activeConnections: 32
  },
  {
    id: 'shard-eu-west-1a',
    region: 'eu-west-1 (Ireland)',
    status: 'DEGRADED',
    weight: 50,
    tenantCount: 184,
    dbHealth: 'DEGRADED',
    readOnly: false,
    capacityTenants: 200,
    utilizationPercent: 92,
    lastHealthCheck: '12 secs ago',
    connectionPoolSize: 250,
    activeConnections: 210
  },
  {
    id: 'shard-ap-south-1a',
    region: 'ap-south-1 (Mumbai)',
    status: 'HEALTHY',
    weight: 100,
    tenantCount: 110,
    dbHealth: 'HEALTHY',
    readOnly: false,
    capacityTenants: 250,
    utilizationPercent: 44,
    lastHealthCheck: '2 secs ago',
    connectionPoolSize: 200,
    activeConnections: 42
  },
  {
    id: 'shard-ap-southeast-1a',
    region: 'ap-southeast-1 (Singapore)',
    status: 'READ_ONLY',
    weight: 0,
    tenantCount: 195,
    dbHealth: 'HEALTHY',
    readOnly: true,
    capacityTenants: 200,
    utilizationPercent: 97.5,
    lastHealthCheck: '8 secs ago',
    connectionPoolSize: 200,
    activeConnections: 89
  }
];

export const MOCK_ORGANIZATIONS: Organization[] = [
  {
    id: 'org-101',
    name: 'City National Bank',
    legalName: 'City National Bank Financial Corp.',
    slug: 'city-national-bank',
    type: 'BANK',
    status: 'ACTIVE',
    plan: 'Enterprise',
    subscriptionState: 'ACTIVE',
    contactEmail: 'admin@citynatbank.com',
    contactPhone: '+1 (555) 234-8900',
    country: 'United States',
    timezone: 'America/New_York',
    branchesCount: 24,
    usersCount: 180,
    employeesCount: 340,
    servicesCount: 18,
    activeQueuesCount: 42,
    monthlyBookingsCount: 48200,
    currentShard: 'shard-us-east-1a',
    region: 'us-east-1',
    createdDate: '2024-01-15',
    lastActivity: '2 mins ago',
    logoUrl: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=100&auto=format&fit=crop&q=80',
    primaryAdminName: 'David Vance',
    primaryAdminEmail: 'd.vance@citynatbank.com',
    primaryAdminPhone: '+1 (555) 234-8901'
  },
  {
    id: 'org-102',
    name: 'Apex Health Systems',
    legalName: 'Apex Health Alliance Inc.',
    slug: 'apex-health',
    type: 'HOSPITAL',
    status: 'ACTIVE',
    plan: 'Enterprise',
    subscriptionState: 'ACTIVE',
    contactEmail: 'ops@apexhealth.org',
    contactPhone: '+1 (555) 876-1234',
    country: 'United States',
    timezone: 'America/Chicago',
    branchesCount: 12,
    usersCount: 95,
    employeesCount: 210,
    servicesCount: 24,
    activeQueuesCount: 28,
    monthlyBookingsCount: 32100,
    currentShard: 'shard-us-west-2a',
    region: 'us-west-2',
    createdDate: '2024-03-20',
    lastActivity: '5 mins ago',
    logoUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=100&auto=format&fit=crop&q=80',
    primaryAdminName: 'Dr. Sarah Lin',
    primaryAdminEmail: 'slin@apexhealth.org',
    primaryAdminPhone: '+1 (555) 876-1235'
  },
  {
    id: 'org-103',
    name: 'Dhaka Care Medical',
    legalName: 'Dhaka Care Medical Limited',
    slug: 'dhaka-care',
    type: 'CLINIC',
    status: 'ACTIVE',
    plan: 'Professional',
    subscriptionState: 'ACTIVE',
    contactEmail: 'info@dhakacare.com',
    contactPhone: '+880 2 9876543',
    country: 'Bangladesh',
    timezone: 'Asia/Dhaka',
    branchesCount: 5,
    usersCount: 42,
    employeesCount: 85,
    servicesCount: 14,
    activeQueuesCount: 12,
    monthlyBookingsCount: 14500,
    currentShard: 'shard-ap-south-1a',
    region: 'ap-south-1',
    createdDate: '2024-06-10',
    lastActivity: '1 min ago',
    logoUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=100&auto=format&fit=crop&q=80',
    primaryAdminName: 'Rahul Amin',
    primaryAdminEmail: 'rahul.amin@dhakacare.com',
    primaryAdminPhone: '+880 1712 345678'
  },
  {
    id: 'org-104',
    name: 'Metro DMV Authority',
    legalName: 'Metropolitan Department of Motor Vehicles',
    slug: 'metro-dmv',
    type: 'GOVERNMENT',
    status: 'SUSPENDED',
    plan: 'Enterprise',
    subscriptionState: 'SUSPENDED',
    contactEmail: 'contact@metrodmv.gov',
    contactPhone: '+1 (555) 432-1099',
    country: 'United States',
    timezone: 'America/New_York',
    branchesCount: 18,
    usersCount: 120,
    employeesCount: 290,
    servicesCount: 10,
    activeQueuesCount: 0,
    monthlyBookingsCount: 52000,
    currentShard: 'shard-us-east-1a',
    region: 'us-east-1',
    createdDate: '2023-11-04',
    lastActivity: '3 days ago',
    logoUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=100&auto=format&fit=crop&q=80',
    primaryAdminName: 'Marcus Vance',
    primaryAdminEmail: 'm.vance@metrodmv.gov',
    primaryAdminPhone: '+1 (555) 432-1100'
  },
  {
    id: 'org-105',
    name: 'Global Express Postal',
    legalName: 'Global Express Logistics & Postal S.A.',
    slug: 'global-express-post',
    type: 'POST_OFFICE',
    status: 'ACTIVE',
    plan: 'Professional',
    subscriptionState: 'ACTIVE',
    contactEmail: 'support@globalexpresspost.eu',
    contactPhone: '+44 20 7946 0912',
    country: 'United Kingdom',
    timezone: 'Europe/London',
    branchesCount: 45,
    usersCount: 230,
    employeesCount: 520,
    servicesCount: 8,
    activeQueuesCount: 64,
    monthlyBookingsCount: 89000,
    currentShard: 'shard-eu-west-1a',
    region: 'eu-west-1',
    createdDate: '2024-02-14',
    lastActivity: '12 mins ago',
    logoUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=100&auto=format&fit=crop&q=80',
    primaryAdminName: 'Emma Watson',
    primaryAdminEmail: 'ewatson@globalexpresspost.eu',
    primaryAdminPhone: '+44 20 7946 0915'
  },
  {
    id: 'org-106',
    name: 'Pacific Federal University',
    legalName: 'Pacific Federal University Higher Education Trust',
    slug: 'pacific-fed-univ',
    type: 'UNIVERSITY',
    status: 'PENDING',
    plan: 'Starter',
    subscriptionState: 'TRIAL',
    contactEmail: 'registrar@pacificfed.edu',
    contactPhone: '+1 (555) 901-2345',
    country: 'United States',
    timezone: 'America/Los_Angeles',
    branchesCount: 3,
    usersCount: 15,
    employeesCount: 35,
    servicesCount: 6,
    activeQueuesCount: 2,
    monthlyBookingsCount: 2100,
    currentShard: 'shard-us-west-2a',
    region: 'us-west-2',
    createdDate: '2026-09-25',
    lastActivity: '4 hours ago',
    logoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=100&auto=format&fit=crop&q=80',
    primaryAdminName: 'Prof. Robert Hughes',
    primaryAdminEmail: 'rhughes@pacificfed.edu',
    primaryAdminPhone: '+1 (555) 901-2346'
  },
  {
    id: 'org-107',
    name: 'Horizon Tech Care',
    legalName: 'Horizon Technology Service Center Ltd',
    slug: 'horizon-tech',
    type: 'SERVICE_CENTER',
    status: 'ACTIVE',
    plan: 'Starter',
    subscriptionState: 'ACTIVE',
    contactEmail: 'contact@horizontech.com',
    contactPhone: '+65 6789 0123',
    country: 'Singapore',
    timezone: 'Asia/Singapore',
    branchesCount: 4,
    usersCount: 28,
    employeesCount: 60,
    servicesCount: 12,
    activeQueuesCount: 8,
    monthlyBookingsCount: 8400,
    currentShard: 'shard-ap-southeast-1a',
    region: 'ap-southeast-1',
    createdDate: '2024-08-01',
    lastActivity: '18 mins ago',
    logoUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&auto=format&fit=crop&q=80',
    primaryAdminName: 'Keng Wei Tan',
    primaryAdminEmail: 'kwtan@horizontech.com',
    primaryAdminPhone: '+65 6789 0124'
  }
];

export const MOCK_TENANT_ADMINS: TenantAdmin[] = [
  {
    id: 'tadmin-1',
    organizationId: 'org-101',
    organizationName: 'City National Bank',
    name: 'David Vance',
    email: 'd.vance@citynatbank.com',
    phone: '+1 (555) 234-8901',
    role: 'TENANT_OWNER',
    status: 'ACTIVE',
    lastLogin: 'Today at 09:42 AM',
    createdDate: '2024-01-15'
  },
  {
    id: 'tadmin-2',
    organizationId: 'org-101',
    organizationName: 'City National Bank',
    name: 'Rachel Green',
    email: 'r.green@citynatbank.com',
    phone: '+1 (555) 234-8905',
    role: 'TENANT_ADMIN',
    status: 'ACTIVE',
    lastLogin: 'Yesterday at 04:15 PM',
    createdDate: '2024-02-01'
  },
  {
    id: 'tadmin-3',
    organizationId: 'org-102',
    organizationName: 'Apex Health Systems',
    name: 'Dr. Sarah Lin',
    email: 'slin@apexhealth.org',
    phone: '+1 (555) 876-1235',
    role: 'TENANT_OWNER',
    status: 'ACTIVE',
    lastLogin: 'Today at 08:10 AM',
    createdDate: '2024-03-20'
  },
  {
    id: 'tadmin-4',
    organizationId: 'org-103',
    organizationName: 'Dhaka Care Medical',
    name: 'Rahul Amin',
    email: 'rahul.amin@dhakacare.com',
    phone: '+880 1712 345678',
    role: 'TENANT_OWNER',
    status: 'ACTIVE',
    lastLogin: 'Today at 03:22 PM',
    createdDate: '2024-06-10'
  },
  {
    id: 'tadmin-5',
    organizationId: 'org-104',
    organizationName: 'Metro DMV Authority',
    name: 'Marcus Vance',
    email: 'm.vance@metrodmv.gov',
    phone: '+1 (555) 432-1100',
    role: 'TENANT_OWNER',
    status: 'SUSPENDED',
    lastLogin: '3 days ago',
    createdDate: '2023-11-04'
  }
];

export const MOCK_PLATFORM_USERS: PlatformUser[] = [
  {
    id: 'puser-1',
    name: 'Alexander Wright',
    email: 'alexander.wright@queueflow.io',
    role: 'PLATFORM_OWNER',
    status: 'ACTIVE',
    lastLogin: 'Just now',
    mfaStatus: 'ENABLED',
    createdDate: '2023-09-01',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'puser-2',
    name: 'Elena Rostova',
    email: 'elena.rostova@queueflow.io',
    role: 'PLATFORM_ADMIN',
    status: 'ACTIVE',
    lastLogin: 'Today at 10:14 AM',
    mfaStatus: 'ENABLED',
    createdDate: '2023-10-15',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'puser-3',
    name: 'Carlos Mendez',
    email: 'carlos.mendez@queueflow.io',
    role: 'PLATFORM_SUPPORT',
    status: 'ACTIVE',
    lastLogin: 'Yesterday at 05:30 PM',
    mfaStatus: 'ENABLED',
    createdDate: '2024-02-10',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'puser-4',
    name: 'Priya Sharma',
    email: 'priya.sharma@queueflow.io',
    role: 'PLATFORM_ADMIN',
    status: 'SUSPENDED',
    lastLogin: '2 weeks ago',
    mfaStatus: 'DISABLED',
    createdDate: '2024-04-01',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80'
  }
];

export const MOCK_SUBSCRIPTION_PLANS: PlatformSubscriptionPlan[] = [
  {
    id: 'plan-starter',
    name: 'Starter',
    priceMonthly: 199,
    activeOrgsCount: 24,
    maxBranches: 5,
    maxUsers: 20,
    maxBookingsMonthly: 5000,
    features: [
      'Up to 5 Branches',
      'Standard Queue Ticket Dispenser',
      'Basic SMS Notifications',
      'Email Support',
      'Shared Database Shard'
    ]
  },
  {
    id: 'plan-pro',
    name: 'Professional',
    priceMonthly: 499,
    activeOrgsCount: 68,
    maxBranches: 25,
    maxUsers: 100,
    maxBookingsMonthly: 30000,
    features: [
      'Up to 25 Branches',
      'Advanced Service & Department Routing',
      'Custom Booking Form Builder',
      'Realtime Analytics & SLA Heatmaps',
      'Priority 24/7 Support',
      'Dedicated Regional Shard'
    ]
  },
  {
    id: 'plan-enterprise',
    name: 'Enterprise',
    priceMonthly: 1299,
    activeOrgsCount: 145,
    maxBranches: 'Unlimited',
    maxUsers: 'Unlimited',
    maxBookingsMonthly: 'Unlimited',
    features: [
      'Unlimited Branches & Terminals',
      'Multi-region Dedicated DB Sharding',
      'Custom SSO / SAML & LDAP Sync',
      'Strict Outbox Zero-Data-Loss Pipeline',
      'Dedicated Account Manager & SLA Guarantee',
      'Custom Domain & Brand Whitelabeling'
    ]
  }
];

export const MOCK_SYSTEM_HEALTH: SystemComponentHealth[] = [
  {
    id: 'sys-api',
    name: 'API Gateway Cluster',
    type: 'Core Ingress',
    status: 'HEALTHY',
    latencyMs: 14,
    lastHeartbeatSec: 3,
    errorRatePercent: 0.01,
    details: 'v4.12.0 - 12 active ingress nodes operating at 18% CPU'
  },
  {
    id: 'sys-db',
    name: 'PostgreSQL Distributed Cluster',
    type: 'Primary Database',
    status: 'HEALTHY',
    latencyMs: 3,
    lastHeartbeatSec: 1,
    errorRatePercent: 0.00,
    details: '5 Primary shards + 10 Read replicas active'
  },
  {
    id: 'sys-redis',
    name: 'Redis Cache & Session Cluster',
    type: 'In-Memory Cache',
    status: 'HEALTHY',
    latencyMs: 2,
    lastHeartbeatSec: 2,
    errorRatePercent: 0.00,
    details: '99.4% Cache hit ratio, 1.4GB memory used'
  },
  {
    id: 'sys-kafka',
    name: 'Kafka Event Stream Cluster',
    type: 'Event Bus',
    status: 'HEALTHY',
    latencyMs: 6,
    lastHeartbeatSec: 4,
    errorRatePercent: 0.00,
    details: '3 Broker nodes, 18,400 msg/sec throughput'
  },
  {
    id: 'sys-ws',
    name: 'Socket.IO Realtime Gateway',
    type: 'WebSocket Engine',
    status: 'HEALTHY',
    latencyMs: 8,
    lastHeartbeatSec: 2,
    errorRatePercent: 0.02,
    details: '4,210 concurrent active display sockets'
  },
  {
    id: 'sys-worker',
    name: 'Queue & Ticket Workers',
    type: 'Background Workers',
    status: 'HEALTHY',
    latencyMs: 12,
    lastHeartbeatSec: 5,
    errorRatePercent: 0.00,
    details: '48 worker threads processing token transitions'
  },
  {
    id: 'sys-shard-mgr',
    name: 'Consistent Hashing Shard Manager',
    type: 'Infra Control',
    status: 'HEALTHY',
    latencyMs: 4,
    lastHeartbeatSec: 6,
    errorRatePercent: 0.00,
    details: 'Ring topology balanced across 5 database shards'
  },
  {
    id: 'sys-outbox',
    name: 'Transactional Outbox Processor',
    type: 'Reliable Messaging',
    status: 'HEALTHY',
    latencyMs: 9,
    lastHeartbeatSec: 3,
    errorRatePercent: 0.00,
    details: '0 pending backlog items, zero lag'
  },
  {
    id: 'sys-notifications',
    name: 'SMS / Email Notification Worker',
    type: 'External Communications',
    status: 'DEGRADED',
    latencyMs: 380,
    lastHeartbeatSec: 15,
    errorRatePercent: 1.4,
    lastFailureTime: '10 mins ago',
    details: 'Twilio SMS gateway experiencing elevated upstream latencies'
  },
  {
    id: 'sys-analytics',
    name: 'Analytics & Reporting Worker',
    type: 'ETL Pipeline',
    status: 'HEALTHY',
    latencyMs: 22,
    lastHeartbeatSec: 8,
    errorRatePercent: 0.00,
    details: 'Realtime SLA aggregation up-to-date'
  }
];

export const MOCK_TENANT_MIGRATIONS: TenantMigrationJob[] = [
  {
    id: 'mig-901',
    organizationId: 'org-105',
    organizationName: 'Global Express Postal',
    sourceShard: 'shard-eu-west-1a',
    destinationShard: 'shard-us-east-1a',
    status: 'CUTTING_OVER',
    progressPercent: 88,
    startedAt: '2026-09-29 14:10:00',
    initiatedBy: 'Alexander Wright',
    notes: 'Rebalancing heavy EU shard load to US East 1'
  },
  {
    id: 'mig-902',
    organizationId: 'org-103',
    organizationName: 'Dhaka Care Medical',
    sourceShard: 'shard-ap-south-1a',
    destinationShard: 'shard-ap-south-1a',
    status: 'COMPLETED',
    progressPercent: 100,
    startedAt: '2026-09-20 08:30:00',
    completedAt: '2026-09-20 08:45:12',
    initiatedBy: 'Elena Rostova',
    notes: 'Upgraded tenant database schema to v4.2'
  },
  {
    id: 'mig-903',
    organizationId: 'org-106',
    organizationName: 'Pacific Federal University',
    sourceShard: 'shard-us-west-2a',
    destinationShard: 'shard-us-west-2a',
    status: 'PLANNED',
    progressPercent: 0,
    startedAt: '2026-09-30 02:00:00',
    initiatedBy: 'Alexander Wright',
    notes: 'Scheduled off-peak index maintenance and shard optimization'
  }
];

export const MOCK_AUDIT_LOGS: PlatformAuditLog[] = [
  {
    id: 'aud-301',
    timestamp: '2026-09-29 15:42:10',
    actor: 'Alexander Wright',
    actorRole: 'PLATFORM_OWNER',
    action: 'ORGANIZATION_CREATED',
    organizationId: 'org-107',
    organizationName: 'Horizon Tech Care',
    resource: 'Organization',
    resourceId: 'org-107',
    ipAddress: '192.168.1.45',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    result: 'SUCCESS'
  },
  {
    id: 'aud-302',
    timestamp: '2026-09-29 14:10:00',
    actor: 'Alexander Wright',
    actorRole: 'PLATFORM_OWNER',
    action: 'MIGRATION_STARTED',
    organizationId: 'org-105',
    organizationName: 'Global Express Postal',
    resource: 'Shard Migration',
    resourceId: 'mig-901',
    ipAddress: '192.168.1.45',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    result: 'SUCCESS',
    reason: 'Shard load rebalancing'
  },
  {
    id: 'aud-303',
    timestamp: '2026-09-28 11:20:05',
    actor: 'Elena Rostova',
    actorRole: 'PLATFORM_ADMIN',
    action: 'ORGANIZATION_SUSPENDED',
    organizationId: 'org-104',
    organizationName: 'Metro DMV Authority',
    resource: 'Organization',
    resourceId: 'org-104',
    ipAddress: '10.0.4.12',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    result: 'SUCCESS',
    reason: 'Payment invoice overdue by 45 days'
  },
  {
    id: 'aud-304',
    timestamp: '2026-09-27 09:15:30',
    actor: 'Alexander Wright',
    actorRole: 'PLATFORM_OWNER',
    action: 'PLATFORM_SETTING_CHANGED',
    resource: 'PlatformSettings',
    resourceId: 'rateLimits',
    ipAddress: '192.168.1.45',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    result: 'SUCCESS',
    reason: 'Increased API rate limits for enterprise peak traffic'
  },
  {
    id: 'aud-305',
    timestamp: '2026-09-25 16:50:11',
    actor: 'Elena Rostova',
    actorRole: 'PLATFORM_ADMIN',
    action: 'ADMIN_CREATED',
    organizationId: 'org-103',
    organizationName: 'Dhaka Care Medical',
    resource: 'TenantAdmin',
    resourceId: 'tadmin-4',
    ipAddress: '10.0.4.12',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    result: 'SUCCESS'
  }
];

export const MOCK_PLATFORM_SETTINGS: PlatformSettings = {
  general: {
    platformName: 'QueueFlow Control Tower Enterprise',
    supportEmail: 'superadmin@queueflow.io',
    maintenanceMode: false,
    allowNewRegistrations: true
  },
  security: {
    enforceMfaForStaff: true,
    sessionTimeoutMinutes: 60,
    maxLoginAttempts: 5,
    ipWhitelist: ['192.168.1.0/24', '10.0.0.0/16']
  },
  rateLimits: {
    apiRequestsPerMinute: 12000,
    publicFormSubmissionsPerMin: 300
  },
  notifications: {
    systemAlertEmails: ['ops-alerts@queueflow.io', 'security@queueflow.io'],
    slackWebhookUrlMasked: 'https://hooks.slack.com/services/T00/B00/••••••••'
  },
  infrastructure: {
    defaultShard: 'shard-us-east-1a',
    autoFailover: true,
    backupFrequencyHours: 6
  }
};
