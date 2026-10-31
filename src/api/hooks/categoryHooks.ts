import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryApi } from '../category.api';
import { categoryKeys } from '../queryKeys';
import type { Category, CreateCategoryInput, UpdateCategoryInput } from '../../types/category';

export const useCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: categoryKeys.lists(),
    queryFn: () => categoryApi.getCategories(),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};

export const useCategory = (id: string) => {
  return useQuery<Category, Error>({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryApi.getCategoryById(id),
    enabled: Boolean(id),
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCategoryInput) => categoryApi.createCategory(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateCategoryInput) => categoryApi.updateCategory(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoryApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
};

