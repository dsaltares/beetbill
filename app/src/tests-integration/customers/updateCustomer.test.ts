import type { Company, User } from '@prisma/client';
import type { Session } from 'next-auth';
import { TRPCError } from '@trpc/server';
import { updateCustomer } from '@server/customers/updateCustomer';
import {
  createTestCompany,
  createTestCustomer,
  createTestUser,
} from '../testData';
import prisma from '@server/prisma';

let user: User;
let company: Company;
let session: Session;

describe('updateCustomer', () => {
  beforeEach(async () => {
    user = await createTestUser();
    company = await createTestCompany(user.id);
    session = { userId: user.id, companyId: company.id, expires: '' };
  });

  it('throws when trying to update a non existing customer', async () => {
    await expect(
      updateCustomer({
        ctx: { session },
        input: {
          id: 'invalid_customer',
          name: 'Test Customer',
        },
      })
    ).rejects.toEqual(new TRPCError({ code: 'NOT_FOUND' }));
  });

  it('throws when trying to update an invoice customer of a non draft invoice', async () => {
    const invoiceCustomer = await createTestCustomer(company.id);
    await prisma.invoice.create({
      data: {
        number: 1,
        customerId: invoiceCustomer.id,
        companyId: company.id,
        status: 'SENT',
      },
    });
    await expect(
      updateCustomer({
        ctx: { session },
        input: {
          id: invoiceCustomer.id,
          name: 'Test Customer',
        },
      })
    ).rejects.toThrowError();
  });

  it('updates the customer', async () => {
    const customer = await createTestCustomer(company.id);
    const newName = 'Updated Customer';
    const updatedCustomer = await updateCustomer({
      ctx: { session },
      input: {
        id: customer.id,
        name: newName,
      },
    });
    const dbCustomer = await prisma.customer.findUnique({
      where: { id: customer.id },
    });

    expect(updatedCustomer.name).toEqual(newName);
    expect(updatedCustomer).toEqual(dbCustomer);
  });
});
