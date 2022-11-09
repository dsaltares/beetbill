import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useRef } from 'react';
import Logo from '@components/Logo';
import SidebarButton from './SidebarButton';

type MobileSidebarOpenControlsProps = {
  onOpenSidebar: () => void;
};

const MobileSidebarOpenControls = ({
  onOpenSidebar,
}: MobileSidebarOpenControlsProps) => {
  const stickyRef = useRef<HTMLDivElement>(null);
  return (
    <>
      <div
        ref={stickyRef}
        className="fixed top-0 z-10 flex w-full p-4 items-center justify-between lg:hidden bg-violet-50"
      >
        <SidebarButton
          label="open menu"
          icon={faBars}
          onClick={onOpenSidebar}
        />
        <Logo size="sm" />
      </div>
      <div
        className="flex w-full flex-shrink-0 lg:hidden"
        style={{
          height: stickyRef.current
            ? `${stickyRef.current.offsetHeight}px`
            : '0px',
        }}
      />
    </>
  );
};

export default MobileSidebarOpenControls;
