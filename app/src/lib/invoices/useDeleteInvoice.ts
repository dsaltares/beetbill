import api from '@lib/api';
import useMutation from '@lib/useMutation';
import type {
  DeleteInvoiceInput,
  GetInvoicesOutput,
} from '@server/invoices/types';
import QueryKeys from './queryKeys';

const useDeleteInvoice = () =>
  useMutation<DeleteInvoiceInput, GetInvoicesOutput>({
    mutationFn: api.deleteInvoice.mutate,
    cacheKey: QueryKeys.invoices,
    cacheUpdater: (invoices, input) => {
      const invoiceIndex = invoices.findIndex(({ id }) => id === input.id);
      if (invoiceIndex !== -1) {
        invoices.splice(invoiceIndex, 1);
      }
    },
    successMessage: () => 'Successfully deleted invoice!',
    errorMessage: () => 'Failed to delete invoice',
  });

export default useDeleteInvoice;
