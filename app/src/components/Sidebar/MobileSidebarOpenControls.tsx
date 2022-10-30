import { faBars } from '@fortawesome/free-solid-svg-icons';
import IconButton from '@components/IconButton';
import Logo from '@components/Logo';

type MobileSidebarOpenControlsProps = {
  onOpenSidebar: () => void;
};

const MobileSidebarOpenControls = ({
  onOpenSidebar,
}: MobileSidebarOpenControlsProps) => (
  <div className="flex items-center justify-between pb-4 lg:hidden">
    <IconButton label="open menu" icon={faBars} onClick={onOpenSidebar} />
    <Logo variant="primary" />
  </div>
);

export default MobileSidebarOpenControls;
