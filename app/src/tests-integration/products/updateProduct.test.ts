import type { User } from '@prisma/client';
import type { Session } from 'next-auth';
import { TRPCError } from '@trpc/server';
import omit from 'lodash.omit';
import { updateProduct } from '@server/products/updateProduct';
import {
  createTestCompany,
  createTestClient,
  createTestProduct,
  createTestUser,
} from '../testData';
import prisma from '@server/prisma';

let user: User;
let company: Awaited<ReturnType<typeof createTestCompany>>;
let session: Session;

describe('updateProduct', () => {
  beforeEach(async () => {
    user = await createTestUser();
    company = await createTestCompany(user.id);
    session = { userId: user.id, companyId: company.id, expires: '' };
  });

  it('throws when trying to update a non existing product', async () => {
    await expect(
      updateProduct({
        ctx: { session },
        input: {
          id: 'invalid_product',
          name: 'Test Product',
        },
      })
    ).rejects.toEqual(new TRPCError({ code: 'NOT_FOUND' }));
  });

  it('throws when trying to update an invoice product of a non draft invoice', async () => {
    const [client, product] = await Promise.all([
      createTestClient(company.id),
      createTestProduct(company.id),
    ]);
    await prisma.invoice.create({
      data: {
        number: 1,
        status: 'SENT',
        clientStateId: client.states[0].id,
        companyStateId: company.states[0].id,
        items: {
          create: {
            productStateId: product.states[0].id,
          },
        },
      },
    });
    await expect(
      updateProduct({
        ctx: { session },
        input: {
          id: product.id,
          name: 'New Product Name',
        },
      })
    ).rejects.toThrowError();
  });

  it('updates the product', async () => {
    const product = await createTestProduct(company.id);
    const newName = 'Updated Product';
    const updatedProduct = await updateProduct({
      ctx: { session },
      input: {
        id: product.id,
        name: newName,
      },
    });
    const dbProduct = await prisma.product.findUnique({
      where: { id: product.id },
    });

    expect(updatedProduct.name).toEqual(newName);
    expect(updatedProduct).toMatchObject(
      omit(dbProduct, 'id', 'createdAt', 'updatedAt')
    );
  });
});
