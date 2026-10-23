import { api } from './client';
import {
  INITIAL_ASSOCIATIONS,
  type EmployeeDepartmentAssociation,
} from '../data/mockAssociations';

export interface CreateAssociationInput {
  assocCode: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  deptId: string;
  deptName: string;
  designationRole: string;
  associationType: EmployeeDepartmentAssociation['associationType'];
  branch: string;
  status?: EmployeeDepartmentAssociation['status'];
}

export interface UpdateAssociationInput extends Partial<CreateAssociationInput> {
  id: string;
}

// In-memory fallback cache for employee-department associations
let localAssociations: EmployeeDepartmentAssociation[] = [...INITIAL_ASSOCIATIONS];

export const associationApi = {
  getAssociations: async (): Promise<EmployeeDepartmentAssociation[]> => {
    try {
      const result = await api.get<EmployeeDepartmentAssociation[]>('/associations');
      if (Array.isArray(result)) {
        return result;
      }
      return localAssociations;
    } catch {
      return localAssociations;
    }
  },

  getAssociationById: async (id: string): Promise<EmployeeDepartmentAssociation> => {
    try {
      return await api.get<EmployeeDepartmentAssociation>(`/associations/${id}`);
    } catch {
      const found = localAssociations.find((a) => a.id === id);
      if (!found) throw new Error(`Association ${id} not found`);
      return found;
    }
  },

  createAssociation: async (
    input: CreateAssociationInput
  ): Promise<EmployeeDepartmentAssociation> => {
    try {
      const created = await api.post<EmployeeDepartmentAssociation>('/associations', input);
      localAssociations = [created, ...localAssociations];
      return created;
    } catch {
      const newAssoc: EmployeeDepartmentAssociation = {
        id: `assoc-${Date.now()}`,
        assocCode: input.assocCode || `EDA-${Math.floor(2000 + Math.random() * 900)}`,
        employeeId: input.employeeId,
        employeeName: input.employeeName,
        employeeAvatar:
          input.employeeAvatar ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        deptId: input.deptId,
        deptName: input.deptName,
        designationRole: input.designationRole,
        associationType: input.associationType,
        branch: input.branch,
        assignedDate: new Date().toISOString().split('T')[0],
        status: input.status ?? 'Active',
      };
      localAssociations = [newAssoc, ...localAssociations];
      return newAssoc;
    }
  },

  updateAssociation: async ({
    id,
    ...input
  }: UpdateAssociationInput): Promise<EmployeeDepartmentAssociation> => {
    try {
      const updated = await api.patch<EmployeeDepartmentAssociation>(`/associations/${id}`, input);
      localAssociations = localAssociations.map((a) => (a.id === id ? { ...a, ...updated } : a));
      return updated;
    } catch {
      let updatedAssoc: EmployeeDepartmentAssociation | null = null;
      localAssociations = localAssociations.map((a) => {
        if (a.id === id) {
          updatedAssoc = { ...a, ...input };
          return updatedAssoc;
        }
        return a;
      });
      if (!updatedAssoc) throw new Error(`Association ${id} not found`);
      return updatedAssoc;
    }
  },

  deleteAssociation: async (id: string): Promise<{ success: boolean; id: string }> => {
    try {
      await api.delete(`/associations/${id}`);
    } catch {
      // Continue for local state
    }
    localAssociations = localAssociations.filter((a) => a.id !== id);
    return { success: true, id };
  },
};
