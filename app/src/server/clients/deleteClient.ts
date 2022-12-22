import { TRPCError } from '@trpc/server';
import prisma from '@server/prisma';
import { type Procedure, procedure } from '@server/trpc';
import { DeleteClientOutput, DeleteClientInput } from './types';

export const deleteClient: Procedure<
  DeleteClientInput,
  DeleteClientOutput
> = async ({ ctx: { session }, input: { id } }) => {
  const clientInNonDraftInvoice = await prisma.client.findFirst({
    where: {
      id,
      companyId: session?.companyId as string,
      states: {
        some: {
          invoices: {
            some: {
              deletedAt: null,
            },
          },
        },
      },
    },
  });
  if (clientInNonDraftInvoice) {
    throw new TRPCError({
      code: 'PRECONDITION_FAILED',
      message: 'Clients associated to approved invoices cannot be deleted.',
    });
  }

  const existingClient = await prisma.client.findFirst({
    where: { id, companyId: session?.companyId as string },
  });

  if (existingClient) {
    await prisma.client.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  return id;
};

export default procedure
  .input(DeleteClientInput)
  .output(DeleteClientOutput)
  .mutation(deleteClient);
