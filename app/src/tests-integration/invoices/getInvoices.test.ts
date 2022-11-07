import type { User } from '@prisma/client';
import type { Session } from 'next-auth';
import omit from 'lodash.omit';
import { getInvoices } from '@server/invoices/getInvoices';
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

describe('getInvoices', () => {
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

  it('returns an empty array when there are no invoices', async () => {
    await createTestInvoice(company2.states[0].id, client2.states[0].id);

    const clients = await getInvoices({ ctx: { session }, input: {} });
    expect(clients).toEqual([]);
  });

  it('returns the clients for the company in the session', async () => {
    await createTestClient(company2.id);
    const dbInvoice1 = await createTestInvoice(
      company1.states[0].id,
      client1.states[0].id
    );
    const dbInvoice2 = await createTestInvoice(
      company1.states[0].id,
      client1.states[0].id
    );

    const invoices = await getInvoices({ ctx: { session }, input: {} });
    expect(invoices).toEqual(
      expect.arrayContaining([
        expect.objectContaining(
          omit(
            dbInvoice1,
            'companyStateId',
            'clientStateId',
            'companyState',
            'clientState',
            'deletedAt',
            'date'
          )
        ),
        expect.objectContaining(
          omit(
            dbInvoice2,
            'companyStateId',
            'clientStateId',
            'companyState',
            'clientState',
            'deletedAt',
            'date'
          )
        ),
      ])
    );
  });
});
