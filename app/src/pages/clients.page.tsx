import { useCallback } from 'react';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import EmptyContent from '@components/EmptyContent';
import WithAuthentication from '@components/WithAuthentication';
import Routes from '@lib/routes';
import FullScreenSpinner from '@components/Layout/FullScreenSpinner';
import LinkButton from '@components/LinkButton';
import useClients from '@lib/clients/useClients';
import useDeleteClient from '@lib/clients/useDeleteClient';
import ClientsTable from '@components/ClientsTable';

const ClientsPage = () => {
  const { data: clients, isLoading } = useClients();
  const { mutate: deleteClient } = useDeleteClient();
  const handleDelete = useCallback(
    (clientId: string) => deleteClient({ id: clientId }),
    [deleteClient]
  );

  if (isLoading) {
    return <FullScreenSpinner />;
  }

  if (!clients || clients.length === 0) {
    return (
      <EmptyContent
        message="You don't have any clients yet"
        createLabel="Add clients"
        createHref={Routes.createClient}
      />
    );
  }

  return (
    <div className="flex flex-col w-full gap-16">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Your clients</h1>
        <LinkButton href={Routes.createProduct} endIcon={faAdd}>
          Add client
        </LinkButton>
      </div>
      <ClientsTable clients={clients} onDelete={handleDelete} />
    </div>
  );
};

export default WithAuthentication(ClientsPage);
