import { TRPCError } from '@trpc/server';
import { type Procedure, procedure } from '@server/trpc';
import prisma from '@server/prisma';
import { UpdateCompanyOutput, UpdateCompanyInput } from './types';

export const updateCompany: Procedure<
  UpdateCompanyInput,
  UpdateCompanyOutput
> = async ({ ctx: { session }, input: { id, ...data } }) => {
  const existingCompany = await prisma.company.findFirst({
    where: { id, userId: session?.userId as string },
  });
  if (!existingCompany) {
    throw new TRPCError({ code: 'NOT_FOUND' });
  }
  return prisma.company.update({
    where: { id },
    data,
  });
};

export default procedure
  .input(UpdateCompanyInput)
  .output(UpdateCompanyOutput)
  .mutation(updateCompany);
