import { useQuery } from '@tanstack/react-query';
import api from '@lib/api';
import QueryKeys from './queryKeys';

const useInvoice = (id: string) =>
  useQuery(QueryKeys.invoice(id), () => api.getInvoice.query({ id }));

export default useInvoice;
