import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import Card from '@components/Card';
import LinkButton from '@components/LinkButton';
import AppName from '@lib/appName';

const Messages: Record<string, string> = {
  Configuration: 'The application is misconfigured, please contact support.',
  AccessDenied: 'Your account has been blocked, please contact support.',
  Verification:
    'The sign in link is no longer valid. It may have been used or it may have expired.',
  Default: 'Something went wrong, please try again.',
};

const ErrorPage = ({
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const message = Messages[error] || Messages.Default;
  return (
    <Card>
      <Head>
        <title>{`Log in - ${AppName}`}</title>
      </Head>
      <h1 className="text-2xl font-bold text-center">Unable to sign in</h1>
      <div className="flex flex-col gap-4">
        <p className="text-base">{message}</p>
        <LinkButton href="/auth/signin">Sign in</LinkButton>
      </div>
    </Card>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => ({
  props: {
    error: context.query.error || '',
  },
});

export default ErrorPage;
