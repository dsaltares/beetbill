/* eslint-disable import/export */
import React, { type ReactNode } from 'react';
import { render } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';

const customRender = (
  ui: React.ReactElement,
  providerData: ProviderData = {}
) => render(ui, { wrapper: createProviders(providerData) });

type ProviderData = {
  session?: Session;
};

type NewType = ReactNode;

type ChildrenProps = {
  children?: NewType;
};

const createProviders = ({ session }: ProviderData) => {
  const Providers = ({ children }: ChildrenProps) => (
    <SessionProvider session={session}>{children}</SessionProvider>
  );

  return Providers;
};

export * from '@testing-library/react';

export { customRender as render };
