import { TRPCError } from '@trpc/server';
import { NotFoundError } from '@prisma/client/runtime';
import { type Procedure, procedure } from '@server/trpc';
import prisma from '@server/prisma';
import { GetClientInput, GetClientOutput } from './types';
import mapClientEntity from './mapClientEntity';
import { getInvoicesForClient } from './utils';

export const getClient: Procedure<GetClientInput, GetClientOutput> = async ({
  ctx: { session },
  input: { id },
}) => {
  try {
    const [client, invoices] = await Promise.all([
      prisma.client.findFirstOrThrow({
        where: { id, companyId: session?.companyId, deletedAt: null },
        include: {
          states: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      }),
      getInvoicesForClient(id),
    ]);
    return mapClientEntity(client, invoices);
  } catch (e) {
    if (e instanceof NotFoundError) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'The client does not exist.',
      });
    }
    throw e;
  }
};

export default procedure
  .input(GetClientInput)
  .output(GetClientOutput)
  .query(getClient);
