import type { inferAsyncReturnType } from '@trpc/server';
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import type { Session } from 'next-auth';
import { getServerSession } from 'next-auth';
import authOptions from './auth/authOptions';

const createContext = async ({ req, res }: CreateNextContextOptions) => ({
  session: (await getServerSession(req, res, authOptions)) as Session | null,
});

export default createContext;

export type Context = inferAsyncReturnType<typeof createContext>;
