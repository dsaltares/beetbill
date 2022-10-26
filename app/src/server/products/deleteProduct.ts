import { TRPCError } from '@trpc/server';
import prisma from '@server/prisma';
import { type Procedure, procedure } from '@server/trpc';
import { DeleteProductOutput, DeleteProductInput } from './types';

export const deleteProduct: Procedure<
  DeleteProductInput,
  DeleteProductOutput
> = async ({ ctx: { session }, input: { id } }) => {
  const productInNonDraftInvoice = await prisma.product.findFirst({
    where: {
      id,
      companyId: session?.companyId as string,
      states: {
        some: {
          lineItems: {
            some: {
              invoice: { deletedAt: null },
            },
          },
        },
      },
    },
  });
  if (productInNonDraftInvoice) {
    throw new TRPCError({
      code: 'PRECONDITION_FAILED',
      message: 'Product is associated to an approved invoice',
    });
  }

  const existingProduct = await prisma.product.findFirst({
    where: { id, companyId: session?.companyId as string },
  });

  if (!existingProduct) {
    return id;
  }

  await prisma.product.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return id;
};

export default procedure
  .input(DeleteProductInput)
  .output(DeleteProductOutput)
  .mutation(deleteProduct);
