import cuid from 'cuid';
import api from '@lib/api';
import useMutation from '@lib/useMutation';
import type {
  CreateProductInput,
  GetProductsOutput,
  Product,
} from '@server/products/types';
import QueryKeys from './queryKeys';

type UseCreateProductArgs =
  | {
      onSuccess?: (product: Product) => void;
    }
  | undefined;

const useCreateProduct = ({ onSuccess }: UseCreateProductArgs = {}) =>
  useMutation<CreateProductInput, GetProductsOutput, Product>({
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
    onSuccess,
  });

export default useCreateProduct;
