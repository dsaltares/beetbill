import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getProviders } from 'next-auth/react';
import SignInForm from '@components/SignInForm';
import { withNoAuth } from '@lib/nextauth/decorators';

const SignIn = ({
  providers,
  callbackUrl,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => (
  <div className="flex w-full h-screen items-end md:items-center justify-center bg-violet-50">
    <SignInForm providers={providers} callbackUrl={callbackUrl} error={error} />
  </div>
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
