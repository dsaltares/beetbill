import { TRPCError } from '@trpc/server';
import { InvoiceStatus } from '@prisma/client';
import { type Procedure, procedure } from '@server/trpc';
import prisma from '@server/prisma';
import { UpdateInvoiceOutput, UpdateInvoiceInput } from './types';
import mapInvoiceEntity from './mapInvoiceEntity';

export const updateInvoice: Procedure<
  UpdateInvoiceInput,
  UpdateInvoiceOutput
> = async ({
  ctx: { session },
  input: { id, clientId, number, status, prefix, date },
}) => {
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
  let clientStateId: string | undefined;
  if (clientId) {
    const client = await prisma.client.findFirst({
      where: {
        id: clientId,
        deletedAt: null,
      },
      include: {
        states: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
    if (!client) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }
    clientStateId = client.states[0].id;
  }
  const updatedInvoice = await prisma.invoice.update({
    where: { id },
    data: {
      number,
      status,
      prefix,
      date,
      clientStateId,
    },
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
