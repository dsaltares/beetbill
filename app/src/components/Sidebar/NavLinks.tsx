import {
  faBoxOpen,
  faBriefcase,
  faFileInvoice,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import Routes from '@lib/routes';
import NavLink from './NavLink';

const Links = [
  {
    label: 'Company',
    href: Routes.company,
    icon: faBriefcase,
  },
  {
    label: 'Clients',
    href: Routes.clients,
    icon: faUsers,
  },
  {
    label: 'Products',
    href: Routes.products,
    icon: faBoxOpen,
  },
  {
    label: 'Invoices',
    href: Routes.invoices,
    icon: faFileInvoice,
  },
];

const isSelected = (href: string, pathname: string) => {
  const path = pathname.split('/');
  const hrefPath = href.split('/');
  return path[1] === hrefPath[1];
};

const NavLinks = () => {
  const { pathname } = useRouter();
  return (
    <ul className="flex flex-col gap-1">
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
