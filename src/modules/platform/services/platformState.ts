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
  OrgType
} from '../types/platform';
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
} from '../data/mockPlatformData';

class PlatformStore {
  private listeners: Set<() => void> = new Set();
  
  public organizations: Organization[] = [...MOCK_ORGANIZATIONS];
  public tenantAdmins: TenantAdmin[] = [...MOCK_TENANT_ADMINS];
  public platformUsers: PlatformUser[] = [...MOCK_PLATFORM_USERS];
  public subscriptionPlans: PlatformSubscriptionPlan[] = [...MOCK_SUBSCRIPTION_PLANS];
  public systemHealth: SystemComponentHealth[] = [...MOCK_SYSTEM_HEALTH];
  public shards: ShardInfo[] = [...MOCK_SHARDS];
  public migrations: TenantMigrationJob[] = [...MOCK_TENANT_MIGRATIONS];
  public auditLogs: PlatformAuditLog[] = [...MOCK_AUDIT_LOGS];
  public settings: PlatformSettings = { ...MOCK_PLATFORM_SETTINGS };

  // Super Admin active context state
  public currentUser: PlatformUser = MOCK_PLATFORM_USERS[0];
  public activeTenantContext: Organization | null = null;

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  // --- TENANT CONTEXT SWITCHING ---
  public switchTenantContext(orgId: string | null) {
    if (!orgId) {
      this.activeTenantContext = null;
    } else {
      const org = this.organizations.find((o) => o.id === orgId);
      if (org) {
        this.activeTenantContext = org;
        this.addAuditLog({
          actor: this.currentUser.name,
          actorRole: this.currentUser.role,
          action: 'TENANT_CONTEXT_SWITCHED',
          organizationId: org.id,
          organizationName: org.name,
          resource: 'Organization',
          resourceId: org.id,
          result: 'SUCCESS',
          reason: `Super Admin impersonated tenant context for ${org.name}`
        });
      }
    }
    this.notify();
  }

  // --- ORGANIZATION MUTATIONS ---
  public createOrganization(data: {
    name: string;
    legalName: string;
    slug: string;
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
  }): Organization {
    // Shard assignment respecting consistent shard catalog: select least utilized writable shard
    const writableShards = this.shards.filter((s) => !s.readOnly && s.status === 'HEALTHY');
    const selectedShard = data.preferredShardId
      ? this.shards.find((s) => s.id === data.preferredShardId) || writableShards[0]
      : writableShards.sort((a, b) => a.utilizationPercent - b.utilizationPercent)[0] || this.shards[0];

    const newOrgId = `org-${Date.now().toString().slice(-4)}`;
    const newOrg: Organization = {
      id: newOrgId,
      name: data.name,
      legalName: data.legalName || data.name,
      slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
      type: data.type,
      status: 'ACTIVE',
      plan: data.planName || 'Professional',
      subscriptionState: 'ACTIVE',
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      country: data.country,
      timezone: data.timezone,
      branchesCount: 1,
      usersCount: 1,
      employeesCount: 5,
      servicesCount: 4,
      activeQueuesCount: 1,
      monthlyBookingsCount: 0,
      currentShard: selectedShard.id,
      region: selectedShard.region.split(' ')[0],
      createdDate: new Date().toISOString().split('T')[0],
      lastActivity: 'Just now',
      primaryAdminName: data.primaryAdminName,
      primaryAdminEmail: data.primaryAdminEmail,
      primaryAdminPhone: data.primaryAdminPhone
    };

    // Increment tenant count on selected shard
    selectedShard.tenantCount += 1;
    selectedShard.utilizationPercent = Math.min(
      100,
      Math.round((selectedShard.tenantCount / selectedShard.capacityTenants) * 100)
    );

    this.organizations = [newOrg, ...this.organizations];

    // Create Primary Admin for Tenant
    const primaryAdmin: TenantAdmin = {
      id: `tadmin-${Date.now().toString().slice(-4)}`,
      organizationId: newOrg.id,
      organizationName: newOrg.name,
      name: data.primaryAdminName,
      email: data.primaryAdminEmail,
      phone: data.primaryAdminPhone || data.contactPhone,
      role: 'TENANT_OWNER',
      status: 'ACTIVE',
      lastLogin: 'Never',
      createdDate: new Date().toISOString().split('T')[0]
    };
    this.tenantAdmins = [primaryAdmin, ...this.tenantAdmins];

    this.addAuditLog({
      actor: this.currentUser.name,
      actorRole: this.currentUser.role,
      action: 'ORGANIZATION_CREATED',
      organizationId: newOrg.id,
      organizationName: newOrg.name,
      resource: 'Organization',
      resourceId: newOrg.id,
      result: 'SUCCESS',
      reason: `Assigned to shard ${selectedShard.id}`
    });

    this.notify();
    return newOrg;
  }

  public suspendOrganization(orgId: string, reason: string) {
    const org = this.organizations.find((o) => o.id === orgId);
    if (!org) return;

    const previousStatus = org.status;
    org.status = 'SUSPENDED';
    org.subscriptionState = 'SUSPENDED';
    org.lastActivity = 'Just now';

    // Suspend associated tenant admins
    this.tenantAdmins.forEach((adm) => {
      if (adm.organizationId === orgId) {
        adm.status = 'SUSPENDED';
      }
    });

    this.addAuditLog({
      actor: this.currentUser.name,
      actorRole: this.currentUser.role,
      action: 'ORGANIZATION_SUSPENDED',
      organizationId: org.id,
      organizationName: org.name,
      resource: 'Organization',
      resourceId: org.id,
      result: 'SUCCESS',
      reason: `Status changed from ${previousStatus} to SUSPENDED. Reason: ${reason}`
    });

    this.notify();
  }

