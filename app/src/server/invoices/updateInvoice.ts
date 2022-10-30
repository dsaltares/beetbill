import { TRPCError } from '@trpc/server';
import type { LineItem, Product, ProductState } from '@prisma/client';
import { InvoiceStatus } from '@prisma/client';
import { type Procedure, procedure } from '@server/trpc';
import prisma from '@server/prisma';
import type { ArrayElement } from '@lib/utilityTypes';
import { UpdateInvoiceOutput, UpdateInvoiceInput } from './types';
import mapInvoiceEntity from './mapInvoiceEntity';

export const updateInvoice: Procedure<
  UpdateInvoiceInput,
  UpdateInvoiceOutput
> = async ({
  ctx: { session },
  input: { id, clientId, number, status, prefix, date, items },
}) => {
  const existingInvoice = await prisma.invoice.findFirst({
    where: {
      id,
      deletedAt: null,
      companyState: { companyId: session?.companyId as string },
    },
    include: {
      items: {
        include: {
          productState: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });
  if (!existingInvoice) {
    throw new TRPCError({ code: 'NOT_FOUND' });
  }
  if (existingInvoice.status !== InvoiceStatus.DRAFT) {
    throw new TRPCError({
      code: 'PRECONDITION_FAILED',
      message: 'Cannot update an approved invoice',
    });
  }
  let clientStateId: string | undefined;
  if (clientId) {
    const client = await prisma.client.findFirst({
      where: {
        id: clientId,
        deletedAt: null,
      },
      include: {
        states: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
    if (!client) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }
    clientStateId = client.states[0].id;
  }

  const diff = await buildItemsDiff(existingInvoice.items, items);
  if (diff.toDelete.length) {
    await prisma.lineItem.deleteMany({
      where: {
        id: {
          in: diff.toDelete,
        },
      },
    });
  }
  if (diff.toCreate.length) {
    await prisma.lineItem.createMany({
      data: diff.toCreate.map((item) => ({ ...item, invoiceId: id })),
    });
  }
  for (const toUpdate of diff.toUpdate) {
    await prisma.lineItem.update({
      where: { id: toUpdate.id },
      data: toUpdate,
    });
  }

  const updatedInvoice = await prisma.invoice.update({
    where: { id },
    data: {
      number,
      status,
      prefix,
      date,
      clientStateId,
    },
    include: {
      companyState: {
        include: {
          company: true,
        },
      },
      clientState: {
        include: {
          client: true,
        },
      },
      items: {
        include: {
          productState: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });
  return mapInvoiceEntity(updatedInvoice);
};

const buildItemsDiff = async (
  existing: (LineItem & {
    productState: ProductState & { product: Product };
  })[],
  input: UpdateInvoiceInput['items'] = []
) => {
  const inputProductSet = new Set(input.map(({ productId }) => productId));
  const dbProducts = await prisma.product.findMany({
    where: {
      id: { in: Array.from(inputProductSet) },
    },
    include: {
      states: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });

  const dbProductsById = dbProducts.reduce(
    (acc, product) => ({
      ...acc,
      [product.id]: product,
    }),
    {} as Record<string, ArrayElement<typeof dbProducts>>
  );

  inputProductSet.forEach((productId) => {
    if (!dbProductsById[productId]) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }
  });

  const toCreate: {
    productStateId: string;
    quantity?: number;
    date?: Date;
  }[] = [];
  const toUpdate: {
    id: string;
    quantity?: number;
    date?: Date;
  }[] = [];
  const toDelete: string[] = [];

  const existingById = existing.reduce(
    (acc, { id, quantity, date, productState: { productId } }) => ({
      ...acc,
      [productId]: { date, quantity, id },
    }),
    {} as { [id: string]: ArrayElement<typeof toUpdate> }
  );
  const inputById = input.reduce((acc, { productId, quantity, date }) => {
    const productStateId = dbProductsById[productId].states[0].id;
    return {
      ...acc,
      [productId]: {
        quantity,
        date,
        productStateId,
      },
    };
  }, {} as { [id: string]: ArrayElement<typeof toCreate> });

  input.forEach(({ productId }) => {
    const item = inputById[productId];
    const existingItem = existingById[productId];
    if (existingItem) {
      toUpdate.push({
        ...existingItem,
        ...item,
      });
    } else {
      toCreate.push(item);
    }
  });
  existing.forEach(({ id, productState: { productId } }) => {
    if (!inputById[productId]) {
      toDelete.push(id);
    }
  });

  return {
    toCreate,
    toUpdate,
    toDelete,
  };
};

export default procedure
  .input(UpdateInvoiceInput)
  .output(UpdateInvoiceOutput)
  .mutation(updateInvoice);
