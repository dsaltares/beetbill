import cuid from 'cuid';
import api from '@lib/api';
import useMutation from '@lib/useMutation';
import type {
  Invoice,
  CreateInvoiceInput,
  GetInvoicesOutput,
} from '@server/invoices/types';
import type { Company } from '@server/company/types';
import type { Client } from '@server/clients/types';
import QueryKeys from './queryKeys';

type UseCreateInvoicesArgs =
  | {
      onSuccess?: (invoice: Invoice) => void;
    }
  | undefined;

type UseCreateInvoicesInput = CreateInvoiceInput & {
  company: Company;
  client: Client;
};

const useCreateInvoice = ({ onSuccess }: UseCreateInvoicesArgs = {}) =>
  useMutation<UseCreateInvoicesInput, GetInvoicesOutput, Invoice>({
    mutationFn: ({ company: _company, client: _client, ...input }) =>
      api.createInvoice.mutate(input),
    cacheKey: QueryKeys.invoices,
    cacheUpdater: (invoices, input) => {
      invoices.push({
        id: `new-invoice${cuid()}`,
        status: 'DRAFT',
        prefix: '',
        number: 0,
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [],
        ...input,
      });
    },
    successMessage: () => 'Invoice created',
    errorMessage: () => 'Failed to create invoice',
    onSuccess,
  });

export default useCreateInvoice;
