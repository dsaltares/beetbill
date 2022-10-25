import type { Company, User } from '@prisma/client';
import type { Session } from 'next-auth';
import { TRPCError } from '@trpc/server';
import { getCustomer } from '@server/customers/getCustomer';
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

describe('getCustomer', () => {
  beforeEach(async () => {
    [user1, user2] = await Promise.all([createTestUser(), createTestUser()]);
    [company1, company2] = await Promise.all([
      createTestCompany(user1.id),
      createTestCompany(user2.id),
    ]);
    session = { userId: user1.id, companyId: company1.id, expires: '' };
  });

  it('returns the customer', async () => {
    const dbCustomer = await createTestCustomer(company1.id);

    const customer = await getCustomer({
      ctx: { session },
      input: { id: dbCustomer.id },
    });
    expect(customer).toEqual(dbCustomer);
  });

  it('throws a NOT_FOUND error when the customer does not exist', async () => {
    await expect(
      getCustomer({ ctx: { session }, input: { id: 'invalid' } })
    ).rejects.toEqual(new TRPCError({ code: 'NOT_FOUND' }));
  });

  it('throws a NOT_FOUND error when the customer belongs to a different user', async () => {
    const dbCustomer = await createTestCustomer(company2.id);

    await expect(
      getCustomer({ ctx: { session }, input: { id: dbCustomer.id } })
    ).rejects.toEqual(new TRPCError({ code: 'NOT_FOUND' }));
  });
});
