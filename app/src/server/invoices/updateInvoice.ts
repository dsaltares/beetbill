import { TRPCError } from '@trpc/server';
import { InvoiceStatus } from '@prisma/client';
import { type Procedure, procedure } from '@server/trpc';
import prisma from '@server/prisma';
import { UpdateInvoiceOutput, UpdateInvoiceInput } from './types';
import mapInvoiceEntity from './mapInvoiceEntity';

export const updateInvoice: Procedure<
  UpdateInvoiceInput,
  UpdateInvoiceOutput
> = async ({ ctx: { session }, input: { id, ...data } }) => {
  const existingInvoice = await prisma.invoice.findFirst({
    where: {
      id,
      deletedAt: null,
      companyState: { companyId: session?.companyId as string },
    },
  });
  if (!existingInvoice) {
    throw new TRPCError({ code: 'NOT_FOUND' });
  }
  if (existingInvoice.status !== InvoiceStatus.DRAFT) {
    throw new TRPCError({
      code: 'PRECONDITION_FAILED',
      message: 'Cannot update an approved invoice',
    });
  }
  const updatedInvoice = await prisma.invoice.update({
    where: { id },
    data,
    include: {
      companyState: {
        include: {
          company: true,
        },
      },
      clientState: {
        include: {
          client: true,
        },
      },
      items: {
        include: {
          productState: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });
  return mapInvoiceEntity(updatedInvoice);
};

export default procedure
  .input(UpdateInvoiceInput)
  .output(UpdateInvoiceOutput)
  .mutation(updateInvoice);
