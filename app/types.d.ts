/* eslint-disable no-var */
import 'next-auth';
import type { PrismaClient, Company, User } from '@prisma/client';

declare global {
  var _prisma: PrismaClient | undefined;
}

declare module 'next-auth' {
  export interface Session {
    userId: User['id'];
    companyId: Company['id'];
  }
}
