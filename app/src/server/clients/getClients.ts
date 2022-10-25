import { type Procedure, procedure } from '@server/trpc';
import prisma from '@server/prisma';
import { GetClientsOutput } from './types';

export const getClients: Procedure<unknown, GetClientsOutput> = ({ ctx }) =>
  prisma.client.findMany({
    where: {
      companyId: ctx.session?.companyId,
      originalId: null,
      deletedAt: null,
    },
  });

export default procedure.output(GetClientsOutput).query(getClients);
