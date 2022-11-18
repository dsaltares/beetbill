import type { PropsWithChildren } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import BlankLayout from './BlankLayout';
import SidebarLayout from './SidebarLayout';
import FullScreenSpinner from './FullScreenSpinner';

const BlankLayoutPaths = ['/auth', '/404', '/invoices/[invoiceId]/preview'];

const Layout = ({ children }: PropsWithChildren) => {
  const { status } = useSession();
  const { pathname } = useRouter();

  if (status === 'loading') {
    return <FullScreenSpinner />;
  }

  const hasBlankLayout =
    status === 'unauthenticated' ||
    pathname === '/' ||
    BlankLayoutPaths.some((path) => pathname.startsWith(path));

  return hasBlankLayout ? (
    <BlankLayout>{children}</BlankLayout>
  ) : (
    <SidebarLayout>{children}</SidebarLayout>
  );
};

export default Layout;
