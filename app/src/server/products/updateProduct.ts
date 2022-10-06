import { TRPCError } from '@trpc/server';
import { InvoiceStatus } from '@prisma/client';
import { type Procedure, procedure } from '@server/trpc';
import prisma from '@server/prisma';
import { UpdateProductOutput, UpdateProductInput } from './types';

export const updateProduct: Procedure<
  UpdateProductInput,
  UpdateProductOutput
> = async ({ ctx: { session }, input: { id, ...data } }) => {
  const existingProduct = await prisma.product.findFirst({
    where: { id, companyId: session?.companyId as string },
  });
  if (!existingProduct) {
    throw new TRPCError({ code: 'NOT_FOUND' });
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

  return prisma.product.update({
    where: { id },
    data,
  });
};

export default procedure
  .input(UpdateProductInput)
  .output(UpdateProductOutput)
  .mutation(updateProduct);
