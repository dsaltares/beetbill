import { type Procedure, procedure } from '@server/trpc';
import prisma from '@server/prisma';
import { GetInvoicesInput, GetInvoicesOutput } from './types';
import mapInvoiceEntity from './mapInvoiceEntity';

export const getInvoices: Procedure<
  GetInvoicesInput,
  GetInvoicesOutput
> = async ({ ctx: { session } }) => {
  const invoices = await prisma.invoice.findMany({
    where: {
      deletedAt: null,
      companyState: { companyId: session?.companyId as string },
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
        orderBy: { order: 'asc' },
      },
    },
  });
  return invoices.map(mapInvoiceEntity);
};

export default procedure
  .input(GetInvoicesInput)
  .output(GetInvoicesOutput)
  .query(getInvoices);
