import { TRPCError } from '@trpc/server';
import { type Procedure, procedure } from '@server/trpc';
import prisma from '@server/prisma';
import { CreateInvoiceOutput, CreateInvoiceInput } from './types';
import mapInvoiceEntity from './mapInvoiceEntity';
import { getLastInvoiceNumber } from './utils';

export const createInvoice: Procedure<
  CreateInvoiceInput,
  CreateInvoiceOutput
> = async ({
  ctx: { session },
  input: { clientId, status, prefix, number, date },
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

export default procedure
  .input(CreateInvoiceInput)
  .output(CreateInvoiceOutput)
  .mutation(createInvoice);
