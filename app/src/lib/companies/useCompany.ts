import { useQuery } from '@tanstack/react-query';
import api from '@lib/api';
import QueryKeys from './queryKeys';

const useCompanys = () =>
  useQuery(QueryKeys.company, () => api.getCompany.query());

export default useCompanys;
