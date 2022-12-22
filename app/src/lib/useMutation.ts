import {
  useMutation as useMutationBase,
  useQueryClient,
  type QueryKey,
} from '@tanstack/react-query';
import { type Draft, produce } from 'immer';
import type { TRPCClientError as TRPCClientErrorBase } from '@trpc/client';
import toast from '@components/Toast';
import type { AppRouter } from '@server/router';

type TRPCClientError = TRPCClientErrorBase<AppRouter>;

type UseMutationArgs<Input, Cache, Data> = {
  cacheKey: QueryKey;
  mutationFn: (input: Input) => Promise<Data>;
  cacheUpdater: (cache: Draft<Cache>, input: Input) => void;
  errorMessage?: (error: TRPCClientError) => string;
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
    onError: async (error: TRPCClientError, _args, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(cacheKey, context.previousData);
      }
      if (
        error.data?.code &&
        UserErrors.has(error.data.code) &&
        error.message
      ) {
        toast({
          color: 'danger',
          message: error.message,
        });
      } else if (errorMessage) {
        toast({
          color: 'danger',
          message: errorMessage(error),
        });
      }
    },
    onSettled: () => queryClient.invalidateQueries(cacheKey),
    onSuccess: (data) => {
      if (successMessage) {
        toast({
          message: successMessage(),
          color: 'secondary',
        });
      }
      if (onSuccess) {
        onSuccess(data as Data);
      }
    },
  });
};

const UserErrors = new Set<string>([
  'UNAUTHORIZED',
  'FORBIDDEN',
  'NOT_FOUND',
  'PRECONDITION_FAILED',
]);

export default useMutation;