  public activateOrganization(orgId: string) {
    const org = this.organizations.find((o) => o.id === orgId);
    if (!org) return;

    const previousStatus = org.status;
    org.status = 'ACTIVE';
    org.subscriptionState = 'ACTIVE';
    org.lastActivity = 'Just now';

    // Reactivate associated tenant admins
    this.tenantAdmins.forEach((adm) => {
      if (adm.organizationId === orgId) {
        adm.status = 'ACTIVE';
      }
    });

    this.addAuditLog({
      actor: this.currentUser.name,
      actorRole: this.currentUser.role,
      action: 'ORGANIZATION_ACTIVATED',
      organizationId: org.id,
      organizationName: org.name,
      resource: 'Organization',
      resourceId: org.id,
      result: 'SUCCESS',
      reason: `Status restored from ${previousStatus} to ACTIVE`
    });

    this.notify();
  }

  // --- TENANT ADMIN MANAGEMENT ---
  public createTenantAdmin(data: {
    organizationId: string;
    name: string;
    email: string;
    phone: string;
    role: 'TENANT_OWNER' | 'TENANT_ADMIN';
  }) {
    const org = this.organizations.find((o) => o.id === data.organizationId);
    const newAdmin: TenantAdmin = {
      id: `tadmin-${Date.now().toString().slice(-4)}`,
      organizationId: data.organizationId,
      organizationName: org ? org.name : 'Unknown Org',
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      status: 'ACTIVE',
      lastLogin: 'Never',
      createdDate: new Date().toISOString().split('T')[0]
    };

    this.tenantAdmins = [newAdmin, ...this.tenantAdmins];
    if (org) org.usersCount += 1;

    this.addAuditLog({
      actor: this.currentUser.name,
      actorRole: this.currentUser.role,
      action: 'ADMIN_CREATED',
      organizationId: data.organizationId,
      organizationName: org?.name,
      resource: 'TenantAdmin',
      resourceId: newAdmin.id,
      result: 'SUCCESS'
    });

    this.notify();
  }

  // --- PLATFORM USERS MANAGEMENT ---
  public invitePlatformUser(data: {
    name: string;
    email: string;
    role: 'PLATFORM_OWNER' | 'PLATFORM_ADMIN' | 'PLATFORM_SUPPORT';
  }) {
    const newUser: PlatformUser = {
      id: `puser-${Date.now().toString().slice(-4)}`,
      name: data.name,
      email: data.email,
      role: data.role,
      status: 'ACTIVE',
      lastLogin: 'Never',
      mfaStatus: 'ENABLED',
      createdDate: new Date().toISOString().split('T')[0]
    };

    this.platformUsers = [newUser, ...this.platformUsers];

    this.addAuditLog({
      actor: this.currentUser.name,
      actorRole: this.currentUser.role,
      action: 'PLATFORM_USER_INVITED',
      resource: 'PlatformUser',
      resourceId: newUser.id,
      result: 'SUCCESS',
      reason: `Invited as ${data.role}`
    });

    this.notify();
  }

  // --- SHARD MIGRATION WORKFLOW ---
  public startMigration(orgId: string, destinationShardId: string, notes?: string) {
    const org = this.organizations.find((o) => o.id === orgId);
    if (!org) return;

    const migrationId = `mig-${Date.now().toString().slice(-4)}`;
    const newMigration: TenantMigrationJob = {
      id: migrationId,
      organizationId: org.id,
      organizationName: org.name,
      sourceShard: org.currentShard,
      destinationShard: destinationShardId,
      status: 'COPYING',
      progressPercent: 25,
      startedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      initiatedBy: this.currentUser.name,
      notes: notes || 'Scheduled zero-downtime tenant migration'
    };

    this.migrations = [newMigration, ...this.migrations];

    this.addAuditLog({
      actor: this.currentUser.name,
      actorRole: this.currentUser.role,
      action: 'MIGRATION_STARTED',
      organizationId: org.id,
      organizationName: org.name,
      resource: 'Shard Migration',
      resourceId: migrationId,
      result: 'SUCCESS',
      reason: `Migrating from ${org.currentShard} to ${destinationShardId}`
    });

    this.notify();
  }

  public rollbackMigration(migrationId: string) {
    const mig = this.migrations.find((m) => m.id === migrationId);
    if (!mig) return;

    mig.status = 'ROLLING_BACK';
    mig.progressPercent = 100;
    mig.completedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);

    this.addAuditLog({
      actor: this.currentUser.name,
      actorRole: this.currentUser.role,
      action: 'MIGRATION_ROLLED_BACK',
      organizationId: mig.organizationId,
      organizationName: mig.organizationName,
      resource: 'Shard Migration',
      resourceId: mig.id,
      result: 'SUCCESS',
      reason: `Rolled back migration ${mig.id}. Restored mapping to ${mig.sourceShard}`
    });

    this.notify();
  }

  // --- AUDIT LOG UTILS ---
  private addAuditLog(entry: Omit<PlatformAuditLog, 'id' | 'timestamp' | 'ipAddress' | 'userAgent'>) {
    const newLog: PlatformAuditLog = {
      id: `aud-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      ipAddress: '192.168.1.100',
      userAgent: navigator.userAgent || 'Mozilla/5.0 (Windows NT 10.0)',
      ...entry
    };
    this.auditLogs = [newLog, ...this.auditLogs];
  }
}

export const platformStore = new PlatformStore();
