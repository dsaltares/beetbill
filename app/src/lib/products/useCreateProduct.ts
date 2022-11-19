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
      const now = new Date().toISOString();
      products.push({
        id: `new-product${cuid()}`,
        companyId: '',
        createdAt: now,
        updatedAt: now,
        includesVat: false,
        price: 0,
        currency: 'EUR',
        vat: 0,
        unit: 'hours',
        ...input,
      });
    },
    successMessage: () => 'Successfully created product!',
    errorMessage: () => 'Failed to create product',
    onSuccess,
  });

export default useCreateProduct;
