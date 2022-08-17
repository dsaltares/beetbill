import { createTRPCClient } from '@trpc/client';
import type { AppRouter } from '@pages/api/trpc/[trpc].route';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return '';
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.RENDER_INTERNAL_HOSTNAME) {
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
  }

  return `http://localhost:${process.env.PORT ?? 3000}`;
};

const client = createTRPCClient<AppRouter>({
  url: `${getBaseUrl()}/api/trpc`,
});

export default client;
