import { faXmark } from '@fortawesome/free-solid-svg-icons';
import IconButton from '@components/IconButton';
import Logo from '../Logo';
import NavLinks from './NavLinks';
import UserMenu from './UserMenu';

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Sidebar = ({ onClose }: SidebarProps) => (
  <aside className="flex flex-col justify-between p-4 w-full h-full md:w-[242px] bg-violet-900 gap-10">
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <div className="block md:hidden">
          <IconButton
            variant="secondary"
            label="close menu"
            icon={faXmark}
            onClick={onClose}
          />
        </div>
        <Logo variant="secondary" />
      </div>
      <NavLinks />
    </div>
    <UserMenu />
  </aside>
);

export default Sidebar;
