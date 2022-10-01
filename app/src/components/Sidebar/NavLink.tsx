import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import cn from 'classnames';

type NavLinkProps = {
  label: string;
  icon: IconDefinition;
  href: string;
  selected: boolean;
};

const NavLink = ({ label, icon, href, selected }: NavLinkProps) => (
  <li className="list-none">
    <Link href={href}>
      <a
        className={cn(
          'flex items-center p-4 rounded-xl gap-4 text-white text-base',
          {
            'bg-violet-900': !selected,
            'bg-violet-800': selected,
          }
        )}
      >
        <FontAwesomeIcon className="w-4 h-4" icon={icon} />
        {label}
      </a>
    </Link>
  </li>
);

export default NavLink;
