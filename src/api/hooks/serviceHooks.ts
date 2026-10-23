import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  serviceApi,
  type CreateServiceInput,
  type UpdateServiceInput,
} from '../service.api';
import { serviceKeys } from '../queryKeys';
import type { Service } from '../../types/service';

export const useServices = () => {
  return useQuery({
    queryKey: serviceKeys.lists(),
    queryFn: () => serviceApi.getServices(),
  });
};

export const useService = (id: string) => {
  return useQuery({
    queryKey: serviceKeys.detail(id),
    queryFn: () => serviceApi.getServiceById(id),
    enabled: Boolean(id),
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateServiceInput) => serviceApi.createService(input),
    onSuccess: (newService) => {
      queryClient.setQueryData<Service[]>(serviceKeys.lists(), (old) => {
        return old ? [newService, ...old] : [newService];
      });
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateServiceInput) => serviceApi.updateService(input),
    onSuccess: (updated) => {
      queryClient.setQueryData<Service[]>(serviceKeys.lists(), (old) => {
        return old ? old.map((s) => (s.id === updated.id ? updated : s)) : [updated];
      });
      queryClient.setQueryData(serviceKeys.detail(updated.id), updated);
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => serviceApi.deleteService(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<Service[]>(serviceKeys.lists(), (old) => {
        return old ? old.filter((s) => s.id !== id) : [];
      });
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
    },
  });
};
