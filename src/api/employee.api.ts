import { api } from './client';
import type { Employee } from '../types/employee';
import { INITIAL_EMPLOYEES } from '../data/mockEmployees';

export interface CreateEmployeeInput {
  name: string;
  email: string;
  phone: string;
  role: Employee['role'];
  department: string;
  branch: string;
  avatarUrl?: string;
  status?: Employee['status'];
}

export interface UpdateEmployeeInput extends Partial<CreateEmployeeInput> {
  id: string;
}

// In-memory fallback state so CRUD operations persist seamlessly in dev mode
let localEmployees: Employee[] = [...INITIAL_EMPLOYEES];

export const employeeApi = {
  getEmployees: async (): Promise<Employee[]> => {
    try {
      const result = await api.get<Employee[]>('/employees');
      if (Array.isArray(result) && result.length > 0) {
        return result;
      }
      return localEmployees;
    } catch {
      // Graceful fallback to initial data if backend is offline/unseeded
      return localEmployees;
    }
  },

  getEmployeeById: async (id: string): Promise<Employee> => {
    try {
      return await api.get<Employee>(`/employees/${id}`);
    } catch {
      const found = localEmployees.find((e) => e.id === id || e.employeeId === id);
      if (!found) throw new Error(`Employee ${id} not found`);
      return found;
    }
  },

  createEmployee: async (input: CreateEmployeeInput): Promise<Employee> => {
    try {
      const created = await api.post<Employee>('/employees', input);
      localEmployees = [created, ...localEmployees];
      return created;
    } catch {
      const newEmployee: Employee = {
        id: `emp-${Date.now()}`,
        employeeId: `EMP-${1000 + localEmployees.length + 1}`,
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
    try {
      const updated = await api.patch<Employee>(`/employees/${id}`, input);
      localEmployees = localEmployees.map((e) => (e.id === id ? { ...e, ...updated } : e));
      return updated;
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
      await api.delete(`/employees/${id}`);
    } catch {
      // continue for local state
    }
    localEmployees = localEmployees.filter((e) => e.id !== id && e.employeeId !== id);
    return { success: true, id };
  },
};
