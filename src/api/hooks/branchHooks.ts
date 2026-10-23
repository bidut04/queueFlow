import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  branchApi,
  type CreateBranchInput,
  type UpdateBranchInput,
} from '../branch.api';
import { branchKeys } from '../queryKeys';
import type { Branch } from '../../types/branch';

export const useBranches = () => {
  return useQuery({
    queryKey: branchKeys.lists(),
    queryFn: () => branchApi.getBranches(),
  });
};

export const useBranch = (id: string) => {
  return useQuery({
    queryKey: branchKeys.detail(id),
    queryFn: () => branchApi.getBranchById(id),
    enabled: Boolean(id),
  });
};

export const useCreateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateBranchInput) => branchApi.createBranch(input),
    onSuccess: (newBranch) => {
      queryClient.setQueryData<Branch[]>(branchKeys.lists(), (old) => {
        return old ? [newBranch, ...old] : [newBranch];
      });
      queryClient.invalidateQueries({ queryKey: branchKeys.lists() });
    },
  });
};

export const useUpdateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateBranchInput) => branchApi.updateBranch(input),
    onSuccess: (updated) => {
      queryClient.setQueryData<Branch[]>(branchKeys.lists(), (old) => {
        return old ? old.map((b) => (b.id === updated.id ? updated : b)) : [updated];
      });
      queryClient.setQueryData(branchKeys.detail(updated.id), updated);
      queryClient.invalidateQueries({ queryKey: branchKeys.lists() });
    },
  });
};

export const useDeleteBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => branchApi.deleteBranch(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<Branch[]>(branchKeys.lists(), (old) => {
        return old ? old.filter((b) => b.id !== id) : [];
      });
      queryClient.invalidateQueries({ queryKey: branchKeys.lists() });
    },
  });
};
