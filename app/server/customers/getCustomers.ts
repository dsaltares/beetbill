import { type Procedure, procedure } from '@server/trpc';
import prisma from '@server/prisma';
import { GetCustomersOutput } from './types';

export const getCustomers: Procedure<unknown, GetCustomersOutput> = ({ ctx }) =>
  prisma.customer.findMany({
    where: {
      companyId: ctx.session?.companyId,
      originalId: null,
      deletedAt: null,
    },
  });

export default procedure.output(GetCustomersOutput).query(getCustomers);
