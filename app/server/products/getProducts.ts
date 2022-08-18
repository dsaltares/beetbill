import { procedure } from '@server/trpc';
import prisma from '@server/prisma';
import { GetProductsOutput } from './types';

const getProducts = procedure.output(GetProductsOutput).query(({ ctx }) =>
  prisma.product.findMany({
    where: { companyId: ctx.session?.companyId, deletedAt: null },
  })
);

export default getProducts;
