import {
  faCookie,
  faGavel,
  faLock,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSession } from 'next-auth/react';
import { Menu, Transition } from '@headlessui/react';
import cn from 'classnames';
import Link from 'next/link';
import Routes from '@lib/routes';
import { getFullName } from '@lib/userName';
import Avatar from '@components/Avatar';

const Items = [
  {
    icon: faLock,
    label: 'Privacy policy',
    href: Routes.privacyPolicy,
  },
  {
    icon: faGavel,
    label: 'Terms & conditions',
    href: Routes.termsAndConditions,
  },
  {
    icon: faCookie,
    label: 'Cookie policy',
    href: Routes.cookiePolicy,
  },
  {
    icon: faRightFromBracket,
    label: 'Sign out',
    href: Routes.signOut,
  },
];

const UserMenu = () => {
  const { data } = useSession();

  if (!data?.user) {
    return null;
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="flex w-full items-center gap-4 px-4 py-2 rounded-xl text-white text-base focus-ring">
          <Avatar user={data.user} />
          <span>{getFullName(data.user)}</span>
        </Menu.Button>
      </div>
      <Transition
        as="div"
        className="relative z-10"
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="w-full absolute bottom-[60px] rounded-md bg-white py-1 shadow-xl border border-violet-500 focus-ring">
          {Items.map(({ icon, label, href }) => (
            <Menu.Item key={href}>
              {({ active }) => (
                <div>
                  <Link
                    href={href}
                    className={cn(
                      'flex items-center w-full gap-2 py-2 px-3 text-base',
                      {
                        'bg-violet-100': active,
                      }
                    )}
                  >
                    <FontAwesomeIcon className="w-4 h-4" icon={icon} />
                    {label}
                  </Link>
                </div>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default UserMenu;
