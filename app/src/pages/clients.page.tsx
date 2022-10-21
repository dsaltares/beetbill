import EmptyContent from '@components/EmptyContent';
import WithAuthentication from '@components/WithAuthentication';
import Routes from '@lib/routes';

const ClientsPage = () => (
  <EmptyContent
    message="You don't have any clients yet"
    createLabel="Add clients"
    createHref={Routes.createClient}
  />
);

export default WithAuthentication(ClientsPage);
