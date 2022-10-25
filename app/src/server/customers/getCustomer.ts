import { TRPCError } from '@trpc/server';
import { NotFoundError } from '@prisma/client/runtime';
import { type Procedure, procedure } from '@server/trpc';
import prisma from '@server/prisma';
import { GetCustomerInput, GetCustomerOutput } from './types';

export const getCustomer: Procedure<
  GetCustomerInput,
  GetCustomerOutput
> = async ({ ctx: { session }, input: { id } }) => {
  try {
    const customer = await prisma.customer.findFirstOrThrow({
      where: { id, companyId: session?.companyId, deletedAt: null },
    });
    return customer;
  } catch (e) {
    if (e instanceof NotFoundError) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }
    throw e;
  }
};

export default procedure
  .input(GetCustomerInput)
  .output(GetCustomerOutput)
  .query(getCustomer);
