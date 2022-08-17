import { procedure } from '@server/trpc';
import prisma from '@server/prisma';
import { CreateProductOutput, CreateProductsInput } from './types';

const createProduct = procedure
  .input(CreateProductsInput)
  .output(CreateProductOutput)
  .mutation(({ ctx: { session }, input }) =>
    prisma.product.create({
      data: { companyId: session?.company.id as string, ...input },
    })
  );

export default createProduct;
