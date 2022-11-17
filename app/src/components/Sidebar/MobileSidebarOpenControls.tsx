import { faBars } from '@fortawesome/free-solid-svg-icons';
import Logo from '@components/Logo';
import useSticky from '@lib/useSticky';
import SidebarButton from './SidebarButton';

type MobileSidebarOpenControlsProps = {
  onOpenSidebar: () => void;
};

const MobileSidebarOpenControls = ({
  onOpenSidebar,
}: MobileSidebarOpenControlsProps) => {
  const { ref, height } = useSticky();
  return (
    <>
      <div
        ref={ref}
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
          height: `${height}px`,
        }}
      />
    </>
  );
};

export default MobileSidebarOpenControls;
