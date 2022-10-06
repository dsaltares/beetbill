import { TRPCError } from '@trpc/server';
import { type Procedure, procedure } from '@server/trpc';
import prisma from '@server/prisma';
import { UpdateCustomerOutput, UpdateCustomerInput } from './types';

export const updateCustomer: Procedure<
  UpdateCustomerInput,
  UpdateCustomerOutput
> = async ({ ctx: { session }, input: { id, ...data } }) => {
  const existingCustomer = await prisma.customer.findFirst({
    where: { id, companyId: session?.companyId as string },
  });
  if (!existingCustomer) {
    throw new TRPCError({ code: 'NOT_FOUND' });
  }
  return prisma.customer.update({
    where: { id },
    data,
  });
};

export default procedure
  .input(UpdateCustomerInput)
  .output(UpdateCustomerOutput)
  .mutation(updateCustomer);
