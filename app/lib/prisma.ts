import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!(global as Global).prisma) {
    (global as Global).prisma = new PrismaClient();
  }
  prisma = (global as Global).prisma;
}
export default prisma;

export const isNotFoundError = (e: unknown) =>
  e instanceof PrismaClientKnownRequestError && e.code == 'P2025';
