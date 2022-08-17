import * as trpcNext from '@trpc/server/adapters/next';
import { z } from 'zod';
import createRouter from 'server/createRouter';
import createContext from 'server/context';

export const appRouter = createRouter().query('hello', {
  input: z
    .object({
      text: z.string().nullish(),
    })
    .nullish(),
  output: z.string(),
  resolve({ ctx, input }) {
    return `hello ${input?.text ?? 'world'} - ${
      ctx.session?.user?.email ?? 'anonymous'
    }`;
  },
});

export type AppRouter = typeof appRouter;

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
  batching: { enabled: true },
});
