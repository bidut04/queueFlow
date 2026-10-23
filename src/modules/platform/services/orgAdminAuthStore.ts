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
    // Purge any legacy plaintext credentials left in browser storage
    try {
      localStorage.removeItem('qf_user_credentials');
    } catch {
      // ignore
    }

    // Check if there is an active session
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
    const cleanEmail = data.email.toLowerCase().trim();
    const newUser: OrgAdminUser = {
      id: `orgadm-${Date.now().toString().slice(-4)}`,
      name: data.name,
      email: cleanEmail,
      phone: data.phone || ''
    };

    // Passwords must NEVER be stored in localStorage; authentication is delegated to the secure backend API.
    this.currentUser = newUser;
    localStorage.setItem('qf_org_admin_user', JSON.stringify(newUser));
    this.notify();
    return newUser;
  }

  public getRegisteredUser(email?: string): OrgAdminUser | null {
    if (!email && this.currentUser) return this.currentUser;
    try {
      const saved = localStorage.getItem('qf_org_admin_user');
      if (saved) {
        const user = JSON.parse(saved) as OrgAdminUser;
        if (!email || user.email.toLowerCase() === email.toLowerCase().trim()) {
          return user;
        }
      }
    } catch {
      // ignore
    }
    return null;
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
    try {
      localStorage.removeItem('qf_user_credentials');
    } catch {
      // ignore
    }
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
