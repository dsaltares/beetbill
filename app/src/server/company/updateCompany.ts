import { TRPCError } from '@trpc/server';
import { type Procedure, procedure } from '@server/trpc';
import prisma from '@server/prisma';
import { UpdateCompanyOutput, UpdateCompanyInput } from './types';

export const updateCompany: Procedure<
  UpdateCompanyInput,
  UpdateCompanyOutput
> = async ({ ctx: { session }, input }) => {
  const existingCompany = await prisma.company.findUnique({
    where: { id: session?.companyId as string },
  });
  if (!existingCompany) {
    throw new TRPCError({ code: 'NOT_FOUND' });
  }
  return prisma.company.update({
    where: { id: session?.companyId as string },
    data: input,
  });
};

export default procedure
  .input(UpdateCompanyInput)
  .output(UpdateCompanyOutput)
  .mutation(updateCompany);
