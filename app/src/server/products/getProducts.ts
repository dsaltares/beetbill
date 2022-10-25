import { type Procedure, procedure } from '@server/trpc';
import prisma from '@server/prisma';
import { GetProductsOutput } from './types';
import mapProductEntity from './mapProductEntity';

export const getProducts: Procedure<unknown, GetProductsOutput> = async ({
  ctx,
}) => {
  const products = await prisma.product.findMany({
    where: { companyId: ctx.session?.companyId, deletedAt: null },
    include: {
      states: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });
  return products.map(mapProductEntity);
};

export default procedure.output(GetProductsOutput).query(getProducts);
