import 'next-auth';

type Global = {
  prisma?: PrismaClient;
};

declare module 'next-auth' {
  export interface Session {
    company: Company;
  }
}
