import { api } from './client';
import type { DepartmentItem } from '../data/mockDepartments';

export interface CreateDepartmentInput {
  deptCode: string;
  deptName: string;
  headOfDept: string;
  branch: string;
  totalStaff?: number;
  activeCounters?: number;
  status?: DepartmentItem['status'];
}

export interface UpdateDepartmentInput extends Partial<CreateDepartmentInput> {
  id: string;
}

// In-memory fallback cache for departments
let localDepartments: DepartmentItem[] = [];

export const departmentApi = {
  getDepartments: async (): Promise<DepartmentItem[]> => {
    try {
      const result = await api.get<DepartmentItem[]>('/departments');
      if (Array.isArray(result)) {
        return result;
      }
      return localDepartments;
    } catch {
      return localDepartments;
    }
  },

  getDepartmentById: async (id: string): Promise<DepartmentItem> => {
    try {
      return await api.get<DepartmentItem>(`/departments/${id}`);
    } catch {
      const found = localDepartments.find((d) => d.id === id);
      if (!found) throw new Error(`Department ${id} not found`);
      return found;
    }
  },

  createDepartment: async (input: CreateDepartmentInput): Promise<DepartmentItem> => {
    try {
      const created = await api.post<DepartmentItem>('/departments', input);
      localDepartments = [created, ...localDepartments];
      return created;
    } catch {
      const newDept: DepartmentItem = {
        id: `dept-${Date.now()}`,
        deptCode: input.deptCode || `DEP-${Math.floor(100 + Math.random() * 900)}`,
        deptName: input.deptName,
        headOfDept: input.headOfDept,
        branch: input.branch,
        totalStaff: input.totalStaff ?? 5,
        activeCounters: input.activeCounters ?? 2,
        status: input.status ?? 'Active',
        createdDate: new Date().toISOString().split('T')[0],
      };
      localDepartments = [newDept, ...localDepartments];
      return newDept;
    }
  },

  updateDepartment: async ({ id, ...input }: UpdateDepartmentInput): Promise<DepartmentItem> => {
    try {
      const updated = await api.patch<DepartmentItem>(`/departments/${id}`, input);
      localDepartments = localDepartments.map((d) => (d.id === id ? { ...d, ...updated } : d));
      return updated;
    } catch {
      let updatedDept: DepartmentItem | null = null;
      localDepartments = localDepartments.map((d) => {
        if (d.id === id) {
          updatedDept = { ...d, ...input };
          return updatedDept;
        }
        return d;
      });
      if (!updatedDept) throw new Error(`Department ${id} not found`);
      return updatedDept;
    }
  },

  deleteDepartment: async (id: string): Promise<{ success: boolean; id: string }> => {
    try {
      await api.delete(`/departments/${id}`);
    } catch {
      // Continue for local state
    }
    localDepartments = localDepartments.filter((d) => d.id !== id);
    return { success: true, id };
  },
};
