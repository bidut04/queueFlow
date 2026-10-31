import { api } from './client';
import type { Service } from '../types/service';

export interface CreateServiceInput {
  name: string;
  category: string;
  durationMinutes: number;
  price: string;
  status?: Service['status'];
  description?: string;
  code?: string;
}

export interface UpdateServiceInput extends Partial<CreateServiceInput> {
  id: string;
}

export const serviceApi = {
  getServices: async (): Promise<Service[]> => {
    const result = await api.get<Service[]>('/services');
    return Array.isArray(result) ? result : [];
  },

  getServiceById: async (id: string): Promise<Service> => {
    return await api.get<Service>(`/services/${id}`);
  },

  createService: async (input: CreateServiceInput): Promise<Service> => {
    return await api.post<Service>('/services', input);
  },

  updateService: async ({ id, ...input }: UpdateServiceInput): Promise<Service> => {
    return await api.patch<Service>(`/services/${id}`, input);
  },

  deleteService: async (id: string): Promise<{ success: boolean; id: string }> => {
    return await api.delete<{ success: boolean; id: string }>(`/services/${id}`);
  },
};
