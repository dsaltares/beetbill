import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Head from 'next/head';
import FullScreenSpinner from '@components/Layout/FullScreenSpinner';
import WithAuthentication from '@components/WithAuthentication';
import Routes from '@lib/routes';
import CreateEditClientForm from '@components/CreateEditClientForm';
import useClient from '@lib/clients/useClient';
import AppName from '@lib/appName';

const EditClientPage = () => {
  const router = useRouter();
  const { data: client, isError } = useClient(router.query.clientId as string);

  useEffect(() => {
    if (isError) {
      void router.push(Routes.notFound);
    }
  }, [router, isError]);

  const content = client ? (
    <CreateEditClientForm client={client} />
  ) : (
    <FullScreenSpinner />
  );

  return (
    <>
      <Head>
        <title>{`${client?.name ?? 'Client'} - ${AppName}`}</title>
      </Head>
      {content}
    </>
  );
};

export default WithAuthentication(EditClientPage);
