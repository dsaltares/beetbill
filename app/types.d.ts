/* eslint-disable no-var */
import 'next-auth';

type Global = {
  prisma?: PrismaClient;
};

declare global {
  var prisma: PrismaClient | undefined;
}

declare module 'next-auth' {
  export interface Session {
    company: Company;
  }
}
