import { useQuery } from '@tanstack/react-query';
import api from '@lib/api';
import QueryKeys from './queryKeys';

const useProduct = (id: string) =>
  useQuery(QueryKeys.product(id), () => api.getProduct.query({ id }));

export default useProduct;
