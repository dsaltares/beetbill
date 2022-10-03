import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getProviders } from 'next-auth/react';
import SignInForm from '@components/SignInForm';
import { withNoAuth } from '@lib/nextauth/decorators';
import BlankLayout from '@components/BlankLayout';

const SignIn = ({
  providers,
  callbackUrl,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => (
  <BlankLayout>
    <SignInForm providers={providers} callbackUrl={callbackUrl} error={error} />
  </BlankLayout>
);

export const getServerSideProps: GetServerSideProps = withNoAuth(
  async (context) => {
    const providers = await getProviders();

    return {
      props: {
        providers,
        callbackUrl: context.query.callbackUrl || '',
        error: context.query.error || '',
      },
    };
  }
);

export default SignIn;
