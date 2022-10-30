import type { User } from '@prisma/client';
import { InvoiceStatus } from '@prisma/client';
import type { Session } from 'next-auth';
import { TRPCError } from '@trpc/server';
import { updateInvoice } from '@server/invoices/updateInvoice';
import {
  createTestCompany,
  createTestClient,
  createTestUser,
  createTestInvoice,
  createTestProduct,
} from '../testData';
import prisma from '@server/prisma';

let user: User;
let company: Awaited<ReturnType<typeof createTestCompany>>;
let client: Awaited<ReturnType<typeof createTestClient>>;
let session: Session;

describe('updateInvoice', () => {
  beforeEach(async () => {
    user = await createTestUser();
    company = await createTestCompany(user.id);
    client = await createTestClient(company.id);
    session = { userId: user.id, companyId: company.id, expires: '' };
  });

  it('throws when trying to update a non existing invoice', async () => {
    await expect(
      updateInvoice({
        ctx: { session },
        input: {
          id: 'invalid_invoice',
          date: new Date(),
        },
      })
    ).rejects.toEqual(new TRPCError({ code: 'NOT_FOUND' }));
  });

  it('throws when trying to update an approved invoice', async () => {
    const invoice = await createTestInvoice(
      company.states[0].id,
      client.states[0].id,
      InvoiceStatus.SENT
    );

    await expect(
      updateInvoice({
        ctx: { session },
        input: {
          id: invoice.id,
          date: new Date(),
        },
      })
    ).rejects.toEqual(
      new TRPCError({
        code: 'PRECONDITION_FAILED',
        message: 'Cannot update an approved invoice',
      })
    );
  });

  it('throws when trying to change the invoice client to one that does not exist', async () => {
    const invoice = await createTestInvoice(
      company.states[0].id,
      client.states[0].id
    );

    await expect(
      updateInvoice({
        ctx: { session },
        input: {
          id: invoice.id,
          clientId: 'invalid_client_id',
        },
      })
    ).rejects.toEqual(
      new TRPCError({
        code: 'NOT_FOUND',
      })
    );
  });

  it('updates the invoice', async () => {
    const invoice = await createTestInvoice(
      company.states[0].id,
      client.states[0].id
    );

    const newNumber = 2;
    const updatedInvoice = await updateInvoice({
      ctx: { session },
      input: {
        id: invoice.id,
        number: newNumber,
      },
    });
    const dbInvoice = await prisma.invoice.findUniqueOrThrow({
      where: { id: invoice.id },
    });

    expect(updatedInvoice.number).toEqual(dbInvoice.number);
    expect(updatedInvoice.number).toEqual(newNumber);
  });

  it('changes the client of the invoice', async () => {
    const invoice = await createTestInvoice(
      company.states[0].id,
      client.states[0].id
    );

    const differentClient = await createTestClient(company.id);

    const updatedInvoice = await updateInvoice({
      ctx: { session },
      input: {
        id: invoice.id,
        clientId: differentClient.id,
      },
    });
    const dbInvoice = await prisma.invoice.findUniqueOrThrow({
      where: { id: invoice.id },
    });

    expect(updatedInvoice.client.id).toEqual(differentClient.id);
    expect(dbInvoice.clientStateId).toEqual(differentClient.states[0].id);
  });

  it('updates a line item', async () => {
    const product = await createTestProduct(company.id);
    const invoice = await createTestInvoice(
      company.states[0].id,
      client.states[0].id,
      InvoiceStatus.DRAFT,
      [
        {
          quantity: 1,
          date: new Date(),
          productStateId: product.states[0].id,
        },
      ]
    );

    const updatedItem = {
      productId: product.id,
      quantity: 2,
      date: new Date(),
    };

    const updatedInvoice = await updateInvoice({
      ctx: { session },
      input: {
        id: invoice.id,
        items: [updatedItem],
      },
    });
    const dbInvoice = await prisma.invoice.findUniqueOrThrow({
      where: { id: invoice.id },
      include: {
        items: true,
      },
    });

    expect(updatedInvoice.items[0].quantity).toEqual(updatedItem.quantity);
    expect(dbInvoice.items[0].quantity).toEqual(updatedItem.quantity);
  });

  it('adds a line item', async () => {
    const product1 = await createTestProduct(company.id);
    const product2 = await createTestProduct(company.id);
    const initialItem = {
      quantity: 1,
      date: new Date(),
      productStateId: product1.states[0].id,
    };
    const invoice = await createTestInvoice(
      company.states[0].id,
      client.states[0].id,
      InvoiceStatus.DRAFT,
      [initialItem]
    );

    const newItem = {
      productId: product2.id,
      quantity: 2,
      date: new Date(),
    };

    const updatedInvoice = await updateInvoice({
      ctx: { session },
      input: {
        id: invoice.id,
        items: [{ productId: product1.id, quantity: 1 }, newItem],
      },
    });
    const dbInvoice = await prisma.invoice.findUniqueOrThrow({
      where: { id: invoice.id },
      include: {
        items: true,
      },
    });

    expect(updatedInvoice.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          product: expect.objectContaining({
            id: product1.id,
          }),
        }),
        expect.objectContaining({
          product: expect.objectContaining({
            id: product2.id,
          }),
        }),
      ])
    );

    expect(dbInvoice.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          productStateId: product1.states[0].id,
        }),
        expect.objectContaining({
          productStateId: product2.states[0].id,
        }),
      ])
    );
  });

  it('removes a line item', async () => {
    const product = await createTestProduct(company.id);
    const invoice = await createTestInvoice(
      company.states[0].id,
      client.states[0].id,
      InvoiceStatus.DRAFT,
      [
        {
          quantity: 1,
          date: new Date(),
          productStateId: product.states[0].id,
        },
      ]
    );

    const updatedInvoice = await updateInvoice({
      ctx: { session },
      input: {
        id: invoice.id,
        items: [],
      },
    });
    const dbInvoice = await prisma.invoice.findUniqueOrThrow({
      where: { id: invoice.id },
      include: {
        items: true,
      },
    });

    expect(updatedInvoice.items).toHaveLength(0);
    expect(dbInvoice.items).toHaveLength(0);
  });
});