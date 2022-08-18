import { TRPCError } from '@trpc/server';
import { procedure } from '@server/trpc';
import prisma from '@server/prisma';
import { UpdateProductOutput, UpdateProductInput } from './types';

const updateProduct = procedure
  .input(UpdateProductInput)
  .output(UpdateProductOutput)
  .mutation(async ({ ctx: { session }, input: { id, ...data } }) => {
    const existingProduct = await prisma.product.findFirst({
      where: { id, companyId: session?.companyId as string },
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
