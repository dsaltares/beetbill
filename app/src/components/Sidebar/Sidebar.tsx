import { faXmark } from '@fortawesome/free-solid-svg-icons';
import cn from 'classnames';
import Logo from '@components/Logo';
import SidebarButton from './SidebarButton';
import NavLinks from './NavLinks';
import UserMenu from './UserMenu';

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Sidebar = ({ isOpen, onClose }: SidebarProps) => (
  <>
    <aside
      className={cn(
        'flex flex-col justify-between p-4 w-full h-full fixed z-20 top-0 lg:w-[242px] bg-violet-900 gap-10 ease-in-out duration-300',
        {
          '-translate-x-full': !isOpen,
          'lg:flex lg:translate-x-0': !isOpen,
        }
      )}
    >
      <div className="flex flex-col gap-10">
        <div className="flex items-center justify-between">
          <div className="block lg:hidden">
            <SidebarButton
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
    <div className="hidden lg:block h-full w-full max-w-[242px] flex-grow-0 flex-shrink-0"></div>
  </>
);

export default Sidebar;
