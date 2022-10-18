import type { PropsWithChildren } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Spinner from '@components/Spinner';
import BlankLayout from './BlankLayout';
import SidebarLayout from './SidebarLayout';

const BlankLayoutPaths = ['/auth'];

const Layout = ({ children }: PropsWithChildren) => {
  const { status } = useSession();
  const { pathname } = useRouter();

  if (status === 'loading') {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const hasBlankLayout =
    status === 'unauthenticated' ||
    BlankLayoutPaths.some((path) => pathname.startsWith(path));

  return hasBlankLayout ? (
    <BlankLayout>{children}</BlankLayout>
  ) : (
    <SidebarLayout>{children}</SidebarLayout>
  );
};

export default Layout;
