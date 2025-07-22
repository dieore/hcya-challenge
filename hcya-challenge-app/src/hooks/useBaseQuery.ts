import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

const DEFAULT_QUERY_OPTIONS = {
  gcTime: 10 * 60 * 1000, // 10 minutes
  staleTime: 0,
  refetchOnWindowFocus: true,
  refetchOnMount: true,
  refetchOnReconnect: false
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
