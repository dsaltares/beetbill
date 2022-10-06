import { TRPCError } from '@trpc/server';
import { InvoiceStatus } from '@prisma/client';
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
  const customerInNonDraftInvoice = await prisma.customer.findFirst({
    include: { invoice: true },
    where: {
      id,
      invoice: { status: { not: InvoiceStatus.DRAFT } },
    },
  });
  if (customerInNonDraftInvoice) {
    throw new TRPCError({
      code: 'PRECONDITION_FAILED',
      message: 'Customer is associated to approved invoices',
    });
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
