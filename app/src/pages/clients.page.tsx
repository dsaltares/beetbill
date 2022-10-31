import { useCallback } from 'react';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import Head from 'next/head';
import EmptyContent from '@components/EmptyContent';
import WithAuthentication from '@components/WithAuthentication';
import Routes from '@lib/routes';
import FullScreenSpinner from '@components/Layout/FullScreenSpinner';
import LinkButton from '@components/LinkButton';
import useClients from '@lib/clients/useClients';
import useDeleteClient from '@lib/clients/useDeleteClient';
import ClientsTable from '@components/ClientsTable';
import AppName from '@lib/appName';

const ClientsPage = () => {
  const { data: clients, isLoading } = useClients();
  const { mutate: deleteClient } = useDeleteClient();
  const handleDelete = useCallback(
    (clientId: string) => deleteClient({ id: clientId }),
    [deleteClient]
  );

  let content = null;

  if (isLoading) {
    content = <FullScreenSpinner />;
  } else if (!clients || clients.length === 0) {
    content = (
      <EmptyContent
        message="You don't have any clients yet"
        createLabel="Add clients"
        createHref={Routes.createClient}
      />
    );
  } else {
    content = (
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
  }

  return (
    <>
      <Head>
        <title>{`Clients - ${AppName}`}</title>
      </Head>
      {content}
    </>
  );
};

export default WithAuthentication(ClientsPage);
