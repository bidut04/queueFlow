import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roleApi, type CreateRoleInput, type UpdateRoleInput } from '../role.api';
import { roleKeys } from '../queryKeys';
import type { RoleItem } from '../../data/mockRoles';

export const useRoles = () => {
  return useQuery({
    queryKey: roleKeys.lists(),
    queryFn: () => roleApi.getRoles(),
  });
};

export const useRole = (id: string) => {
  return useQuery({
    queryKey: roleKeys.detail(id),
    queryFn: () => roleApi.getRoleById(id),
    enabled: Boolean(id),
  });
};

export const useRolePermissions = () => {
  return useQuery({
    queryKey: roleKeys.permissions(),
    queryFn: () => roleApi.getAvailablePermissions(),
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateRoleInput) => roleApi.createRole(input),
    onSuccess: (newRole) => {
      queryClient.setQueryData<RoleItem[]>(roleKeys.lists(), (old) => {
        return old ? [newRole, ...old] : [newRole];
      });
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateRoleInput) => roleApi.updateRole(input),
    onSuccess: (updated) => {
      queryClient.setQueryData<RoleItem[]>(roleKeys.lists(), (old) => {
        return old ? old.map((r) => (r.id === updated.id ? updated : r)) : [updated];
      });
      queryClient.setQueryData(roleKeys.detail(updated.id), updated);
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => roleApi.deleteRole(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<RoleItem[]>(roleKeys.lists(), (old) => {
        return old ? old.filter((r) => r.id !== id) : [];
      });
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
    },
  });
};
