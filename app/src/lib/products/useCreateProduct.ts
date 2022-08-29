import cuid from 'cuid';
import api from '@lib/api';
import useMutation from '@lib/useMutation';
import type {
  CreateProductInput,
  GetProductsOutput,
} from '@server/products/types';
import QueryKeys from './queryKeys';

const useCreateProduct = () =>
  useMutation<CreateProductInput, GetProductsOutput>({
    mutationFn: api.createProduct.mutate,
    cacheKey: QueryKeys.products,
    cacheUpdater: (products, input) => {
      products.push({
        id: `new-product${cuid()}`,
        companyId: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...input,
      });
    },
  });

export default useCreateProduct;
