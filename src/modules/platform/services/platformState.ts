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
  RegisterOrgInput,

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
import { api } from '../../../api/client';

import { authApi } from '../../../api/auth.api';
import { platformApi } from '../api/platform.api';


export interface PasswordSetupInvite {
  token: string;
  email: string;
  name: string;
  organizationId: string;
  organizationName: string;
  createdAt: string;
  expiresAt: string;
  isUsed: boolean;
}


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
  public currentUser: PlatformUser = {
    id: 'super-admin-root',
    name: 'Super Admin',
    email: 'admin@gmail.com',
    role: 'PLATFORM_OWNER',
    status: 'ACTIVE',
    lastLogin: 'Just now',
    mfaStatus: 'ENABLED',
    createdDate: new Date().toISOString().split('T')[0]
  };
  public activeTenantContext: Organization | null = null;
  public lastGeneratedInvite: PasswordSetupInvite | null = null;
  public isLoading: boolean = false;
  public isLoadedFromBackend: boolean = false;


  constructor() {
    this.syncCurrentUser();
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public notify() {
    this.listeners.forEach((listener) => listener());
  }

  public syncCurrentUser() {
    const activeAuth = authApi.getCurrentUser();
    if (activeAuth?.email) {
      this.currentUser = {
        id: 'super-admin-user',
        name: activeAuth.email.split('@')[0],
        email: activeAuth.email,
        role: (activeAuth.role === 'SUPER_ADMIN' || activeAuth.role === 'ADMIN') ? 'PLATFORM_OWNER' : 'PLATFORM_ADMIN',
        status: 'ACTIVE',
        lastLogin: 'Just now',
        mfaStatus: 'ENABLED',
        createdDate: new Date().toISOString().split('T')[0]
      };
    }
  }

  // --- LIVE BACKEND DATA FETCHING ---
  public async loadFromBackend(): Promise<void> {
    if (!authApi.isSuperAdmin()) {
      return;
    }
    try {
      this.isLoading = true;
      this.syncCurrentUser();

      const [orgs, shards, users, health, audit, migrations] = await Promise.all([
        platformApi.getOrganizations(),
        platformApi.getShards(),
        platformApi.getPlatformUsers(),
        platformApi.getSystemHealth(),
        platformApi.getAuditLogs(),
        platformApi.getMigrations(),
      ]);

      if (orgs && orgs.length > 0) this.organizations = orgs;
      if (shards && shards.length > 0) this.shards = shards;
      if (users && users.length > 0) {
        this.platformUsers = users;
        const match = this.platformUsers.find(
          (u) => u.email.toLowerCase() === this.currentUser.email.toLowerCase()
        );
        if (match) {
          this.currentUser = match;
        }
      }
      if (health && health.length > 0) this.systemHealth = health;
      if (audit && audit.length > 0) this.auditLogs = audit;
      if (migrations && migrations.length > 0) this.migrations = migrations;

      this.isLoadedFromBackend = true;
    } catch (err) {
      console.warn('[PlatformStore] Could not load live platform data from backend:', err);
    } finally {
      this.isLoading = false;
      this.notify();
    }
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
  public async createOrganization(data: {
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
  }): Promise<Organization> {
    const selectedShardId = data.preferredShardId || this.shards[0]?.id || 'shard_01';

    let createdOrg: Organization;

    try {
      createdOrg = await platformApi.createOrganization({
        name: data.name,
        legalName: data.legalName || data.name,
        slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
        type: data.type,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        country: data.country,
        timezone: data.timezone,
        primaryAdminName: data.primaryAdminName,
        primaryAdminEmail: data.primaryAdminEmail,
        primaryAdminPhone: data.primaryAdminPhone,
        planName: data.planName || 'standard',
        preferredShardId: selectedShardId
      });
    } catch {
      // Fallback local creation if offline
      const newOrgId = `org-${Date.now().toString().slice(-4)}`;
      createdOrg = {
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
        currentShard: selectedShardId,
        region: 'ap-south-1',
        createdDate: new Date().toISOString().split('T')[0],
        lastActivity: 'Just now',
        primaryAdminName: data.primaryAdminName,
        primaryAdminEmail: data.primaryAdminEmail,
        primaryAdminPhone: data.primaryAdminPhone
      };
    }

    this.organizations = [createdOrg, ...this.organizations.filter((o) => o.id !== createdOrg.id)];


    const primaryAdmin: TenantAdmin = {
      id: `tadmin-${Date.now().toString().slice(-4)}`,
      organizationId: createdOrg.id,
      organizationName: createdOrg.name,
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
      organizationId: createdOrg.id,
      organizationName: createdOrg.name,
      resource: 'Organization',
      resourceId: createdOrg.id,
      result: 'SUCCESS',
      reason: `Assigned to shard ${selectedShardId}`
    });

    this.createPasswordSetupInvite({
      email: data.primaryAdminEmail,
      name: data.primaryAdminName,
      organizationId: createdOrg.id,
      organizationName: createdOrg.name
    });

    this.notify();
    return createdOrg;
  }

  // --- SELF-SERVICE ORGANIZATION REGISTRATION ---
  public submitOrganizationRegistration(data: RegisterOrgInput): Organization {
    const selectedShardId = data.preferredShardId || this.shards[0]?.id || 'shard_01';
    const newOrgId = `org-${Date.now().toString().slice(-4)}`;
    const newOrg: Organization = {
      id: newOrgId,
      name: data.name,
      legalName: data.legalName || data.name,
      slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
      type: data.type,
      status: 'PENDING',
      registrationStatus: 'PENDING_APPROVAL',
      plan: data.planName || 'Free',
      subscriptionState: 'TRIAL',
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      country: data.country,
      timezone: data.timezone,
      branchesCount: 1,
      usersCount: 1,
      employeesCount: 2,
      servicesCount: 2,
      activeQueuesCount: 1,
      monthlyBookingsCount: 0,
      currentShard: selectedShardId,
      region: 'ap-south-1',
      createdDate: new Date().toISOString().split('T')[0],
      lastActivity: 'Just now',
      primaryAdminName: data.primaryAdminName,
      primaryAdminEmail: data.primaryAdminEmail,
      primaryAdminPhone: data.primaryAdminPhone,
      submittedByEmail: data.primaryAdminEmail
    };

    this.organizations = [newOrg, ...this.organizations];

    const primaryAdmin: TenantAdmin = {
      id: `tadmin-${Date.now().toString().slice(-4)}`,
      organizationId: newOrg.id,
      organizationName: newOrg.name,
      name: data.primaryAdminName,
      email: data.primaryAdminEmail,
      phone: data.primaryAdminPhone || data.contactPhone,
      role: 'TENANT_OWNER',
      status: 'SUSPENDED',
      lastLogin: 'Never',
      createdDate: new Date().toISOString().split('T')[0]
    };
    this.tenantAdmins = [primaryAdmin, ...this.tenantAdmins];

    this.addAuditLog({
      actor: data.primaryAdminName,
      actorRole: 'TENANT_OWNER',
      action: 'ORGANIZATION_REGISTRATION_SUBMITTED',
      organizationId: newOrg.id,
      organizationName: newOrg.name,
      resource: 'Organization',
      resourceId: newOrg.id,
      result: 'SUCCESS',
      reason: `Self-registration submitted with plan ${data.planName}. Awaiting Super Admin review.`
    });

    this.createPasswordSetupInvite({
      email: data.primaryAdminEmail,
      name: data.primaryAdminName,
      organizationId: newOrg.id,
      organizationName: newOrg.name
    });

    this.notify();
    return newOrg;
  }

  // --- PASSWORD SETUP INVITE MANAGEMENT ---
  public createPasswordSetupInvite(data: {
    email: string;
    name: string;
    organizationId: string;
    organizationName: string;
  }): PasswordSetupInvite {
    const rawTokens = this.getPasswordInvites();
    const token = `inv_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const invite: PasswordSetupInvite = {
      token,
      email: data.email.toLowerCase().trim(),
      name: data.name,
      organizationId: data.organizationId,
      organizationName: data.organizationName,
      createdAt: new Date().toISOString(),
      expiresAt,
      isUsed: false
    };

    const updated = [invite, ...rawTokens];
    localStorage.setItem('qf_password_invites', JSON.stringify(updated));
    this.lastGeneratedInvite = invite;
    this.notify();
    return invite;
  }

  public getPasswordInvites(): PasswordSetupInvite[] {
    try {
      const stored = localStorage.getItem('qf_password_invites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  public getInviteByToken(token: string): PasswordSetupInvite | null {
    const invites = this.getPasswordInvites();
    return invites.find((inv) => inv.token === token) || null;
  }

  public completePasswordSetup(token: string, password: string): { success: boolean; message: string; invite?: PasswordSetupInvite } {
    const invites = this.getPasswordInvites();
    const target = invites.find((inv) => inv.token === token);

    if (!target) {
      return { success: false, message: 'Invalid or expired setup token link.' };
    }

    if (target.isUsed) {
      return { success: false, message: 'This password setup link has already been used.' };
    }

    if (new Date(target.expiresAt).getTime() < Date.now()) {
      return { success: false, message: 'This password setup link has expired.' };
    }

    target.isUsed = true;
    localStorage.setItem('qf_password_invites', JSON.stringify(invites));

    try {
      const storedCreds = localStorage.getItem('qf_user_credentials') || '{}';
      const parsedCreds = JSON.parse(storedCreds);
      parsedCreds[target.email.toLowerCase()] = password;
      localStorage.setItem('qf_user_credentials', JSON.stringify(parsedCreds));
    } catch {
      // ignore
    }

    this.notify();
    return { success: true, message: 'Password configured successfully!', invite: target };
  }

  // --- PERMISSION & APPROVAL WORKFLOWS ---
  public async approveRegistration(orgId: string, remarks?: string): Promise<void> {
    const org = this.organizations.find((o) => o.id === orgId);
    if (org) {
      org.status = 'ACTIVE';
      org.registrationStatus = 'APPROVED';
      org.subscriptionState = 'ACTIVE';
      org.remarks = remarks || 'Approved by Super Admin';
      org.reviewedBy = this.currentUser.name;
      org.reviewedAt = new Date().toLocaleString();
      org.lastActivity = 'Just now';

      this.tenantAdmins.forEach((adm) => {
        if (adm.organizationId === orgId) {
          adm.status = 'ACTIVE';
        }
      });
    }

    try {
      await api.post(`/platform/organizations/${orgId}/activate`, {
        reason: remarks || 'Approved by Super Admin'
      });
      await this.loadFromBackend();
    } catch (err) {
      console.warn('[PlatformStore] Could not sync approveRegistration to backend:', err);
    }

    this.addAuditLog({
      actor: this.currentUser.name,
      actorRole: this.currentUser.role,
      action: 'ORGANIZATION_APPROVED',
      organizationId: orgId,
      organizationName: org?.name,
      resource: 'Organization',
      resourceId: orgId,
      result: 'SUCCESS',
      reason: remarks ? `Approved: ${remarks}` : 'Approved by Super Admin'
    });

    this.notify();
  }

  public async holdRegistration(orgId: string, remarks: string): Promise<void> {
    const org = this.organizations.find((o) => o.id === orgId);
    if (org) {
      org.status = 'HOLD';
      org.registrationStatus = 'HOLD';
      org.remarks = remarks;
      org.reviewedBy = this.currentUser.name;
      org.reviewedAt = new Date().toLocaleString();
      org.lastActivity = 'Just now';
    }

    try {
      await api.post(`/platform/organizations/${orgId}/suspend`, {
        reason: `Registration on hold: ${remarks}`
      });
      await this.loadFromBackend();
    } catch (err) {
      console.warn('[PlatformStore] Could not sync holdRegistration to backend:', err);
    }

    this.addAuditLog({
      actor: this.currentUser.name,
      actorRole: this.currentUser.role,
      action: 'ORGANIZATION_PUT_ON_HOLD',
      organizationId: orgId,
      organizationName: org?.name,
      resource: 'Organization',
      resourceId: orgId,
      result: 'SUCCESS',
      reason: `Put on hold: ${remarks}`
    });

    this.notify();
  }

  public async rejectRegistration(orgId: string, remarks: string): Promise<void> {
    const org = this.organizations.find((o) => o.id === orgId);
    if (org) {
      org.status = 'REJECTED';
      org.registrationStatus = 'REJECTED';
      org.remarks = remarks;
      org.reviewedBy = this.currentUser.name;
      org.reviewedAt = new Date().toLocaleString();
      org.lastActivity = 'Just now';
    }

    try {
      await api.post(`/platform/organizations/${orgId}/archive`, {
        reason: `Registration rejected: ${remarks}`
      });
      await this.loadFromBackend();
    } catch (err) {
      console.warn('[PlatformStore] Could not sync rejectRegistration to backend:', err);
    }

    this.addAuditLog({
      actor: this.currentUser.name,
      actorRole: this.currentUser.role,
      action: 'ORGANIZATION_REJECTED',
      organizationId: orgId,
      organizationName: org?.name,
      resource: 'Organization',
      resourceId: orgId,
      result: 'SUCCESS',
      reason: `Rejected: ${remarks}`
    });

    this.notify();
  }

  public updateOrganizationRemarks(orgId: string, remarks: string): void {
    const org = this.organizations.find((o) => o.id === orgId);
    if (!org) return;

    org.remarks = remarks;
    org.reviewedBy = this.currentUser.name;
    org.reviewedAt = new Date().toLocaleString();
    this.notify();
  }

  public async suspendOrganization(orgId: string, reason: string): Promise<void> {
    const org = this.organizations.find((o) => o.id === orgId);
    const previousStatus = org?.status || 'ACTIVE';

    if (org) {
      org.status = 'SUSPENDED';
      org.subscriptionState = 'SUSPENDED';
      org.lastActivity = 'Just now';

      this.tenantAdmins.forEach((adm) => {
        if (adm.organizationId === orgId) {
          adm.status = 'SUSPENDED';
        }
      });
    }

    try {
      await api.post(`/platform/organizations/${orgId}/suspend`, {
        reason: reason || 'Suspended by Super Admin'
      });
      await this.loadFromBackend();
    } catch (err) {
      console.warn('[PlatformStore] Could not sync suspendOrganization to backend:', err);
    }

    this.addAuditLog({
      actor: this.currentUser.name,
      actorRole: this.currentUser.role,
      action: 'ORGANIZATION_SUSPENDED',
      organizationId: orgId,
      organizationName: org?.name,
      resource: 'Organization',
      resourceId: orgId,
      result: 'SUCCESS',
      reason: `Status changed from ${previousStatus} to SUSPENDED. Reason: ${reason}`
    });

    this.notify();
  }

  public async activateOrganization(orgId: string): Promise<void> {
    const org = this.organizations.find((o) => o.id === orgId);
    const previousStatus = org?.status || 'SUSPENDED';

    if (org) {
      org.status = 'ACTIVE';
      org.subscriptionState = 'ACTIVE';
      org.lastActivity = 'Just now';

      this.tenantAdmins.forEach((adm) => {
        if (adm.organizationId === orgId) {
          adm.status = 'ACTIVE';
        }
      });
    }

    try {
      await api.post(`/platform/organizations/${orgId}/activate`, {
        reason: 'Restored to ACTIVE by Super Admin'
      });
      await this.loadFromBackend();
    } catch (err) {
      console.warn('[PlatformStore] Could not sync activateOrganization to backend:', err);
    }

    this.addAuditLog({
      actor: this.currentUser.name,
      actorRole: this.currentUser.role,
      action: 'ORGANIZATION_ACTIVATED',
      organizationId: orgId,
      organizationName: org?.name,
      resource: 'Organization',
      resourceId: orgId,
      result: 'SUCCESS',
      reason: `Status restored from ${previousStatus} to ACTIVE`
    });

    this.notify();
  }

  // --- TENANT ADMIN MANAGEMENT ---
  public async createTenantAdmin(data: {
    organizationId: string;
    name: string;
    email: string;
    phone: string;
    role: 'TENANT_OWNER' | 'TENANT_ADMIN';
  }): Promise<void> {
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

    try {
      await api.post(`/platform/organizations/${data.organizationId}/admins`, {
        adminFullName: data.name,
        adminEmail: data.email,
        adminPhone: data.phone,
        role: data.role
      });
    } catch (err) {
      console.warn('[PlatformStore] Could not sync createTenantAdmin to backend:', err);
    }

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
  public async invitePlatformUser(data: {
    name: string;
    email: string;
    role: 'PLATFORM_OWNER' | 'PLATFORM_ADMIN' | 'PLATFORM_SUPPORT';
  }): Promise<void> {
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

    try {
      await api.post('/platform/users', {
        email: data.email,
        role: data.role
      });
      await this.loadFromBackend();
    } catch (err) {
      console.warn('[PlatformStore] Could not sync invitePlatformUser to backend:', err);
    }

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
  public async startMigration(orgId: string, destinationShardId: string, notes?: string): Promise<void> {
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

    try {
      await api.post('/platform/migrations', {
        tenantId: org.id,
        targetShardId: destinationShardId,
        notes
      });
      await this.loadFromBackend();
    } catch (err) {
      console.warn('[PlatformStore] Could not sync startMigration to backend:', err);
    }

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

  public async rollbackMigration(migrationId: string): Promise<void> {
    const mig = this.migrations.find((m) => m.id === migrationId);
    if (!mig) return;

    mig.status = 'ROLLING_BACK';
    mig.progressPercent = 100;
    mig.completedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);

    try {
      await api.post(`/platform/migrations/${migrationId}/rollback`, {});
      await this.loadFromBackend();
    } catch (err) {
      console.warn('[PlatformStore] Could not sync rollbackMigration to backend:', err);
    }

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
      ipAddress: '127.0.0.1',
      userAgent: navigator.userAgent || 'Mozilla/5.0',
      ...entry
    };
    this.auditLogs = [newLog, ...this.auditLogs];
  }
}

export const platformStore = new PlatformStore();
