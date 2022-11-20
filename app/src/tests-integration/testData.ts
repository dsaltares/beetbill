import cuid from 'cuid';
import type { InvoiceStatus } from '@prisma/client';
import prisma from '@server/prisma';

export const createTestUser = () =>
  prisma.user.create({
    data: { name: 'Ada Lovelace', email: `ada.${cuid()}@company.com` },
  });

export const createTestCompany = (userId: string) =>
  prisma.company.create({
    data: {
      userId,
      states: {
        create: {
          name: 'Lovelace LLC',
          number: cuid(),
        },
      },
    },
    include: { states: true },
  });

export const createTestClient = (companyId: string) =>
  prisma.client.create({
    data: {
      companyId,
      states: { create: { name: 'Test client', number: cuid() } },
    },
    include: { states: true },
  });

export const createTestProduct = (
  companyId: string,
  currency?: string,
  price?: number
) =>
  prisma.product.create({
    data: {
      companyId,
      states: {
        create: {
          name: 'Test product',
          currency,
          price,
        },
      },
    },
    include: { states: true },
  });

export const createTestInvoice = (
  companyStateId: string,
  clientStateId: string,
  status?: InvoiceStatus,
  items: {
    quantity: number;
    date: Date;
    productStateId: string;
  }[] = [],
  prefix?: string,
  number?: number
) =>
  prisma.invoice.create({
    data: {
      prefix: prefix || cuid(),
      number,
      status: status || 'DRAFT',
      companyStateId,
      clientStateId,
      items: {
        create: items,
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
