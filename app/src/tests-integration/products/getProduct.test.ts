import type { User } from '@prisma/client';
import type { Session } from 'next-auth';
import { TRPCError } from '@trpc/server';
import omit from 'lodash.omit';
import { getProduct } from '@server/products/getProduct';
import {
  createTestCompany,
  createTestProduct,
  createTestUser,
} from '../testData';

let user1: User;
let user2: User;
let company1: Awaited<ReturnType<typeof createTestCompany>>;
let company2: Awaited<ReturnType<typeof createTestCompany>>;
let session: Session;

describe('getProduct', () => {
  beforeEach(async () => {
    [user1, user2] = await Promise.all([createTestUser(), createTestUser()]);
    [company1, company2] = await Promise.all([
      createTestCompany(user1.id),
      createTestCompany(user2.id),
    ]);
    session = { userId: user1.id, companyId: company1.id, expires: '' };
  });

  it('returns the product', async () => {
    const dbProduct = await createTestProduct(company1.id);

    const product = await getProduct({
      ctx: { session },
      input: { id: dbProduct.id },
    });
    expect(product).toMatchObject(omit(dbProduct.states[0], 'id', 'createdAt'));
  });

  it('throws a NOT_FOUND error when the product does not exist', async () => {
    await expect(
      getProduct({ ctx: { session }, input: { id: 'invalid' } })
    ).rejects.toEqual(
      new TRPCError({
        code: 'NOT_FOUND',
        message: 'The product does not exist.',
      })
    );
  });

  it('throws a NOT_FOUND error when the product belongs to a different user', async () => {
    const dbProduct = await createTestProduct(company2.id);

    await expect(
      getProduct({ ctx: { session }, input: { id: dbProduct.id } })
    ).rejects.toEqual(
      new TRPCError({
        code: 'NOT_FOUND',
        message: 'The product does not exist.',
      })
    );
  });
});
