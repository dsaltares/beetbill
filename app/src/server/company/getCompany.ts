import { type Procedure, procedure } from '@server/trpc';
import prisma from '@server/prisma';
import { GetCompanyOutput } from './types';
import mapCompanyEntity from './mapCompanyEntity';

export const getCompany: Procedure<unknown, GetCompanyOutput> = async ({
  ctx,
}) => {
  const company = await prisma.company.findUniqueOrThrow({
    where: {
      id: ctx.session?.companyId,
    },
    include: {
      states: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });
  return mapCompanyEntity(company);
};

export default procedure.output(GetCompanyOutput).query(getCompany);
