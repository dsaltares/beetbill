import type { Company, User } from '@prisma/client';
import type { Session } from 'next-auth';
import cuid from 'cuid';
import prisma from '@server/prisma';
import { createTestCompany, createTestUser } from '../testData';
import { createCustomer } from '@server/customers/createCustomer';

let user: User;
let company: Company;
let session: Session;

describe('createCustomer', () => {
  beforeEach(async () => {
    user = await createTestUser();
    company = await createTestCompany(user.id);
    session = { userId: user.id, companyId: company.id, expires: '' };
  });

  it('creates a customer for the company in the session', async () => {
    const input = {
      name: 'Test Customer',
      number: cuid(),
    };
    const result = await createCustomer({
      ctx: { session },
      input,
    });
    const dbCustomer = await prisma.customer.findUnique({
      where: { id: result.id },
    });
    expect(result).toMatchObject(input);
    expect(result).toEqual(dbCustomer);
  });

  it('throws when the company does not exist', async () => {
    await expect(
      createCustomer({
        ctx: { session: { ...session, companyId: 'invalid_company' } },
        input: {
          name: 'Test Customer',
          number: cuid(),
        },
      })
    ).rejects.toThrow();
  });
});
