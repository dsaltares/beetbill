import { TRPCError } from '@trpc/server';
import { procedure } from '@server/trpc';
import prisma from '@server/prisma';
import { UpdateCustomerOutput, UpdateCustomerInput } from './types';

const updateCustomer = procedure
  .input(UpdateCustomerInput)
  .output(UpdateCustomerOutput)
  .mutation(async ({ ctx: { session }, input: { id, ...data } }) => {
    const existingCustomer = await prisma.customer.findFirst({
      where: { id, companyId: session?.companyId as string, originalId: null },
    });
    if (!existingCustomer) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }
    return prisma.customer.update({
      where: { id },
      data,
    });
  });

export default updateCustomer;
