import { InvoiceStatus } from '@prisma/client';
import { TRPCError } from '@trpc/server';
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

  if (!existingProduct) {
    return id;
  }

  const productInNonDraftInvoice = await prisma.invoiceProduct.findFirst({
    include: { invoice: true },
    where: {
      productId: id,
      invoice: { status: { not: InvoiceStatus.DRAFT } },
    },
  });
  if (productInNonDraftInvoice) {
    throw new TRPCError({
      code: 'PRECONDITION_FAILED',
      message: 'Product is associated to an approved invoice',
    });
  }

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
