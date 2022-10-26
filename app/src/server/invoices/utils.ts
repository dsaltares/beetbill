import prisma from '@server/prisma';

type GetLastInvoiceNumberArgs = {
  companyId: string;
  prefix?: string;
};

export const getLastInvoiceNumber = async ({
  companyId,
  prefix,
}: GetLastInvoiceNumberArgs) => {
  const aggregate = await prisma.invoice.aggregate({
    where: {
      companyState: {
        companyId,
      },
      prefix,
      deletedAt: null,
    },
    _max: {
      number: true,
    },
  });

  return aggregate._max.number || 0;
};
