import type { User } from '@prisma/client';
import type { Session } from 'next-auth';
import omit from 'lodash.omit';
import { getClients } from '@server/clients/getClients';
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

describe('getClients', () => {
  beforeEach(async () => {
    [user1, user2] = await Promise.all([createTestUser(), createTestUser()]);
    [company1, company2] = await Promise.all([
      createTestCompany(user1.id),
      createTestCompany(user2.id),
    ]);
    session = { userId: user1.id, companyId: company1.id, expires: '' };
  });

  it('returns an empty array when there are no clients', async () => {
    await createTestClient(company2.id);

    const clients = await getClients({ ctx: { session }, input: {} });
    expect(clients).toEqual([]);
  });

  it('returns the clients for the company in the session', async () => {
    await createTestClient(company2.id);
    const client1 = await createTestClient(company1.id);
    const client2 = await createTestClient(company1.id);
    const [product1, product2] = await Promise.all([
      createTestProduct(company1.id, 'EUR', 1),
      createTestProduct(company1.id, 'EUR', 2),
    ]);
    await Promise.all([
      createTestInvoice(company1.states[0].id, client1.states[0].id, 'SENT', [
        { productStateId: product1.states[0].id, quantity: 2, date: now },
        { productStateId: product2.states[0].id, quantity: 3, date: now },
      ]),
      createTestInvoice(company1.states[0].id, client2.states[0].id, 'PAID', [
        { productStateId: product1.states[0].id, quantity: 1, date: now },
        { productStateId: product2.states[0].id, quantity: 1, date: now },
      ]),
    ]);

    const clients = await getClients({ ctx: { session }, input: {} });
    expect(clients[0]).toMatchObject(
      omit(client1.states[0], 'id', 'createdAt')
    );
    expect(clients[0].toBePaid).toEqual({ value: 8, currency: 'EUR' });
    expect(clients[0].paid).toEqual({ value: 0, currency: 'EUR' });
    expect(clients[1]).toMatchObject(
      omit(client2.states[0], 'id', 'createdAt')
    );
    expect(clients[1].toBePaid).toEqual({ value: 0, currency: 'EUR' });
    expect(clients[1].paid).toEqual({ value: 3, currency: 'EUR' });
  });
});
