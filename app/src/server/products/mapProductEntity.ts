import type { Product, ProductState } from '@prisma/client';
import type { Product as APIProduct } from './types';

type Entity = Product & { states: ProductState[] };

const mapProductEntity = ({ states, ...product }: Entity): APIProduct => ({
  ...states[0],
  ...product,
});

export default mapProductEntity;
