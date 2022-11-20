import { type Procedure, procedure } from '@server/trpc';
import prisma from '@server/prisma';
import { getInvoices } from '@server/invoices/getInvoices';
import type { Invoice } from '@server/invoices/types';
import { GetClientsOutput } from './types';
import mapClientEntity from './mapClientEntity';

export const getClients: Procedure<unknown, GetClientsOutput> = async ({
  ctx,
}) => {
  const clients = await prisma.client.findMany({
    where: {
      companyId: ctx.session?.companyId,
      deletedAt: null,
    },
    include: {
      states: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });
  const invoices = await getInvoices({ ctx, input: {} });
  const invoicesByClientId = invoices.reduce(
    (acc, invoice) => ({
      ...acc,
      [invoice.client.id]: [...(acc[invoice.client.id] || []), invoice],
    }),
    {} as Record<string, Invoice[]>
  );
  return clients.map((client) =>
    mapClientEntity(client, invoicesByClientId[client.id] || [])
  );
};

export default procedure.output(GetClientsOutput).query(getClients);
