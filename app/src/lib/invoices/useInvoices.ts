import { useQuery } from '@tanstack/react-query';
import api from '@lib/api';
import QueryKeys from './queryKeys';

const useInvoices = () =>
  useQuery(QueryKeys.invoices, () => api.getInvoices.query());

export default useInvoices;
