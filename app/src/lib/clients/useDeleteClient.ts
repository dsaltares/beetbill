import api from '@lib/api';
import useMutation from '@lib/useMutation';
import type {
  DeleteClientInput,
  GetClientsOutput,
} from '@server/clients/types';
import QueryKeys from './queryKeys';

const useDeleteClient = () =>
  useMutation<DeleteClientInput, GetClientsOutput>({
    mutationFn: api.deleteClient.mutate,
    cacheKey: QueryKeys.clients,
    cacheUpdater: (clients, input) => {
      const clientIndex = clients.findIndex(({ id }) => id === input.id);
      if (clientIndex !== -1) {
        clients.splice(clientIndex, 1);
      }
    },
    successMessage: () => 'Successfully deleted client!',
    errorMessage: () => 'Failed to delete client',
  });

export default useDeleteClient;
