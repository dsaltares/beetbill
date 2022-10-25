import { TRPCError } from '@trpc/server';
import { InvoiceStatus } from '@prisma/client';
import omit from 'lodash.omit';
import { type Procedure, procedure } from '@server/trpc';
import prisma from '@server/prisma';
import { UpdateClientOutput, UpdateClientInput } from './types';
import mapClientEntity from './mapClientEntity';

export const updateClient: Procedure<
  UpdateClientInput,
  UpdateClientOutput
> = async ({ ctx: { session }, input: { id, ...data } }) => {
  const existingClient = await prisma.client.findFirst({
    where: { id, companyId: session?.companyId as string },
    include: {
      states: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });
  if (!existingClient) {
    throw new TRPCError({ code: 'NOT_FOUND' });
  }
  const clientInNonDraftInvoice = await prisma.client.findFirst({
    where: {
      id,
      companyId: session?.companyId as string,
      states: {
        some: {
          invoice: { status: { not: InvoiceStatus.DRAFT } },
        },
      },
    },
  });
  if (clientInNonDraftInvoice) {
    throw new TRPCError({
      code: 'PRECONDITION_FAILED',
      message: 'Client is associated to approved invoices',
    });
  }
  const stateData = {
    ...omit(existingClient.states[0], 'id', 'createdAt'),
    ...data,
    clientId: id,
  };
  const newState = await prisma.clientState.create({ data: stateData });
  return mapClientEntity({
    ...existingClient,
    states: [newState],
  });
};

export default procedure
  .input(UpdateClientInput)
  .output(UpdateClientOutput)
  .mutation(updateClient);
