import mapInvoiceEntity from '@server/invoices/mapInvoiceEntity';
import prisma from '@server/prisma';

export const getInvoicesForClient = async (id: string) => {
  const invoices = await prisma.invoice.findMany({
    where: {
      deletedAt: null,
      clientState: {
        clientId: id,
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
  return invoices.map(mapInvoiceEntity);
};
