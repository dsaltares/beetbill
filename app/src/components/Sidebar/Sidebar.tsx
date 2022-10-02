import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import IconButton from '@components/IconButton';
import Logo from '../Logo';
import NavLinks from './NavLinks';
import UserMenu from './UserMenu';

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const ref = useRef<HTMLBaseElement>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    setWidth(ref.current?.offsetWidth ?? 0);
  }, [ref, setWidth]);
  return (
    <>
      <aside
        ref={ref}
        className={cn(
          'flex flex-col justify-between p-4 w-full h-full fixed z-20 top-0 md:w-[242px] bg-violet-900 gap-10 ease-in-out duration-300',
          {
            '-translate-x-full': !isOpen,
            'md:flex md:translate-x-0': !isOpen,
          }
        )}
      >
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
      <div
        className="hidden md:flex h-full w-full"
        style={{ maxWidth: width }}
      ></div>
    </>
  );
};

export default Sidebar;
