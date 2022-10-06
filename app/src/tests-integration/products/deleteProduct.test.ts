import type { Company, User } from '@prisma/client';
import type { Session } from 'next-auth';
import { TRPCError } from '@trpc/server';
import prisma from '@server/prisma';
import {
  createTestCompany,
  createTestUser,
  createTestProduct,
  createTestCustomer,
} from '../testData';
import { deleteProduct } from '@server/products/deleteProduct';

let user: User;
let company: Company;
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
    const [productWithInvoice, customer] = await Promise.all([
      createTestProduct(company.id),
      createTestCustomer(company.id),
    ]);
    const invoice = await prisma.invoice.create({
      data: {
        number: 1,
        customerId: customer.id,
        companyId: company.id,
        status: 'SENT',
      },
    });
    await prisma.invoiceProduct.create({
      data: { invoiceId: invoice.id, productId: productWithInvoice.id },
    });

    await expect(
      deleteProduct({ ctx: { session }, input: { id: productWithInvoice.id } })
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
