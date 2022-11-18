import { createTRPCProxyClient, httpBatchLink, httpLink } from '@trpc/client';
import type { AppRouter } from '@server/router';

export const getBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  if (process.env.RENDER_INTERNAL_HOSTNAME) {
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
  }

  return `http://localhost:${process.env.PORT ?? 3000}`;
};

const baseUrl = getBaseUrl();

const client = createTRPCProxyClient<AppRouter>({
  links: [
    process.env.TEST_ENVIRONMENT === 'true'
      ? httpLink({
          url: `${baseUrl}/api/trpc`,
        })
      : httpBatchLink({
          url: `${baseUrl}/api/trpc`,
          maxURLLength: 2083,
        }),
  ],
});

export default client;
