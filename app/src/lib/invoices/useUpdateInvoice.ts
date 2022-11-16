import omit from 'lodash.omit';
import api from '@lib/api';
import useMutation from '@lib/useMutation';
import type {
  UpdateInvoiceInput,
  GetInvoicesOutput,
  Invoice,
} from '@server/invoices/types';
import QueryKeys from './queryKeys';

type UseUpdateInvoiceArgs =
  | {
      onSuccess?: (invoice: Invoice) => void;
    }
  | undefined;

const useUpdateInvoice = ({ onSuccess }: UseUpdateInvoiceArgs = {}) =>
  useMutation<UpdateInvoiceInput, GetInvoicesOutput, Invoice>({
    mutationFn: api.updateInvoice.mutate,
    cacheKey: QueryKeys.invoices,
    cacheUpdater: (invoices, input) => {
      const invoiceIndex = invoices.findIndex(({ id }) => id === input.id);
      if (invoiceIndex !== -1) {
        invoices[invoiceIndex] = {
          ...invoices[invoiceIndex],
          ...omit(input, 'items'),
        };
      }
    },
    successMessage: () => 'Successfully updated invoice!',
    errorMessage: () => 'Failed to update invoice',
    onSuccess,
  });

export default useUpdateInvoice;
