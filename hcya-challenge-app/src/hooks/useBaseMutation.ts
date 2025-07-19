import { useMutation } from '@tanstack/react-query';
import type { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

type ServiceFunction<TData, TVariables> = (variables: TVariables) => Promise<TData>;

const DEFAULT_MUTATION_OPTIONS = {
  gcTime: 0, // Disable caching
} as const;

export const useBaseMutation = <TData = unknown, TError = Error, TVariables = void, TContext = unknown>(
  mutationFn: ServiceFunction<TData, TVariables>,
  options: Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'mutationFn'> = {}
): UseMutationResult<TData, TError, TVariables, TContext> => {
  return useMutation<TData, TError, TVariables, TContext>({
    ...DEFAULT_MUTATION_OPTIONS,
    mutationFn,
    ...options,
  });
};
