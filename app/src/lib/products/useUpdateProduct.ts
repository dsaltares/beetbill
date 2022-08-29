import api from '@lib/api';
import useMutation from '@lib/useMutation';
import type {
  UpdateProductInput,
  GetProductsOutput,
} from '@server/products/types';
import QueryKeys from './queryKeys';

const useUpdateProduct = () =>
  useMutation<UpdateProductInput, GetProductsOutput>({
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
  });

export default useUpdateProduct;
