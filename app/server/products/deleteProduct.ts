import prisma from '@server/prisma';
import { procedure } from '@server/trpc';
import { DeleteProductOutput, DeleteProductInput } from './types';

const deleteProduct = procedure
  .input(DeleteProductInput)
  .output(DeleteProductOutput)
  .mutation(async ({ ctx: { session }, input: { id } }) => {
    const existingProduct = await prisma.product.findFirst({
      where: { id, companyId: session?.companyId as string },
    });
    if (existingProduct) {
      await prisma.product.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    }

    return id;
  });

export default deleteProduct;
