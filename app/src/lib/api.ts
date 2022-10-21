import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@server/router';

const getBaseUrl = (): string => {
  // eslint-disable-next-line no-console
  console.log('process.env.VERCEL_URL', process.env.VERCEL_URL);
  // eslint-disable-next-line no-console
  console.log('process.env.NEXTAUTH_URL', process.env.NEXTAUTH_URL);
  // eslint-disable-next-line no-console
  console.log('all env variables', JSON.stringify(process.env, null, 2));
  // eslint-disable-next-line no-console
  console.log(
    'process.env.NEXT_PUBLIC_VERCEL_URL',
    process.env.NEXT_PUBLIC_VERCEL_URL
  );
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  if (process.env.RENDER_INTERNAL_HOSTNAME) {
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
  }

  return `http://localhost:${process.env.PORT ?? 3000}`;
};

const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      maxURLLength: 2083,
    }),
  ],
});

export default client;
