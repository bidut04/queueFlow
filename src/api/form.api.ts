import { api } from './client';
import type { FormConfig, LoginConfig } from '../types/formBuilder';
import { formStore } from '../utils/formEngine';

export const formApi = {
  getFormConfigs: async (): Promise<FormConfig[]> => {
    try {
      const serverForms = await api.get<FormConfig[]>('/forms');
      if (Array.isArray(serverForms)) {
        return serverForms;
      }
      return formStore.getConfigs();
    } catch {
      return formStore.getConfigs();
    }
  },

  getPublishedForm: async (
    branchId: string,
    formType: string,
    serviceId?: string
  ): Promise<FormConfig | null> => {
    try {
      const query = new URLSearchParams({ branchId, formType });
      if (serviceId) query.append('serviceId', serviceId);
      const res = await api.get<FormConfig>(`/forms/published?${query.toString()}`);
      if (res && res.id) return res;
      return formStore.getPublishedForm(branchId, formType, serviceId);
    } catch {
      return formStore.getPublishedForm(branchId, formType, serviceId);
    }
  },

  getFormById: async (id: string): Promise<FormConfig | null> => {
    try {
      const res = await api.get<FormConfig>(`/forms/${id}`);
      if (res && res.id) return res;
      const all = formStore.getConfigs();
      return all.find((f) => f.id === id) || null;
    } catch {
      const all = formStore.getConfigs();
      return all.find((f) => f.id === id) || null;
    }
  },

  saveFormConfig: async (config: FormConfig): Promise<FormConfig> => {
    try {
      await api.post('/forms', config);
    } catch {
      // In-browser engine persistence
    }
    return formStore.saveFormConfig(config);
  },

  publishFormConfig: async (id: string): Promise<FormConfig | null> => {
    try {
      await api.patch(`/forms/${id}/publish`, {});
    } catch {
      // In-browser engine persistence
    }
    return formStore.publishFormConfig(id);
  },

  createNewVersion: async (baseConfig: FormConfig): Promise<FormConfig> => {
    return formStore.createNewVersion(baseConfig);
  },

  getLoginConfigs: async (): Promise<LoginConfig[]> => {
    return formStore.getLoginConfigs();
  },

  saveLoginConfig: async (config: LoginConfig): Promise<LoginConfig> => {
    formStore.saveLoginConfig(config);
    return config;
  },
};
