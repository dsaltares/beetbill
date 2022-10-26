import type { User } from '@prisma/client';
import { InvoiceStatus } from '@prisma/client';
import type { Session } from 'next-auth';
import prisma from '@server/prisma';
import {
  createTestClient,
  createTestCompany,
  createTestUser,
} from '../testData';
import { createInvoice } from '@server/invoices/createInvoice';

let user: User;
let company: Awaited<ReturnType<typeof createTestCompany>>;
let client: Awaited<ReturnType<typeof createTestClient>>;
let session: Session;

describe('createInvoice', () => {
  beforeEach(async () => {
    user = await createTestUser();
    company = await createTestCompany(user.id);
    client = await createTestClient(company.id);
    session = { userId: user.id, companyId: company.id, expires: '' };
  });

  it('creates an invoice', async () => {
    const input = {
      status: InvoiceStatus.DRAFT,
      prefix: 'INV',
      number: 1,
      date: new Date(),
      clientId: client.id,
    };
    const invoice = await createInvoice({
      ctx: { session },
      input,
    });
    const dbInvoice = await prisma.invoice.findUniqueOrThrow({
      where: { id: invoice.id },
      include: {
        clientState: true,
        companyState: true,
      },
    });
    expect(invoice.id).toEqual(dbInvoice.id);
    expect(invoice.status).toEqual(dbInvoice.status);
    expect(invoice.prefix).toEqual(dbInvoice.prefix);
    expect(invoice.number).toEqual(dbInvoice.number);
    expect(invoice.date).toEqual(dbInvoice.date);
    expect(invoice.client.id).toEqual(dbInvoice.clientState.clientId);
    expect(invoice.company.id).toEqual(dbInvoice.companyState.companyId);
  });

  it('throws when the company does not exist', async () => {
    await expect(
      createInvoice({
        ctx: { session: { ...session, companyId: 'invalid_company' } },
        input: {
          status: InvoiceStatus.DRAFT,
          prefix: 'INV',
          number: 1,
          date: new Date(),
          clientId: client.id,
        },
      })
    ).rejects.toThrow();
  });
});
