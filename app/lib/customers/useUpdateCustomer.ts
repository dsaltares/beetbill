import api from '@lib/api';
import useMutation from '@lib/useMutation';
import type {
  UpdateCustomerInput,
  GetCustomersOutput,
} from '@server/customers/types';
import QueryKeys from './queryKeys';

const useUpdateCustomer = () =>
  useMutation<UpdateCustomerInput, GetCustomersOutput>({
    mutationFn: api.updateCustomer.mutate,
    cacheKey: QueryKeys.customers,
    cacheUpdater: (customers, input) => {
      const customerIndex = customers.findIndex(({ id }) => id === input.id);
      if (customerIndex !== -1) {
        customers[customerIndex] = {
          ...customers[customerIndex],
          ...input,
        };
      }
    },
  });

export default useUpdateCustomer;
