import { procedure } from '@server/trpc';
import prisma from '@server/prisma';
import { GetCompanyOutput } from './types';

const getCompany = procedure.output(GetCompanyOutput).query(({ ctx }) =>
  prisma.company.findUnique({
    where: {
      id: ctx.session?.companyId,
    },
  })
);

export default getCompany;
