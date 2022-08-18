import { procedure } from '@server/trpc';
import prisma from '@server/prisma';
import { GetCustomersOutput } from './types';

const getCustomers = procedure.output(GetCustomersOutput).query(({ ctx }) =>
  prisma.customer.findMany({
    where: {
      companyId: ctx.session?.companyId,
      originalId: null,
      deletedAt: null,
    },
  })
);

export default getCustomers;
