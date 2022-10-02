import EmptyContent from '@components/EmptyContent';
import Layout from '@components/Layout';
import WithAuthentication from '@components/WithAuthentication';

const CompanyPage = () => (
  <Layout>
    <EmptyContent
      message="You don't have a company registered yet"
      actionLabel="Register company"
      onClick={() => {}}
    />
  </Layout>
);

export default WithAuthentication(CompanyPage);
