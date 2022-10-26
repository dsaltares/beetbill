import type { User } from '@prisma/client';
import { InvoiceStatus } from '@prisma/client';
import type { Session } from 'next-auth';
import { TRPCError } from '@trpc/server';
import { updateInvoice } from '@server/invoices/updateInvoice';
import {
  createTestCompany,
  createTestClient,
  createTestUser,
  createTestInvoice,
} from '../testData';
import prisma from '@server/prisma';

let user: User;
let company: Awaited<ReturnType<typeof createTestCompany>>;
let client: Awaited<ReturnType<typeof createTestClient>>;
let session: Session;

describe('updateInvoice', () => {
  beforeEach(async () => {
    user = await createTestUser();
    company = await createTestCompany(user.id);
    client = await createTestClient(company.id);
    session = { userId: user.id, companyId: company.id, expires: '' };
  });

  it('throws when trying to update a non existing invoice', async () => {
    await expect(
      updateInvoice({
        ctx: { session },
        input: {
          id: 'invalid_invoice',
          date: new Date(),
        },
      })
    ).rejects.toEqual(new TRPCError({ code: 'NOT_FOUND' }));
  });

  it('throws when trying to update an approved invoice', async () => {
    const invoice = await createTestInvoice(
      company.states[0].id,
      client.states[0].id,
      InvoiceStatus.SENT
    );

    await expect(
      updateInvoice({
        ctx: { session },
        input: {
          id: invoice.id,
          date: new Date(),
        },
      })
    ).rejects.toEqual(
      new TRPCError({
        code: 'PRECONDITION_FAILED',
        message: 'Cannot update an approved invoice',
      })
    );
  });

  it('updates the invoice', async () => {
    const invoice = await createTestInvoice(
      company.states[0].id,
      client.states[0].id
    );

    const newNumber = 2;
    const updatedInvoice = await updateInvoice({
      ctx: { session },
      input: {
        id: invoice.id,
        number: newNumber,
      },
    });
    const dbInvoice = await prisma.invoice.findUniqueOrThrow({
      where: { id: invoice.id },
    });

    expect(updatedInvoice.number).toEqual(dbInvoice.number);
    expect(updatedInvoice.number).toEqual(newNumber);
  });
});
