import type { Company, User } from '@prisma/client';
import type { Session } from 'next-auth';
import { getProducts } from '@server/products/getProducts';
import {
  createTestCompany,
  createTestProduct,
  createTestUser,
} from '../testData';

let user1: User;
let user2: User;
let company1: Company;
let company2: Company;
let session: Session;

describe('getProducts', () => {
  beforeEach(async () => {
    [user1, user2] = await Promise.all([createTestUser(), createTestUser()]);
    [company1, company2] = await Promise.all([
      createTestCompany(user1.id),
      createTestCompany(user2.id),
    ]);
    session = { userId: user1.id, companyId: company1.id, expires: '' };
  });

  it('returns an empty array when there are no products', async () => {
    await createTestProduct(company2.id);

    const products = await getProducts({ ctx: { session }, input: {} });
    expect(products).toEqual([]);
  });

  it('returns the products for the company in the session', async () => {
    await createTestProduct(company2.id);
    const product1 = await createTestProduct(company1.id);
    const product2 = await createTestProduct(company1.id);

    const products = await getProducts({ ctx: { session }, input: {} });
    expect(products).toEqual([product1, product2]);
  });
});
