import { TRPCError } from '@trpc/server';
import { NotFoundError } from '@prisma/client/runtime';
import { type Procedure, procedure } from '@server/trpc';
import prisma from '@server/prisma';
import { GetInvoiceInput, GetInvoiceOutput } from './types';
import mapInvoiceEntity from './mapInvoiceEntity';

export const getInvoice: Procedure<GetInvoiceInput, GetInvoiceOutput> = async ({
  ctx: { session },
  input: { id },
}) => {
  try {
    const invoice = await prisma.invoice.findFirstOrThrow({
      where: {
        id,
        deletedAt: null,
        companyState: { companyId: session?.companyId as string },
      },
      orderBy: { createdAt: 'desc' },
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
  } catch (e) {
    if (e instanceof NotFoundError) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }
    throw e;
  }
};

export default procedure
  .input(GetInvoiceInput)
  .output(GetInvoiceOutput)
  .query(getInvoice);
