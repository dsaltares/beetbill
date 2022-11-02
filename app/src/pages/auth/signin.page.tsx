import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getProviders } from 'next-auth/react';
import Head from 'next/head';
import SignInForm from '@components/SignInForm';
import WithNoAuthentication from '@components/WithNoAuthentication';
import AppName from '@lib/appName';

const SignInPage = ({
  providers,
  callbackUrl,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => (
  <>
    <Head>
      <title>{`Log in - ${AppName}`}</title>
    </Head>
    <SignInForm providers={providers} callbackUrl={callbackUrl} error={error} />
  </>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await getProviders();

  return {
    props: {
      providers,
      callbackUrl: context.query.callbackUrl || '',
      error: context.query.error || '',
    },
  };
};

export default WithNoAuthentication(SignInPage);
