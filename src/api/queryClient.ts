import { QueryClient } from '@tanstack/react-query';
import { ApiClientError } from './client';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data remains fresh for 5 minutes.
      // Switching between /user/view -> /booking/view -> /user/view will NOT trigger
      // unnecessary network calls because the previous data is served instantly from cache!
      staleTime: 5 * 60 * 1000,

      // Cache retention: Keep inactive query cache in memory for 10 minutes
      gcTime: 10 * 60 * 1000,

      // Do not refetch on component remount if data is fresh
      refetchOnMount: false,

      // Do not refetch on window focus change
      refetchOnWindowFocus: false,

      // Do not refetch on reconnect unless explicitly required
      refetchOnReconnect: 'always',

      // Smart retry policy: do not retry on 4xx client errors
      retry: (failureCount, error) => {
        if (error instanceof ApiClientError) {
          if (error.status >= 400 && error.status < 500) {
            return false;
          }
        }
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
