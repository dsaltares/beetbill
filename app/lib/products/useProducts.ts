import { useQuery } from '@tanstack/react-query';
import api from '@lib/api';
import QueryKeys from './queryKeys';

const useProducts = () =>
  useQuery(QueryKeys.products, () => api.getProducts.query());

export default useProducts;
