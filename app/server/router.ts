import hello from './procedures/hello';
import trpc from './trpc';

const router = trpc.router({
  hello,
});

export default router;

export type AppRouter = typeof router;
