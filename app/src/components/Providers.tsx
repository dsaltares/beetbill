import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import type { PropsWithChildren } from 'react';
import { useState } from 'react';

type ProvidersProps = {
  session?: Session;
};

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
          },
        },
      })
  );

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default Providers;