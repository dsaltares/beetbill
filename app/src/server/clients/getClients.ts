import { type Procedure, procedure } from '@server/trpc';
import prisma from '@server/prisma';
import { GetClientsOutput } from './types';
import mapClientEntity from './mapClientEntity';

export const getClients: Procedure<unknown, GetClientsOutput> = async ({
  ctx,
}) => {
  const clients = await prisma.client.findMany({
    where: {
      companyId: ctx.session?.companyId,
      deletedAt: null,
    },
    include: {
      states: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });
  return clients.map(mapClientEntity);
};

export default procedure.output(GetClientsOutput).query(getClients);
