import type { User } from '@prisma/client';
import type { Session } from 'next-auth';
import { TRPCError } from '@trpc/server';
import { getInvoice } from '@server/invoices/getInvoice';
import {
  createTestCompany,
  createTestClient,
  createTestUser,
  createTestInvoice,
} from '../testData';

let user1: User;
let user2: User;
let company1: Awaited<ReturnType<typeof createTestCompany>>;
let company2: Awaited<ReturnType<typeof createTestCompany>>;
let client1: Awaited<ReturnType<typeof createTestClient>>;
let client2: Awaited<ReturnType<typeof createTestClient>>;
let session: Session;

describe('getInvoice', () => {
  beforeEach(async () => {
    [user1, user2] = await Promise.all([createTestUser(), createTestUser()]);
    [company1, company2] = await Promise.all([
      createTestCompany(user1.id),
      createTestCompany(user2.id),
    ]);
    [client1, client2] = await Promise.all([
      createTestClient(company1.id),
      createTestClient(company2.id),
    ]);
    session = { userId: user1.id, companyId: company1.id, expires: '' };
  });

  it('returns the invoice', async () => {
    const {
      id,
      status,
      prefix,
      number,
      clientState: { clientId },
      companyState: { companyId },
    } = await createTestInvoice(company1.states[0].id, client1.states[0].id);

    const invoice = await getInvoice({
      ctx: { session },
      input: { id },
    });
    expect(invoice).toMatchObject({
      id,
      status,
      prefix,
      number,
    });
    expect(invoice.client.id).toEqual(clientId);
    expect(invoice.company.id).toEqual(companyId);
  });

  it('throws a NOT_FOUND error when the invoice does not exist', async () => {
    await expect(
      getInvoice({ ctx: { session }, input: { id: 'invalid' } })
    ).rejects.toEqual(
      new TRPCError({
        code: 'NOT_FOUND',
        message: 'The invoice does not exist.',
      })
    );
  });

  it('throws a NOT_FOUND error when the invoice belongs to a different user', async () => {
    const { id } = await createTestInvoice(
      company2.states[0].id,
      client2.states[0].id
    );

    await expect(
      getInvoice({ ctx: { session }, input: { id } })
    ).rejects.toEqual(
      new TRPCError({
        code: 'NOT_FOUND',
        message: 'The invoice does not exist.',
      })
    );
  });
});
