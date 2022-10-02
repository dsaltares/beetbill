import EmptyContent from '@components/EmptyContent';
import Layout from '@components/Layout';
import WithAuthentication from '@components/WithAuthentication';

const ClientsPage = () => (
  <Layout>
    <EmptyContent
      message="You don't have any clients yet"
      actionLabel="Add clients"
      onClick={() => {}}
    />
  </Layout>
);

export default WithAuthentication(ClientsPage);
