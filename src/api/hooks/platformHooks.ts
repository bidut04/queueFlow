import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  platformApi,
  type OrganizationListQueryParams,
  type CreatePlatformOrganizationInput,
  type UpdatePlatformOrganizationInput,
  type CreateTenantAdminInput,
  type InvitePlatformUserInput,
  type UpdatePlatformUserInput,
  type StartMigrationInput,
  type AuditLogQueryParams,
} from '../platform.api';
import { platformKeys } from '../queryKeys';
import type {
  Organization,
} from '../../modules/platform/types/platform';


/**
 * 1. Super Admin Dashboard overview metrics
 */
export const usePlatformDashboard = () => {
  return useQuery({
    queryKey: platformKeys.dashboard(),
    queryFn: () => platformApi.getDashboardOverview(),
    staleTime: 60 * 1000,
  });
};

/**
 * 2. Organizations list query
 */
export const usePlatformOrganizations = (query?: OrganizationListQueryParams) => {
  return useQuery({
    queryKey: platformKeys.organizationList(query as Record<string, unknown>),
    queryFn: () => platformApi.getOrganizations(query),
    staleTime: 2 * 60 * 1000,
  });
};

/**
 * 3. Organization 360 detail
 */
export const usePlatformOrganization = (id: string) => {
  return useQuery({
    queryKey: platformKeys.organizationDetail(id),
    queryFn: () => platformApi.getOrganization360(id),
    enabled: Boolean(id),
  });
};

/**
 * 4. Tenant administrators for an organization
 */
export const usePlatformTenantAdmins = (organizationId: string) => {
  return useQuery({
    queryKey: platformKeys.organizationAdmins(organizationId),
    queryFn: () => platformApi.getTenantAdmins(organizationId),
    enabled: Boolean(organizationId),
  });
};

/**
 * 5. Create Organization mutation
 */
export const useCreateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePlatformOrganizationInput) => platformApi.createOrganization(input),
    onSuccess: (newOrg) => {
      queryClient.setQueryData<Organization[]>(platformKeys.organizations(), (old) => {
        return old ? [newOrg, ...old] : [newOrg];
      });
      queryClient.invalidateQueries({ queryKey: platformKeys.organizations() });
      queryClient.invalidateQueries({ queryKey: platformKeys.dashboard() });
      queryClient.invalidateQueries({ queryKey: platformKeys.approvals() });
    },
  });
};

/**
 * 6. Update Organization mutation
 */
export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdatePlatformOrganizationInput }) =>
      platformApi.updateOrganization(id, input),
    onSuccess: (updatedOrg) => {
      queryClient.invalidateQueries({ queryKey: platformKeys.organizationDetail(updatedOrg.id) });
      queryClient.invalidateQueries({ queryKey: platformKeys.organizations() });
    },
  });
};

/**
 * 7. Suspend Organization mutation
 */
export const useSuspendOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      platformApi.suspendOrganization(id, reason),
    onSuccess: (org) => {
      queryClient.invalidateQueries({ queryKey: platformKeys.organizationDetail(org.id) });
      queryClient.invalidateQueries({ queryKey: platformKeys.organizations() });
      queryClient.invalidateQueries({ queryKey: platformKeys.dashboard() });
    },
  });
};

/**
 * 8. Activate Organization mutation
 */
export const useActivateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      platformApi.activateOrganization(id, reason),
    onSuccess: (org) => {
      queryClient.invalidateQueries({ queryKey: platformKeys.organizationDetail(org.id) });
      queryClient.invalidateQueries({ queryKey: platformKeys.organizations() });
      queryClient.invalidateQueries({ queryKey: platformKeys.dashboard() });
    },
  });
};

/**
 * 9. Archive Organization mutation
 */
export const useArchiveOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      platformApi.archiveOrganization(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: platformKeys.organizations() });
      queryClient.invalidateQueries({ queryKey: platformKeys.dashboard() });
    },
  });
};

/**
 * 10. Add Tenant Admin mutation
 */
export const useCreateTenantAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      input,
    }: {
      organizationId: string;
      input: CreateTenantAdminInput;
    }) => platformApi.createTenantAdmin(organizationId, input),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({
        queryKey: platformKeys.organizationAdmins(vars.organizationId),
      });
      queryClient.invalidateQueries({
        queryKey: platformKeys.organizationDetail(vars.organizationId),
      });
    },
  });
};

/**
 * 11. Platform Users (Super Admins)
 */
