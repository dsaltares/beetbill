import { type PropsWithChildren, useEffect } from 'react';
import { useRouter } from 'next/router';
import Sidebar, { MobileSidebarOpenControls } from '@components/Sidebar';
import useDisclosure from '@lib/useDisclosure';

const SidebarLayout = ({ children }: PropsWithChildren) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath]);
  return (
    <div className="flex flex-row h-full w-full bg-violet-50">
      <Sidebar isOpen={isOpen} onClose={onClose} />
      <div className="flex flex-col h-full main-content">
        <MobileSidebarOpenControls onOpenSidebar={onOpen} />
        <main className="flex flex-col h-full w-full p-4 lg:p-12">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
