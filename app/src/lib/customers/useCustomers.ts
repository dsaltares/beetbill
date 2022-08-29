import { useQuery } from '@tanstack/react-query';
import api from '@lib/api';
import QueryKeys from './queryKeys';

const useCustomers = () =>
  useQuery(QueryKeys.customers, () => api.getCustomers.query());

export default useCustomers;
