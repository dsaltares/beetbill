import type { Company, User } from '@prisma/client';
import type { Session } from 'next-auth';
import cuid from 'cuid';
import prisma from '@server/prisma';
import { getCustomers } from '@server/customers/getCustomers';
import {
  createTestCompany,
  createTestCustomer,
  createTestUser,
} from '../testData';

let user1: User;
let user2: User;
let company1: Company;
let company2: Company;
let session: Session;

describe('getCustomers', () => {
  beforeEach(async () => {
    [user1, user2] = await Promise.all([createTestUser(), createTestUser()]);
    [company1, company2] = await Promise.all([
      createTestCompany(user1.id),
      createTestCompany(user2.id),
    ]);
    session = { userId: user1.id, companyId: company1.id, expires: '' };
  });

  it('returns an empty array when there are no customers', async () => {
    await createTestCustomer(company2.id);

    const customers = await getCustomers({ ctx: { session }, input: {} });
    expect(customers).toEqual([]);
  });

  it('returns the customers for the company in the session', async () => {
    await createTestCustomer(company2.id);
    const customer1 = await createTestCustomer(company1.id);
    const customer2 = await createTestCustomer(company1.id);

    const customers = await getCustomers({ ctx: { session }, input: {} });
    expect(customers).toEqual([customer1, customer2]);
  });
});
