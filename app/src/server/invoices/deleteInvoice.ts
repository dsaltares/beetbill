import { TRPCError } from '@trpc/server';
import prisma from '@server/prisma';
import { type Procedure, procedure } from '@server/trpc';
import { DeleteInvoiceOutput, DeleteInvoiceInput } from './types';

export const deleteInvoice: Procedure<
  DeleteInvoiceInput,
  DeleteInvoiceOutput
> = async ({ ctx: { session }, input: { id } }) => {
  const invoice = await prisma.invoice.findFirst({
    where: {
      id,
      deletedAt: null,
      companyState: {
        companyId: session?.companyId as string,
      },
    },
  });

  if (!invoice) {
    return id;
  }

  if (invoice.status !== 'DRAFT') {
    throw new TRPCError({
      code: 'PRECONDITION_FAILED',
      message: 'Appoved invoices cannot be deleted.',
    });
  }

  await prisma.invoice.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return id;
};

export default procedure
  .input(DeleteInvoiceInput)
  .output(DeleteInvoiceOutput)
  .mutation(deleteInvoice);
