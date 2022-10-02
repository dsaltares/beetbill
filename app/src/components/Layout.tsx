import type { PropsWithChildren } from 'react';
import useDisclosure from '@lib/useDisclosure';
import Sidebar from './Sidebar/Sidebar';
import MobileSidebarOpenControls from './Sidebar/MobileSidebarOpenControls';

const Layout = ({ children }: PropsWithChildren) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <div className="flex flex-row min-h-screen w-full">
      <Sidebar isOpen={isOpen} onClose={onClose} />
      <main className="flex flex-col w-full min-h-screen p-4">
        <MobileSidebarOpenControls onOpenSidebar={onOpen} />
        {children}
      </main>
    </div>
  );
};

export default Layout;
