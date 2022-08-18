import { procedure } from '@server/trpc';
import prisma from '@server/prisma';
import { CreateCustomerOutput, CreateCustomerInput } from './types';

const createCustomer = procedure
  .input(CreateCustomerInput)
  .output(CreateCustomerOutput)
  .mutation(({ ctx: { session }, input }) =>
    prisma.customer.create({
      data: { companyId: session?.company.id as string, ...input },
    })
  );

export default createCustomer;
