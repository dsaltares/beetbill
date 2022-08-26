import { type Procedure, procedure } from '@server/trpc';
import prisma from '@server/prisma';
import { CreateProductOutput, CreateProductInput } from './types';

export const createProduct: Procedure<
  CreateProductInput,
  CreateProductOutput
> = ({ ctx: { session }, input }) =>
  prisma.product.create({
    data: { companyId: session?.companyId as string, ...input },
  });

export default procedure
  .input(CreateProductInput)
  .output(CreateProductOutput)
  .mutation(createProduct);
