import type { User } from '@prisma/client';
import { InvoiceStatus } from '@prisma/client';
import type { Session } from 'next-auth';
import { TRPCError } from '@trpc/server';
import prisma from '@server/prisma';
import {
  createTestCompany,
  createTestUser,
  createTestClient,
  createTestInvoice,
} from '../testData';
import { deleteInvoice } from '@server/invoices/deleteInvoice';

let user: User;
let company: Awaited<ReturnType<typeof createTestCompany>>;
let session: Session;
let client: Awaited<ReturnType<typeof createTestClient>>;

describe('deleteInvoice', () => {
  beforeEach(async () => {
    user = await createTestUser();
    company = await createTestCompany(user.id);
    client = await createTestClient(company.id);
    session = { userId: user.id, companyId: company.id, expires: '' };
  });

  it('does nothing when the invoice does not exist', async () => {
    const invoiceDoesNotExistId = 'invalid_client';
    const id = await deleteInvoice({
      ctx: { session },
      input: { id: invoiceDoesNotExistId },
    });
    expect(id).toEqual(invoiceDoesNotExistId);
  });

  it('throws when the invoice has been approved', async () => {
    const invoice = await createTestInvoice(
      company.states[0].id,
      client.states[0].id,
      InvoiceStatus.SENT
    );

    await expect(
      deleteInvoice({ ctx: { session }, input: { id: invoice.id } })
    ).rejects.toEqual(
      new TRPCError({
        code: 'PRECONDITION_FAILED',
        message: 'Appoved invoices cannot be deleted.',
      })
    );
  });

  it('soft deletes the invoice', async () => {
    const invoice = await createTestInvoice(
      company.states[0].id,
      client.states[0].id
    );

    const id = await deleteInvoice({
      ctx: { session },
      input: { id: invoice.id },
    });
    const dbInvoice = await prisma.invoice.findUnique({
      where: { id: invoice.id },
    });
    expect(id).toEqual(invoice.id);
    expect(dbInvoice?.deletedAt).not.toEqual(null);
  });
});
