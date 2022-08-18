import cuid from 'cuid';
import api from '@lib/api';
import useMutation from '@lib/useMutation';
import type {
  CreateCustomerInput,
  GetCustomersOutput,
} from '@server/customers/types';
import QueryKeys from './queryKeys';

const useCreateCustomer = () =>
  useMutation<CreateCustomerInput, GetCustomersOutput>({
    mutationFn: api.createCustomer.mutate,
    cacheKey: QueryKeys.customers,
    cacheUpdater: (customers, input) => {
      customers.push({
        id: `new-customer${cuid()}`,
        companyId: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...input,
      });
    },
  });

export default useCreateCustomer;
