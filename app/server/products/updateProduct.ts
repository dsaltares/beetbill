import { TRPCError } from '@trpc/server';
import { procedure } from '@server/trpc';
import prisma from '@server/prisma';
import { UpdateProductOutput, UpdateProductsInput } from './types';

const updateProduct = procedure
  .input(UpdateProductsInput)
  .output(UpdateProductOutput)
  .mutation(async ({ ctx: { session }, input: { id, ...data } }) => {
    const existingProduct = await prisma.product.findFirst({
      where: { id, companyId: session?.company.id as string },
    });
    if (!existingProduct) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }
    return prisma.product.update({
      where: { id },
      data,
    });
  });

export default updateProduct;
