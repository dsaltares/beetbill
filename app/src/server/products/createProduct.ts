import { type Procedure, procedure } from '@server/trpc';
import prisma from '@server/prisma';
import { CreateProductOutput, CreateProductInput } from './types';
import mapProductEntity from './mapProductEntity';

export const createProduct: Procedure<
  CreateProductInput,
  CreateProductOutput
> = async ({ ctx: { session }, input }) => {
  const product = await prisma.product.create({
    data: {
      companyId: session?.companyId as string,
      states: { create: input },
    },
    include: { states: true },
  });
  return mapProductEntity(product);
};

export default procedure
  .input(CreateProductInput)
  .output(CreateProductOutput)
  .mutation(createProduct);
