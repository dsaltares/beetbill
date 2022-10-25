import { useCallback } from 'react';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import EmptyContent from '@components/EmptyContent';
import WithAuthentication from '@components/WithAuthentication';
import Routes from '@lib/routes';
import FullScreenSpinner from '@components/Layout/FullScreenSpinner';
import LinkButton from '@components/LinkButton';
import useCustomers from '@lib/customers/useCustomers';
import useDeleteCustomer from '@lib/customers/useDeleteCustomer';
import ClientsTable from '@components/ClientsTable';

const ClientsPage = () => {
  const { data: clients, isLoading } = useCustomers();
  const { mutate: deleteCustomer } = useDeleteCustomer();
  const handleDelete = useCallback(
    (clientId: string) => deleteCustomer({ id: clientId }),
    [deleteCustomer]
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
