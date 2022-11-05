import { faBars } from '@fortawesome/free-solid-svg-icons';
import Logo from '@components/Logo';
import SidebarButton from './SidebarButton';

type MobileSidebarOpenControlsProps = {
  onOpenSidebar: () => void;
};

const MobileSidebarOpenControls = ({
  onOpenSidebar,
}: MobileSidebarOpenControlsProps) => (
  <div className="flex items-center justify-between pb-4 lg:hidden">
    <SidebarButton label="open menu" icon={faBars} onClick={onOpenSidebar} />
    <Logo variant="primary" />
  </div>
);

export default MobileSidebarOpenControls;
