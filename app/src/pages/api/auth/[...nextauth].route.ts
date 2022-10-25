import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import prisma from '@server/prisma';

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  secret: process.env.NEXT_AUTH_SECRET,
  callbacks: {
    session: async ({ session, user }) => {
      const company = await prisma.company.findUnique({
        where: { userId: user.id },
      });
      session.userId = user.id;
      session.companyId = company?.id as string;
      return session;
    },
  },
  events: {
    createUser: async ({ user }) => {
      await prisma.company.create({
        data: {
          userId: user.id,
          states: {
            create: {
              name: '',
              number: '',
              vatNumber: '',
              email: '',
              website: '',
              country: '',
              address: '',
              postCode: '',
              city: '',
              iban: '',
            },
          },
        },
      });
    },
  },
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify',
    error: '/auth/error',
  },
});
