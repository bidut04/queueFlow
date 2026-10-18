import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queueApi } from '../queue.api';
import { queueKeys, bookingKeys } from '../queryKeys';

/**
 * Hook to fetch active queue entries for a branch.
 */
export const useActiveQueue = (branchId = 'branch_central') => {
  return useQuery({
    queryKey: queueKeys.active(branchId),
    queryFn: () => queueApi.getActiveQueue(branchId),
  });
};

/**
 * Hook to call a queue token.
 */
export const useCallEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, counterId }: { id: string; counterId: string }) =>
      queueApi.callEntry(id, counterId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queueKeys.all });
    },
  });
};

/**
 * Hook to start service on a queue token.
 */
export const useStartService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => queueApi.startService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queueKeys.all });
    },
  });
};

/**
 * Hook to complete service on a queue token (also completes linked booking).
 */
export const useCompleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => queueApi.completeService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queueKeys.all });
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
    },
  });
};

/**
 * Hook to mark an entry as no-show.
 */
export const useMarkNoShow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => queueApi.markNoShow(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queueKeys.all });
    },
  });
};

/**
 * Hook to cancel a queue entry.
 */
export const useCancelEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      queueApi.cancelEntry(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queueKeys.all });
    },
  });
};

/**
 * Hook to requeue an entry.
 */
export const useRequeueEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      options,
    }: {
      id: string;
      options?: { bypassRules?: boolean; reason?: string };
    }) => queueApi.requeueEntry(id, options),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queueKeys.all });
    },
  });
};
