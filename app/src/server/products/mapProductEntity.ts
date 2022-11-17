import type { Product, ProductState } from '@prisma/client';
import type { Product as APIProduct } from './types';

type Entity = Product & { states: ProductState[] };

const mapProductEntity = ({
  states,
  createdAt,
  updatedAt,
  ...product
}: Entity): APIProduct => ({
  ...states[0],
  ...product,
  createdAt: createdAt.toISOString(),
  updatedAt: updatedAt.toISOString(),
});

export default mapProductEntity;
