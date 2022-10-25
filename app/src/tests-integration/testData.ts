import cuid from 'cuid';
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

export const createTestProduct = (companyId: string) =>
  prisma.product.create({
    data: {
      companyId,
      states: {
        create: {
          name: 'Test product',
        },
      },
    },
    include: { states: true },
  });
