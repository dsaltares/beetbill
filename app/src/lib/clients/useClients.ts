import { useQuery } from '@tanstack/react-query';
import api from '@lib/api';
import QueryKeys from './queryKeys';

const useClients = () =>
  useQuery(QueryKeys.clients, () => api.getClients.query());

export default useClients;
