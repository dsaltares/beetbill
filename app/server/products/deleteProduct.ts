import prisma from '@server/prisma';
import { procedure } from '@server/trpc';
import { DeleteProductOutput, DeleteProductsInput } from './types';

const deleteProduct = procedure
  .input(DeleteProductsInput)
  .output(DeleteProductOutput)
  .mutation(async ({ ctx: { session }, input: { id } }) => {
    const existingProduct = await prisma.product.findFirst({
      where: { id, companyId: session?.company.id as string },
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
