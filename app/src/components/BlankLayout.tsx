import type { PropsWithChildren } from 'react';

const BlankLayout = ({ children }: PropsWithChildren) => (
  <main className="flex w-full h-screen items-end md:items-center justify-center bg-violet-50">
    {children}
  </main>
);

export default BlankLayout;
