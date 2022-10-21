import api from '@lib/api';
import useMutation from '@lib/useMutation';
import type {
  UpdateProductInput,
  GetProductsOutput,
  Product,
} from '@server/products/types';
import QueryKeys from './queryKeys';

type UseUpdateProductArgs =
  | {
      onSuccess?: (data: Product) => void;
    }
  | undefined;

const useUpdateProduct = ({ onSuccess }: UseUpdateProductArgs = {}) =>
  useMutation<UpdateProductInput, GetProductsOutput, Product>({
    mutationFn: api.updateProduct.mutate,
    cacheKey: QueryKeys.products,
    cacheUpdater: (products, input) => {
      const productIndex = products.findIndex(({ id }) => id === input.id);
      if (productIndex !== -1) {
        products[productIndex] = {
          ...products[productIndex],
          ...input,
        };
      }
    },
    onSuccess,
  });

export default useUpdateProduct;
