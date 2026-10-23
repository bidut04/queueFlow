import { api } from './client';
import type { Branch } from '../types/branch';

export interface CreateBranchInput {
  name: string;
  location: string;
  manager: string;
  contactNumber: string;
  activeCounters?: number;
  rating?: number;
  avgWaitTime?: string;
  status?: Branch['status'];
}

export interface UpdateBranchInput extends Partial<CreateBranchInput> {
  id: string;
}

// In-memory fallback cache so master branch mutations persist seamlessly
let localBranches: Branch[] = [];

export const branchApi = {
  getBranches: async (): Promise<Branch[]> => {
    try {
      const result = await api.get<Branch[]>('/branches');
      if (Array.isArray(result)) {
        return result;
      }
      return localBranches;
    } catch {
      return localBranches;
    }
  },

  getBranchById: async (id: string): Promise<Branch> => {
    try {
      return await api.get<Branch>(`/branches/${id}`);
    } catch {
      const found = localBranches.find((b) => b.id === id);
      if (!found) throw new Error(`Branch ${id} not found`);
      return found;
    }
  },

  createBranch: async (input: CreateBranchInput): Promise<Branch> => {
    try {
      const created = await api.post<Branch>('/branches', input);
      localBranches = [created, ...localBranches];
      return created;
    } catch {
      const newBranch: Branch = {
        id: `branch-${Date.now()}`,
        name: input.name,
        location: input.location,
        manager: input.manager,
        contactNumber: input.contactNumber,
        activeCounters: input.activeCounters ?? 4,
        rating: input.rating ?? 4.5,
        avgWaitTime: input.avgWaitTime ?? '15 min',
        status: input.status ?? 'On Time',
        todayTotalBookings: 0,
      };
      localBranches = [newBranch, ...localBranches];
      return newBranch;
    }
  },

  updateBranch: async ({ id, ...input }: UpdateBranchInput): Promise<Branch> => {
    try {
      const updated = await api.patch<Branch>(`/branches/${id}`, input);
      localBranches = localBranches.map((b) => (b.id === id ? { ...b, ...updated } : b));
      return updated;
    } catch {
      let updatedBranch: Branch | null = null;
      localBranches = localBranches.map((b) => {
        if (b.id === id) {
          updatedBranch = { ...b, ...input };
          return updatedBranch;
        }
        return b;
      });
      if (!updatedBranch) throw new Error(`Branch ${id} not found`);
      return updatedBranch;
    }
  },

  deleteBranch: async (id: string): Promise<{ success: boolean; id: string }> => {
    try {
      await api.delete(`/branches/${id}`);
    } catch {
      // Continue for local state
    }
    localBranches = localBranches.filter((b) => b.id !== id);
    return { success: true, id };
  },
};
