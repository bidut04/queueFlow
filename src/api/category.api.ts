import { api } from './client';
import type { Category, CreateCategoryInput, UpdateCategoryInput } from '../types/category';

export const categoryApi = {
  getCategories: async (): Promise<Category[]> => {
    const result = await api.get<Category[]>('/categories');
    return Array.isArray(result) ? result : [];
  },

  getCategoryById: async (id: string): Promise<Category> => {
    return await api.get<Category>(`/categories/${id}`);
  },

  createCategory: async (input: CreateCategoryInput): Promise<Category> => {
    return await api.post<Category>('/categories', input);
  },

  updateCategory: async ({ id, ...input }: UpdateCategoryInput): Promise<Category> => {
    return await api.patch<Category>(`/categories/${id}`, input);
  },

  deleteCategory: async (id: string): Promise<{ success: boolean; message: string }> => {
    return await api.delete<{ success: boolean; message: string }>(`/categories/${id}`);
  },
};

