import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  departmentApi,
  type CreateDepartmentInput,
  type UpdateDepartmentInput,
} from '../department.api';
import { departmentKeys } from '../queryKeys';
import type { DepartmentItem } from '../../data/mockDepartments';

export const useDepartments = () => {
  return useQuery({
    queryKey: departmentKeys.lists(),
    queryFn: () => departmentApi.getDepartments(),
  });
};

export const useDepartment = (id: string) => {
  return useQuery({
    queryKey: departmentKeys.detail(id),
    queryFn: () => departmentApi.getDepartmentById(id),
    enabled: Boolean(id),
  });
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateDepartmentInput) => departmentApi.createDepartment(input),
    onSuccess: (newDept) => {
      queryClient.setQueryData<DepartmentItem[]>(departmentKeys.lists(), (old) => {
        return old ? [newDept, ...old] : [newDept];
      });
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
    },
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateDepartmentInput) => departmentApi.updateDepartment(input),
    onSuccess: (updated) => {
      queryClient.setQueryData<DepartmentItem[]>(departmentKeys.lists(), (old) => {
        return old ? old.map((d) => (d.id === updated.id ? updated : d)) : [updated];
      });
      queryClient.setQueryData(departmentKeys.detail(updated.id), updated);
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
    },
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => departmentApi.deleteDepartment(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<DepartmentItem[]>(departmentKeys.lists(), (old) => {
        return old ? old.filter((d) => d.id !== id) : [];
      });
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
    },
  });
};
