import type { PropsWithChildren } from 'react';

const BlankLayout = ({ children }: PropsWithChildren) => (
  <main className="flex w-full h-full items-end lg:items-center justify-center bg-violet-50">
    {children}
  </main>
);

export default BlankLayout;
