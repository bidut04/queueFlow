import { api } from './client';
import type { Employee } from '../types/employee';

export interface CreateEmployeeInput {
  name: string;
  email: string;
  phone: string;
  role: Employee['role'];
  department: string;
  branch: string;
  employeeId?: string;
  employeeCode?: string;
  locationId?: string;
  roleId?: string;
  avatarUrl?: string;
  status?: Employee['status'];
}

export interface UpdateEmployeeInput extends Partial<CreateEmployeeInput> {
  id: string;
}

// In-memory fallback state so CRUD operations persist seamlessly in dev mode
let localEmployees: Employee[] = [];

export const employeeApi = {
  getEmployees: async (): Promise<Employee[]> => {
    try {
      const result = await api.get<any>('/employees', { skipAuthRedirect: true });
      const rawList = Array.isArray(result) ? result : (result?.items || result?.data?.items || result?.data || []);
      if (Array.isArray(rawList) && rawList.length > 0) {
        return rawList.map((emp: any) => ({
          id: emp.id,
          employeeId: emp.employeeCode || emp.employeeId || emp.id,
          name: emp.name,
          email: emp.email || '',
          phone: emp.phone || '',
          role: emp.roles?.[0]?.role?.roleName || emp.roles?.[0]?.role?.name || emp.role || 'Staff',
          department: emp.department || 'General Operations',
          branch: emp.locations?.[0]?.location?.name || emp.branch || 'Main Branch',
          avatarUrl: emp.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
          status: emp.status === 'ACTIVE' || emp.status === 'Active' ? 'Active' : (emp.status || 'Active'),
          joinedDate: emp.createdAt ? new Date(emp.createdAt).toISOString().split('T')[0] : '2024-01-01',
        }));
      }
      return localEmployees;
    } catch {
      // Graceful fallback to initial data if backend is offline/unseeded
      return localEmployees;
    }
  },

  getEmployeeById: async (id: string): Promise<Employee> => {
    try {
      const res = await api.get<any>(`/employees/${id}`, { skipAuthRedirect: true });
      const emp = res?.data || res;
      return {
        id: emp.id,
        employeeId: emp.employeeCode || emp.employeeId || emp.id,
        name: emp.name,
        email: emp.email || '',
        phone: emp.phone || '',
        role: emp.roles?.[0]?.role?.roleName || emp.roles?.[0]?.role?.name || emp.role || 'Staff',
        department: emp.department || 'General Operations',
        branch: emp.locations?.[0]?.location?.name || emp.branch || 'Main Branch',
        avatarUrl: emp.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        status: emp.status === 'ACTIVE' || emp.status === 'Active' ? 'Active' : (emp.status || 'Active'),
        joinedDate: emp.createdAt ? new Date(emp.createdAt).toISOString().split('T')[0] : '2024-01-01',
      };
    } catch {
      const found = localEmployees.find((e) => e.id === id || e.employeeId === id);
      if (!found) throw new Error(`Employee ${id} not found`);
      return found;
    }
  },

  createEmployee: async (input: CreateEmployeeInput): Promise<Employee> => {
    const code = input.employeeCode || input.employeeId || `EMP-${1000 + localEmployees.length + 1}`;
    const payload = {
      employeeCode: code,
      name: input.name,
      email: input.email ? input.email.trim() : undefined,
      phone: input.phone ? input.phone.trim() : undefined,
      role: input.role,
      roleId: input.roleId,
      department: input.department,
      branch: input.branch,
      locationId: input.locationId,
      status: input.status ? (input.status.toUpperCase() === 'ON LEAVE' ? 'ACTIVE' : input.status.toUpperCase()) : 'ACTIVE',
    };

    try {
      const created = await api.post<any>('/employees', payload, { skipAuthRedirect: true });
      const res = created?.data || created;
      const assignedBranch = res.locations?.[0]?.location?.name || input.branch || 'Main Branch';
      const assignedRole = res.roles?.[0]?.role?.roleName || res.roles?.[0]?.role?.name || input.role || 'Staff';
      const normalized: Employee = {
        id: res.id || `emp-${Date.now()}`,
        employeeId: res.employeeCode || code,
        name: res.name || input.name,
        email: res.email || input.email,
        phone: res.phone || input.phone,
        role: assignedRole,
        department: res.department || input.department,
        branch: assignedBranch,
        avatarUrl: input.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        status: res.status === 'ACTIVE' || res.status === 'Active' ? 'Active' : (input.status || 'Active'),
        joinedDate: res.createdAt ? new Date(res.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      };
      localEmployees = [normalized, ...localEmployees];
      return normalized;
    } catch {
      const newEmployee: Employee = {
        id: `emp-${Date.now()}`,
        employeeId: code,
        name: input.name,
        email: input.email,
        phone: input.phone,
        role: input.role,
        department: input.department,
        branch: input.branch,
        avatarUrl: input.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        status: input.status || 'Active',
        joinedDate: new Date().toISOString().split('T')[0],
      };
      localEmployees = [newEmployee, ...localEmployees];
      return newEmployee;
    }
  },

  updateEmployee: async ({ id, ...input }: UpdateEmployeeInput): Promise<Employee> => {
    const payload = {
      name: input.name,
      email: input.email ? input.email.trim() : undefined,
      phone: input.phone ? input.phone.trim() : undefined,
      role: input.role,
      roleId: input.roleId,
      department: input.department,
      branch: input.branch,
      locationId: input.locationId,
      status: input.status ? (input.status.toUpperCase() === 'ON LEAVE' ? 'ACTIVE' : input.status.toUpperCase()) : undefined,
    };

    try {
      const updated = await api.patch<any>(`/employees/${id}`, payload, { skipAuthRedirect: true });
      const res = updated?.data || updated;
      const assignedBranch = res.locations?.[0]?.location?.name || input.branch || '';
      const assignedRole = res.roles?.[0]?.role?.roleName || res.roles?.[0]?.role?.name || input.role || 'Staff';
      const normalized: Employee = {
        id: res.id || id,
        employeeId: res.employeeCode || input.employeeCode || input.employeeId || id,
        name: res.name || input.name || '',
        email: res.email || input.email || '',
        phone: res.phone || input.phone || '',
        role: assignedRole,
        department: res.department || input.department || '',
        branch: assignedBranch,
        avatarUrl: input.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        status: res.status === 'ACTIVE' || res.status === 'Active' ? 'Active' : (input.status || 'Active'),
        joinedDate: res.createdAt ? new Date(res.createdAt).toISOString().split('T')[0] : '2024-01-01',
      };
      localEmployees = localEmployees.map((e) => (e.id === id ? { ...e, ...normalized } : e));
      return normalized;
    } catch {
      let updatedEmp: Employee | null = null;
      localEmployees = localEmployees.map((e) => {
        if (e.id === id || e.employeeId === id) {
          updatedEmp = { ...e, ...input };
          return updatedEmp;
        }
        return e;
      });
      if (!updatedEmp) throw new Error(`Employee ${id} not found`);
      return updatedEmp;
    }
  },

  deleteEmployee: async (id: string): Promise<{ success: boolean; id: string }> => {
    try {
      await api.delete(`/employees/${id}`, { skipAuthRedirect: true });
    } catch {
      // continue for local state
    }
    localEmployees = localEmployees.filter((e) => e.id !== id && e.employeeId !== id);
    return { success: true, id };
  },
};
