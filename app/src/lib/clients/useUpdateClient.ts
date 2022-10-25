import api from '@lib/api';
import useMutation from '@lib/useMutation';
import type {
  UpdateClientInput,
  GetClientsOutput,
  Client,
} from '@server/clients/types';
import QueryKeys from './queryKeys';

type UseUpdateClientArgs =
  | {
      onSuccess?: (client: Client) => void;
    }
  | undefined;

const useUpdateClient = ({ onSuccess }: UseUpdateClientArgs = {}) =>
  useMutation<UpdateClientInput, GetClientsOutput, Client>({
    mutationFn: api.updateClient.mutate,
    cacheKey: QueryKeys.clients,
    cacheUpdater: (clients, input) => {
      const clientIndex = clients.findIndex(({ id }) => id === input.id);
      if (clientIndex !== -1) {
        clients[clientIndex] = {
          ...clients[clientIndex],
          ...input,
        };
      }
    },
    successMessage: () => 'Client updated',
    errorMessage: () => 'Failed to update client',
    onSuccess,
  });

export default useUpdateClient;
