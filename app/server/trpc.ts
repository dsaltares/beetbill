import { initTRPC, TRPCError } from '@trpc/server';
import type { Context } from './createContext';

interface Meta {
  withoutAuth: boolean;
  [key: string]: unknown;
}

const trpc = initTRPC<{ ctx: Context; meta: Meta }>()();

const isAuthed = trpc.middleware(async ({ meta, next, ctx }) => {
  if (!meta?.withoutAuth && !ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx });
});

export const procedure = trpc.procedure.use(isAuthed);

export default trpc;
