import api from '@lib/api';
import useMutation from '@lib/useMutation';
import type {
  DeleteCustomerInput,
  GetCustomersOutput,
} from '@server/customers/types';
import QueryKeys from './queryKeys';

const useDeleteCustomer = () =>
  useMutation<DeleteCustomerInput, GetCustomersOutput>({
    mutationFn: api.deleteCustomer.mutate,
    cacheKey: QueryKeys.customers,
    cacheUpdater: (customers, input) => {
      const customerIndex = customers.findIndex(({ id }) => id === input.id);
      if (customerIndex !== -1) {
        customers.splice(customerIndex, 1);
      }
    },
  });

export default useDeleteCustomer;
