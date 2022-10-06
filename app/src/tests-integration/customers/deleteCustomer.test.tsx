import type { Company, Customer, User } from '@prisma/client';
import type { Session } from 'next-auth';
import cuid from 'cuid';
import { TRPCError } from '@trpc/server';
import prisma from '@server/prisma';
import { createTestCompany, createTestUser } from '../testData';
import { deleteCustomer } from '@server/customers/deleteCustomer';

let user: User;
let company: Company;
let session: Session;
let customer: Customer;

describe('deleteCustomer', () => {
  beforeEach(async () => {
    user = await createTestUser();
    company = await createTestCompany(user.id);
    customer = await prisma.customer.create({
      data: { companyId: company.id, name: 'Test customer', number: cuid() },
    });
    session = { userId: user.id, companyId: company.id, expires: '' };
  });

  it('does nothing when the customer does not exist', async () => {
    const customerDoesNotExistId = 'invalid_customer';
    const id = await deleteCustomer({
      ctx: { session },
      input: { id: customerDoesNotExistId },
    });
    expect(id).toEqual(customerDoesNotExistId);
  });

  it('throws when the customer has a non draft invoice', async () => {
    const invoiceCustomer = await prisma.customer.create({
      data: {
        companyId: company.id,
        name: customer.name,
        number: customer.number,
        originalId: customer.id,
      },
    });
    await prisma.invoice.create({
      data: {
        number: 1,
        customerId: invoiceCustomer.id,
        companyId: company.id,
        status: 'SENT',
      },
    });

    await expect(
      deleteCustomer({ ctx: { session }, input: { id: customer.id } })
    ).rejects.toEqual(
      new TRPCError({
        code: 'PRECONDITION_FAILED',
        message: 'Customer is associated to approved invoices',
      })
    );
  });

  it('soft deletes the customer', async () => {
    const invoiceCustomer = await prisma.customer.create({
      data: {
        companyId: company.id,
        name: customer.name,
        number: customer.number,
        originalId: customer.id,
      },
    });
    await prisma.invoice.create({
      data: {
        number: 1,
        customerId: invoiceCustomer.id,
        companyId: company.id,
        status: 'DRAFT',
      },
    });

    const id = await deleteCustomer({
      ctx: { session },
      input: { id: customer.id },
    });
    const dbCustomer = await prisma.customer.findUnique({
      where: { id: customer.id },
    });
    expect(id).toEqual(customer.id);
    expect(dbCustomer?.deletedAt).not.toEqual(null);
  });
});
