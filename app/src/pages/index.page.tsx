import type { NextPage } from 'next';
import Link from 'next/link';
import WithAuthentication from '@components/WithAuthentication';

const Home: NextPage = () => (
  <nav className="flex flex-col">
    <Link href={'/products'}>
      <a>Products</a>
    </Link>
    <Link href={'/customers'}>
      <a>Customers</a>
    </Link>
    <Link href={'/invoices'}>
      <a>Invoices</a>
    </Link>
  </nav>
);

export default WithAuthentication(Home);
