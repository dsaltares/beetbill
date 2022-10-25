import type { User } from '@prisma/client';
import type { Session } from 'next-auth';
import { TRPCError } from '@trpc/server';
import prisma from '@server/prisma';
import {
  createTestCompany,
  createTestUser,
  createTestProduct,
  createTestClient,
} from '../testData';
import { deleteProduct } from '@server/products/deleteProduct';

let user: User;
let company: Awaited<ReturnType<typeof createTestCompany>>;
let session: Session;

describe('deleteProduct', () => {
  beforeEach(async () => {
    user = await createTestUser();
    company = await createTestCompany(user.id);
    session = { userId: user.id, companyId: company.id, expires: '' };
  });

  it('does nothing when the product does not exist', async () => {
    const productDoesNotExistId = 'invalid_product';
    const id = await deleteProduct({
      ctx: { session },
      input: { id: productDoesNotExistId },
    });
    expect(id).toEqual(productDoesNotExistId);
  });

  it('throws when the product has a non draft invoice', async () => {
    const [product, client] = await Promise.all([
      createTestProduct(company.id),
      createTestClient(company.id),
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
      deleteProduct({ ctx: { session }, input: { id: product.id } })
    ).rejects.toEqual(
      new TRPCError({
        code: 'PRECONDITION_FAILED',
        message: 'Product is associated to an approved invoice',
      })
    );
  });

  it('soft deletes the product', async () => {
    const product = await createTestProduct(company.id);
    const id = await deleteProduct({
      ctx: { session },
      input: { id: product.id },
    });
    const dbProduct = await prisma.product.findUnique({
      where: { id: product.id },
    });
    expect(id).toEqual(product.id);
    expect(dbProduct?.deletedAt).not.toEqual(null);
  });
});