export const usePlatformUsers = () => {
  return useQuery({
    queryKey: platformKeys.users(),
    queryFn: () => platformApi.getPlatformUsers(),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * 12. Invite Platform User mutation
 */
export const useInvitePlatformUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: InvitePlatformUserInput) => platformApi.invitePlatformUser(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: platformKeys.users() });
      queryClient.invalidateQueries({ queryKey: platformKeys.dashboard() });
    },
  });
};

/**
 * 13. Update Platform User mutation
 */
export const useUpdatePlatformUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdatePlatformUserInput }) =>
      platformApi.updatePlatformUser(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: platformKeys.users() });
    },
  });
};

/**
 * 14. Shards query
 */
export const usePlatformShards = () => {
  return useQuery({
    queryKey: platformKeys.shards(),
    queryFn: () => platformApi.getShards(),
    staleTime: 2 * 60 * 1000,
  });
};

/**
 * 15. Update Shard mutation
 */
export const useUpdateShard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: { weight?: number; readOnly?: boolean; status?: string };
    }) => platformApi.updateShard(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: platformKeys.shards() });
    },
  });
};

/**
 * 16. Migrations query
 */
export const usePlatformMigrations = () => {
  return useQuery({
    queryKey: platformKeys.migrations(),
    queryFn: () => platformApi.getMigrations(),
    refetchInterval: 10 * 1000, // poll during active migrations
  });
};

/**
 * 17. Start Migration mutation
 */
export const useStartMigration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: StartMigrationInput) => platformApi.startMigration(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: platformKeys.migrations() });
      queryClient.invalidateQueries({ queryKey: platformKeys.organizations() });
    },
  });
};

/**
 * 18. Rollback Migration mutation
 */
export const useRollbackMigration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      platformApi.rollbackMigration(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: platformKeys.migrations() });
      queryClient.invalidateQueries({ queryKey: platformKeys.organizations() });
    },
  });
};

/**
 * 19. System Health query
 */
export const usePlatformHealth = () => {
  return useQuery({
    queryKey: platformKeys.health(),
    queryFn: () => platformApi.getSystemHealth(),
    refetchInterval: 30 * 1000,
  });
};

/**
 * 20. Subscriptions & Plans
 */
export const usePlatformSubscriptions = () => {
  return useQuery({
    queryKey: platformKeys.subscriptions(),
    queryFn: () => platformApi.getSubscriptions(),
  });
};

export const usePlatformPlans = () => {
  return useQuery({
    queryKey: platformKeys.plans(),
    queryFn: () => platformApi.getPlans(),
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * 21. Audit Logs query
 */
export const usePlatformAuditLogs = (query?: AuditLogQueryParams) => {
  return useQuery({
    queryKey: platformKeys.auditLogs(query as Record<string, unknown>),
    queryFn: () => platformApi.getAuditLogs(query),
    staleTime: 30 * 1000,
  });
};

/**
 * 22. Platform Settings
 */
export const usePlatformSettings = () => {
  return useQuery({
    queryKey: platformKeys.settings(),
    queryFn: () => platformApi.getSettings(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdatePlatformSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      category,
      settings,
    }: {
      category: string;
      settings: Record<string, unknown>;
    }) => platformApi.updateSettings(category, settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: platformKeys.settings() });
    },
  });
};

/**
 * 23. Self-registration approvals
 */
export const usePendingRegistrations = (options?: { limit?: number; cursor?: string }) => {
  return useQuery({
    queryKey: platformKeys.approvals(),
    queryFn: () => platformApi.getPendingOrganizations(options),
    refetchInterval: 20 * 1000,
  });
};

export const useApproveRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      platformApi.approveRegistration(id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: platformKeys.approvals() });
      queryClient.invalidateQueries({ queryKey: platformKeys.organizations() });
      queryClient.invalidateQueries({ queryKey: platformKeys.dashboard() });
    },
  });
};

export const useRejectRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      platformApi.rejectRegistration(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: platformKeys.approvals() });
      queryClient.invalidateQueries({ queryKey: platformKeys.organizations() });
      queryClient.invalidateQueries({ queryKey: platformKeys.dashboard() });
    },
  });
};

export const useReviewLogs = (orgId: string) => {
  return useQuery({
    queryKey: platformKeys.reviewLogs(orgId),
    queryFn: () => platformApi.getReviewLogs(orgId),
    enabled: Boolean(orgId),
  });
};
