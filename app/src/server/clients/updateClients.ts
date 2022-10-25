import { TRPCError } from '@trpc/server';
import { InvoiceStatus } from '@prisma/client';
import { type Procedure, procedure } from '@server/trpc';
import prisma from '@server/prisma';
import { UpdateClientOutput, UpdateClientInput } from './types';

export const updateClient: Procedure<
  UpdateClientInput,
  UpdateClientOutput
> = async ({ ctx: { session }, input: { id, ...data } }) => {
  const existingClient = await prisma.client.findFirst({
    where: { id, companyId: session?.companyId as string },
  });
  if (!existingClient) {
    throw new TRPCError({ code: 'NOT_FOUND' });
  }
  const clientInNonDraftInvoice = await prisma.client.findFirst({
    include: { invoice: true },
    where: {
      id,
      invoice: { status: { not: InvoiceStatus.DRAFT } },
    },
  });
  if (clientInNonDraftInvoice) {
    throw new TRPCError({
      code: 'PRECONDITION_FAILED',
      message: 'Client is associated to approved invoices',
    });
  }
  return prisma.client.update({
    where: { id },
    data,
  });
};

export default procedure
  .input(UpdateClientInput)
  .output(UpdateClientOutput)
  .mutation(updateClient);
