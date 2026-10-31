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

export const departmentApi = {
  getDepartments: async (): Promise<DepartmentItem[]> => {
    const result = await api.get<any>('/departments', { skipAuthRedirect: true });
    const list = Array.isArray(result) ? result : result?.data;
    if (Array.isArray(list)) {
      return list;
    }
    return [];
  },

  getDepartmentById: async (id: string): Promise<DepartmentItem> => {
    const res = await api.get<any>(`/departments/${id}`, { skipAuthRedirect: true });
    return res?.data || res;
  },

  createDepartment: async (input: CreateDepartmentInput): Promise<DepartmentItem> => {
    const res = await api.post<any>('/departments', input, { skipAuthRedirect: true });
    return res?.data || res;
  },

  updateDepartment: async ({ id, ...input }: UpdateDepartmentInput): Promise<DepartmentItem> => {
    const res = await api.patch<any>(`/departments/${id}`, input, { skipAuthRedirect: true });
    return res?.data || res;
  },

  deleteDepartment: async (id: string): Promise<{ success: boolean; id: string }> => {
    await api.delete(`/departments/${id}`, { skipAuthRedirect: true });
    return { success: true, id };
  },
};
