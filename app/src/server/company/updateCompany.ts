import { TRPCError } from '@trpc/server';
import omit from 'lodash.omit';
import { type Procedure, procedure } from '@server/trpc';
import prisma from '@server/prisma';
import { UpdateCompanyOutput, UpdateCompanyInput } from './types';
import mapCompanyEntity from './mapCompanyEntity';

export const updateCompany: Procedure<
  UpdateCompanyInput,
  UpdateCompanyOutput
> = async ({ ctx: { session }, input: { id: _id, ...data } }) => {
  const existingCompany = await prisma.company.findUnique({
    where: { id: session?.companyId as string },
    include: {
      states: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });
  if (!existingCompany) {
    throw new TRPCError({ code: 'NOT_FOUND' });
  }
  const stateData = {
    ...omit(existingCompany.states[0], 'id', 'createdAt'),
    ...data,
    companyId: existingCompany.id,
  };
  const newState = await prisma.companyState.create({ data: stateData });
  return mapCompanyEntity({
    ...existingCompany,
    states: [newState],
  });
};

export default procedure
  .input(UpdateCompanyInput)
  .output(UpdateCompanyOutput)
  .mutation(updateCompany);
