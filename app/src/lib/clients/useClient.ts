import { useQuery } from '@tanstack/react-query';
import api from '@lib/api';
import QueryKeys from './queryKeys';

const useClient = (id: string) =>
  useQuery(QueryKeys.client(id), () => api.getClient.query({ id }));

export default useClient;
