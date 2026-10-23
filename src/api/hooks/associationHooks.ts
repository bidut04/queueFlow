import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  associationApi,
  type CreateAssociationInput,
  type UpdateAssociationInput,
} from '../association.api';
import { associationKeys } from '../queryKeys';
import type { EmployeeDepartmentAssociation } from '../../data/mockAssociations';

export const useAssociations = () => {
  return useQuery({
    queryKey: associationKeys.lists(),
    queryFn: () => associationApi.getAssociations(),
  });
};

export const useAssociation = (id: string) => {
  return useQuery({
    queryKey: associationKeys.detail(id),
    queryFn: () => associationApi.getAssociationById(id),
    enabled: Boolean(id),
  });
};

export const useCreateAssociation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAssociationInput) => associationApi.createAssociation(input),
    onSuccess: (newAssoc) => {
      queryClient.setQueryData<EmployeeDepartmentAssociation[]>(associationKeys.lists(), (old) => {
        return old ? [newAssoc, ...old] : [newAssoc];
      });
      queryClient.invalidateQueries({ queryKey: associationKeys.lists() });
    },
  });
};

export const useUpdateAssociation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateAssociationInput) => associationApi.updateAssociation(input),
    onSuccess: (updated) => {
      queryClient.setQueryData<EmployeeDepartmentAssociation[]>(associationKeys.lists(), (old) => {
        return old ? old.map((a) => (a.id === updated.id ? updated : a)) : [updated];
      });
      queryClient.setQueryData(associationKeys.detail(updated.id), updated);
      queryClient.invalidateQueries({ queryKey: associationKeys.lists() });
    },
  });
};

export const useDeleteAssociation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => associationApi.deleteAssociation(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<EmployeeDepartmentAssociation[]>(associationKeys.lists(), (old) => {
        return old ? old.filter((a) => a.id !== id) : [];
      });
      queryClient.invalidateQueries({ queryKey: associationKeys.lists() });
    },
  });
};
