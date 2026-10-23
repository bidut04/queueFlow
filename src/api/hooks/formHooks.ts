import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formApi } from '../form.api';
import { formKeys } from '../queryKeys';
import type { FormConfig, LoginConfig } from '../../types/formBuilder';

export const useFormConfigs = () => {
  return useQuery({
    queryKey: formKeys.lists(),
    queryFn: () => formApi.getFormConfigs(),
  });
};

export const usePublishedForm = (branchId: string, formType: string, serviceId?: string) => {
  return useQuery({
    queryKey: formKeys.published(branchId, formType, serviceId),
    queryFn: () => formApi.getPublishedForm(branchId, formType, serviceId),
    enabled: Boolean(branchId && formType),
  });
};

export const useFormDetail = (id: string) => {
  return useQuery({
    queryKey: formKeys.detail(id),
    queryFn: () => formApi.getFormById(id),
    enabled: Boolean(id),
  });
};

export const useSaveFormConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (config: FormConfig) => formApi.saveFormConfig(config),
    onSuccess: (saved) => {
      queryClient.setQueryData<FormConfig[]>(formKeys.lists(), (old) => {
        if (!old) return [saved];
        const idx = old.findIndex((f) => f.id === saved.id);
        if (idx >= 0) {
          const next = [...old];
          next[idx] = saved;
          return next;
        }
        return [saved, ...old];
      });
      queryClient.invalidateQueries({ queryKey: formKeys.lists() });
    },
  });
};

export const usePublishFormConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => formApi.publishFormConfig(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: formKeys.all });
    },
  });
};

export const useCreateFormVersion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (baseConfig: FormConfig) => formApi.createNewVersion(baseConfig),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: formKeys.lists() });
    },
  });
};

export const useLoginConfigs = () => {
  return useQuery({
    queryKey: formKeys.loginConfigs(),
    queryFn: () => formApi.getLoginConfigs(),
  });
};

export const useSaveLoginConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (config: LoginConfig) => formApi.saveLoginConfig(config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: formKeys.loginConfigs() });
    },
  });
};
