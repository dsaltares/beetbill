import type { User } from '@prisma/client';
import type { Session } from 'next-auth';
import omit from 'lodash.omit';
import { TRPCError } from '@trpc/server';
import { getClient } from '@server/clients/getClient';
import {
  createTestCompany,
  createTestClient,
  createTestUser,
  createTestProduct,
  createTestInvoice,
} from '../testData';

const now = new Date();
let user1: User;
let user2: User;
let company1: Awaited<ReturnType<typeof createTestCompany>>;
let company2: Awaited<ReturnType<typeof createTestCompany>>;
let session: Session;

describe('getClient', () => {
  beforeEach(async () => {
    [user1, user2] = await Promise.all([createTestUser(), createTestUser()]);
    [company1, company2] = await Promise.all([
      createTestCompany(user1.id),
      createTestCompany(user2.id),
    ]);
    session = { userId: user1.id, companyId: company1.id, expires: '' };
  });

  it('returns the client', async () => {
    const dbClient = await createTestClient(company1.id);
    const [product1, product2] = await Promise.all([
      createTestProduct(company1.id, 'EUR', 1),
      createTestProduct(company1.id, 'EUR', 2),
    ]);
    await Promise.all([
      createTestInvoice(company1.states[0].id, dbClient.states[0].id, 'SENT', [
        { productStateId: product1.states[0].id, quantity: 2, date: now },
        { productStateId: product2.states[0].id, quantity: 3, date: now },
      ]),
      createTestInvoice(company1.states[0].id, dbClient.states[0].id, 'PAID', [
        { productStateId: product1.states[0].id, quantity: 1, date: now },
        { productStateId: product2.states[0].id, quantity: 1, date: now },
      ]),
    ]);

    const client = await getClient({
      ctx: { session },
      input: { id: dbClient.id },
    });
    expect(client).toMatchObject(omit(dbClient.states[0], 'id', 'createdAt'));
    expect(client.toBePaid).toEqual({ value: 8, currency: 'EUR' });
    expect(client.paid).toEqual({ value: 3, currency: 'EUR' });
  });

  it('throws a NOT_FOUND error when the client does not exist', async () => {
    await expect(
      getClient({ ctx: { session }, input: { id: 'invalid' } })
    ).rejects.toEqual(new TRPCError({ code: 'NOT_FOUND' }));
  });

  it('throws a NOT_FOUND error when the client belongs to a different user', async () => {
    const dbClient = await createTestClient(company2.id);

    await expect(
      getClient({ ctx: { session }, input: { id: dbClient.id } })
    ).rejects.toEqual(new TRPCError({ code: 'NOT_FOUND' }));
  });
});
