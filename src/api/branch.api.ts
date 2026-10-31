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

const mapLocationToBranch = (b: any): Branch => ({
  id: b.id,
  name: b.name || '',
  location: typeof b.address === 'object' && b.address
    ? `${b.address.city || ''}, ${b.address.state || ''}`.replace(/^,\s*|,\s*$/g, '').trim() || b.name
    : (b.location || b.name || ''),
  manager: b.manager || 'Branch Manager',
  contactNumber: b.phone || b.contactNumber || '',
  activeCounters: b.activeCounters ?? (b.counters?.length || 0),
  rating: b.rating ?? 5.0,
  avgWaitTime: b.avgWaitTime ?? '0m',
  status: (b.status === 'ACTIVE' || b.status === 'Active' ? 'Active' : (b.status || 'Active')) as Branch['status'],
  todayTotalBookings: b.todayTotalBookings ?? (b.queueEntries?.length || 0),
});

export const branchApi = {
  getBranches: async (): Promise<Branch[]> => {
    const result = await api.get<any>('/branches', { skipAuthRedirect: true });
    const list = Array.isArray(result) ? result : result?.data;
    if (Array.isArray(list)) {
      return list.map(mapLocationToBranch);
    }
    return [];
  },

  getBranchById: async (id: string): Promise<Branch> => {
    const res = await api.get<any>(`/branches/${id}`, { skipAuthRedirect: true });
    const b = res?.data || res;
    return mapLocationToBranch(b);
  },

  createBranch: async (input: CreateBranchInput): Promise<Branch> => {
    const res = await api.post<any>('/branches', {
      name: input.name,
      phone: input.contactNumber,
      address: { city: input.location },
      manager: input.manager,
    }, { skipAuthRedirect: true });
    const created = res?.data || res;
    return mapLocationToBranch(created);
  },

  updateBranch: async ({ id, ...input }: UpdateBranchInput): Promise<Branch> => {
    const res = await api.patch<any>(`/branches/${id}`, {
      name: input.name,
      phone: input.contactNumber,
      ...(input.location ? { address: { city: input.location } } : {}),
      manager: input.manager,
    }, { skipAuthRedirect: true });
    const updated = res?.data || res;
    return mapLocationToBranch(updated);
  },

  deleteBranch: async (id: string): Promise<{ success: boolean; id: string }> => {
    await api.delete(`/branches/${id}`, { skipAuthRedirect: true });
    return { success: true, id };
  },
};
