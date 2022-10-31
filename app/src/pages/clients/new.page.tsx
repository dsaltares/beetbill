import Head from 'next/head';
import CreateEditClientForm from '@components/CreateEditClientForm';
import WithAuthentication from '@components/WithAuthentication';
import AppName from '@lib/appName';

const NewClientPage = () => (
  <>
    <Head>
      <title>{`New client - ${AppName}`}</title>
    </Head>
    <CreateEditClientForm />
  </>
);

export default WithAuthentication(NewClientPage);
