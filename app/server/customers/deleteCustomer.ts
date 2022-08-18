import { InvoiceStatus } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import prisma from '@server/prisma';
import { procedure } from '@server/trpc';
import { DeleteCustomerOutput, DeleteCustomerInput } from './types';

const deleteCustomer = procedure
  .input(DeleteCustomerInput)
  .output(DeleteCustomerOutput)
  .mutation(async ({ ctx: { session }, input: { id } }) => {
    const customerInNonDraftInvoice = await prisma.customer.findFirst({
      include: { invoice: true },
      where: {
        originalId: id,
        companyId: session?.company.id as string,
        invoice: { status: { not: InvoiceStatus.DRAFT } },
      },
    });
    if (customerInNonDraftInvoice) {
      throw new TRPCError({
        code: 'PRECONDITION_FAILED',
        message: 'Customer is associated to approved invoices',
      });
    }

    const existingCustomer = await prisma.product.findFirst({
      where: { id, companyId: session?.company.id as string, originalId: null },
    });

    if (existingCustomer) {
      await prisma.customer.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    }

    return id;
  });

export default deleteCustomer;
