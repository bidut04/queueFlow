import { platformStore } from './platformState';
import type { Organization } from '../types/platform';

export interface OrgAdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  organizationId?: string;
}

class OrgAdminAuthStore {
  private listeners: Set<() => void> = new Set();
  public currentUser: OrgAdminUser | null = null;

  constructor() {
    // Check if there is an active session or initialize with a default demo if stored
    const saved = localStorage.getItem('qf_org_admin_user');
    if (saved) {
      try {
        this.currentUser = JSON.parse(saved) as OrgAdminUser;
      } catch {
        this.currentUser = null;
      }
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }

  public signUp(data: { name: string; email: string; phone: string; password?: string }): OrgAdminUser {
    const newUser: OrgAdminUser = {
      id: `orgadm-${Date.now().toString().slice(-4)}`,
      name: data.name,
      email: data.email.toLowerCase().trim(),
      phone: data.phone || ''
    };

    this.currentUser = newUser;
    localStorage.setItem('qf_org_admin_user', JSON.stringify(newUser));
    this.notify();
    return newUser;
  }

  public signIn(email: string, _password?: string): OrgAdminUser {
    const cleanEmail = email.toLowerCase().trim();
    // Check if there is an existing organization submitted with this email
    const existingOrg = platformStore.organizations.find(
      (o) => o.submittedByEmail?.toLowerCase() === cleanEmail || o.contactEmail?.toLowerCase() === cleanEmail
    );

    const user: OrgAdminUser = {
      id: `orgadm-${Date.now().toString().slice(-4)}`,
      name: existingOrg ? existingOrg.primaryAdminName : cleanEmail.split('@')[0],
      email: cleanEmail,
      phone: existingOrg?.primaryAdminPhone || '+1 (555) 019-2834',
      organizationId: existingOrg?.id
    };

    this.currentUser = user;
    localStorage.setItem('qf_org_admin_user', JSON.stringify(user));
    this.notify();
    return user;
  }

  public signOut(): void {
    this.currentUser = null;
    localStorage.removeItem('qf_org_admin_user');
    this.notify();
  }

  public setRegisteredOrganization(orgId: string): void {
    if (this.currentUser) {
      this.currentUser = {
        ...this.currentUser,
        organizationId: orgId
      };
      localStorage.setItem('qf_org_admin_user', JSON.stringify(this.currentUser));
      this.notify();
    }
  }

  public getAssociatedOrganization(): Organization | undefined {
    if (!this.currentUser) return undefined;

    // Check by orgId first
    if (this.currentUser.organizationId) {
      const org = platformStore.organizations.find((o) => o.id === this.currentUser?.organizationId);
      if (org) return org;
    }

    // Check by submittedByEmail or contactEmail
    return platformStore.organizations.find(
      (o) =>
        o.submittedByEmail?.toLowerCase() === this.currentUser?.email.toLowerCase() ||
        o.contactEmail?.toLowerCase() === this.currentUser?.email.toLowerCase()
    );
  }
}

export const orgAdminAuthStore = new OrgAdminAuthStore();
