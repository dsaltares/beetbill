import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getProviders } from 'next-auth/react';
import SignInForm from '@components/SignInForm';
import WithNoAuthentication from '@components/WithNoAuthentication';

const SignIn = ({
  providers,
  callbackUrl,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => (
  <SignInForm providers={providers} callbackUrl={callbackUrl} error={error} />
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

export default WithNoAuthentication(SignIn);
