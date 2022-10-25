import cuid from 'cuid';
import api from '@lib/api';
import useMutation from '@lib/useMutation';
import type {
  CreateCustomerInput,
  Customer,
  GetCustomersOutput,
} from '@server/customers/types';
import QueryKeys from './queryKeys';

type UseCreateCustomerArgs =
  | {
      onSuccess?: (customer: Customer) => void;
    }
  | undefined;

const useCreateCustomer = ({ onSuccess }: UseCreateCustomerArgs = {}) =>
  useMutation<CreateCustomerInput, GetCustomersOutput, Customer>({
    mutationFn: api.createCustomer.mutate,
    cacheKey: QueryKeys.customers,
    cacheUpdater: (customers, input) => {
      customers.push({
        id: `new-customer${cuid()}`,
        companyId: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        vatNumber: null,
        firstName: null,
        lastName: null,
        email: null,
        country: null,
        address: null,
        postCode: null,
        city: null,
        paymentTerms: 7,
        ...input,
      });
    },
    successMessage: () => 'Client created',
    errorMessage: () => 'Failed to create client',
    onSuccess,
  });

export default useCreateCustomer;
