import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi, type CreateUserInput, type UpdateUserInput } from '../user.api';
import { userKeys } from '../queryKeys';
import type { UserItem } from '../../types/user';

/**
 * Hook to fetch all users.
 * Cached for 5 minutes (staleTime); navigating between pages will not trigger redundant refetches.
 */
export const useUsers = () => {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: () => userApi.getUsers(),
  });
};

/**
 * Hook to fetch a user by id.
 */
export const useUser = (id: string) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userApi.getUserById(id),
    enabled: Boolean(id),
  });
};

/**
 * Hook to create a new user.
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateUserInput) => userApi.createUser(input),
    onSuccess: (newUser) => {
      queryClient.setQueryData<UserItem[]>(userKeys.lists(), (old) => {
        return old ? [newUser, ...old] : [newUser];
      });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

/**
 * Hook to update an existing user.
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateUserInput) => userApi.updateUser(input),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData<UserItem[]>(userKeys.lists(), (old) => {
        return old ? old.map((u) => (u.id === updatedUser.id ? updatedUser : u)) : [updatedUser];
      });
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

/**
 * Hook to delete a user.
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userApi.deleteUser(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<UserItem[]>(userKeys.lists(), (old) => {
        return old ? old.filter((u) => u.id !== id) : [];
      });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};
