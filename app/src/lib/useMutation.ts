import {
  useMutation as useMutationBase,
  useQueryClient,
  type QueryKey,
} from '@tanstack/react-query';
import type { TRPCError } from '@trpc/server';
import { type Draft, produce } from 'immer';
import toast from '@components/Toast';

type UseMutationArgs<Input, Cache> = {
  cacheKey: QueryKey;
  mutationFn: (input: Input) => Promise<unknown>;
  cacheUpdater: (cache: Draft<Cache>, input: Input) => void;
  errorMessage?: (error: TRPCError) => string;
};

const useMutation = <Input, Cache>({
  cacheKey,
  mutationFn,
  cacheUpdater,
  errorMessage,
}: UseMutationArgs<Input, Cache>) => {
  const queryClient = useQueryClient();
  return useMutationBase(mutationFn, {
    onMutate: async (input) => {
      const previousData = queryClient.getQueryData<Cache>(cacheKey);

      if (previousData && cacheUpdater) {
        await queryClient.cancelQueries(cacheKey);

        const result = produce(previousData, (draft) => {
          cacheUpdater(draft, input);
        });

        queryClient.setQueryData(cacheKey, result);

        return {
          previousData,
        };
      }

      return {};
    },
    onError: async (_error: TRPCError, _args, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(cacheKey, context.previousData);
      }
      const message = errorMessage ? errorMessage(_error) : _error.message;
      toast({
        color: 'danger',
        variant: 'light',
        message,
      });
    },
    onSettled: () => queryClient.invalidateQueries(cacheKey),
  });
};

export default useMutation;
