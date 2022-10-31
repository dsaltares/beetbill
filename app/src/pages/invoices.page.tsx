import Head from 'next/head';
import EmptyContent from '@components/EmptyContent';
import WithAuthentication from '@components/WithAuthentication';
import Routes from '@lib/routes';
import AppName from '@lib/appName';

const InvoicesPage = () => (
  <>
    <Head>
      <title>{`Invoices - ${AppName}`}</title>
    </Head>
    <EmptyContent
      message="You don't have any invoices yet"
      createLabel="Add invoices"
      createHref={Routes.createInvoice}
    />
  </>
);

export default WithAuthentication(InvoicesPage);
