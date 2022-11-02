import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TRPCError } from '@trpc/server';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import type { PropsWithChildren } from 'react';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';

type ProvidersProps = {
  session?: Session;
};

const RetriableErrors = new Set([
  'INTERNAL_SERVER_ERROR',
  'TIMEOUT',
  'CONFLICT',
  'TOO_MANY_REQUESTS',
  'CLIENT_CLOSED_REQUEST',
]);

const Providers = ({
  session,
  children,
}: PropsWithChildren<ProvidersProps>) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1 * 60 * 1000, // 1 minute
            cacheTime: 12 * 60 * 60 * 1000, // 12 hours
            refetchOnWindowFocus: true,
            refetchOnReconnect: 'always',
            refetchOnMount: true,
            keepPreviousData: true,
            retry: (_count, error) => {
              if (error instanceof TRPCError) {
                return RetriableErrors.has(error.code);
              }
              return false;
            },
          },
        },
      })
  );

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
        <Toaster position="bottom-center" />
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default Providers;
