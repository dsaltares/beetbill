import { useQuery } from '@tanstack/react-query';
import api from '@lib/api';
import QueryKeys from './queryKeys';

const useCustomer = (id: string) =>
  useQuery(QueryKeys.customer(id), () => api.getCustomer.query({ id }));

export default useCustomer;
