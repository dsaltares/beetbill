import { TRPCError } from '@trpc/server';
import { InvoiceStatus } from '@prisma/client';
import omit from 'lodash.omit';
import { type Procedure, procedure } from '@server/trpc';
import prisma from '@server/prisma';
import type { ArrayElement } from '@lib/utilityTypes';
import { UpdateInvoiceOutput, UpdateInvoiceInput } from './types';
import mapInvoiceEntity from './mapInvoiceEntity';
import { getLastInvoiceNumber } from './utils';

export const updateInvoice: Procedure<
  UpdateInvoiceInput,
  UpdateInvoiceOutput
> = async ({ ctx: { session }, input }) => {
  const { id, clientId, status, prefix, date, message, items } = input;
  const companyId = session?.companyId as string;
  const existingInvoice = await prisma.invoice.findFirst({
    where: {
      id,
      deletedAt: null,
      companyState: { companyId },
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
  if (!canUpdateInvice(existingInvoice.status, input)) {
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

  if (items) {
    const itemProductIds = Array.from(
      new Set(items.map(({ productId }) => productId))
    );
    const dbProducts = await prisma.product.findMany({
      where: {
        id: { in: itemProductIds },
      },
      include: {
        states: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    const currency = existingInvoice.items.length
      ? existingInvoice.items[0].productState.currency
      : undefined;
    const hasDifferentCurrency =
      !!currency &&
      dbProducts.some((product) => product.states[0].currency !== currency);

    if (hasDifferentCurrency) {
      throw new TRPCError({
        code: 'PRECONDITION_FAILED',
        message: 'All products within an invoice must have the same currency',
      });
    }

    await prisma.lineItem.deleteMany({
      where: { id: { in: existingInvoice.items.map(({ id }) => id) } },
    });

    const dbProductsById = dbProducts.reduce(
      (acc, product) => ({
        ...acc,
        [product.id]: product,
      }),
      {} as Record<string, ArrayElement<typeof dbProducts>>
    );
    await prisma.lineItem.createMany({
      data: items.map(({ productId, quantity, date }) => {
        const product = dbProductsById[productId];
        if (!product) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `Product not found, id: ${productId}`,
          });
        }
        return {
          productStateId: product.states[0].id,
          invoiceId: id,
          quantity,
          date,
        };
      }),
    });
  }

  const isApproving =
    existingInvoice.status === InvoiceStatus.DRAFT &&
    !!status &&
    status !== InvoiceStatus.DRAFT;
  let number: number | undefined;
  if (isApproving) {
    number = (await getLastInvoiceNumber({ companyId, prefix })) + 1;
  }
  const updatedInvoice = await prisma.invoice.update({
    where: { id },
    data: {
      number,
      status,
      prefix,
      date,
      message,
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

const canUpdateInvice = (status: InvoiceStatus, input: UpdateInvoiceInput) => {
  if (status === 'DRAFT') {
    return true;
  }
  if (input.status === 'DRAFT') {
    return false;
  }

  return Object.values(omit(input, ['id', 'status'])).every(
    (value) => value === undefined
  );
};

export default procedure
  .input(UpdateInvoiceInput)
  .output(UpdateInvoiceOutput)
  .mutation(updateInvoice);
