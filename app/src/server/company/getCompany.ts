import { type Procedure, procedure } from '@server/trpc';
import prisma from '@server/prisma';
import { GetCompanyOutput } from './types';

export const getCompany: Procedure<unknown, GetCompanyOutput> = ({ ctx }) =>
  prisma.company.findUnique({
    where: {
      id: ctx.session?.companyId,
    },
  });

export default procedure.output(GetCompanyOutput).query(getCompany);
