import type { User } from '@prisma/client';
import { InvoiceStatus } from '@prisma/client';
import type { Session } from 'next-auth';
import { TRPCError } from '@trpc/server';
import cuid from 'cuid';
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
          date: new Date().toISOString(),
        },
      })
    ).rejects.toEqual(
      new TRPCError({
        code: 'NOT_FOUND',
        message: 'The invoice does not exist.',
      })
    );
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
          date: new Date().toISOString(),
        },
      })
    ).rejects.toEqual(
      new TRPCError({
        code: 'PRECONDITION_FAILED',
        message: 'Appoved invoices cannot be updated.',
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
        message: 'The client does not exist.',
      })
    );
  });

  it('updates the invoice', async () => {
    const invoice = await createTestInvoice(
      company.states[0].id,
      client.states[0].id
    );

    const newPrefix = '2022';
    const newMessage = 'New message';
    const updatedInvoice = await updateInvoice({
      ctx: { session },
      input: {
        id: invoice.id,
        prefix: newPrefix,
        message: newMessage,
      },
    });
    const dbInvoice = await prisma.invoice.findUniqueOrThrow({
      where: { id: invoice.id },
    });

    expect(updatedInvoice.prefix).toEqual(dbInvoice.prefix);
    expect(updatedInvoice.prefix).toEqual(newPrefix);
    expect(updatedInvoice.message).toEqual(dbInvoice.message);
    expect(updatedInvoice.message).toEqual(newMessage);
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
      date: new Date().toISOString(),
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
      date: new Date().toISOString(),
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

  it('adds a line item with the same product', async () => {
    const product = await createTestProduct(company.id);
    const initialItem = {
      quantity: 1,
      date: new Date(),
      productStateId: product.states[0].id,
    };
    const invoice = await createTestInvoice(
      company.states[0].id,
      client.states[0].id,
      InvoiceStatus.DRAFT,
      [initialItem]
    );

    const newItem = {
      productId: product.id,
      quantity: 2,
      date: new Date().toISOString(),
    };

    const updatedInvoice = await updateInvoice({
      ctx: { session },
      input: {
        id: invoice.id,
        items: [{ productId: product.id, quantity: 1 }, newItem],
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
            id: product.id,
          }),
          quantity: initialItem.quantity,
        }),
        expect.objectContaining({
          product: expect.objectContaining({
            id: product.id,
          }),
          quantity: newItem.quantity,
        }),
      ])
    );

    expect(dbInvoice.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          productStateId: product.states[0].id,
        }),
        expect.objectContaining({
          productStateId: product.states[0].id,
        }),
      ])
    );
  });

  it('throws when trying to add a line item with a different currency', async () => {
    const product1 = await createTestProduct(company.id, 'EUR');
    const product2 = await createTestProduct(company.id, 'USD');
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
      date: new Date().toISOString(),
    };

    await expect(
      updateInvoice({
        ctx: { session },
        input: {
          id: invoice.id,
          items: [{ productId: product1.id, quantity: 1 }, newItem],
        },
      })
    ).rejects.toEqual(
      new TRPCError({
        code: 'PRECONDITION_FAILED',
        message: 'All products within an invoice must have the same currency',
      })
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

  it('approves the invoice and automatically chooses the right number', async () => {
    const prefix = cuid();
    const firstInvoice = await createTestInvoice(
      company.states[0].id,
      client.states[0].id,
      InvoiceStatus.SENT,
      [],
      prefix,
      1
    );

    const secondInvoice = await createTestInvoice(
      company.states[0].id,
      client.states[0].id,
      InvoiceStatus.DRAFT,
      [],
      prefix
    );

    const updatedInvoice = await updateInvoice({
      ctx: { session },
      input: {
        id: secondInvoice.id,
        status: InvoiceStatus.SENT,
      },
    });
    const dbInvoice = await prisma.invoice.findUniqueOrThrow({
      where: { id: secondInvoice.id },
    });

    expect(updatedInvoice.number).toEqual(firstInvoice.number! + 1);
    expect(updatedInvoice.number).toEqual(dbInvoice.number);
  });

  it('marks an invoice as paid', async () => {
    const invoice = await createTestInvoice(
      company.states[0].id,
      client.states[0].id,
      InvoiceStatus.SENT
    );

    const newStatus = InvoiceStatus.PAID;
    const updatedInvoice = await updateInvoice({
      ctx: { session },
      input: {
        id: invoice.id,
        status: newStatus,
      },
    });
    const dbInvoice = await prisma.invoice.findUniqueOrThrow({
      where: { id: invoice.id },
    });

    expect(updatedInvoice.status).toEqual(dbInvoice.status);
    expect(updatedInvoice.status).toEqual(newStatus);
  });

  it('throws when trying to mark an invoice as draft when it is approved', async () => {
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
          status: InvoiceStatus.DRAFT,
        },
      })
    ).rejects.toEqual(
      new TRPCError({
        code: 'PRECONDITION_FAILED',
        message: 'Appoved invoices cannot be updated.',
      })
    );
  });
});
