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
