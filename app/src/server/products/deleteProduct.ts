import prisma from '@server/prisma';
import { type Procedure, procedure } from '@server/trpc';
import { DeleteProductOutput, DeleteProductInput } from './types';

export const deleteProduct: Procedure<
  DeleteProductInput,
  DeleteProductOutput
> = async ({ ctx: { session }, input: { id } }) => {
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
};

export default procedure
  .input(DeleteProductInput)
  .output(DeleteProductOutput)
  .mutation(deleteProduct);
