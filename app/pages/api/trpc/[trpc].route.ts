import { createNextApiHandler } from '@trpc/server/adapters/next';
import router from '@server/router';
import createContext from 'server/createContext';

export default createNextApiHandler({
  router,
  createContext,
  batching: { enabled: true },
});
