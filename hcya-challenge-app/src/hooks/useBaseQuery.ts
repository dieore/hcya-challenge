import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

const DEFAULT_QUERY_OPTIONS = {
  gcTime: 0, // Disable caching
  staleTime: 0, // Always consider data as stale
  refetchOnWindowFocus: false, // Don't refetch on window focus
  refetchOnMount: true, // Refetch when component mounts
  refetchOnReconnect: false // Don't refetch on reconnect
} as const;

export const useBaseQuery = <TData = unknown, TError = Error, TParams = void | undefined>(
  queryKey: unknown[], 
  queryFn: (params: TParams) => Promise<TData>,
  params?: TParams,
  options: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'> = {}
): UseQueryResult<TData, TError> => {
  return useQuery<TData, TError>({
    ...DEFAULT_QUERY_OPTIONS,
    queryKey: [...queryKey, params],
    queryFn: () => {
      if (params === undefined) {
        return queryFn(undefined as TParams);
      }
      return queryFn(params);
    },
    ...options,
  });
};
