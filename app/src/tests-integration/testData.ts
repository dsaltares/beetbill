import cuid from 'cuid';
import prisma from '@server/prisma';

export const createTestUser = () =>
  prisma.user.create({
    data: { name: 'Ada Lovelace', email: `ada.${cuid()}@company.com` },
  });

export const createTestCompany = (userId: string) =>
  prisma.company.create({
    data: {
      name: 'Lovelace LLC',
      number: cuid(),
      userId,
    },
  });

export const createTestClient = (companyId: string) =>
  prisma.client.create({
    data: { companyId, name: 'Test client', number: cuid() },
  });

export const createTestProduct = (companyId: string) =>
  prisma.product.create({
    data: {
      companyId,
      name: 'Test product',
    },
  });
