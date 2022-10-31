import Head from 'next/head';
import CreateEditProductForm from '@components/CreateEditProductForm';
import WithAuthentication from '@components/WithAuthentication';
import AppName from '@lib/appName';

const NewProductPage = () => (
  <>
    <Head>
      <title>{`New product - ${AppName}`}</title>
    </Head>
    <CreateEditProductForm />
  </>
);

export default WithAuthentication(NewProductPage);
