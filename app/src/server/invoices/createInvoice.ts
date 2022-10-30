import { TRPCError } from '@trpc/server';
import { type Procedure, procedure } from '@server/trpc';
import prisma from '@server/prisma';
import type { ArrayElement } from '@lib/utilityTypes';
import { CreateInvoiceOutput, CreateInvoiceInput } from './types';
import mapInvoiceEntity from './mapInvoiceEntity';
import { getLastInvoiceNumber } from './utils';

export const createInvoice: Procedure<
  CreateInvoiceInput,
  CreateInvoiceOutput
> = async ({
  ctx: { session },
  input: { clientId, status, prefix, number, date, items },
}) => {
  const [client, company] = await Promise.all([
    prisma.client.findFirst({
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
    }),
    prisma.company.findFirst({
      where: {
        id: session?.companyId as string,
      },
      include: {
        states: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    }),
  ]);

  if (!client || !company) {
    throw new TRPCError({ code: 'NOT_FOUND' });
  }

  const invoice = await prisma.invoice.create({
    data: {
      status,
      prefix,
      number:
        number ||
        (await getLastInvoiceNumber({ companyId: company.id, prefix })) + 1,
      date,
      companyStateId: company.states[0].id,
      clientStateId: client.states[0].id,
      items: {
        createMany: {
          data: await buildItemsData(items),
        },
      },
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

  return mapInvoiceEntity(invoice);
};

const buildItemsData = async (items: CreateInvoiceInput['items'] = []) => {
  const products = await prisma.product.findMany({
    where: {
      id: { in: items.map(({ productId }) => productId) },
    },
    include: {
      states: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });

  const productsById = products.reduce(
    (acc, product) => ({
      ...acc,
      [product.id]: product,
    }),
    {} as Record<string, ArrayElement<typeof products>>
  );

  return items.map(({ productId, quantity, date }) => {
    const product = productsById[productId];
    if (!product) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }

    return {
      productStateId: product.states[0].id,
      quantity,
      date,
    };
  });
};

export default procedure
  .input(CreateInvoiceInput)
  .output(CreateInvoiceOutput)
  .mutation(createInvoice);
