import {
  useMutation as useMutationBase,
  useQueryClient,
  type QueryKey,
} from '@tanstack/react-query';
import type { TRPCError } from '@trpc/server';
import { type Draft, produce } from 'immer';
import toast from '@components/Toast';

type UseMutationArgs<Input, Cache, Data> = {
  cacheKey: QueryKey;
  mutationFn: (input: Input) => Promise<Data>;
  cacheUpdater: (cache: Draft<Cache>, input: Input) => void;
  errorMessage?: (error: TRPCError) => string;
  onSuccess?: (data: Data) => void;
  successMessage?: () => string;
};

const useMutation = <Input, Cache, Data = unknown>({
  cacheKey,
  mutationFn,
  cacheUpdater,
  errorMessage,
  successMessage,
  onSuccess,
}: UseMutationArgs<Input, Cache, Data>) => {
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
    onSuccess: (data) => {
      if (successMessage) {
        toast({
          message: successMessage(),
          color: 'primary',
          variant: 'light',
        });
      }
      if (onSuccess) {
        onSuccess(data as Data);
      }
    },
  });
};

export default useMutation;
