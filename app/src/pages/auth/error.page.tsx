import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import {
  faArrowRight,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LinkButton from '@components/LinkButton';
import AppName from '@lib/appName';
import Routes from '@lib/routes';
import WithNoAuthentication from '@components/WithNoAuthentication';
import Card from '@components/Card';

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
    <Card title="Unable to sign in" icon={faTriangleExclamation}>
      <Head>
        <title>{`Log in - ${AppName}`}</title>
      </Head>
      <p className="text-base text-center">{message}</p>
      <div className="flex w-full justify-center">
        <LinkButton endIcon={faArrowRight} href={Routes.signIn}>
          Sign in
        </LinkButton>
      </div>
    </Card>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => ({
  props: {
    error: context.query.error || '',
  },
});

export default WithNoAuthentication(ErrorPage);
