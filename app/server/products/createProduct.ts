import { procedure } from '@server/trpc';
import prisma from '@server/prisma';
import { CreateProductOutput, CreateProductInput } from './types';

const createProduct = procedure
  .input(CreateProductInput)
  .output(CreateProductOutput)
  .mutation(({ ctx: { session }, input }) =>
    prisma.product.create({
      data: { companyId: session?.company.id as string, ...input },
    })
  );

export default createProduct;
