import { type Procedure, procedure } from '@server/trpc';
import prisma from '@server/prisma';
import { CreateCustomerOutput, CreateCustomerInput } from './types';

export const createCustomer: Procedure<
  CreateCustomerInput,
  CreateCustomerOutput
> = ({ ctx: { session }, input }) =>
  prisma.customer.create({
    data: { companyId: session?.companyId as string, ...input },
  });

export default procedure
  .input(CreateCustomerInput)
  .output(CreateCustomerOutput)
  .mutation(createCustomer);
