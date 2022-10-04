/* eslint-disable no-console */
/* eslint-disable import/export */
import React, { useState, type PropsWithChildren } from 'react';
import { render } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import type { NextRouter } from 'next/router';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import type { Session } from 'next-auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const customRender = (
  ui: React.ReactElement,
  providerData: ProviderData = {}
) => render(ui, { wrapper: createProviders(providerData) });

type ProviderData = {
  session?: Session;
  router?: Partial<NextRouter>;
};

const createProviders = ({ session, router }: ProviderData) => {
  const Providers = ({ children }: PropsWithChildren) => {
    const [queryClient] = useState(
      () =>
        new QueryClient({
          defaultOptions: {
            queries: {
              retry: false,
            },
          },
          logger: {
            log: console.log,
            warn: console.warn,
            error: () => {},
          },
        })
    );
    return (
      <RouterContext.Provider value={{ ...mockRouter, ...(router || {}) }}>
        <QueryClientProvider client={queryClient}>
          <SessionProvider session={session}>{children}</SessionProvider>
          {children}
        </QueryClientProvider>
      </RouterContext.Provider>
    );
  };

  return Providers;
};

export const mockRouter: NextRouter = {
  basePath: '',
  pathname: '/',
  route: '/',
  query: {},
  asPath: '/',
  back: jest.fn(),
  beforePopState: jest.fn(),
  prefetch: () => Promise.resolve(),
  push: jest.fn(),
  reload: jest.fn(),
  replace: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
  isLocaleDomain: false,
  isReady: true,
  defaultLocale: 'en',
  domainLocales: [],
  isPreview: false,
};

export * from '@testing-library/react';

export { customRender as render };
