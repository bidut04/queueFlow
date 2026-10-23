import { api } from './client';
import { INITIAL_ROLES, type RoleItem } from '../data/mockRoles';

export interface CreateRoleInput {
  roleCode: string;
  roleName: string;
  description: string;
  permissionsCount?: number;
  level?: RoleItem['level'];
  status?: RoleItem['status'];
}

export interface UpdateRoleInput extends Partial<CreateRoleInput> {
  id: string;
}

// In-memory fallback cache for roles
let localRoles: RoleItem[] = [...INITIAL_ROLES];

export const roleApi = {
  getRoles: async (): Promise<RoleItem[]> => {
    try {
      const response = await api.get<any>('/roles');
      const rawList = Array.isArray(response) ? response : response?.data;
      if (Array.isArray(rawList)) {
        // Map backend roles if necessary, else return
        return rawList.map((r: any) => ({
          id: r.id || `role-${Date.now()}`,
          roleCode: r.roleCode || r.name || `ROLE_${r.id}`,
          roleName: r.roleName || r.name || 'Custom Role',
          description: r.description || 'Tenant operational role',
          permissionsCount: r.permissionsCount ?? (r.permissions?.length || 16),
          assignedEmployees: r.assignedEmployees ?? (r.assignments?.length || 0),
          level: r.level || 'Standard',
          status: r.status || (r.isActive === false ? 'Inactive' : 'Active'),
          createdAt: r.createdAt ? new Date(r.createdAt).toISOString().split('T')[0] : '2024-01-01',
        }));
      }
      return localRoles;
    } catch {
      return localRoles;
    }
  },

  getRoleById: async (id: string): Promise<RoleItem> => {
    try {
      const res = await api.get<any>(`/roles/${id}`);
      const r = res?.data || res;
      return {
        id: r.id,
        roleCode: r.roleCode || r.name,
        roleName: r.roleName || r.name,
        description: r.description,
        permissionsCount: r.permissionsCount ?? (r.permissions?.length || 16),
        assignedEmployees: r.assignedEmployees ?? 0,
        level: r.level || 'Standard',
        status: r.status || 'Active',
        createdAt: r.createdAt ? new Date(r.createdAt).toISOString().split('T')[0] : '2024-01-01',
      };
    } catch {
      const found = localRoles.find((r) => r.id === id);
      if (!found) throw new Error(`Role ${id} not found`);
      return found;
    }
  },

  createRole: async (input: CreateRoleInput): Promise<RoleItem> => {
    try {
      const res = await api.post<any>('/roles', {
        name: input.roleName,
        description: input.description,
      });
      const r = res?.data || res;
      const created: RoleItem = {
        id: r.id || `role-${Date.now()}`,
        roleCode: input.roleCode || `ROLE_${Date.now().toString().slice(-4)}`,
        roleName: input.roleName,
        description: input.description,
        permissionsCount: input.permissionsCount ?? 16,
        assignedEmployees: 0,
        level: input.level ?? 'Standard',
        status: input.status ?? 'Active',
        createdAt: new Date().toISOString().split('T')[0],
      };
      localRoles = [created, ...localRoles];
      return created;
    } catch {
      const newRole: RoleItem = {
        id: `role-${Date.now()}`,
        roleCode: input.roleCode || `ROLE_${Date.now().toString().slice(-4)}`,
        roleName: input.roleName,
        description: input.description,
        permissionsCount: input.permissionsCount ?? 16,
        assignedEmployees: 0,
        level: input.level ?? 'Standard',
        status: input.status ?? 'Active',
        createdAt: new Date().toISOString().split('T')[0],
      };
      localRoles = [newRole, ...localRoles];
      return newRole;
    }
  },

  updateRole: async ({ id, ...input }: UpdateRoleInput): Promise<RoleItem> => {
    try {
      await api.patch(`/roles/${id}`, {
        name: input.roleName,
        description: input.description,
      });
    } catch {
      // Continue for local state
    }
    let updatedRole: RoleItem | null = null;
    localRoles = localRoles.map((r) => {
      if (r.id === id) {
        updatedRole = { ...r, ...input };
        return updatedRole;
      }
      return r;
    });
    if (!updatedRole) throw new Error(`Role ${id} not found`);
    return updatedRole;
  },

  deleteRole: async (id: string): Promise<{ success: boolean; id: string }> => {
    try {
      await api.delete(`/roles/${id}`);
    } catch {
      // Continue for local state
    }
    localRoles = localRoles.filter((r) => r.id !== id);
    return { success: true, id };
  },

  getAvailablePermissions: async (): Promise<string[]> => {
    try {
      const res = await api.get<any>('/roles/permissions');
      return res?.data || res || [];
    } catch {
      return [
        'ROLE_READ',
        'ROLE_CREATE',
        'ROLE_UPDATE',
        'ROLE_DELETE',
        'EMPLOYEE_READ',
        'EMPLOYEE_CREATE',
        'QUEUE_CALL',
        'QUEUE_VIEW',
        'BOOKING_READ',
        'BOOKING_CREATE',
      ];
    }
  },
};
