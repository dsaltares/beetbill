import {
  faBoxOpen,
  faBriefcase,
  faFileInvoice,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import NavLink from './NavLink';

const Links = [
  {
    label: 'Company',
    href: '/company',
    icon: faBriefcase,
  },
  {
    label: 'Clients',
    href: '/clients',
    icon: faUsers,
  },
  {
    label: 'Products',
    href: '/products',
    icon: faBoxOpen,
  },
  {
    label: 'Invoices',
    href: '/invoices',
    icon: faFileInvoice,
  },
];

const isSelected = (href: string, pathname: string) => {
  const path = pathname.split('/');
  const hrefPath = href.split('/');
  return path[1] === hrefPath[1] && path.length === hrefPath.length;
};

const NavLinks = () => {
  const { pathname } = useRouter();
  return (
    <ul>
      {Links.map(({ label, href, icon }) => (
        <NavLink
          key={href}
          label={label}
          icon={icon}
          href={href}
          selected={isSelected(href, pathname)}
        />
      ))}
    </ul>
  );
};

export default NavLinks;
