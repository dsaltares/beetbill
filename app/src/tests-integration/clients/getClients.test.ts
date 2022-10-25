import type { Company, User } from '@prisma/client';
import type { Session } from 'next-auth';
import { getClients } from '@server/clients/getClients';
import {
  createTestCompany,
  createTestClient,
  createTestUser,
} from '../testData';

let user1: User;
let user2: User;
let company1: Company;
let company2: Company;
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

    const clients = await getClients({ ctx: { session }, input: {} });
    expect(clients).toEqual([client1, client2]);
  });
});
