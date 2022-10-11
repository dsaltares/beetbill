import EmptyContent from '@components/EmptyContent';
import WithAuthentication from '@components/WithAuthentication';

const CompanyPage = () => (
  <EmptyContent
    message="You don't have a company registered yet"
    actionLabel="Register company"
    onClick={() => {}}
  />
);

export default WithAuthentication(CompanyPage);
