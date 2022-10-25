import type { Company, User } from '@prisma/client';
import type { Session } from 'next-auth';
import prisma from '@server/prisma';
import { createTestCompany, createTestUser } from '../testData';
import { createProduct } from '@server/products/createProduct';

let user: User;
let company: Company;
let session: Session;

describe('createProduct', () => {
  beforeEach(async () => {
    user = await createTestUser();
    company = await createTestCompany(user.id);
    session = { userId: user.id, companyId: company.id, expires: '' };
  });

  it('creates a product for the company in the session', async () => {
    const input = {
      name: 'Test Product',
    };
    const result = await createProduct({
      ctx: { session },
      input,
    });
    const dbClient = await prisma.product.findUnique({
      where: { id: result.id },
    });
    expect(result).toMatchObject(input);
    expect(result).toEqual(dbClient);
  });

  it('throws when the company does not exist', async () => {
    await expect(
      createProduct({
        ctx: { session: { ...session, companyId: 'invalid_company' } },
        input: {
          name: 'Test Product',
        },
      })
    ).rejects.toThrow();
  });
});
