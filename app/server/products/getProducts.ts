import { type Procedure, procedure } from '@server/trpc';
import prisma from '@server/prisma';
import { GetProductsOutput } from './types';

export const getProducts: Procedure<unknown, GetProductsOutput> = ({ ctx }) =>
  prisma.product.findMany({
    where: { companyId: ctx.session?.companyId, deletedAt: null },
  });

export default procedure.output(GetProductsOutput).query(getProducts);
