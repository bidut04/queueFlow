import { api } from './client';
import type { Service } from '../types/service';

export interface CreateServiceInput {
  name: string;
  category: string;
  durationMinutes: number;
  price: string;
  status?: Service['status'];
}

export interface UpdateServiceInput extends Partial<CreateServiceInput> {
  id: string;
}

// In-memory fallback cache for services
let localServices: Service[] = [];

export const serviceApi = {
  getServices: async (): Promise<Service[]> => {
    try {
      const result = await api.get<Service[]>('/services');
      if (Array.isArray(result)) {
        return result;
      }
      return localServices;
    } catch {
      return localServices;
    }
  },

  getServiceById: async (id: string): Promise<Service> => {
    try {
      return await api.get<Service>(`/services/${id}`);
    } catch {
      const found = localServices.find((s) => s.id === id);
      if (!found) throw new Error(`Service ${id} not found`);
      return found;
    }
  },

  createService: async (input: CreateServiceInput): Promise<Service> => {
    try {
      const created = await api.post<Service>('/services', input);
      localServices = [created, ...localServices];
      return created;
    } catch {
      const newService: Service = {
        id: `svc-${Date.now()}`,
        name: input.name,
        category: input.category,
        durationMinutes: input.durationMinutes,
        price: input.price,
        totalBookingsThisMonth: 0,
        growthRate: 0,
        status: input.status ?? 'Active',
      };
      localServices = [newService, ...localServices];
      return newService;
    }
  },

  updateService: async ({ id, ...input }: UpdateServiceInput): Promise<Service> => {
    try {
      const updated = await api.patch<Service>(`/services/${id}`, input);
      localServices = localServices.map((s) => (s.id === id ? { ...s, ...updated } : s));
      return updated;
    } catch {
      let updatedService: Service | null = null;
      localServices = localServices.map((s) => {
        if (s.id === id) {
          updatedService = { ...s, ...input };
          return updatedService;
        }
        return s;
      });
      if (!updatedService) throw new Error(`Service ${id} not found`);
      return updatedService;
    }
  },

  deleteService: async (id: string): Promise<{ success: boolean; id: string }> => {
    try {
      await api.delete(`/services/${id}`);
    } catch {
      // Continue for local state
    }
    localServices = localServices.filter((s) => s.id !== id);
    return { success: true, id };
  },
};
