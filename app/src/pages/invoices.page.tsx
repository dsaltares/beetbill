import EmptyContent from '@components/EmptyContent';
import Layout from '@components/Layout';
import WithAuthentication from '@components/WithAuthentication';

const InvoicesPage = () => (
  <Layout>
    <EmptyContent
      message="You don't have any invoices yet"
      actionLabel="Add invoices"
      onClick={() => {}}
    />
  </Layout>
);

export default WithAuthentication(InvoicesPage);
