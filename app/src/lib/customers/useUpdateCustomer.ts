import api from '@lib/api';
import useMutation from '@lib/useMutation';
import type {
  UpdateCustomerInput,
  GetCustomersOutput,
  Customer,
} from '@server/customers/types';
import QueryKeys from './queryKeys';

type UseUpdateCustomerArgs =
  | {
      onSuccess?: (customer: Customer) => void;
    }
  | undefined;

const useUpdateCustomer = ({ onSuccess }: UseUpdateCustomerArgs = {}) =>
  useMutation<UpdateCustomerInput, GetCustomersOutput, Customer>({
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
    successMessage: () => 'Client updated',
    errorMessage: () => 'Failed to update client',
    onSuccess,
  });

export default useUpdateCustomer;
