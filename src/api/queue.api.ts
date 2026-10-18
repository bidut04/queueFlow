import { api } from './client';

export interface QueueEntryItem {
  id: string;
  tokenNumber: number;
  tokenLabel: string;
  status: 'WAITING' | 'CALLED' | 'IN_SERVICE' | 'COMPLETED' | 'NO_SHOW' | 'CANCELLED';
  counterId?: string;
  branchId: string;
  serviceId?: string;
  customerName?: string;
  createdAt: string;
}

export const queueApi = {
  getActiveQueue: async (branchId = 'branch_central'): Promise<QueueEntryItem[]> => {
    try {
      return await api.get<QueueEntryItem[]>(`/queue/branch/${branchId}/active`);
    } catch {
      return [
        {
          id: 'qe-1',
          tokenNumber: 101,
          tokenLabel: 'A-101',
          status: 'CALLED',
          counterId: 'Counter 1',
          branchId,
          customerName: 'Sarah Jenkins',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'qe-2',
          tokenNumber: 102,
          tokenLabel: 'A-102',
          status: 'WAITING',
          branchId,
          customerName: 'Michael Chang',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'qe-3',
          tokenNumber: 103,
          tokenLabel: 'B-103',
          status: 'WAITING',
          branchId,
          customerName: 'Emma Watson',
          createdAt: new Date().toISOString(),
        },
      ];
    }
  },

  callEntry: async (id: string, counterId: string): Promise<unknown> => {
    return api.post(`/queue/entries/${id}/call`, { counterId });
  },

  startService: async (id: string): Promise<unknown> => {
    return api.post(`/queue/entries/${id}/start`);
  },

  completeService: async (id: string): Promise<unknown> => {
    return api.post(`/queue/entries/${id}/complete`);
  },

  markNoShow: async (id: string): Promise<unknown> => {
    return api.post(`/queue/entries/${id}/no-show`);
  },

  cancelEntry: async (id: string, reason?: string): Promise<unknown> => {
    return api.post(`/queue/entries/${id}/cancel`, { reason });
  },

  requeueEntry: async (id: string, options?: { bypassRules?: boolean; reason?: string }): Promise<unknown> => {
    return api.post(`/queue/entries/${id}/requeue`, options);
  },
};
