import cuid from 'cuid';
import api from '@lib/api';
import useMutation from '@lib/useMutation';
import type {
  CreateClientInput,
  Client,
  GetClientsOutput,
} from '@server/clients/types';
import QueryKeys from './queryKeys';

type UseCreateClientArgs =
  | {
      onSuccess?: (client: Client) => void;
    }
  | undefined;

const useCreateClient = ({ onSuccess }: UseCreateClientArgs = {}) =>
  useMutation<CreateClientInput, GetClientsOutput, Client>({
    mutationFn: api.createClient.mutate,
    cacheKey: QueryKeys.clients,
    cacheUpdater: (clients, input) => {
      const now = new Date().toISOString();
      clients.push({
        id: `new-client${cuid()}`,
        companyId: '',
        createdAt: now,
        updatedAt: now,
        vatNumber: null,
        contactName: null,
        email: null,
        country: null,
        address: null,
        postCode: null,
        city: null,
        paymentTerms: 7,
        ...input,
      });
    },
    successMessage: () => 'Successfully created client!',
    errorMessage: () => 'Failed to create client',
    onSuccess,
  });

export default useCreateClient;
