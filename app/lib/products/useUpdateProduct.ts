import api from '@lib/api';
import useMutation from '@lib/useMutation';
import type {
  UpdateProductsInput,
  GetProductsOutput,
} from '@server/products/types';
import QueryKeys from './queryKeys';

const useUpdateProduct = () =>
  useMutation<UpdateProductsInput, GetProductsOutput>({
    mutationFn: api.updateProduct.mutate,
    cacheKey: QueryKeys.products,
    cacheUpdater: (cache, input) => {
      const productIndex = cache.findIndex(({ id }) => id === input.id);
      if (productIndex !== -1) {
        cache[productIndex] = {
          ...cache[productIndex],
          ...input,
        };
      }
    },
  });

export default useUpdateProduct;
