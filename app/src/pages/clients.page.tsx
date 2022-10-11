import EmptyContent from '@components/EmptyContent';
import WithAuthentication from '@components/WithAuthentication';

const ClientsPage = () => (
  <EmptyContent
    message="You don't have any clients yet"
    actionLabel="Add clients"
    onClick={() => {}}
  />
);

export default WithAuthentication(ClientsPage);
